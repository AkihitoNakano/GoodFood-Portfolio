import { Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import User, { ExUserSchemaFields } from '../../../models/User'
import Profile from '../../../models/Profile'
import Follow from '../../../models/Follow'
import Recipe from '../../../models/Recipe'
import Fav from '../../../models/Fav'
import Page from '../../../models/Page'
import Tag from '../../../models/Tag'
import { existsUser } from '../userControl'
import { checkEmail } from '../docControl'
import { ErrorOutput } from '../errInterface'

// アカウント削除
export const deleteAccount = async (userId: string | Types.ObjectId) => {
  try {
    await existsUser(userId, 'ユーザーが存在しません')
    // profileを消す
    await Profile.deleteOne({ _id: userId })
    // followを消す
    // TODO: 一行で書きたい
    await Follow.deleteMany({ follower: userId })
    await Follow.deleteMany({ followed: userId })

    // Tagを消す
    const recipes = await Recipe.find({ owner: userId }, { _id: 1 })
    const formatRecipes = recipes.map(recipe => recipe._id)
    await Tag.deleteMany({ _id: { $in: [...formatRecipes] } })
    // Recipeを消す
    await Recipe.deleteMany({ owner: userId })
    // Favを消す
    await Fav.deleteMany({ owner: userId })
    // Pageを消す
    await Page.deleteMany({ creator: userId })
    // Userを消す
    await User.deleteOne({ _id: userId })
  } catch (err) {
    console.log(err)
    throw new Error()
  }
}

// パスワード変更
export const changePass = async (user: ExUserSchemaFields, passwords: { currentPass: string; newPass: string }) => {
  try {
    const isMatch = await bcrypt.compare(passwords.currentPass, user.password)

    if (!isMatch) throw new Error()

    user.password = passwords.newPass
    user.save()
  } catch (e: any) {
    const err = new ErrorOutput(404, 'アカウントが見つかりません。パスワードが間違っているか、不適切な入力です')
    throw new Error(err.errContent)
  }
}

// Emailアドレスの変更
export const changeEmail = async (user: ExUserSchemaFields, email: { currentEmail: string; newEmail: string }) => {
  try {
    if (user.email !== email.currentEmail) throw new Error()

    const isEmailValid = checkEmail(email.newEmail)
    if (!isEmailValid) throw new Error()

    const changeEmail = await User.findOneAndUpdate({ _id: user._id }, { email: email.newEmail })
  } catch (e: any) {
    const err = new ErrorOutput(404, 'アカウントが見つかりません。メールアドレスが間違っているか、不適切な入力です')
    throw new Error(err.errContent)
  }
}
