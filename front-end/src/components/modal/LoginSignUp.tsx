import Link from 'next/link'
import { memo } from 'react'
import { Dispatch, SetStateAction } from 'react'
import styles from 'styles/UserAccModal.module.css'

type CloseHandler = {
  modalCloseHandler: Dispatch<SetStateAction<boolean>>
}

const LoginSignUpModal = memo(({ modalCloseHandler }: CloseHandler) => {
  return (
    <>
      <div onClick={() => modalCloseHandler(false)} className={styles.backClose}></div>
      <div className={styles.userModalContainer}>
        <div className={styles.listWrap}>
          <div className={styles.linkWrap}>
            <img className={styles.icon} src='/icons/general/user.svg' alt='user' />
            <Link href='/login'>
              <p onClick={() => modalCloseHandler(false)}>ログイン</p>
            </Link>
          </div>
          <div className={styles.linkWrap}>
            <img className={styles.icon} src='/icons/general/logout.svg' alt='logout' />
            <Link href='/signup'>
              <p onClick={() => modalCloseHandler(false)}>新規登録</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
})

export default LoginSignUpModal
