import React from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"
import { Col, Row } from 'react-bootstrap' 

function HexagonCustom(props) {
  return (
    <div>
      <Row>
        <Col lg={props.col} className={styles.shadow}>
          <div className={styles.hexagon} style={{ backgroundColor: props.background }}>
            <div style={{ width: "295px" }}>
              <p className={styles.titleHexagon} style={{ fontSize: 24, color: props.color }}>{props.title} </p>
              <p className={styles.titleHexagon} style={{ fontSize: 30, fontWeight: "bold", color: props.color }}> {props.data} </p>
            </div>
          </div>
        </Col>
        <Col className={styles.hexagonIcon} lg={3}>
          <img className={styles.generalDataImg} src={"/" + props.icon + ".svg"} alt={props.icon} />
        </Col>
      </Row>
    </div>
  )
}

export default HexagonCustom