import { Types } from 'mongoose'
import Tag from '../../../models/Tag'
import { ErrorOutput } from '../errInterface'
import { trimStrings, trimAndCheckLength } from '../docControl'
import { tagNameConfig } from '../../../config/name.config'

// タグが登録されているか確認する
const haveTag = async (recipeId: Types.ObjectId | string): Promise<boolean> => {
  const tag = await Tag.findOne({ _id: recipeId })
  return tag ? true : false
}

// 配列内のタグの数とタグの名前の長さをチェックする

// tagを新規作成する
export const createTag = async (recipeId: Types.ObjectId | string, tag: string[]): Promise<void> => {
  // 既にタグが登録されていれば削除する
  const anyTag = await haveTag(recipeId)
  if (anyTag) {
    await Tag.deleteOne({ _id: recipeId })
  }

  // 配列内のタグの数とタグの名前の長さをチェックする
  if (!tag) return
  const trimTag: string[] = trimAndCheckLength(tag, tagNameConfig.tagMinLen, tagNameConfig.tagMaxLen, 'タグ')
  if (trimTag.length === 0) return

  await Tag.create({ _id: recipeId, tagName: tag })
}

// タグを更新する
export const updateTag = async (recipeId: Types.ObjectId | string, tag: string[]): Promise<void> => {
  if (!tag) {
    await Tag.deleteOne({ _id: recipeId })
    return
  }
  // 配列内のタグの数とタグの名前の長さをチェックする
  const trimTag = trimAndCheckLength(tag, tagNameConfig.tagMinLen, tagNameConfig.tagMaxLen, 'タグ')
  if (trimTag.length === 0) {
    await Tag.deleteOne({ _id: recipeId })
    return
  }

  // Tagが登録されていなければ新規作成,既にあれば更新
  const anyTag = await haveTag(recipeId)
  if (!anyTag) {
    await Tag.create({ _id: recipeId, tagName: tag })
  } else {
    await Tag.findByIdAndUpdate({ _id: recipeId }, { tagName: tag })
  }
}
