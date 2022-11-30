import { Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import Profile from '../../../models/Profile'
import State from '../../../models/State'

export const getUserAccount = async (userId: string | Types.ObjectId) => {
  const userAccount = await Profile.findOne({ _id: userId }, { introduction: 0, __v: 0, updatedAt: 0, links: 0 })
  return userAccount
}

// hash化されたメールアドレスからStateに登録されているユーザーを照合して、ユーザーと一致すればStateから削除する
export const decodeUserEmail = async (accountName: string, hashedMail: string) => {
  try {
    const userState = await State.findOne({ accountName: accountName })
    if (!userState) throw new Error('そのアカウントネームはありません')

    const isMatchMail = bcrypt.compareSync(userState.email, hashedMail)
    if (!isMatchMail) throw new Error('一致するメールアドレスはありません')
    // 登録していたstateを削除する
    await userState.delete()

    return userState.email
  } catch (err: any) {
    throw new Error(err.message)
  }
}
