import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'

import NumberOfGroups from './NumberOfGroups';
import GraphsView from './graphs/GraphsView';
import WordCloudsView from './WordCloud/WordCloudsView';
import ShowBarCharts from './graphBar/ShowBarCharts';
import GeneralCleanDataView from './GeneralData/GeneralCleanDataView';
import GeneralDataView from './GeneralData/GeneralDataView';
import InteractiveGraphView from './InteractiveGraph/InteractiveGraphView';
import { Col, Form, Row } from 'react-bootstrap';
import styles from '../../styles/DocumentosComponentes.module.css'
import FinalScreenView from './FinalScreenView';
import InfoButton from './commons/InfoButton';


function Resultados({ data }) {
   console.log(data);

   /* General data */
   const dataGeneral = data["generalData"]

   /* Topic modeling */
   const bestTopicNumber = data["topicModeling"]["bestModelNumber"]
   const modelos = data["topicModeling"]["models"]
   const [currentTopicNumber, setTopicNumber] = useState(bestTopicNumber + 2)

   /* Distributions */
   const distributions = data["distribuciones"]

   /* Interactive graph */
   const interactiveGraph = data["interactive"]

   /* Id*/
   const id = data["id"]
   return (
      <div>
         <GeneralDataView data={dataGeneral} />
         <GeneralCleanDataView data={dataGeneral} />
         <NumberOfGroups numTopics={bestTopicNumber + 2} />
         <div>
            <div className={`${styles.fondoColorMoradoClaro} ${styles.center} ${styles.shadow}`} style={{ padding: "1em 10em" }}>
               <Row className={styles.shadow}>
                  <p className={styles.tituloEstilo3} > ¡Puedes cambiar el número de tópicos y mirar como cambian las diferentes métricas!</p>
                  <Col lg={8}>
                     <Form.Range min={2}
                        max={9}
                        step={1}
                        tooltip={"on"}
                        value={currentTopicNumber}
                        onChange={(changeEvent) => { setTopicNumber(changeEvent.target.value) }}
                     />
                  </Col>
                  <Col lg={4} style={{ textAlign: "start", color: "white" }}>
                     <p className={styles.text3} style={{ fontSize: "1em", textAlign: "start" }}>Tópico actual: <b>  {currentTopicNumber} </b></p>
                  </Col>
               </Row>
            </div>
            <GraphsView coherencia={modelos[currentTopicNumber - 2]["coherencia_c_v"]} distribuciones={distributions} topicos={currentTopicNumber - 2} files={dataGeneral}/>
            <div className={`${styles.fondoColorMoradoClaro} ${styles.center} ${styles.shadow}`} style={{ padding: "1em 10em" }}>
               <Row className={styles.shadow}>
                  <p className={styles.tituloEstilo3} > Recuerda: ¡Puedes cambiar el número de tópicos y mirar como cambian las diferentes métricas!</p>
                  <Col lg={8}>
                     <Form.Range min={2}
                        max={9}
                        step={1}
                        tooltip={"on"}
                        value={currentTopicNumber}
                        onChange={(changeEvent) => { setTopicNumber(changeEvent.target.value) }}
                     />
                  </Col>
                  <Col lg={4} style={{ textAlign: "start", color: "white" }}>
                     <p className={styles.text3} style={{ fontSize: "1em", textAlign: "start" }}>Tópico actual: <b>  {currentTopicNumber} </b></p>
                  </Col>
               </Row>
            </div>
            <div className={`${styles.fondoColorMorado}`} >
            <Row >
               <Col md={{ offset: 11 }} style={{marginTop: "15px"}}>
                  <InfoButton message='Nota: importancia es el peso de las palabras en el documento.' placement="left" />
               </Col>
            </Row>
            </div>
            <WordCloudsView topicos={modelos[currentTopicNumber - 2]["topicos"]} />
            <div className={`${styles.fondoColorMoradoClaro} ${styles.center} ${styles.shadow}`} style={{ padding: "1em 10em" }}>
               <Row className={styles.shadow}>
                  <p className={styles.tituloEstilo3} > Recuerda: ¡Puedes cambiar el número de tópicos y mirar como cambian las diferentes métricas!</p>
                  <Col lg={8}>
                     <Form.Range min={2}
                        max={9}
                        step={1}
                        tooltip={"on"}
                        value={currentTopicNumber}
                        onChange={(changeEvent) => { setTopicNumber(changeEvent.target.value) }}
                     />
                  </Col>
                  <Col lg={4} style={{ textAlign: "start", color: "white" }}>
                     <p className={styles.text3} style={{ fontSize: "1em", textAlign: "start" }}>Tópico actual: <b>  {currentTopicNumber} </b></p>
                  </Col>
               </Row>
            </div>
            <ShowBarCharts topicos={modelos[currentTopicNumber - 2]["topicos"]} />
         </div>
         <div className={`${styles.fondoColorMorado}`} style={{ padding: "30px 0px" }}>
         <div className={`${styles.fondoColorMoradoClaro} ${styles.center} ${styles.shadow}`} style={{ padding: "1em 10em" }}>
               <Row className={styles.shadow}>
                  <p className={styles.tituloEstilo3} > Recuerda: ¡Puedes cambiar el número de tópicos y mirar como cambian las diferentes métricas!</p>
                  <Col lg={8}>
                     <Form.Range min={2}
                        max={9}
                        step={1}
                        tooltip={"on"}
                        value={currentTopicNumber}
                        onChange={(changeEvent) => { setTopicNumber(changeEvent.target.value) }}
                     />
                  </Col>
                  <Col lg={4} style={{ textAlign: "start", color: "white" }}>
                     <p className={styles.text3} style={{ fontSize: "1em", textAlign: "start" }}>Tópico actual: <b>  {currentTopicNumber} </b></p>
                  </Col>
               </Row>
            </div>
         </div>
         <InteractiveGraphView data={interactiveGraph[currentTopicNumber - 2]} />
         <FinalScreenView id={id} topicNumber={currentTopicNumber - 2} />
      </div>
   )
}


export default Resultados