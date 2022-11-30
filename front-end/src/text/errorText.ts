import { ErrorLevel } from '../interfaces/Error'

interface MessageAndLevel {
  message: string
  level: string
}

interface IErrorMessage {
  NO_TOKEN: MessageAndLevel
  NO_FOUND_ACCOUNT: MessageAndLevel
  SERVER_ERR_LOGIN: MessageAndLevel
  NOT_FOUND_RELOGIN: MessageAndLevel
  NETWORK_ERROR: MessageAndLevel
  SERVER_ERR: MessageAndLevel
}

// error messageを定義する
export const ERROR_MSG: IErrorMessage = {
  NO_TOKEN: {
    message: 'レシピをお気に入りに保存したり、より多くの機能を利用する場合は、ログインしてください！',
    level: ErrorLevel.ALERT,
  },
  NO_FOUND_ACCOUNT: {
    message: 'アカウントが見つかりませんでした、ログインするか、サインアップして下さい',
    level: ErrorLevel.ALERT,
  },
  SERVER_ERR_LOGIN: {
    message: 'サーバーエラーが発生しました、もう一度ログインするか、サインアップして下さい',
    level: ErrorLevel.ALERT,
  },
  NOT_FOUND_RELOGIN: {
    message: 'アカウントが見つかりませんでした。emailとパスワードの組み合わせが間違っています。',
    level: ErrorLevel.ALERT,
  },
  NETWORK_ERROR: {
    message: 'ネットワークエラーが発生しました、もう一度試して下さい。',
    level: ErrorLevel.ALERT,
  },
  SERVER_ERR: {
    message: 'サーバーエラーが発生しました',
    level: ErrorLevel.ALERT,
  },
}

interface IInfo_message {
  CHECK_VALID_EMAIL: MessageAndLevel
}

export const INFO_MSG: IInfo_message = {
  CHECK_VALID_EMAIL: {
    message: '確認用のメールをメールアドレス送信しました。メールを確認してアカウントを有効にして下さい',
    level: ErrorLevel.INFO,
  },
}
