import React from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css";
import Paralelogramo from '../commons/Paralelogramo';
import WordCloud from '../commons/WordCloud';

function WordCloudComponent(props) {

  return (
    <div className={`${styles.center} ${styles.shadow}`} style={{ paddingTop: "25px" }} >
      <div className={styles.containerWordcloud}>
        <div style={{
          position: "relative",
          top: "-14%"
        }} >
          <Paralelogramo text={props.title} width="15vw" />
        </div>
        <div className={styles.center} style={{ width: "100%", height: "100%" }}>
          <WordCloud data={props.data} />
        </div>
      </div>
    </div>
  )
}

export default WordCloudComponent

