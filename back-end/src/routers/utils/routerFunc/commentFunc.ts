import { Aggregate, Types } from 'mongoose'
import Comment, { CommentSchemaFields } from '../../../models/Comment'
import Profile from '../../../models/Profile'
import { RecipeId, UserId, PostComment, IId } from '../customInterface'
import { findRecipe } from './recipeFunc'
import { ErrorOutput } from '../errInterface'
import { limitStringLen } from '../docControl'
import docConfig from '../../../config/document.config'

// commentがあるかどうか
const exitsComment = async (commentId: string | Types.ObjectId, option?: Object) => {
  const comment = await Comment.findOne({ _id: commentId }, { ...option })
  if (!comment) {
    const err = new ErrorOutput(400, '返信するコメントがありません')
    throw new Error(err.errContent)
  }
  return comment
}

// recipeIdに対するコメントを取得する
export const getCommentsFromRecipe = async (recipeId: IId | undefined, skip: number, limit: number) => {
  try {
    const comments = await Comment.aggregate([
      { $match: { recipeId: new Types.ObjectId(recipeId) } },
      { $project: { __v: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'profiles',
          localField: 'creator',
          foreignField: '_id',
          as: 'profile',
          pipeline: [{ $project: { _id: 0, avatar: 1, displayName: 1, accountName: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { profile: 0 } },
      // replyコメントがあれば取得する
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'responseId',
          as: 'response',
          pipeline: [
            { $project: { __v: 0 } },
            {
              $lookup: {
                from: 'profiles',
                localField: 'creator',
                foreignField: '_id',
                as: 'replyProfile',
                pipeline: [{ $project: { _id: 0, avatar: 1, displayName: 1, accountName: 1 } }],
              },
            },
            { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$replyProfile', 0] }, '$$ROOT'] } } },
            { $project: { replyProfile: 0 } },
            { $sort: { createdAt: -1 } },
          ],
        },
      },
    ])

    return comments
  } catch (e: any) {
    const err = new ErrorOutput(500, 'コメントを取得する際にサーバーエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// commentの作成
export const createComment = async (userId: string | Types.ObjectId, body: PostComment) => {
  const { recipeId, responseId, comment } = body

  limitStringLen(comment, docConfig.commentMinLength, docConfig.commentMaxLength, 'コメント')

  let createdComment
  try {
    if (responseId) {
      await exitsComment(responseId)
      createdComment = await Comment.create({ creator: userId, responseId, comment })
    } else {
      await findRecipe(recipeId)
      createdComment = await Comment.create({ creator: userId, recipeId, comment })
    }

    const responseComment = await Comment.aggregate([
      { $match: { _id: createdComment._id } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'creator',
          foreignField: '_id',
          as: 'profile',
          pipeline: [{ $project: { _id: 0, avatar: 1, displayName: 1 } }],
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { __v: 0, profile: 0 } },
    ])

    return responseComment[0]
  } catch (e: any) {
    const err = new ErrorOutput(500, 'コメントを作成する途中でサーバーエラーが発生しました')
    throw new Error(err.errContent)
  }
}

// commentの削除
export const deleteComment = async (
  userId: string | Types.ObjectId,
  recipeId: string | Types.ObjectId,
  commentId: string | Types.ObjectId
) => {
  // recipeがあるかどうか、recipeのオーナーが削除しているのか確認
  const recipeOwner = await findRecipe(recipeId, { _id: 0, owner: 1 })
  const comment = await exitsComment(commentId, { creator: 1 })

  console.log(recipeOwner.owner.toString(), userId.toString(), comment.creator.toString())
  // recipeのオーナ、またはコメント作成者であれば削除できる
  if (recipeOwner.owner.toString() === userId.toString() || comment.creator.toString() === userId.toString()) {
    await Comment.deleteOne({ _id: comment._id })
  } else {
    const err = new ErrorOutput(400, 'コメントを削除できませんでした')
    throw new Error(err.errContent)
  }
}
