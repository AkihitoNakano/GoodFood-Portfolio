import { FC, useState, useRef, FormEvent, Dispatch, SetStateAction } from 'react'
import axios from 'axios'
import { nanoid } from 'nanoid'
import LoaderSending from 'components/utils/LoaderSending '
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { ErrorReport, ErrorLevel } from 'interfaces/Error'
import { checkEmail } from 'functions/utils/docControl'
import FETCH_API_URL from 'text/API_URL'
import styles from 'styles/Account.module.css'
import tStyles from 'styles/Text.module.css'
import bStyles from 'styles/Button.module.css'
import fStyles from 'styles/Form.module.css'

const ChangeEmail: FC<{
  setErrorMsg: Dispatch<SetStateAction<ErrorReport[] | undefined>>
  isDataSending: boolean
  setIsDataSending: Dispatch<SetStateAction<boolean>>
}> = ({ setErrorMsg, isDataSending, setIsDataSending }) => {
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const currentEmailInputEl = useRef<HTMLInputElement>(null)
  const changedEmailInputEl = useRef<HTMLInputElement>(null)

  const submitEmailHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDataSending(true)

    const data = { currentEmail: currentEmailInputEl.current?.value, newEmail: changedEmailInputEl.current?.value }

    // emailアドレスのvalidationチェック
    const isEmailValid = checkEmail(data.newEmail)
    if (!isEmailValid) {
      setShowErrorMsg(true)
      return setIsDataSending(false)
    }

    try {
      await axios.patch(FETCH_API_URL.changeEmail, data)
      setIsDataSending(false)
      setErrorMsg([{ id: nanoid(), message: 'メールアドレスが変更されました', level: ErrorLevel.INFO }])
    } catch (err: any) {
      setIsDataSending(false)
      catchErrorFromAPI(err, setErrorMsg)
    }
  }

  return (
    <>
      {isDataSending && <LoaderSending />}
      <form onSubmit={e => submitEmailHandler(e)} className={styles.formWrap}>
        <h2>Emailアドレスを変更する</h2>
        <label htmlFor='currentEmail'>現在のメールアドレスを入力してください</label>
        <input ref={currentEmailInputEl} className={fStyles.formInput} type='text' id='currentEmail' required />
        <label htmlFor='changedEmail'>変更したいメールアドレスを入力してください</label>
        <input ref={changedEmailInputEl} className={fStyles.formInput} type='text' id='changedEmail' required />
        {showErrorMsg && <p className={tStyles.red}>メールアドレスの形式が適切ではありません</p>}
        <button className={`${bStyles.btn} ${bStyles.btnMRedFree} ${styles.checkBtn}`}>Emailアドレスを変更する</button>
      </form>
    </>
  )
}

export default ChangeEmail
