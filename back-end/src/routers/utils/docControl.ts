import bcrypt from 'bcryptjs'
import { ErrorOutput } from './errInterface'

// 配列内のstringをトリミングする
export const trimStrings = (arr: string[]): string[] | null => {
  const trimObj = arr.map(str => str.trim())
  if (!trimObj) {
    return null
  }
  return trimObj
}

//  トリミングと文字列長さのチェクを行う
export const trimAndCheckLength = (arr: string[], minLen: number, maxLen: number, describe: string): string[] => {
  const trimObj: any = arr.map(str => {
    limitStringLen(str, minLen, maxLen, describe)
    return str
  })
  return trimObj
}

// 文字数を制限する
export const limitStringLen = (text: string, minLen: number, maxLen: number, describe: string): void => {
  if (text.length > maxLen || text.length < minLen) {
    const err = new ErrorOutput(400, `${describe}の文字数は${minLen}文字以上${maxLen}文字以下にしてください`)
    throw new Error(err.errContent)
  }
}

// 配列の数と数字があっているかどうか
export const areEqualArrLength = (arr: string[], len: number) => {
  if (arr.length === len) return
  const err = new ErrorOutput(400, '配列の数と分割数があっていません')
  throw new Error(err.errContent)
}

// 与えられた数値よりも配列の数が少ないかどうか
export const isLessOrLargerThanArrLength = (arr: string[], len: number, type: 'less' | 'larger') => {
  if (type === 'less') {
    if (arr.length <= len) return
    const err = new ErrorOutput(400, '分割数よりも配列の数が多いです')
    throw new Error(err.errContent)
  } else {
    if (arr.length >= len) return
    const err = new ErrorOutput(400, '分割数よりも配列の数が少ないです')
    throw new Error(err.errContent)
  }
}

// 配列の中身に含まれているか
export const isInArray = <T>(arr: T[], obj: T) => {
  const isMatch = arr.includes(obj)
  if (isMatch) return
  const err = new ErrorOutput(400, 'レシピの分割数が規定の数値ではありません')
  throw new Error(err.errContent)
}

// Check email is valid
export const checkEmail = (email: string | undefined) => {
  if (email == undefined) return false
  const re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/
  return re.test(email.trim())
}

// hash化する
export const createHash = async (input: string) => {
  try {
    const salt = await bcrypt.genSalt()
    let hashedInput = await bcrypt.hash(input, salt)
    return hashedInput
  } catch (err: any) {
    throw new Error()
  }
}
