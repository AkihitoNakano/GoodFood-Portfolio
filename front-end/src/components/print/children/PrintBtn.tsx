import { FC } from 'react'
import styles from 'styles/Print.module.css'
import bStyles from 'styles/Button.module.css'

const PrintBtn: FC<{ printPage: () => void }> = ({ printPage }) => {
  return (
    <input
      className={`${bStyles.btn} ${bStyles.btnSBlack} ${styles.no_print} ${styles.printBtn}`}
      type='button'
      value='印刷する'
      onClick={printPage}
    />
  )
}

export default PrintBtn
