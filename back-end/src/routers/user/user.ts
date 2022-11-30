import { Router } from 'express'
import { catchErr } from '../utils/errorHandle'
import User, { ExUserSchemaFields } from '../../models/User'
import { ExResponse } from '../utils/customInterface'
import auth from '../../middleware/auth'

import { getUserAccount, decodeUserEmail } from '../utils/routerFunc/authFunc'
import { deleteAccount, changePass, changeEmail } from '../utils/routerFunc/userFunc'
import profileRouter from './profile'

const router = Router()

router.use('/profile', profileRouter)
// /user

// who am I
router.get('/who', auth, async (req, res: ExResponse) => {
  try {
    const user: ExUserSchemaFields = res.locals.user
    const profile = await User.aggregate([
      { $match: { _id: user._id } },
      { $project: { email: 1 } },
      {
        $lookup: {
          from: 'profiles',
          localField: '_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 0, createdAt: 0, updatedAt: 0, __v: 0, avatar: 0, links: 0 } }],
          as: 'profile',
        },
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$profile', 0] }, '$$ROOT'] } } },
      { $project: { _id: 0, profile: 0 } },
    ])

    res.send(profile[0])
  } catch (err: any) {
    catchErr(res, err)
  }
})

// ユーザーの認証,ユーザー情報の取得
router.get('/auth', auth, async (req, res: ExResponse) => {
  try {
    const user = res.locals.user
    const account = await getUserAccount(user._id)

    res.send(account)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// アカウントを削除する
router.delete('/', auth, async (req, res: ExResponse) => {
  const user: ExUserSchemaFields = res.locals.user
  try {
    // アカウントを削除する
    await deleteAccount(user._id)

    res.send('OK')
  } catch (err: any) {
    catchErr(res, err)
  }
})

// パスワードを変更する
router.patch('/changePass', auth, async (req, res: ExResponse) => {
  const user = res.locals.user
  try {
    await changePass(user, req.body)

    res.send('OK')
  } catch (err: any) {
    catchErr(res, err)
  }
})

// ユーザーのemailアドレスの変更
router.patch('/changeEmail', auth, async (req, res: ExResponse) => {
  const user = res.locals.user
  try {
    await changeEmail(user, req.body)
    res.send('OK')
  } catch (err: any) {
    catchErr(res, err)
  }
})

// メールの有効化確認、
router.post('/account/authentication', async (req, res) => {
  const { id, key } = req.query
  try {
    const decodeEmail = decodeURIComponent(key as string)
    // DBからhash化されたメールアドレスと一致するメールアドレスを探し出す
    const email = await decodeUserEmail(id as string, decodeEmail)

    // tokenを生成する
    const user = await User.findOne({ email: email })
    const token = await user?.generateAuthToken()
    res.send(token)
  } catch (err: any) {
    console.log(err)
    // errorページへ飛ぶ
    res.status(400).send(err.message)
  }
})

export default router
