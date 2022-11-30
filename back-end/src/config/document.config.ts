interface IDocConfig {
  readRecipeLimit: number
  recipeDescribeLen: number
  readRecipeAtProfileLimit: number
  readFollowUserLimit: number
  readPageLimit: number
  recipePageNameMinLen: number
  recipePageNameMaxLen: number
  recipeCommentLen: number
  pageDivision: [1, 4, 6]
  readCommentLimit: number
  commentMinLength: number
  commentMaxLength: number
}

const docConfig: IDocConfig = {
  // recipeルートでユーザーで読み込むレシピ数
  readRecipeLimit: 20,
  // recipeのdescribeのMaxの長さ
  recipeDescribeLen: 50,
  // ユーザープロフィールページで読み込むレシピの数
  readRecipeAtProfileLimit: 20,
  // フォローユーザーを読み込むデフォルトの数
  readFollowUserLimit: 20,
  // ユーザーのpageを読み込むデフォルトの数
  readPageLimit: 10,
  // pageのタイトルの長さ
  recipePageNameMinLen: 1,
  recipePageNameMaxLen: 30,
  // recipeに対するコメントの長さ
  recipeCommentLen: 140,
  pageDivision: [1, 4, 6],
  // commentを読み込む数
  readCommentLimit: 5,
  // コメントの長さ
  commentMinLength: 1,
  commentMaxLength: 250,
}

export default docConfig
