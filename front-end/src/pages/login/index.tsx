import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import axios from 'axios'
import { nanoid } from 'nanoid'
import LoaderSending from 'components/utils/LoaderSending '
import Footer from 'components/footer/Footer'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import { emailValidatePattern } from 'functions/form/checkInputForm'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { ERROR_MSG } from 'text/errorText'
import { ApiServerErrorRes, ErrorLevel } from 'interfaces/Error'

import styles from 'styles/Login.module.css'
import tStyles from 'styles/Text.module.css'
import bStyles from 'styles/Button.module.css'
import fStyles from 'styles/Form.module.css'

export interface LoginData {
  email: string
  password: string
}

const Login: React.FC = () => {
  const router = useRouter()
  const showError = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ defaultValues: { email: '', password: '' } })

  const emailFormInput = {
    ...register('email', {
      required: 'メールアドレスを入力して下さい',
      pattern: { value: emailValidatePattern, message: '不適切なメールアドレスです' },
    }),
  }

  const passwordFormInput = {
    ...register('password', {
      required: 'パスワードを入力して下さい',
      minLength: {
        value: 6,
        message: '6文字以上入力して下さい',
      },
      maxLength: { value: 20, message: '20文字以内におさめてください' },
    }),
  }

  const submitHandler = async (data: LoginData) => {
    setIsDataSending(() => true)
    const ENDPOINT = '/api/user/login'
    try {
      await axios.post(ENDPOINT, { data }).then(res => res.status)
      setIsDataSending(() => false)
      router.push('/')
    } catch (e: any) {
      setIsDataSending(() => false)
      const errData: ApiServerErrorRes = e.response.data
      if (axios.isAxiosError(e)) {
        if (errData.error.status === 404) {
          showError([{ id: nanoid(), message: errData.error.message, level: ErrorLevel.ALERT }])
        } else {
          showError([{ id: nanoid(), ...ERROR_MSG.SERVER_ERR_LOGIN }])
        }
      }
    }
  }

  return (
    <main>
      {isDataSending && <LoaderSending />}
      <div className={styles.container}>
        <form className={styles.loginForm} onSubmit={handleSubmit(data => submitHandler(data))}>
          <img src='/icons/logo/logo_v01.svg' alt='good food' />
          <p className={`${styles.title} ${tStyles.title70g}`}>ログイン</p>
          <label className={`${tStyles.title50g}`} htmlFor='email'>
            メールアドレス
          </label>
          <input
            className={`${fStyles.formInput}`}
            type='text'
            id='email'
            {...emailFormInput}
            placeholder='メールアドレスを入力して下さい'
          />
          <p className={`${tStyles.secRed}`}>{errors.email?.message}</p>

          <label className={`${tStyles.title50g}`} htmlFor='password'>
            パスワード
          </label>
          <input
            className={`${fStyles.formInput}`}
            type='password'
            id='password'
            {...passwordFormInput}
            placeholder='パスワードを入力して下さい'
          />
          <p className={`${tStyles.secRed}`}>{errors.password?.message}</p>

          <button className={`${bStyles.btn} ${bStyles.btnLRed}`}>送信</button>
        </form>
        <Footer />
      </div>
    </main>
  )
}

export default Login
