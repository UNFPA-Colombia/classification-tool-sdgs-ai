import React from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"
import { Col, Row } from 'react-bootstrap'
import HexagonCustom from '../commons/HexagonCustom'

function GeneralAllDataComponent(props) {
  return (
    <div className={styles.generalAllDataComponent}>
      <Row>
        <Col style={{ marginRight: "50px"}}>
        <HexagonCustom background={"#F3F3F3"} title={"Tamaño de los archivos"} data={props.data["size"]} icon={"balanza"} col={8}/>
        <HexagonCustom background={"#00A5BE"} title={"# Documentos en total"} data={props.numArchivos} icon={"folder"}  col={8}/>
        </Col>
        <Col>
        <HexagonCustom background={"#00A5BE"} title={"# Páginas totales"} data={props.data["pages"]} icon={"open-book"} col={8}/>
        <HexagonCustom background={"#F3F3F3"} title={"# Palabras totales"} data={props.data["words"]} icon={"search"} col={8}/>
        </Col>
      </Row>
    </div>
  )
}

export default GeneralAllDataComponent