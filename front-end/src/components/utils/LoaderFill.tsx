import { FC } from 'react'
import CircleLoader from './Loader'
import styles from 'styles/LoadingAccount.module.css'

const LoaderFill: FC = () => {
  return (
    <div className={styles.fitLoading}>
      <img src='/icons/logo/tomato_icon_v02.svg' alt='loading icon' />
      <CircleLoader />
    </div>
  )
}

export default LoaderFill
