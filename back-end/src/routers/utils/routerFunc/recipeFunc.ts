import * as Realm from 'realm-web'
import 'dotenv/config'
import Recipe, { RecipeFields } from '../../../models/Recipe'
import User from '../../../models/User'
import Fav from '../../../models/Fav'
import Follow from '../../../models/Follow'
import Tag from '../../../models/Tag'
import { ErrorOutput, errRes } from '../errInterface'
import { Types } from 'mongoose'
import { RecipeId, UserId, RecipeCard, IId, RecipeContent } from '../customInterface'
import docConfig from '../../../config/document.config'

// レシピがあるかどうか
export const findRecipe = async (recipeId: IId | undefined, option?: Object): Promise<RecipeFields> => {
  let recipe: RecipeFields | null
  if (option) {
    recipe = await Recipe.findOne({ _id: recipeId }, { ...option })
  } else {
    recipe = await Recipe.findOne({ _id: recipeId })
  }
  if (recipe) return recipe

  const err = new ErrorOutput(404, 'レシピがありません')
  throw new Error(err.errContent)
}

// レシピIDで単体の詳細ページ用のレシピを取得
export const readRecipe = async (id: IId | undefined): Promise<RecipeContent[]> => {
  try {
    const recipe = await Recipe.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          as: 'profile',
          pipeline: [{ $project: { _id: 0, displayName: 1, avatar: 1, accountName: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { profile: 0, __v: 0 } },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          as: 'favCount',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$favCount', 0] }, '$$ROOT'] } } },
      { $project: { favCount: 0 } },
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tag',
          pipeline: [{ $project: { tags: '$tagName', _id: 0 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$tag', 0] }, '$$ROOT'] } } },
      { $project: { tag: 0 } },
    ])

    return recipe
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// 複数のレシピIDで詳細ページ用のレシピデータを取得
export const readMultiDetailedRecipes = async (ids: string) => {
  const recipeIds = ids.split(',')
  try {
    const recipes = await Recipe.aggregate([
      { $match: { _id: { $in: recipeIds.map(id => new Types.ObjectId(id)) } } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          as: 'profile',
          pipeline: [{ $project: { _id: 0, displayName: 1, avatar: 1, accountName: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { profile: 0, __v: 0 } },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          as: 'favCount',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$favCount', 0] }, '$$ROOT'] } } },
      { $project: { favCount: 0 } },
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tag',
          pipeline: [{ $project: { tags: '$tagName', _id: 0 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$tag', 0] }, '$$ROOT'] } } },
      { $project: { tag: 0 } },
    ])

    return recipes
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// TODO: regexを使用するかfull text searchを使うか serverless functionを使うか
// AtlasのApp serviceを使った文書内検索　indexが競合する
export const searchRecipesFromAtlas = async (input: string) => {
  const REALM_APP_ID = process.env.REALM_APP_ID!
  const app = new Realm.App({ id: REALM_APP_ID })
  const credentials = Realm.Credentials.anonymous()
  try {
    const user = await app.logIn(credentials)
    const allRecipes = await user.functions.searchRecipes(input)
    return allRecipes
  } catch (err: any) {
    console.log(err)
  }
}

// TODO: レシピの順番は必ず確認すること　$unwindを使用しているとおかしくなるため確認

// 検索したレシピを取得する
export const searchRecipes = async (input: string, skip: number, limit: number): Promise<RecipeCard[]> => {
  try {
    // console.log('input', input)
    const recipes = await Recipe.aggregate([
      {
        $match: { $or: [{ title: { $regex: input, $options: 'x' } }, { describe: { $regex: input, $options: 'x' } }] },
      },
      // { $match: { $text: { $search: input } } },
      { $project: { title: 1, describe: 1, img: 1, createdAt: 1, owner: 1 } },
      { $sort: { createdAt: 1 } },
      { $skip: skip * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 0, displayName: 1, avatar: 1, accountName: 1 } }],
          as: 'profile',
        },
      },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }, { $project: { _id: 0, count: 1 } }],
          as: 'fav',
        },
      },
      {
        $project: {
          title: 1,
          describe: 1,
          img: 1,
          createdAt: 1,
          owner: 1,
          displayName: { $arrayElemAt: ['$profile.displayName', 0] },
          avatar: { $arrayElemAt: ['$profile.avatar', 0] },
          accountName: { $arrayElemAt: ['$profile.accountName', 0] },
          count: { $arrayElemAt: ['$fav.count', 0] },
        },
      },
    ])
    // console.log('recipe', recipes)
    return recipes
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// タグ検索
export const searchRecipesWithTag = async (input: string | string[], skip: number, limit: number) => {
  try {
    const recipes = await Tag.aggregate([
      { $match: { tagName: input } },
      { $sort: { updatedAt: -1 } },
      { $skip: skip * limit },
      { $limit: limit },
      { $project: { _id: 1 } },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: '_id',
          as: 'recipe',
          pipeline: [{ $project: { _id: 0, title: 1, owner: 1, describe: 1, img: 1, createdAt: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$recipe', 0] }, '$$ROOT'] } } },
      { $project: { recipe: 0 } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          as: 'profile',
          pipeline: [{ $project: { displayName: 1, avatar: 1, _id: 0, accountName: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { profile: 0 } },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }, { $project: { _id: 0, count: 1 } }],
          as: 'fav',
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fav', 0] }, '$$ROOT'] } } },
      { $project: { fav: 0 } },
    ])
    // console.log('tag recipe', recipes)
    return recipes
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// 検索したレシピの総数を取得する
export const countSearchRecipes = async (input: string | undefined) => {
  try {
    if (input?.charAt(0) === '@') {
      // タグ検索
      input = input.slice(1)
      const count = await Tag.find({ tagName: input }).count()
      return count
    } else {
      return await Recipe.find({
        $or: [{ title: { $regex: input } }, { describe: { $regex: input } }],
      }).countDocuments()
    }
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// レシピのFavに既にユーザーが登録されているかどうか
export const isUserInFav = async (
  recipeId: Types.ObjectId,
  userId: Types.ObjectId,
  isCreate: boolean = true
): Promise<boolean> => {
  const user = await Fav.findOne({ recipeId: recipeId, owner: userId })

  if (isCreate) {
    if (!user) return true
    const err = new ErrorOutput(404, '既にお気に入りに登録しています')
    throw new Error(err.errContent)
  } else {
    if (user) return true
    const err = new ErrorOutput(400, 'ユーザーとレシピがありません')
    throw new Error(err.errContent)
  }
}

//TODO: もっと簡略化できそう、冗長なな書き方 $unwindを使った方法は危なっかしいので注意が必要
// フォローユーザーの最新レシピを取得する
export const getFollowUsersLatestRecipes = async (user: string | Types.ObjectId): Promise<RecipeCard[]> => {
  try {
    const result = await Follow.aggregate([
      { $match: { follower: user } },
      { $project: { _id: 0, owner: '$followed' } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 0, displayName: 1, avatar: 1, accountName: 1 } }],
          as: 'profile',
        },
      },
      { $unwind: '$profile' },
      {
        $project: {
          owner: 1,
          displayName: '$profile.displayName',
          avatar: '$profile.avatar',
          accountName: '$profile.accountName',
        },
      },
      {
        $lookup: {
          from: 'recipes',
          localField: 'owner',
          foreignField: 'owner',
          pipeline: [{ $project: { title: 1, describe: 1, img: 1, createdAt: 1 } }],
          as: 'recipe',
        },
      },
      { $unwind: '$recipe' },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$recipe', '$$ROOT'] } } },
      { $project: { recipe: 0 } },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          as: 'fav',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }],
        },
      },
      { $unwind: '$fav' },
      {
        $project: {
          _id: 1,
          title: 1,
          describe: 1,
          img: 1,
          createdAt: 1,
          owner: 1,
          displayName: 1,
          accountName: 1,
          avatar: 1,
          count: '$fav.count',
        },
      },
      { $sort: { createdAt: 1 } },
      { $limit: docConfig.readRecipeLimit },
    ])

    return result
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// indexページに載るfavが多いレシピを取得する(最新順)
export const getEvaluatedRecipe = async (readLimit: number, skip: number) => {
  // アルゴリズム的に順番が同じにならないことがある
  const recipes = await Fav.aggregate([
    { $group: { _id: '$recipeId', count: { $count: {} } } },
    { $sort: { count: -1 } },
    { $skip: skip * readLimit },
    { $limit: readLimit },
    // Recipeに繋げる
    {
      $lookup: {
        from: 'recipes',
        localField: '_id',
        foreignField: '_id',
        pipeline: [{ $project: { ingredients: 0, flavors: 0, steps: 0, updated: 0, __v: 0, cookTime: 0 } }],
        as: 'recipe',
      },
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$recipe', 0] }, '$$ROOT'] } } },
    { $project: { recipe: 0, updatedAt: 0 } },
    {
      $lookup: {
        from: 'profiles',
        localField: 'owner',
        foreignField: '_id',
        as: 'profile',
        pipeline: [{ $project: { displayName: 1, avatar: 1, _id: 0, accountName: 1 } }],
      },
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
    { $project: { profile: 0 } },
  ])
  return recipes
}

// 指定したユーザーのレシピを取得する
export const getUserRecipe = async (userId: IId | undefined, skip: number, limit: number) => {
  try {
    const ownerId = new Types.ObjectId(userId)
    const userRecipes = await Recipe.aggregate([
      { $match: { owner: ownerId } },
      { $sort: { createdAt: -1 } },
      { $skip: limit * skip },
      { $limit: limit },
      { $project: { title: 1, describe: 1, img: 1, createdAt: 1, owner: 1 } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          as: 'profile',
          pipeline: [{ $project: { displayName: 1, avatar: 1, accountName: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { profile: 0 } },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          as: 'fav',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }],
        },
      },
      {
        $project: {
          title: 1,
          describe: 1,
          img: 1,
          createdAt: 1,
          owner: 1,
          displayName: 1,
          accountName: 1,
          avatar: 1,
          favCount: { $arrayElemAt: ['$fav', 0] },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          describe: 1,
          img: 1,
          createdAt: 1,
          owner: 1,
          displayName: 1,
          accountName: 1,
          avatar: 1,
          count: '$favCount.count',
        },
      },
    ])
    // console.log('userRecipe', userRecipes)
    return userRecipes
  } catch (e: any) {
    console.log(e)
    const err = new ErrorOutput(500, 'レシピのデータを取得中にサーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// お気に入りに登録しているレシピを取得する
export const getMyFavoriteRecipes = async (userId: IId, skip: number, limit: number) => {
  try {
    const recipes = await Fav.aggregate([
      // { $group: { _id: '$recipeId', count: { $count: {} } } },
      { $match: { owner: userId } },

      { $lookup: { from: 'recipes', localField: 'recipeId', foreignField: '_id', as: 'recipe' } },
      { $project: { _id: 0, owner: 0 } },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$recipe', 0] }, '$$ROOT'] } } },
      { $project: { title: 1, describe: 1, img: 1, createdAt: 1, owner: 1 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          as: 'profile',
          pipeline: [{ $project: { displayName: 1, avatar: 1, _id: 0, accountName: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { profile: 0 } },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          as: 'favCount',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }],
        },
      },
      // mergeObjectsとarrayElementAtで配列要素に入っていた0番目のオブジェクト（count）が取り出される
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$favCount', 0] }, '$$ROOT'] } } },
      { $project: { favCount: 0 } },
    ])

    // console.log(recipes)
    return recipes
  } catch (e: any) {
    console.log(e)
    const err = new ErrorOutput(500, 'レシピのデータを取得中にサーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// 関連したレシピを取得する
// searchのアルゴリズムとほぼ一緒
export const getRelatedRecipe = async (
  input: string | string[],
  skip: number,
  limit: number
): Promise<RecipeCard[]> => {
  try {
    // @ts-ignore
    const tags = input.split(',')
    const recipes = await Tag.aggregate([
      { $match: { tagName: { $in: tags } } },
      { $sort: { updatedAt: -1 } },
      { $project: { _id: 1 } },
      { $limit: limit },
      // Recipeに繋げる
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: '_id',
          pipeline: [{ $project: { ingredients: 0, flavors: 0, steps: 0, updated: 0, __v: 0, cookTime: 0 } }],
          as: 'recipe',
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$recipe', 0] }, '$$ROOT'] } } },
      { $project: { recipe: 0, updatedAt: 0 } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          as: 'profile',
          pipeline: [{ $project: { displayName: 1, avatar: 1, _id: 0, accountName: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { profile: 0 } },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          as: 'favCount',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }],
        },
      },
      // mergeObjectsとarrayElementAtで配列要素に入っていた0番目のオブジェクト（count）が取り出される
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$favCount', 0] }, '$$ROOT'] } } },
      { $project: { favCount: 0 } },
    ])

    return recipes
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// 自分の作成したレシピであるかどうか
export const isMyRecipe = async (userId: IId, recipeId: IId | undefined) => {
  try {
    const isMyCreated = await Recipe.findOne({ owner: userId, _id: recipeId })

    if (!isMyCreated) return false
    return true
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// favの中から検索する
export const searchRecipesInFav = async (userId: IId, input: string, skip: number, limit: number) => {
  try {
    const recipes = await Fav.aggregate([
      { $match: { owner: userId } },
      {
        $lookup: {
          from: 'recipes',
          localField: 'recipeId',
          foreignField: '_id',
          as: 'recipe',
          pipeline: [{ $match: { $or: [{ title: { $regex: input } }, { describe: { $regex: input } }] } }],
        },
      },
      { $unwind: '$recipe' },
      { $project: { recipe: 1, _id: 0 } },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$recipe', '$$ROOT'] } } },
      { $project: { recipe: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 0, displayName: 1, avatar: 1, accountName: 1 } }],
          as: 'profile',
        },
      },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }, { $project: { _id: 0, count: 1 } }],
          as: 'fav',
        },
      },
      {
        $project: {
          title: 1,
          describe: 1,
          img: 1,
          createdAt: 1,
          owner: 1,
          displayName: { $arrayElemAt: ['$profile.displayName', 0] },
          accountName: { $arrayElemAt: ['$profile.accountName', 0] },
          avatar: { $arrayElemAt: ['$profile.avatar', 0] },
          count: { $arrayElemAt: ['$fav.count', 0] },
        },
      },
    ])
    // console.log(recipes)
    return recipes
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// 複数のIDからレシピカード型のデータを取得する
export const readRecipesFromMultiIds = async (ids: string) => {
  const recipeIds = ids.split(',')
  try {
    const recipes = await Recipe.aggregate([
      { $match: { _id: { $in: recipeIds.map(id => new Types.ObjectId(id)) } } },
      { $project: { cookTime: 0, ingredients: 0, flavors: 0, steps: 0, updatedAt: 0, __v: 0 } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'owner',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 0, displayName: 1, avatar: 1, accountName: 1 } }],
          as: 'profile',
        },
      },
      {
        $lookup: {
          from: 'favs',
          localField: '_id',
          foreignField: 'recipeId',
          pipeline: [{ $group: { _id: '$recipeId', count: { $count: {} } } }, { $project: { _id: 0, count: 1 } }],
          as: 'fav',
        },
      },
      {
        $project: {
          title: 1,
          describe: 1,
          img: 1,
          createdAt: 1,
          owner: 1,
          displayName: { $arrayElemAt: ['$profile.displayName', 0] },
          accountName: { $arrayElemAt: ['$profile.accountName', 0] },
          avatar: { $arrayElemAt: ['$profile.avatar', 0] },
          count: { $arrayElemAt: ['$fav.count', 0] },
        },
      },
    ])
    // console.log(recipes)
    return recipes
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーでエラーが発生しました')
    throw new Error(err.errContent)
  }
}
