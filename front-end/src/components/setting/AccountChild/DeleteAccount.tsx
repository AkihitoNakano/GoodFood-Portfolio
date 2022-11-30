import { FC, useState, Dispatch, SetStateAction } from 'react'
import axios from 'axios'
import LoaderSending from 'components/utils/LoaderSending '
import { useAccount } from 'components/context/AccountContext'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { ErrorReport, ErrorLevel } from 'interfaces/Error'
import FETCH_API_URL from 'text/API_URL'
import styles from 'styles/Account.module.css'
import tStyles from 'styles/Text.module.css'
import bStyles from 'styles/Button.module.css'

const DeleteAccount: FC<{
  setErrorMsg: Dispatch<SetStateAction<ErrorReport[] | undefined>>
  isDataSending: boolean
  setIsDataSending: Dispatch<SetStateAction<boolean>>
}> = ({ setErrorMsg, isDataSending, setIsDataSending }) => {
  const [isModalOpened, setModalOpen] = useState<boolean>(false)
  const account = useAccount()

  // アカウント削除のリクエストを送信
  const deleteAccount = async () => {
    setIsDataSending(() => true)
    try {
      // アカウントの画像データを取得する
      const avatar = account?.avatar
      // アカウントを削除する
      await axios.delete(FETCH_API_URL.deleteAccount)
      // 画像データを削除する
      avatar && (await axios.delete(`${FETCH_API_URL.deleteOldImage}?file=${avatar}`))
      setIsDataSending(() => false)
      location.href = '/'
    } catch (e: any) {
      setIsDataSending(() => false)
      catchErrorFromAPI(e, setErrorMsg)
    }
  }

  const btnCheck = () => {
    if (!isModalOpened) return
    return (
      <button
        onClick={() => setModalOpen(false)}
        className={`${bStyles.btn} ${bStyles.btnMBlackFree} ${styles.cancelBtn}`}>
        いいえ
      </button>
    )
  }

  return (
    <>
      {isDataSending && <LoaderSending />}
      <form className={styles.formWrap}>
        <h2>アカウントを削除する</h2>
        <u className={tStyles.red}>アカウントを一度削除すると元にに戻す事ができなくなります。</u>
        <button
          onClick={isModalOpened ? () => deleteAccount() : () => setModalOpen(true)}
          type='button'
          className={`${bStyles.btn} ${bStyles.btnMRedFree} ${styles.checkBtn}`}>
          {isModalOpened ? '本当に削除する' : 'アカウントを削除'}
        </button>
        {btnCheck()}
      </form>
    </>
  )
}

export default DeleteAccount
