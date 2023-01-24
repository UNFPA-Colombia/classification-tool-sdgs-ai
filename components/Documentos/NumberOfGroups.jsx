import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Circle from './commons/Circle'
import styles from "../../styles/DocumentosComponentes.module.css"
import Paralelogramo from './commons/Paralelogramo';
import InfoButton from './commons/InfoButton';

function NumberOfGroups(props) {

  const [numTopics, setnumTopics] = useState(8);
  const changeValue = (e) => {
    setnumTopics(e);
  };
  // function alerta() {
  //   alert("Funciones en desarrollo. Gracias por tu paciencia");
  // }
  return (

    <div className={styles.fondoColorMoradoGradient}>
      <Row>
        <Col className={styles.centerDescription}>
          <h3 className={styles.tituloEstilo3}> Las palabras que se eliminaron son denominadas palabras vacías.
            Se considera que estas palabras no aportan valor o información  adicional al texto
          </h3>
        </Col>
        <Col className={styles.shadow}>
          <div className={styles.paralelogramo}>
            <h3> Algunos ejemplos de estas palabras son: </h3>
            <Row>
              <Col>
                <ul className={styles.generalDataUl}>
                  <li className={styles.generalDataLi} >Los</li>
                  <li className={styles.generalDataLi} >Algo</li>
                  <li className={styles.generalDataLi} >Ellos</li>
                </ul>
              </Col>
              <Col>
                <ul className={styles.generalDataUl}>
                  <li className={styles.generalDataLi} >Los</li>
                  <li className={styles.generalDataLi} >Algo</li>
                  <li className={styles.generalDataLi} >Ellos</li>
                </ul>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <div className={styles.centerDescription}>
        <h3 className={styles.tituloEstilo3}>
          Para realizar el modelo con base a los textos que se subieron se utilizaron librerías creadas para el análisis de texto.
          Gracias a estas, se crea un diccionario con las palabras obtenidas después de la limpieza y luego se encuentra la frecuencia
          de estas palabras en el documento. Con lo anterior…..
        </h3>
      </div>
      <div className={`${styles.fondoColorMoradoClaro} ${styles.shadow}`}>
      <Row >
        <Col md={{ offset: 11 }}>
          <InfoButton message='Recuerda que decir "Tópicos" es igual a "Grupos".' placement="left" />
        </Col>
      </Row>
      <div className={` ${styles.center2}`} >
        <div className={styles.center} >
          <Paralelogramo height="5.5rem" width="28vw" text="¡Obtuvimos" />
          <Paralelogramo height="5.5rem" width="28vw" text="Diferentes" />
          <Paralelogramo height="5.5rem" width="28vw" text="Tópicos!" />
        </div>
        <div style={{ position: "relative", right: "10%" }}>
          <Circle text1="" text2="" text3="" data={props.numTopics} width="22rem" height="18rem" fontSize="28px" fontSizeData="9rem" color="#FFDED8" />
        </div>
      </div>
     </div> 
      <div className={`${styles.fondoColorMorado}`} style={{ height: "15vh" }} ></div>
    </div>



    // <div style={{background: "rgb(68,22,218)",
    //   background: "linear-gradient(0deg, rgba(68,22,218,1) 0%, rgba(0,146,255,1) 100%)", height: "120vh"}}>
    //   <div className={styles.numberOfGroups}>
    //     <div className={styles.menuSuperior}>
    //       <Row>
    //         <Col md={4}>
    //           <Form.Group className="mb-3" controlId="rangeTopics">
    //             <Form.Label>Número de grupos</Form.Label>
    //             <Form.Range value={numTopics} onChange={changeValue} />
    //           </Form.Group>
    //         </Col>
    //         <Col md={{ span: 2, offset: 5 }}>
    //           <div className={styles.numberOfGroupsButton} >¿Quieres conocer más?
    //             Ve al modo experto</div>
    //         </Col>
    //       </Row>
    //     </div>
    //     <h2 className={styles.numberOfGroupsH2} >¡Obtuvimos</h2>
    //     <Row>
    //       <Col  md={{ span: 2, offset: 4 }} style={{ textAlign: "-webkit-right"}} >
    //         <Circle text1="" text2="" text3="" data={props.numGrupos} size="150px" fontSize="28px" fontSizeData="90px" paddingTop="10%" color="DodgerBlue"  />
    //       </Col>
    //       <Col>
    //         <p className={styles.numberOfGroupsP}>grupos diferentes</p> 
    //         <p className={styles.numberOfGroupsP}>en tu texto !</p>
    //       </Col>
    //     </Row>
    //   </div>
    // </div>
  )
}

export default NumberOfGroups