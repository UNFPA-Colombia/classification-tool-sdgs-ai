import React from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"
// props, 
function Circle(props) {
  return (
    <div className={`${styles.center} ${styles.shadow}`} style={{ width: "min-content" }}>
      <div className={styles.circle} style={{
        width: props.width,
        height: props.height, backgroundColor: props.color,
        padding: "10%"
      }}>
        <p className={styles.text1} style={{ fontSize: props.fontSize }} >{props.text1}</p>
        <h1 className={styles.circleH1} style={{ fontSize: props.fontSizeData }}>{props.data} </h1>
        <p className={styles.text2} style={{ fontSize: props.fontSize }} > {props.text2} </p>
        <p className={styles.text3} style={{ fontSize: props.fontSize3 }}>{props.text3} </p>
      </div>
      {props.line ?
        <div style={{ width: "15px", backgroundColor: props.color, height: "15px" }} ></div> : null}
    </div>
  )
}

export default Circle