import bcrypt from 'bcryptjs'
import User from '../../../models/User'
import { ErrorOutput } from '../errInterface'

// emailとpasswordの組み合わせてユーザー確認、トークンを発行
export const findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    const err = new ErrorOutput(404, 'emailとパスワードの組み合わせが間違っています')
    throw new Error(err.errContent)
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    const err = new ErrorOutput(404, 'emailとパスワードの組み合わせが間違っています')
    throw new Error(err.errContent)
  }
  return user
}
