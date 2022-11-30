export interface UserAccount {
  _id: string
  accountName: string
  displayName: string
  createdAt: Date
  avatar: string
}

export interface IUserProfile {
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
