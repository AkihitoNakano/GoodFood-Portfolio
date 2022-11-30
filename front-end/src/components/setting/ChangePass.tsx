import { FC, useState, FormEvent, useRef } from 'react'
import { nanoid } from 'nanoid'
import { useUpdateError } from '../context/ErrorReportContext'
import styles from 'styles/ChangePassword.module.css'
import { passwordLen } from 'text/Specification'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import btnStyles from 'styles/Button.module.css'
import axios from 'axios'
import FETCH_API_URL from 'text/API_URL'
import { ErrorLevel } from 'interfaces/Error'

type passwords = {
  currentPass: string
  newPass: string
  checkPass: string
}

const ChangePassword: FC = () => {
  const [passwords, setPasswords] = useState<passwords>({ currentPass: '', newPass: '', checkPass: '' })
  const setErrorMsg = useUpdateError()
  const btnRef = useRef<HTMLButtonElement>(null)

  // パスワードの送信
  const changePassHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    btnRef.current!.disabled = true

    // 新しいパスワードと再確認用のパスワードをチェック
    if (passwords.newPass !== passwords.checkPass) {
      setErrorMsg([
        {
          id: nanoid(),
          message: '新しいパスワードが一致しません。もう一度２つを確認して下さい。',
          level: ErrorLevel.ALERT,
        },
      ])
      btnRef.current!.disabled = false
      return
    }
    // パスワードをサーバーに送信
    const changePass = async () => {
      try {
        await axios.patch(FETCH_API_URL.changePass, { ...passwords })
        setErrorMsg([{ id: nanoid(), message: 'パスワードが変更されました', level: ErrorLevel.INFO }])
        btnRef.current!.disabled = false
        setPasswords({ currentPass: '', newPass: '', checkPass: '' })
      } catch (e: any) {
        btnRef.current!.disabled = false
        catchErrorFromAPI(e, setErrorMsg)
      }
    }
    changePass()
  }

  return (
    <div className='settingCenterWrap'>
      <div className={styles.container}>
        <h1>パスワードの変更</h1>
        <form onSubmit={changePassHandler} className={styles.formWrap}>
          <label htmlFor='currentPass'>現在のパスワード</label>
          <input
            onChange={e => setPasswords(prev => ({ ...prev, currentPass: e.target.value }))}
            type='password'
            id='currentPass'
            placeholder='現在のパスワードを入力して下さい'
            minLength={passwordLen.minLen}
            value={passwords.currentPass}
            required
          />
          <label htmlFor='newPass'>新しいパスワード</label>
          <input
            onChange={e => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
            type='password'
            id='newPass'
            placeholder={`${passwordLen.minLen}文字以上${passwordLen.maxLen}以内で入力して下さい`}
            maxLength={passwordLen.maxLen}
            value={passwords.newPass}
            required
          />
          <label htmlFor='checkPass'>新しいパスワードの再確認</label>
          <input
            onChange={e => setPasswords(prev => ({ ...prev, checkPass: e.target.value }))}
            type='password'
            id='checkPass'
            placeholder={`新しいパスワードと同じ内容を入力して下さい`}
            maxLength={passwordLen.maxLen}
            value={passwords.checkPass}
            required
          />
          <button ref={btnRef} className={`${btnStyles.btn} ${btnStyles.btnMRed}`}>
            変更
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
