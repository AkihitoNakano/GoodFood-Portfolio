import Fav from '../../../models/Fav'
import { Types } from 'mongoose'
import { ErrorOutput } from '../errInterface'
import { IId } from '../customInterface'

// favに登録しているユーザーを検索する
export const getFavUsersFromRecipe = async (recipeId: string | Types.ObjectId, option?: Object) => {
  // Favに登録しているユーザーIDのみを取得する

  // let users: FavSchemaFields[] | null
  // users = option ? await Fav.find({ recipeId }, { ...option }) : (users = await Fav.find({ recipeId }))

  // ユーザーIDからユーザープロフファイルを取得する

  const users: any = await Fav.aggregate([
    { $match: { recipeId: recipeId } },
    { $lookup: { from: 'profiles', localField: 'owner', foreignField: '_id', as: 'profile' } },
    { $limit: 30 },
    { $project: option ? { ...option } : { __v: 0 } },
  ])

  if (!users) {
    const err = new ErrorOutput(404, 'お気に入りに登録しているユーザーがいません')
    throw new Error(err.errContent)
  }
  return users
}

// ユーザーがfavに登録しているか確認
export const isFavThisRecipe = async (userId: IId, recipeId: IId | undefined) => {
  try {
    const isFav = await Fav.findOne({ recipeId: recipeId, owner: userId })

    return isFav ? true : false
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーエラーが発生しました')
    throw new Error(err.errContent)
  }
}
