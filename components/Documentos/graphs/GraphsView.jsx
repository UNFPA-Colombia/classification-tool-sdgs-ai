import React, { useState, useEffect } from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"
import GraphComponent from './GraphComponent'

const coherenciaDescription = "Aquí se puede ver una gráfica que mide el sentido que tienen las palabras de los tópicos entre sí."
const coherenciaDescription2 = "Ten en cuenta que el número de tópicos que te mostramos en este modelo es el óptimo para encontrar un nivel mayor de coherencia"
const paiDescription="Ahora puedes ver la distribución de los tópicos en cada uno de los textos. Ej: En el primer texto, se habla en un 15% del tópico 1."
function GraphsView({ coherencia, distribuciones, topicos, files }) {

  const [documento, setDocumento] = useState(0)
  const [data, setData] = useState([])
  const colores=["#FFB2E6",
  "#EC92F3",
  "#D972FF",
  "#AF5DFF",
  "#9A52FF",
  "#8447FF",
  "#88A3ED",
  "#8CFFDA",
  "#C6FFE1",
  "#FFFFE8"
  ]
  useEffect(() => {
    setData(distribuciones[documento]["distribucion"][topicos].map((element, index) => {
      return {
        nombre:`Tópico ${element.topico}`,
        color: colores[index],
        valor: element.valor,
        radius: 1,
      }
    }))
  }, [documento, distribuciones, topicos])
  return (
    <div>
      <GraphComponent title="Coherencia entre tópicos" description={coherenciaDescription} description2={coherenciaDescription2} derecha={true} data={coherencia} />
      <GraphComponent title="Distribución de los tópicos en el documento" description={paiDescription} description2={"Si el tópico no se ve, es porque su importancia en el texto es muy pequeña"} derecha={false} data={data} files={files} funcion={setDocumento}/>
      <div className={`${styles.fondoColorMorado}`} style={{ height: "20vh" }} ></div>
      {console.log(data)}
    </div>
  )
}

export default GraphsView