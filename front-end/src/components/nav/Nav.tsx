import Link from 'next/link'
import { ReactNode, useState, memo, FC } from 'react'
import { useRouter } from 'next/router'
import { createPortal } from 'react-dom'
import UserAccountModal from '../modal/UserAccountModal'
import LoginSignUpModal from '../modal/LoginSignUp'
import { cvtUrl } from 'functions/upload/convertImageUrl'
import { useAccount } from '../context/AccountContext'
import { UserAccount } from 'interfaces/User'
import { useShowNav } from 'components/context/ShowNavContext'
import styles from 'styles/Nav.module.css'

const ModalPortal = memo(({ children }: { children: ReactNode }) => {
  const target = document.querySelector('nav')!
  return createPortal(children, target)
})

const Nav: FC = memo(() => {
  const [isModalOpen, setModalOpen] = useState(false)
  const userData = useAccount()
  const router = useRouter()
  const showNav = useShowNav()

  const jumpToHome = () => router.push('/')

  // modalを閉じる
  const modalCloseHandler = () => {
    setModalOpen(false)
  }

  const witchModal = (isLogin: UserAccount | undefined) =>
    isLogin ? (
      <UserAccountModal userData={userData} setModalOpen={setModalOpen} />
    ) : (
      <LoginSignUpModal modalCloseHandler={modalCloseHandler} />
    )

  return (
    <>
      {showNav && (
        <nav className={styles.container}>
          <div className={styles.logoWrap} onClick={jumpToHome}>
            <img className={styles.tomatoLogo} src='/icons/logo/tomato_icon_v02.svg' alt='good food' />
            <img className={styles.goodFood} src='/icons/logo/logo_v01.svg' alt='good food' />
          </div>

          <div className={styles.userAccount}>
            <p className={styles.pop}>レシピ会議実施中！</p>
            <div className={styles.border}></div>
            {userData ? (
              <img className={styles.avatar} src={cvtUrl(userData.avatar)} alt={userData.accountName} />
            ) : (
              <img className={`${styles.avatar} ${styles.tempAvatar}`} src='/icons/general/user.svg' alt='user' />
            )}

            {userData ? (
              <Link href={`/settings`}>
                <a className={styles.accountLink}>{userData?.accountName}</a>
              </Link>
            ) : (
              <Link href='/signup'>
                <a className={styles.accountLink}>Join US!</a>
              </Link>
            )}
            <div onMouseEnter={() => setModalOpen(prev => !prev)} className={styles.dropDown}>
              ▼
            </div>
          </div>

          {isModalOpen && <ModalPortal>{witchModal(userData)}</ModalPortal>}
        </nav>
      )}
    </>
  )
})

export default Nav
