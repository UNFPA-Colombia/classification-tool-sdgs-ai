import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import styles from "../../styles/DocumentosComponentes.module.css"
import { FileUploader } from 'react-drag-drop-files'
import Link from 'next/link';
import UseModelView from './useModelView';
const fileTypes = ["PDF"];

function FinalScreenView(props) {

  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState(0); // 0: no files, 1: uploading, 2: uploaded 3: error size, 4: error type, 5: error
  const [data, setData] = useState({});

  const handleChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleSubmission = () => {
    setStatus(0);
    if (files != null) {
      setStatus(1);
      const data = new FormData();
      data.append('files', files, files.name);
      data.append('id', props.id)
      data.append('topicNumber', props.topicNumber)
      console.log("dataaaa: " + data);
      fetch('/api/documentosUse', {
        method: 'POST',
        body:data,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log('result:', result)
          if (result["error"] != 0) {
            setStatus(5);
          }
          else {
            console.log("Vamos bien")
            setStatus(2);
            setData(result);
          }
        })
        .catch((error) => {
          
        });
    }
  };

  function showDocumentos() {
    if (files != null) {
      return (
        <ul className={`${styles.center}`}>
          <li className={styles.archivo} >{files.name} &nbsp;&nbsp;
          </li>
        </ul>
      );
    }
  }

  return (
    <div className={`${styles.fondoColorMorado} ${styles.center}`} style={{ height: "100vh", justifyContent: "flex-start" }} >
      <div className={`${styles.fondoColorMoradoClaro} ${styles.shadow}`} style={{ width: "25vw", marginBottom: "15vh" }}>
        <p className={styles.textStorytelling}>Ahora prueba tu mismo el modelo que acabas de  crear. Sube otro archivo pdf para ver que tópicos que creaste tiene este nuevo documento.
        </p>
      </div>
      <div className={`${styles.fondoColorMorado} ${styles.center}`}  >
        <div className={`${styles.center}`} >

          <FileUploader
            handleChange={handleChange}
            onDraggingStateChange={(f) => { console.log("dragging", f) }}
            onTypeError={(f) => { console.log("type error", f) }}
            onSizeError={(f) => { console.log("size error", f) }}
            name="file"
            types={fileTypes}
            multiple={false}
            maxSize={6}
          >
            <div className={styles.cajaArchivos} >
              {files != null ? <p>Recuerda que solo puedes subir un nuevo documento. <u> Cambiar archivo </u></p> : <p>¡Prueba el modelo con un nuevo documento! Arrastra el documento o <u>haz click aquí</u></p>}
            </div>
          </FileUploader>
          {showDocumentos()}
          {files != null && <Button variant="success" onClick={handleSubmission} className={styles.buttonStart} role="button">Probar modelo</Button>}
          {status === 1 && <p className={styles.status}>Subiendo el archivo </p>}
          {status === 2 && <p className={styles.status}>¡Listo! Puedes ver los resultados en la sección de abajo</p>}
          {status === 3 && <p className={styles.status}>Error: El archivo es demasiado grande</p>}
          {console.log(data)}
        </div>
      </div>
      {status === 2 && <UseModelView data={data} />}
    </div>
  )
}

export default FinalScreenView