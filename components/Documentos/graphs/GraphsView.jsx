import React from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"
import GraphComponent from './GraphComponent'

const coherenciaDescription = "Aquí se puede ver una gráfica que mide el sentido que tienen las palabras de los tópicos entre sí."
const coherenciaDescription2 = "Ten en cuenta que el número de tópicos que te mostramos en este modelo es el optimo para encontrar un nivel mayor de coherencia"
function GraphsView({ coherencia }) {

  return (
    <div>
      <GraphComponent title="Coherencia entre tópicos" description={coherenciaDescription} description2={coherenciaDescription2} derecha={true} data={coherencia} />
      <div className={`${styles.fondoColorMorado}`} style={{ height: "20vh" }} ></div>
    </div>
  )
}

export default GraphsView