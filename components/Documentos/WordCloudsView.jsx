import React from 'react'
import { Col, Row } from 'react-bootstrap'
import styles from "../../styles/DocumentosComponentes.module.css"
import WordCloudComponent from './WordCloudComponent'
import Paralelogramo from './commons/Paralelogramo'


function WordCloudsView({ topicos }) {

  return (
    <div className={`${styles.fondoColorMorado} ${styles.shadowBottom} ${styles.center}`} styles={{
      paddingLeft: "155rem",
    }}>
      <div className={styles.divGraficosDescription} >
        < p className={styles.text1}>
          En el siguiente apartado veremos las nubes de palabras para cada uno de los topicos encontrados. Recuerda que el tamaño de la palabra representa la importancia que tiene en cada topico.
        </p>
      </div>
      <Paralelogramo text="Nubes de palabras" width="30vw" />

      <Row>
        {topicos.map((palabras, index) => {
          return (index + 1) % 2 != 0 ?
            <Col lg="7" key={index} style={{ padding: 0 }}>
              <Row>
                <Col lg="8" className={styles.center} >
                  <WordCloudComponent data={palabras["palabras"]} title={"Tópico " + (index + 1)} />
                </Col>
                <Col lg="4" className={`${styles.fondoColorMoradoClaro}  ${styles.center}`}>
                </Col>
              </Row>
            </Col> :
            <Col lg="5" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: "15px" }} key={index}>
              <WordCloudComponent data={palabras["palabras"]} title={"Tópico " + (index + 1)} />
            </Col>
        })}
      </Row>
    </div>
  )
}

export default WordCloudsView