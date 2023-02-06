import React, { useEffect, useState } from 'react'
import styles from "../../styles/DocumentosComponentes.module.css"
import PieSDGs from '../PieSDGs'
import { Col, Row } from 'react-bootstrap'
import InfoButton from './commons/InfoButton'

function UseModelView({ data }) {

  const [datos, setDatos] = useState([])
  const colores = ["#FFB2E6",
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
    setDatos(data["distribution"].map((element, index) => {
      return {
        nombre: `Tópico ${element.topico}`,
        color: colores[index],
        valor: element.valor,
        radius: 1,
      }
    }))
  }, [])

  return (
    <div className={`${styles.fondoColorMorado}`}  >
      <p className={styles.tituloEstilo3} style={{ padding: "80px 50px 0px 5vw", margin: 0 }} >
        Analizamos el nuevo documento que subiste y lo comparamos con el número de tópicos que dejaste seleccionado. Con esto, ¡Encontramos la siguiente distribución de los tópicos!.
      </p>
      <br />
      <Row >
        <Col>
          <p style={{ padding: "0px 50px 0px 5vw", margin: 0, fontStyle: "italic" }}>
            Ten en cuenta que los tópicos que no se ven es porque tienen una importancia muy bajita en tu nuevo documento
          </p>
        </Col>
        <Col md={{ offset: 11 }}>
          <InfoButton message='Recuerda: Si pasas el mouse sobre el color, puedes ver el tópico al que pertenece.' placement="left" />
        </Col>
      </Row>
      <div className={styles.center} style={{ width: "50vw", height: "100vh", margin: "auto" }}>
        <PieSDGs objetivos={datos} setObjetivo={""} />
      </div>
    </div>
  )
}

export default UseModelView