import { Response } from 'express'
import { ErrorOutput } from './errInterface'

interface CheckForm {
  isValid: boolean
  message: string
}

interface IHandleError {
  errCode: number
  errMessage: string
}

export enum InputType {
  string,
  number,
}

// Check input from singUp
export const checkInputForm = (input: string, target: string, min: number, max: number): CheckForm => {
  const re = /^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/
  if (!re.test(input.trim())) {
    return { isValid: false, message: `${target} 半角英数字で入力してください` }
  }
  if (input.length < min || input.length > max) {
    return { isValid: false, message: `${target} 半角英数字${min}以上、${max}以内にしてください` }
  }
  return { isValid: true, message: '' }
}

// modelのエラーをキャッチする
const handleError = (err: any): IHandleError => {
  // duplicate email error code
  if (err.code === 11000) {
    return { errCode: 400, errMessage: `e-mailアドレスまたはアカウントネームが既に使われています` }
  }

  return { errCode: 500, errMessage: 'サーバーで不具合が起きました' }
}

// Emailが有効な形式であるかどうか
const isValidEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}
// エラーをキャッチしてコードとメッセージを返す
export const catchErr = (res: Response, err: any) => {
  const { code, message } = ErrorOutput.splitErrorContent(err.message)
  if (code && message) {
    res.status(code).send(message)
  } else {
    res.status(500).send('サーバーエラーが発生しました')
  }
}

// numberかどうか
export const inputIsNumber = (input: any, errMessage: string) => {
  const isNumber = isNaN(input)
  if (!isNumber) return
  const err = new ErrorOutput(400, errMessage)
  throw new Error(err.errContent)
}

// queryのlimitとskipが適切な値かどうか
export const checkLimitAndSkip = (queryLimit: string | undefined, querySkip: string | undefined, readLimit: number) => {
  let limit: number
  let skip: number
  queryLimit ? (limit = +queryLimit) : (limit = readLimit)
  querySkip ? (skip = +querySkip) : (skip = 0)

  inputIsNumber(limit, 'クエリが不適切な値です')
  inputIsNumber(skip, 'クエリが不適切な値です')

  return { limit, skip }
}

export { handleError, isValidEmail }
