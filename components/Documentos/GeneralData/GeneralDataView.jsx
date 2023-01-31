import React, { useRef } from 'react'
import { Col, Row } from 'react-bootstrap'
import styles from "../../../styles/DocumentosComponentes.module.css"
import GeneralDataComponent from './GeneralDataComponent'
import GeneralAllDataComponent from './GeneralAllDataComponent'
import { HiArrowCircleDown } from "react-icons/Hi";


function GeneralDataView(props) {
  const myRef = useRef(null);

  return (
    <div>
      <div className={styles.welcomePage}>
        <h2 className={styles.tituloEstilo1}>
          ¡Hola!
          Estamos creando el nuevo modelo con base en los documentos que nos diste.
          Antes de ir allá, primero conozcamos los archivos que nos llegaron para analizar.
        </h2>
        <div>
          <HiArrowCircleDown onClick={() => myRef.current.scrollIntoView()} size={70} />
        </div>
      </div>
      <div ref={myRef} className={styles.generalDataView}>
        {props.data.map((documento, idx) => {
          return (
            documento.title == "Total" ?
              <div key={idx}>
                <div className={styles.titleAllDataGeneral} >
                  <h3 className={styles.tituloEstilo2} style={{ width: "150vh" }}>
                    Terminamos de revisar cada uno de los documentos que subiste. Ahora, miremos estas mismas estadísticas con todos los documentos:
                  </h3>
                </div>
                <GeneralAllDataComponent data={documento} numArchivos={props.data.length - 1} />
                <div className={styles.centerDescription} >
                  <h3 className={styles.tituloEstilo3}>
                    Primero, tuvimos que limpiar tu texto. Para eso eliminamos los signos de puntuación como puntos, comas, etc. También...
                  </h3>
                </div>
              </div>
              :
              <div key={idx} >
                {idx <= 15 ?
                  <div className={styles.titleDocumentos}>
                    <Row>
                      <Col style={{ alignSelf: "center" }} lg={4} sm={4}>
                        <h3>En el documento #{idx+1}: {'"'}{documento["title"]}{'"'} encontramos:</h3>
                      </Col>
                      <Col>
                        <img className={styles.generalDataImg} src={"/file.svg"} alt="Foto" />
                      </Col>
                    </Row>
                  </div>
                  : null
                }
                <GeneralDataComponent data={documento} key={idx} />
                <div className="lineblue" style={{ height: "120px" }}>
                </div>
              </div>
          )
        })}
      </div>
    </div>








    //   <div style={{background: "rgb(251,251,251)",
    //     background: "linear-gradient(0deg, rgba(251,251,251,1) 0%, rgba(254,177,12,1) 100%)"}}>
    // <div className={styles.generalData}>

    //   <Row>
    //     <Col md={8}>
    //       <h2 className={styles.generalDataH2}> Tu texto tenía</h2>
    //     </Col>
    //     <Col className={styles.pages} md={{ span: 3, offset: 1 }}>
    //       <Circle text1="" text2="Páginas" text3="en total" data={props.paginas} size="250px" fontSize="25px" fontSizeData="60px" paddingTop="20%" color="DodgerBlue" />
    //     </Col>
    //   </Row>

    //   <Row style={{ marginTop: "50px" }}>
    //     <Col >
    //       <Row className="weight">
    //         <Col md={{ span: 4, offset: 1 }}>
    //           <Circle text1="Peso" text2="KB" text3="" data={props.peso} size="250px" fontSize="30px" fontSizeData="60px" paddingTop="15%" color="DodgerBlue" />
    //         </Col>
    //       </Row>
    //       <Row className="words" style={{ marginTop: "150px" }}>
    //         <Col md={{ span: 4, offset: 7 }}>
    //           <Circle text1="" text2="palabras" text3="" data={props.palabras} size="250px" fontSize="30px" fontSizeData="60px" paddingTop="30%" color="DodgerBlue" />
    //         </Col>
    //       </Row>

    //     </Col>
    //     <Col>
    //       <Row className="docs" style={{ marginTop: "50px", textAlign: "-webkit-right" }} >
    //         <Col>
    //           <Circle text1="Estás analizando" text2="documentos" text3="diferentes" data={props.nDocumentos} size="500px" fontSize="40px" fontSizeData="120px" paddingTop="20%" color="DodgerBlue" />
    //         </Col>
    //       </Row>
    //     </Col>
    //   </Row>
    // </div>


    //   </div >

  )
}

export default GeneralDataView