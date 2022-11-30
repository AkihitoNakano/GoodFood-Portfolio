import bcrypt from 'bcryptjs'
import { model, Model, Schema, Types, Document, PopulatedDoc } from 'mongoose'
import cookieConfig from '../config/cookie.config'
import jwt from 'jsonwebtoken'
import { ErrorOutput } from '../routers/utils/errInterface'

import 'dotenv/config'

const secretKey: string = process.env.SALTSECRET!

// どっちか消す
export interface UserSchemaFields {
  _id: Types.ObjectId
  email: string
  password: string
  tokens: { token: string; _id: Types.ObjectId }[]
  timestamps: Date
  generateAuthToken(): Promise<string>
}

export interface ExUserSchemaFields extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  tokens: { token: string; _id: Types.ObjectId }[]
  timestamps: Date
  generateAuthToken(): Promise<string>
  logout(myToken: string): Promise<void>
  logoutAll(): Promise<void>
}

export interface IUserMethods extends Model<UserSchemaFields> {
  findByCredentials(email: string, password: string): UserSchemaFields
}

const userSchema = new Schema<UserSchemaFields, IUserMethods>(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

userSchema.virtual('profile', {
  ref: 'Profile',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.virtual('recipe', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.email
  delete userObject.password
  delete userObject.tokens

  return userObject
}

// Cookieの期限
const maxAge = cookieConfig.maxAge
userSchema.methods.generateAuthToken = async function (): Promise<String> {
  try {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, secretKey, {
      expiresIn: maxAge,
    })
    user.tokens.push({ token })

    await user.save()
    return token
  } catch (err) {
    console.log(err)
    throw new Error('トークンが付与されませんでした')
  }
}

userSchema.statics.confirmCredential = async (inputPass: string, user) => {
  if (!user) {
    throw new Error('パスワードが合いません')
  }
  const isMatch = await bcrypt.compare(inputPass, user.password)
  if (!isMatch) {
    throw new Error('パスワードが合いません')
  }

  return isMatch
}

// logout
userSchema.methods.logout = async function (this: ExUserSchemaFields, myToken: string) {
  const user: ExUserSchemaFields | undefined = this
  if (!user) {
    const err = new ErrorOutput(404, 'ユーザが存在しません')
    throw new Error(err.errContent)
  }

  user.tokens = user.tokens.filter((token: { token: string; _id: Types.ObjectId }) => token.token !== myToken)
  await user.save().catch(err => {
    throw new Error('サーバーエラーが発生しました')
  })
}

// logout All
userSchema.methods.logoutAll = async function (this: ExUserSchemaFields) {
  const user: ExUserSchemaFields | undefined = this
  if (!user) {
    const err = new ErrorOutput(404, 'ユーザが存在しません')
    throw new Error(err.errContent)
  }

  user.tokens = []
  await user.save().catch(e => {
    throw new Error('サーバーエラーが発生しました')
  })
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this
  const salt = await bcrypt.genSalt()
  if (user.isModified('password')) {
    user.password! = await bcrypt.hash(user.password!, salt)
  }
  next()
})

const User = model<UserSchemaFields, IUserMethods>('User', userSchema)

export default User
