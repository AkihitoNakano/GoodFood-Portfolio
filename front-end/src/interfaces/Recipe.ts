export interface RecipeCard {
  // recipe
  _id: string
  title: string
  owner: string
  describe: string
  img: string
  createdAt: Date
  // profile
  displayName: string
  accountName: string
  avatar: string
  // fav
  count: number
}

export type RecipeState = RecipeCard[] | undefined

export interface SearchRecipeState {
  recipes: RecipeState
  count: number
}

// レシピ詳細ページ
export type RecipeContent = {
  // recipe
  _id: string
  owner: string
  title: string
  describe: string
  cookTime: number
  img: string
  ingredients: Material[]
  flavors: Material[]
  steps: string[]
  createdAt: Date
  updatedAt: Date
  // profile
  displayName: string
  avatar: string
  accountName: string
  //fav
  count: number
  // tag
  tags: string[]
}

export type Material = {
  name: string
  amount: string
}

export interface ExMaterial extends Material {
  id: number
}
export type Step = { id: number; desc: string }

export type Comment = {
  // このidはcomment id
  _id: string
  recipeId: string
  creator: string
  accountName: string
  displayName: string
  avatar: string
  comment: string
  response?: ReplyComment[]
  createdAt: Date
}
// commentのレスポンスは１階層のみ
export type ReplyComment = {
  // このidはcomment id
  _id: string
  creator: string
  accountName: string
  displayName: string
  avatar: string
  comment: string
  createdAt: Date
}
