import { ErrorOutput } from '../errInterface'
import { checkInputForm, handleError, isValidEmail } from '../errorHandle'
import accountConfig from '../../../config/account.config'

// 入力されたアカウント名、パスワード、emailの値をチェックする
export const checkSingUpForm = (accountName: string, password: string, email: string) => {
  // アカウント名をチェックする
  const checkAccountName = checkInputForm(
    accountName,
    'アカウント名',
    accountConfig.accountName.min,
    accountConfig.accountName.max
  )

  if (!checkAccountName.isValid) {
    const err = new ErrorOutput(400, checkAccountName.message)
    throw new Error(err.errContent)
  }
  // パスワードの長さをチェック
  const checkPassLength = checkInputForm(password, 'パスワード', accountConfig.password.min, accountConfig.password.max)

  if (!checkPassLength.isValid) {
    const err = new ErrorOutput(400, checkPassLength.message)
    throw new Error(err.errContent)
  }

  // Emailの型有効性チェック
  if (!isValidEmail(email)) {
    const err = new ErrorOutput(400, 'Emailが正しい書式ではありません')
    throw new Error(err.errContent)
  }
}
