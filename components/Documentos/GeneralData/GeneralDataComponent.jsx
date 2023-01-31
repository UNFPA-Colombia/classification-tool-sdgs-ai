import React from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"
import HexagonCustom from '../commons/HexagonCustom'
import { Col, Row } from 'react-bootstrap'

function GeneralDataComponent(props) {
  return (
    <div className={styles.documentData}>
      <Row>
        <Col>
          <div className={styles.hexagon_child}>
            <HexagonCustom background={"#F3F3F3"} title={"# Palabras"} data={props.data["words"]} icon={"search"} col={9} />
          </div>
        </Col>
        <Col>
          <div className={styles.hexagon_child}>
            <HexagonCustom background={"#B4FAFE"} title={"# Páginas"} data={props.data["pages"]} icon={"open-book"} col={9} />
          </div>
        </Col>
        <Col>
          <div className={styles.hexagon_child}>
            <HexagonCustom background={"#F3F3F3"} title={'Tamaño del \n archivo'} data={props.data["size"]} icon={"balanza"} col={9} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default GeneralDataComponent