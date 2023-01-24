import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'

import NumberOfGroups from './NumberOfGroups';
import GraphsView from './graphs/GraphsView';
import WordCloudsView from './WordCloudsView';
import ShowBarCharts from './ShowBarCharts';
import { Button, Col, Form, Row } from 'react-bootstrap';
import styles from '../../styles/DocumentosComponentes.module.css'


function Resultados({data}) {

   const bestTopicNumber = data["bestModel"]
   const modelos = data["models"]
   const bestModel = modelos[bestTopicNumber]
   const [currentTopicNumber, setTopicNumber] = useState(bestTopicNumber + 2)


   return (
      <div>
         <NumberOfGroups numTopics={bestTopicNumber + 2} />
         <div className={`${styles.fondoColorMoradoClaro} ${styles.center} ${styles.shadow}`} style={{padding: "1em 10em" }}>
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
               <Col lg={4} style={{textAlign: "start",    color: "white"}}>
                  <p className={styles.text3} style={{fontSize:"1em", textAlign: "start"}}>Tópico actual: <b>  {currentTopicNumber} </b></p>
               </Col>
            </Row>
         </div>
         <GraphsView coherencia={modelos[currentTopicNumber - 2]["coherencia_c_v"]} />
         <WordCloudsView topicos={modelos[currentTopicNumber-2]["topicos"]} />
         <ShowBarCharts topicos={modelos[currentTopicNumber-2]["topicos"]} />
      </div>
   )
}


export default Resultados