import React from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"
import ReactSrcDocIframe from 'react-srcdoc-iframe';
import pyLDAvisDraw from './pyLDAvisGraph';

function InteractiveGraphView(props) {

  const html = pyLDAvisDraw(JSON.stringify(props.data));

  return (
    <div className={`${styles.fondoColorMorado} ${styles.center} ${styles.heightAllScreen}`} style={{ height: "175vh" }}>
      <div className={`${styles.fondoColorMoradoClaro} ${styles.shadowLateral}`} style={{ width: "20.5vw" }}>
        <p className={styles.textStorytelling}>Puedes mirar la frecuencia de cada palabra en cada tópico.</p>
        <p className={styles.textStorytelling}>Prueba dar click en los círculos que tienen el número de tópico</p>
      </div>
      <ReactSrcDocIframe srcDoc={html} width="95%" height="1200" />
    </div >
  )
}

export default InteractiveGraphView