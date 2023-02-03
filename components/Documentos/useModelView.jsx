import React from 'react'
import { Col, Row } from 'react-bootstrap'
import PieSDGs from '../PieSDGs'

function UseModelView()  {
  return (
    <Row className={`${styles.fondoColorMorado}`} >
      <p className={styles.tituloEstilo3} style={{padding:"0px 50px 40px 5vw"}} > Analizamos el nuevo documento que subiste y lo comparación con el número de tópicos que dejaste seleccionado. Con esto, ¡Encontramos la siguiente distribución de los tópicos!.</p>
    <Col style={{width:"50vw", height:"100vh"}}>
      {/* <PieSDGs objetivos={props.data} setObjetivo={""} objetivo={""} /> */}
    </Col>
    </Row>

  )
}

export default UseModelView