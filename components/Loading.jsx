

import styles from '../styles/Loading.module.css';

function Loading() {
  return (
    <>
      <img src={'/SDG_logo.png'} className={styles.loadingLogo} alt="ODSs logo spinning" />
    </>
  )
}

export default Loading;