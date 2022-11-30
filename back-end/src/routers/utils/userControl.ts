import { Types } from 'mongoose'
import User from '../../models/User'
import { ErrorOutput } from './errInterface'

// ユーザーがいるかどうかチェックする
export const existsUser = async (id: string | Types.ObjectId, errMsg: string): Promise<void> => {
  const user = await User.findOne({ _id: id })
  if (!user) {
    const err = new ErrorOutput(404, errMsg)
    throw new Error(err.errContent)
  }
}
