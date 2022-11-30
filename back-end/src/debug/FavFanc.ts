import Recipe from '../models/Recipe'
import Fav from '../models/Fav'
import User, { UserSchemaFields } from '../models/User'
import recipes from './recipe'

import { randRange } from './testFunc'
import { Types } from 'mongoose'

// Favを登録する
const randomChoice = async (users: { _id: Types.ObjectId }[], recipes: { _id: Types.ObjectId }[]) => {
  const user = users[randRange(0, users.length - 1)]
  const recipe = recipes[randRange(0, recipes.length - 1)]

  const alreadyHave = await Fav.findOne({ owner: user._id, recipeId: recipe._id })
  if (alreadyHave) return
  await Fav.create({ recipeId: recipe._id, owner: user._id })
}

// TODO: ランダムにレシピをお気に入り登録する
export const createRandomFav = async () => {
  const users = await User.find({}, { _id: 1 })
  const recipes = await Recipe.find({}, { _id: 1 })

  // 一度の発火で1-6の範囲でランダムにお気に入り登録する
  const num = Math.floor(Math.random() * 6)
  console.log(num)
  for (let i = 0; i <= num; i++) {
    await randomChoice(users, recipes)
  }
}
