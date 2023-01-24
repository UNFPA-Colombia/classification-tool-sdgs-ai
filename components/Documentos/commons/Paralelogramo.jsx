import React from 'react'
import styles from "../../../styles/DocumentosComponentes.module.css"

function Paralelogramo(props) {
  return (
    <div className={styles.shadow} style={{ height: props.height, width: props.width }}>
      <div className={styles.paralelogramoComplete}>
        <h3>
          {props.text}
        </h3>
      </div>
    </div>
  )
}

export default Paralelogramo