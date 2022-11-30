import { Types } from 'mongoose'
import Page from '../../../models/Page'
import Recipe from '../../../models/Recipe'
import { ErrorOutput } from '../errInterface'
import { existsUser } from '../userControl'
import { limitStringLen, areEqualArrLength, isInArray, isLessOrLargerThanArrLength } from '../docControl'
import docConfig from '../../../config/document.config'
import { IId, PostPageData } from '../customInterface'

// pageが存在するかどうか確認する
const existsPage = async (pageId: string | Types.ObjectId) => {
  const page = await Page.findOne({ _id: pageId })
  if (!page) {
    const err = new ErrorOutput(404, 'ページが存在しません')
    throw new Error(err.errContent)
  }
}

// ユーザーがそのページを持っているか
const userHasThisPage = async (userId: IId, pageId: IId) => {
  const page = await Page.findOne({ creator: userId, _id: pageId })
  if (!page) {
    const err = new ErrorOutput(404, 'ページが存在しないかまたは指定のページを保持していません')
    throw new Error(err.errContent)
  }
}

// recipeのstring IDからObjectIDを検索して取り出す
const searchAndConvertToObjectId = async (recipeIds: string[]): Promise<Types.ObjectId[]> => {
  // TODO: 以下の二つの文を一つにまとめたい
  const recipeObj = await Recipe.find({ _id: { $in: recipeIds } }, { _id: 1 })
  return recipeObj.map(recipe => recipe._id)
}

// 存在していないレシピがあるかどうか配列の長さで確認する
const checkLength = (recipeObj: Types.ObjectId[], recipeIds: string[]) => {
  if (recipeObj.length !== recipeIds.length) {
    const err = new ErrorOutput(404, '存在していないレシピidがあるためページがが作成できませんでした')
    throw new Error(err.errContent)
  }
}

// 単体ページを取得する
export const getPage = async (pageId: string | Types.ObjectId) => {
  await existsPage(pageId)
  try {
    return await Page.findOne({ _id: pageId }, { __v: 0 })
  } catch (e: any) {
    console.log(e)
    const err = new ErrorOutput(400, 'そのレシピIDは存在しません')
    throw new Error(err.errContent)
  }
}

// ユーザーが作成したページを取得する
export const getUsersPages = async (userId: string | Types.ObjectId, limit: number, skip: number) => {
  await existsUser(userId, 'ユーザーはいません')
  try {
    const pages = await Page.find({ creator: userId }, { __v: 0 })
      .limit(limit)
      .skip(limit * skip)
    return pages
  } catch (e: any) {
    console.log(e)
    const err = new ErrorOutput(400, '不正なクエリです')
    throw new Error(err.errContent)
  }
}

// ページを作成する
export const createPage = async (owner: string | Types.ObjectId, body: PostPageData) => {
  const { recipeIds, pageName, divisionNum } = body

  await existsUser(owner, 'ユーザーはいません')
  isInArray(docConfig.pageDivision, divisionNum)
  isLessOrLargerThanArrLength(recipeIds, divisionNum, 'less')
  limitStringLen(pageName, docConfig.recipePageNameMinLen, docConfig.recipePageNameMaxLen, 'ページタイトル')

  const recipeObj = await searchAndConvertToObjectId(recipeIds)
  checkLength(recipeObj, recipeIds)

  return await Page.create({ creator: owner, recipeIds: recipeObj, pageName, divisionNum })
}

// pageを編集する
export const updatePage = async (
  owner: string | Types.ObjectId,
  pageId: string | Types.ObjectId,
  body: PostPageData
) => {
  const { recipeIds, pageName, divisionNum } = body
  // await existsUser(owner, 'ユーザーはいません')
  // await existsPage(pageId)
  userHasThisPage(owner, pageId)
  isInArray(docConfig.pageDivision, divisionNum)
  isLessOrLargerThanArrLength(recipeIds, divisionNum, 'less')
  const recipeObj = await searchAndConvertToObjectId(recipeIds)
  checkLength(recipeObj, recipeIds)

  await Page.updateOne({ _id: pageId }, { recipeIds: recipeObj, pageName, divisionNum })
  return await Page.findOne({ _id: pageId }, { __v: 0 })
}

// pageを削除する
export const deletePage = async (owner: IId, pageId: IId) => {
  await existsUser(owner, 'ユーザーはいません')
  await existsPage(pageId)

  await Page.deleteOne({ _id: pageId })
}
