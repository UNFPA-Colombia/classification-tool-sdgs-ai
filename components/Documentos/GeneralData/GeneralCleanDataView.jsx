import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Circle from '../commons/Circle'
import styles from "../../../styles/DocumentosComponentes.module.css"


function GeneralCleanDataView(props) {
  var size = ((100 / props.data.length) - 5) < 20 ? 20 : ((100 / props.data.length) - 5) > 30 ? 30 : ((100 / props.data.length) - 5)
  var secondcolum = props.data.length > 6
  const [dataP1] = useState(() => {
    if (!secondcolum) {
      return props.data
    }
    else {
      var data = []
      for (var i = 0; i < 5; i++) {
        data[i] = props.data[i]
      } return data
    }
  });
  const [dataP2] = useState(() => {
    if (!secondcolum) {
      return []
    } else {
      var data = []
      for (var i = 6; i < props.data.length; i++) {
        data[i - 6] = props.data[i]
      } return data
    }
  });


  return (

    <div className={styles.generalCleanData}>
      <div className={styles.center} style={{ marginBottom: "10vh" }}>
        <h2 className={styles.tituloEstilo2}> {">>>"} ¡Eliminamos algunas palabras! {">>>"} </h2>
      </div>
      <Row className={styles.row}>
        <Col>
          <h3 className={styles.rotateTitle} >
            En los documentos:
          </h3>
          <Row className={`${styles.row}`}>
            <Col className={styles.center}>
              {dataP1.map((documento, idx) => {
                return (
                  documento["title"] != "Total" ?
                    <div key={idx}>
                      <Circle text1={"Doc. #" + (idx + 1)} text2="" text3="" data={documento["deleted"]} width={size + "vh"} height={size + "vh"} fontSize="14px" fontSizeData={"2em"} color="#B4FAFE" line={idx != 4} />
                    </div> : null
                )
              })}
            </Col>
            {secondcolum ?
              <Col className={styles.center}>
                {
                  secondcolum ?
                    dataP2.map((documento, idx) => {
                      return (
                        documento["title"] != "Total" ?
                          <div key={idx + 5}>
                            <Circle text1={"Doc. #" + (idx + 6)} text2="" text3="" data={documento["deleted"]} width={size + "vh"} height={size + "vh"} fontSize="14px" fontSizeData={"2em"} color="#B4FAFE" line={idx != (dataP2.length - 2) && idx != 9} />
                          </div> : null
                      )
                    }) : null
                }
              </Col> : null
            };
          </Row>
        </Col>
        <Col>
          <h3 className={styles.rotateTitle}>En total</h3>
          <Circle text1="Eliminamos" text2="palabras vacías" text3="Lo cual es el 50% del total de palabras" data={props.data[props.data.length - 1]["deleted"]} width="60vh" height="60vh" fontSize="28px" fontSize3="14px" fontSizeData="60px" paddingTop="00%" color="#B4FAFE" />
        </Col>
      </Row>
    </div>
  )
}
export default GeneralCleanDataView