import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Paralelogramo from './commons/Paralelogramo'
import styles from "../../styles/DocumentosComponentes.module.css"
import ShowGraphsComponent from './ShowGraphsComponent'

function ShowBarCharts({ topicos }) {
  return (
    <div className={`${styles.fondoColorMorado} ${styles.center}`}>
      <div className={styles.divGraficosDescription} >
        < p className={styles.text1}>
          En la nube de palabras pudimos darnos una idea de las palabras que conforman los tópicos y la relevancia de cada una de ellas. Ahora se pueden ver algunos diagramas de barras donde se pueden observar con mayor detenimiento la importancia de cada una de las palabras dentro de los tópicos.
        </p>
      </div>
      <Paralelogramo text="Gráficos de barras" width="25vw" />

      <Row>
        {topicos.map((palabras, index) => (
          (index + 1) % 2 != 0 ?
            <Col lg="7" key={index} style={{ padding: 0 }}>
              <Row>
                <Col lg="8" style={{
                  paddingLeft: 0, paddingRight: 0, paddingBottom: "15px", display: "flex",
                  alignItems: "flex-end"
                }}>
                  <ShowGraphsComponent title={"Tópico " + (index + 1)} data={palabras["palabras"]} left={true} />
                </Col>
                <Col lg="4" className={`${styles.fondoColorMoradoClaro} ${styles.shadowLateral} ${styles.center}`}>
                </Col>
              </Row>
            </Col> :
            <Col lg="5" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: "15px" }} key={index}>
              <ShowGraphsComponent title={"Tópico " + (index + 1)} data={palabras["palabras"]} left={false} />
            </Col>
        ))}
      </Row>
    </div>
  )
}

export default ShowBarCharts