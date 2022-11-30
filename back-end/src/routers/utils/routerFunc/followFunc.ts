import { Types } from 'mongoose'
import Follow from '../../../models/Follow'
import User from '../../../models/User'
import { ErrorOutput } from '../errInterface'
import { IId } from '../customInterface'

interface IUser {
  me: string | Types.ObjectId
  followedUser: string | Types.ObjectId
}

// フォローするのが自分ではないか
const followerIsMe = (me: IId, followedUser: IId) => {
  if (me.toString() === followedUser.toString()) {
    const err = new ErrorOutput(400, '自身はフォローできません')
    throw new Error(err.errContent)
  }
}

// ユーザーが存在しているかどうか
const doesExistUser = async (userId: IId) => {
  const user = await User.findOne({ _id: userId })
  if (!user) {
    const err = new ErrorOutput(404, 'ユーザーがいません')
    throw new Error(err.errContent)
  }
  return user
}

// 既にフォローしているかどうか確認する
export const checkIsFollowing = async (me: IId, followedUser: IId): Promise<boolean> => {
  const isFollowed = await Follow.findOne({ follower: me, followed: followedUser })
  return isFollowed ? true : false
}

// アカウントをフォローする
export const followUser = async (me: IId, followedUser: IId, canFlip: boolean = false) => {
  await Follow.create({ follower: me, followed: followedUser })
  return 'アカウントをフォローしました'
}

// フォローを解除する
export const unFollowUser = async (me: IId, followedUser: IId) => {
  await Follow.deleteOne({ follower: me, followed: followedUser })
  return 'フォローを解除しました'
}

// フォローしているアカウントをカウントする
export const countFollowers = async (me: IId) => {
  return await Follow.find({ follower: me }).countDocuments()
}

// フォローされているアカウントをカウントする
export const countFolloweds = async (me: IId) => {
  return await Follow.find({ followed: me }).countDocuments()
}

// フォローしているユーザーのプロフィールを取得する
export const getFollowers = async (userId: IId, limit: number, skip: number) => {
  const user = await doesExistUser(userId)

  const result = await Follow.aggregate([
    { $match: { follower: user._id } },
    { $project: { _id: 0, followed: 1 } },
    { $skip: limit * skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'profiles',
        localField: 'followed',
        foreignField: '_id',
        as: 'profile',
      },
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
    { $project: { displayName: 1, accountName: 1, avatar: 1 } },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'followed',
        as: 'follow',
        pipeline: [{ $group: { _id: '$followed', count: { $count: {} } } }, { $project: { _id: 0 } }],
      },
    },
    // $$ROOT 二つ重ねると２個上のルート、$一つだとfollowのルート
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$follow', 0] }, '$$ROOT'] } } },
    { $project: { follow: 0 } },
  ])
  console.log(result.length)
  return result
}

// フォローされているユーザーを取得する
export const getFolloweds = async (userId: IId, limit: number, skip: number) => {
  const user = await doesExistUser(userId)

  const result = await Follow.aggregate([
    { $match: { followed: user._id } },
    { $project: { _id: 0, follower: 1 } },
    { $skip: limit * skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'profiles',
        localField: 'follower',
        foreignField: '_id',
        as: 'profile',
      },
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
    { $project: { displayName: 1, accountName: 1, avatar: 1 } },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'followed',
        as: 'follow',
        pipeline: [{ $group: { _id: '$followed', count: { $count: {} } } }, { $project: { _id: 0 } }],
      },
    },
    // $$ROOT 二つ重ねると２個上のルート、$一つだとfollowのルート
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$follow', 0] }, '$$ROOT'] } } },
    { $project: { follow: 0 } },
  ])

  return result
}

//フォロー、アンフォローの一連の集約関数
export const followUserStream = async (me: IId, followedUser: IId) => {
  followerIsMe(me, followedUser)
  await doesExistUser(followedUser)

  const isFollowing = await checkIsFollowing(me, followedUser)

  if (!isFollowing) {
    await followUser(me, followedUser)
  } else {
    await unFollowUser(me, followedUser)
  }
  const followers = await countFollowers(followedUser)
  const followeds = await countFolloweds(followedUser)

  return { isFollowing: !isFollowing, followers, followeds }
}
