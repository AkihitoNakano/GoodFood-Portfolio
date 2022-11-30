// 文字列の空白をトリミングする
export const trimText = (text: string) => {
  return text.trim()
}

// トリムした文字列が空かどうか
export const isTextEmpty = (text: string) => {
  return text === '' ? true : false
}

// トリミングして文字列が空かどうか確認する
export const trimTextAndIsEmpty = (text: string) => {
  const trimedText = trimText(text)
  return isTextEmpty(trimedText)
}

// 文字の長さが規定以上であれば...で表示するようにする
export const omitText = (text: string, maxLength: number) => {
  if (!text || text === '') return ''
  if (text.length <= maxLength) return text
  const slicedText = text.substring(0, maxLength + 1)
  return slicedText + '...'
}

// Check email is valid
export const checkEmail = (email: string | undefined) => {
  if (email == undefined) return false
  const re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/
  return re.test(email.trim())
}
