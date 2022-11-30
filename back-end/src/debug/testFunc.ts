import Recipe from '../models/Recipe'
import Profile from '../models/Profile'
import Tag from '../models/Tag'
import User from '../models/User'
import recipes from './recipe'
import { usersName } from './users'

interface UserLoginFormat {
  accountName: string
  email: string
  password: string
}

export const createRandomUser = async () => {
  const name = usersName[randRange(0, usersName.length - 1)] + '_' + Math.floor(Math.random() * 1000)
  const user = createUserFormat(name)
  const createUser = await User.create({ email: user.email, password: user.password })
  await Profile.create({ _id: createUser._id, accountName: user.accountName })
}

//  テストユーザーを作成する
export const createTestUsers = (users: string[]) => {
  const usersArr = users.map(user => createUserFormat(user))
  return usersArr
}

// userを送信用のフォーマットに入れる
const createUserFormat = (user: string): UserLoginFormat => {
  return { accountName: user, email: `${user}@google.com`, password: 'test123' }
}

// 範囲内でランダムな数値を取得する
export const randRange = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)

// ランダムなレシピを作る
export const createRandomRecipe = async (num: number) => {
  const users = await User.find({}, { _id: 1 })
  for (let k = 0; k <= users.length - 1; k++) {
    for (let i = 0; i < num; i++) {
      const recipe = createRecipeFormat()
      const parentRecipe = await Recipe.create({ owner: users[k]._id, ...recipe })
      const tag = createTagFormat()
      await Tag.create({ _id: parentRecipe._id, tagName: tag })
    }
  }
}

// レシピをフォーマットに入れる
const createRecipeFormat = () => {
  const ingreContents: { name: string; amount: string }[] = []
  const ingreMax = randRange(1, 4)
  for (let i = 0; i <= ingreMax; i++) {
    const ing = {
      name: recipes.ingredients[randRange(0, recipes.ingredients.length - 1)],
      amount: `${randRange(1, 200)}${recipes.ingreAmount[recipes.ingreAmount.length - 1]}`,
    }
    ingreContents.push(ing)
  }

  const flavorsContents: { name: string; amount: string }[] = []
  const flavorMax = randRange(1, 3)
  for (let i = 0; i <= flavorMax; i++) {
    const fla = {
      name: recipes.flavors[randRange(0, recipes.flavors.length - 1)],
      amount: `${randRange(1, 200)}${recipes.flavorsAmount[recipes.flavorsAmount.length - 1]}`,
    }
    flavorsContents.push(fla)
  }

  const steps = []
  const stepNum = randRange(1, 4)
  for (let i = 0; i <= stepNum; i++) {
    const step = recipes.steps[randRange(0, recipes.steps.length - 1)]
    steps.push(step)
  }

  const recipeTitle = `${recipes.titles[randRange(0, recipes.titles.length - 1)]}_${randRange(0, 9999)}`
  const describeContent = recipes.describe[randRange(0, recipes.describe.length - 1)]
  // const recipeImg = recipes.img[randRange(0, recipes.img.length - 1)]
  // console.log(recipeTitle)
  return {
    title: recipeTitle,
    describe: describeContent,
    cookTime: randRange(20, 200),
    // img: recipeImg,
    ingredients: ingreContents,
    flavors: flavorsContents,
    steps: steps,
  }
}

const createTagFormat = () => {
  let recipeTags: string[] = []
  const maxNum = randRange(0, 5)
  for (let i = 0; i <= maxNum; i++) {
    const tag = recipes.tags[randRange(0, recipes.tags.length - 1)]
    recipeTags.push(tag)
  }
  return recipeTags
}
