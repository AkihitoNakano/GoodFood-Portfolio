import { FC } from 'react'
import styles from 'styles/LoadingAccount.module.css'

const AccountLoader: FC = () => {
  return (
    <div className={styles.viewLoading}>
      <img src='/icons/logo/tomato_icon_v02.svg' alt='loading icon' />
      <p>Loading...</p>
    </div>
  )
}

export default AccountLoader
