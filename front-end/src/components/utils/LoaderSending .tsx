import { FC } from 'react'
import styles from 'styles/LoaderSending.module.css'

const LoaderSending: FC = () => {
  return (
    <>
      <div className={styles.processBar}></div>
      <div className={styles.loadingInfoWrap}>
        <p>Sending update files...</p>
      </div>
      <div className={styles.viewLoading}></div>
    </>
  )
}

export default LoaderSending
