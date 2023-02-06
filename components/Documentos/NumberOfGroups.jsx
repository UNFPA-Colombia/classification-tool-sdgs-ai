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
          <h3 className={styles.tituloEstilo3}> Las palabras que se eliminaron son denominadas "palabras vacías".
            Se considera que estas palabras no aportan valor o información adicional al texto.
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
                  <li className={styles.generalDataLi} >Ahí</li>
                  <li className={styles.generalDataLi} >Así</li>
                  <li className={styles.generalDataLi} >Buen</li>
                </ul>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <div className={styles.centerDescription}>
        <h3 className={styles.tituloEstilo3}>
          Para realizar el modelo, se utilizaron librerías creadas para el análisis de texto.
          Gracias a estas, se realiza la limpieza de los textos y se crea un diccionario con las palabras obtenidas. Luego se encuentra la frecuencia
          de estas palabras en el documento. Con lo anterior…
        </h3>
      </div>
      <div className={`${styles.fondoColorMoradoClaro} ${styles.shadow}`}>
      <Row >
        <Col md={{ offset: 11 }}>
          <InfoButton message='Recuerda que decir "Tópicos" es igual a "Grupos" o "Temas"' placement="left" />
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
  )
}

export default NumberOfGroups