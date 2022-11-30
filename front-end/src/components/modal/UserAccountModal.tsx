import { useRouter } from 'next/router'
import { FC, memo, Dispatch, SetStateAction } from 'react'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { logout } from 'functions/api/logout'
import { UserAccount } from 'interfaces/User'
import FETCH_URL from 'text/API_URL'
import styles from 'styles/UserAccModal.module.css'

type IAccountAndCloseModal = {
  modalCloseHandler: Dispatch<SetStateAction<boolean>>
  userData: UserAccount | undefined
}

type SetModalOpen = Dispatch<SetStateAction<boolean>>

const UserAccountModal: FC<{ userData: UserAccount | undefined; setModalOpen: SetModalOpen }> = memo(
  ({ setModalOpen, userData }) => {
    const router = useRouter()
    const setErrorMsg = useUpdateError()

    const logoutFromAccount = () => {
      const executeLogout = async () => {
        await logout(setErrorMsg, FETCH_URL.logout)
        router.reload()
      }
      executeLogout()
    }

    const jumpToPage = (url: string) => {
      router.push(url)
      setModalOpen(false)
    }

    return (
      <>
        <div onClick={() => setModalOpen(false)} className={styles.backClose}></div>
        <div className={styles.userModalContainer}>
          <div className={styles.listWrap}>
            <div className={styles.linkWrap} onClick={() => jumpToPage(`/${userData?.accountName}`)}>
              <img className={styles.icon} src='/icons/general/user.svg' alt='user' />
              <p>マイプロフィール</p>
            </div>
            <div onClick={logoutFromAccount} className={styles.linkWrap}>
              <img className={styles.icon} src='/icons/general/logout.svg' alt='logout' />
              <p>ログアウト</p>
            </div>
            <div onClick={() => (location.href = '/settings?page=createRecipe')} className={styles.linkWrap}>
              <img className={styles.icon} src='/icons/general/tools-kitchen-2.svg' alt='create recipe' />
              <p>レシピを作成する</p>
            </div>
            <div onClick={() => (location.href = '/settings?page=createPage')} className={styles.linkWrap}>
              <img className={styles.icon} src='/icons/general/clipboard-text.svg' alt='create page' />
              <p>ページを作成する</p>
            </div>
            <div className={styles.linkWrap} onClick={() => (location.href = '/settings')}>
              <img className={styles.icon} src='/icons/general/settings.svg' alt='settings' />
              <p>設定</p>
            </div>
          </div>
        </div>
      </>
    )
  }
)

export default UserAccountModal
