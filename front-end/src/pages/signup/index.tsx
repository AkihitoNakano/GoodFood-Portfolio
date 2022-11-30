import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import axios from 'axios'
import { nanoid } from 'nanoid'
import LoaderSending from 'components/utils/LoaderSending '
import Footer from 'components/footer/Footer'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { emailValidatePattern, accountNameValidatePattern } from 'functions/form/checkInputForm'
import { ApiServerErrorRes, ErrorLevel } from 'interfaces/Error'
import { ERROR_MSG, INFO_MSG } from 'text/errorText'
import styles from 'styles/Login.module.css'
import tStyles from 'styles/Text.module.css'
import bStyles from 'styles/Button.module.css'
import fStyles from 'styles/Form.module.css'

export interface SignUpData {
  accountName: string
  email: string
  password: string
  rePassword: string
}

const SignUp: React.FC = () => {
  const router = useRouter()
  const showError = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()
  // useForm
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignUpData>({ defaultValues: { accountName: '', email: '', password: '', rePassword: '' } })

  const accountNameFromInput = {
    ...register('accountName', {
      required: 'アカウント名を入力して下さい',
      minLength: {
        value: 3,
        message: '英数字で3文字以上入力して下さい',
      },
      maxLength: { value: 20, message: '20文字以内におさめてください' },
      pattern: { value: accountNameValidatePattern, message: '英数字と記号{ _ - }のみで入力してください' },
    }),
  }
  const emailFormInput = {
    ...register('email', {
      required: 'メールアドレスを入力して下さい',
      pattern: { value: emailValidatePattern, message: '不適切なメールアドレスです' },
    }),
  }

  const passwordFormInput = {
    ...register('password', {
      required: 'パスワードを入力して下さい',
      minLength: { value: 6, message: 'パスワードは6文字以上で設定して下さい' },
      maxLength: { value: 16, message: 'パスワードは16文字以下で設定して下さい' },
    }),
  }
  const rePasswordFormInput = {
    ...register('rePassword', {
      required: 'パスワードを入力して下さい',
      validate: value => {
        return value === getValues('password') || 'パスワードが一致しません'
      },
    }),
  }

  // apiへ送信
  const submitHandler = async (data: SignUpData) => {
    const API_URL = '/api/user/signup'
    setIsDataSending(() => true)
    try {
      await axios.post(API_URL, { data }).then(res => res.status)
      setIsDataSending(() => false)
      showError([{ id: nanoid(), ...INFO_MSG.CHECK_VALID_EMAIL }])
      router.push('/index')
    } catch (e: any) {
      setIsDataSending(() => false)
      const errData: ApiServerErrorRes = e.response.data
      if (axios.isAxiosError(e)) {
        if (errData.error.status === 400) {
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
        <form className={styles.loginForm} onSubmit={handleSubmit(submitHandler)}>
          <img src='/icons/logo/logo_v01.svg' alt='good food' />
          <p className={`${styles.title} ${tStyles.title70g}`}>新規登録</p>
          <label className={`${tStyles.title50g}`} htmlFor='email'>
            アカウント名
          </label>
          <input
            className={`${fStyles.formInput}`}
            type='text'
            id='accountName'
            {...accountNameFromInput}
            placeholder='アカウント名を入力して下さい。'
          />
          <p className={`${tStyles.secRed}`}>{errors.accountName?.message}</p>

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

          <label className={`${tStyles.title50g}`} htmlFor='rePassword'>
            パスワード再確認
          </label>
          <input
            className={`${fStyles.formInput}`}
            type='password'
            id='rePassword'
            {...rePasswordFormInput}
            placeholder='パスワードを入力して下さい'
          />
          <p className={`${tStyles.secRed}`}>{errors.rePassword?.message}</p>

          <button className={`${bStyles.btn} ${bStyles.btnLRed}`}>送信</button>
        </form>
        <Footer />
      </div>
    </main>
  )
}

export default SignUp
