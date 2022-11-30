import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { ExUserSchemaFields } from '../../models/User'

export type IId = string | Types.ObjectId
export interface ExRequest extends Request {
  query: {
    limit: string | undefined
    skip: string | undefined
    input?: string | undefined
    id?: string | undefined
  }
}

export interface ExResponse extends Response {
  locals: {
    token: string
    user: ExUserSchemaFields
  }
}

export interface PostPageData {
  pageName: string
  divisionNum: number
  recipeIds: string[]
}
export interface PostComment {
  creator: string | Types.ObjectId
  recipeId: string | Types.ObjectId
  responseId: string | Types.ObjectId | null
  comment: string
}

// profileにデータをポストする際の型
export interface PostProfile {
  displayName: string
  introduction: string
  avatar?: string
  links?: {
    twitter?: string
    instagram?: string
    meta?: string
    another?: string
  }
}

export interface UserId {
  userId: string | Types.ObjectId
}

export interface RecipeId {
  recipeId: string | Types.ObjectId
}

export interface RecipeCard {
  // recipe
  _id: string
  title: string
  describe: string
  img: string
  createdAt: Date
  // user or recipe.owner
  owner: string
  // profile
  displayName: string
  avatar: string
  // Fav count
  count: number
}

// profilePageで取得するユーザprofileの型
export interface UserProfile {
  //profile
  _id: string
  accountName: string
  displayName: string
  introduction: string
  avatar: string
  links?: {
    twitter?: string
    instagram?: string
    meta?: string
    another?: string
  }
  // follow
  followers: number
  followeds: number
  isFollowing: boolean
}

// フォロー中のユーザー表示
export interface IUserIcon {
  _id: string
  displayName: string
  accountName: string
  avatar: string
  // フォローされている数
  count: number
}

// レシピ詳細ページ
export type RecipeContent = {
  // recipe
  _id: string
  owner: string
  title: string
  describe: string
  cookTime: number
  img: string
  ingredients: Material[]
  flavors: Material[]
  steps: string[]
  createdAt: Date
  updatedAt: Date
  // profile
  displayName: string
  avatar: string
  accountName: string
  //fav
  count: number
  // tag
  tags: string[]
}

export type Material = {
  name: string
  amount: string
}

export type Comment = {
  _id: string
  recipeId: string
  creator: string
  displayName: string
  accountName: string
  avatar: string
  comment: string
  response?: ReplyComment[]
  createdAt: Date
}
// commentのレスポンスは１階層のみ
export type ReplyComment = {
  // このidはcomment id
  _id: string
  creator: string
  accountName: string
  displayName: string
  avatar: string
  comment: string
  createdAt: Date
}
