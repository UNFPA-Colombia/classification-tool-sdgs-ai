import React, { useState } from 'react'
import styles from "../../styles/DocumentosComponentes.module.css"
import Paralelogramo from './commons/Paralelogramo'
import BarChart from './commons/BarChart'


function ShowGraphsComponent(props) {
  const [styleLeft] = useState(props.left ? {
    display: "flex",
    alignItems: "flex-end"
  } : {})
  return (
    <div className={styles.center} style={styleLeft}>
      <div style={{
        position: "relative",
        top: "35px"
      }}>
        <Paralelogramo text={props.title} width="15vw" />
      </div>
      <div className={`${styles.fondoColorMoradoClaro} ${styles.shadowBottom}`} style={{ width: "94%", padding: "50px" }}>
        <BarChart data={props.data} />
      </div>
    </div>
  )
}

export default ShowGraphsComponent