import React, { useState, useEffect } from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"
import GraphComponent from './GraphComponent'

const coherenciaDescription = "Aquí se puede ver una gráfica que mide el sentido que tienen las palabras de los tópicos entre sí."
const coherenciaDescription2 = "Ten en cuenta que el número de tópicos que te mostramos en este modelo es el optimo para encontrar un nivel mayor de coherencia"
const paiDescription="Esta es una gráfica de torta en la que puedes ver la distribución total de los tópicos en todos los textos. Por ejemplo: De todos los textos que subiste, se habla en un 15% del tópico 1"
function GraphsView({ coherencia, distribuciones, topicos }) {

  const [documento, setDocumento] = useState(0)
  const [data, setData] = useState([])

  useEffect(() => {
    setData(distribuciones[documento]["distribucion"][topicos].map((element, index) => {
      return {
        nombre: element.topico,
        color: "#ffffff",
        valor: element.valor,
        radius: 1,
      }
    }))
  }, [documento, distribuciones, topicos])

  return (
    <div>
      <GraphComponent title="Coherencia entre tópicos" description={coherenciaDescription} description2={coherenciaDescription2} derecha={true} data={coherencia} />
      <GraphComponent title="Distribución de los tópicos en el documento" description={paiDescription} derecha={false} data={data}/>
      <div className={`${styles.fondoColorMorado}`} style={{ height: "20vh" }} ></div>
    </div>
  )
}

export default GraphsView