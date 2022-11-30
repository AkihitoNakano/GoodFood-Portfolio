// アバター画像のURL変換
export const cvtUrl = (url: string | undefined) => {
  return url ? `https://storage.googleapis.com/good_food/${url}` : '/icons/general/user.svg'
}

// レシピ画像のURL変換
export const cvtRecipeUrl = (url: string | undefined, alter: 'alterNoImg' | 'null' = 'alterNoImg') => {
  let alterImage: string | undefined
  if (alter === 'alterNoImg') alterImage = '/images/No_image.svg'
  if (alter === 'null') alterImage = undefined
  return url ? `https://storage.googleapis.com/good_food/${url}` : alterImage
}
