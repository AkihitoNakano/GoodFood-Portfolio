import { Types } from 'mongoose'
import Profile from '../../../models/Profile'
import Follow from '../../../models/Follow'
import docConfig from '../../../config/document.config'
import accountConfig from '../../../config/account.config'
import { PostProfile, IId } from '../customInterface'
import { existsUser } from '../userControl'
import { ErrorOutput } from '../errInterface'
import { limitStringLen } from '../docControl'

// ユーザーのプロフィール情報を取得する
export const getUserProfile = async (accountId: string) => {
  const profile = await Profile.findOne({ accountName: accountId })
  return profile
}

// プロフィールページで取得するユーザープロフィールデータ
// TODO: projectを2度使用してcountの値を取得したり、isFollowingを別で記述したり無駄がある
export const getProfileData = async (userId: IId, accountName: string) => {
  try {
    const profile = await Profile.aggregate([
      { $match: { accountName: accountName } },
      { $project: { accountName: 1, displayName: 1, introduction: 1, avatar: 1, links: 1 } },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follower',
          pipeline: [{ $group: { _id: '$follower', count: { $count: {} } } }, { $project: { _id: 0 } }],
          as: 'followersArr',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'followed',
          pipeline: [{ $group: { _id: '$followed', count: { $count: {} } } }, { $project: { _id: 0 } }],
          as: 'followedsArr',
        },
      },
      {
        $project: {
          _id: 1,
          accountName: 1,
          displayName: 1,
          introduction: 1,
          avatar: 1,
          links: 1,
          followersArr: { $arrayElemAt: ['$followersArr', 0] },
          followedsArr: { $arrayElemAt: ['$followedsArr', 0] },
        },
      },
      {
        $project: {
          _id: 1,
          accountName: 1,
          displayName: 1,
          introduction: 1,
          avatar: 1,
          links: 1,
          followers: '$followersArr.count',
          followeds: '$followedsArr.count',
        },
      },
    ])

    const userProfile = profile[0]
    const isUserFollowed = await Follow.findOne({ follower: userId, followed: userProfile._id })
    isUserFollowed ? (userProfile.isFollowing = true) : (userProfile.isFollowing = false)

    return userProfile
  } catch (e: any) {
    const err = new ErrorOutput(500, 'そのアカウントネームのユーザーはいません')
    throw new Error(err.errContent)
  }
}

// ユーザーのプロフィールとレシピデータを取得する
export const getProfileAndRecipe = async (accountId: string, profileOp: Object, recipeOp: Object) => {
  const data = await Profile.aggregate([
    { $match: { accountName: accountId } },
    { $project: { ...profileOp } },
    {
      $lookup: {
        from: 'recipes',
        localField: '_id',
        foreignField: 'owner',
        pipeline: [
          { $limit: docConfig.readRecipeAtProfileLimit },
          { $sort: { createdAt: 1 } },
          { $project: { ...recipeOp } },
        ],
        as: 'recipes',
      },
    },
  ])
  return data
}

// ユーザーのプロフィールを編集する
export const updateProfile = async (userId: string | Types.ObjectId, profileBody: PostProfile) => {
  await existsUser(userId, 'ユーザーがいません')
  const { displayName, introduction } = profileBody
  // displayNameの長さチェック
  limitStringLen(displayName, accountConfig.displayName.min, accountConfig.displayName.max, '表示名')
  // introductionの長さチェック
  limitStringLen(introduction, accountConfig.introduction.min, accountConfig.introduction.max, '紹介文')
  try {
    await Profile.updateOne({ _id: userId }, { ...profileBody })
  } catch (e: any) {
    const err = new ErrorOutput(500, 'サーバーエラーが発生しました')
    throw new Error(err.errContent)
  }
}
