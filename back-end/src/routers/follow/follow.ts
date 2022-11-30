import { Router } from 'express'
import { ExRequest, ExResponse } from '../utils/customInterface'
import auth from '../../middleware/auth'
import { followUserStream, getFollowers, getFolloweds } from '../utils/routerFunc/followFunc'
import { catchErr } from '../utils/errorHandle'
import docConfig from '../../config/document.config'
import { checkLimitAndSkip } from '../utils/errorHandle'

const router = Router()

// /follow

// アカウントをフォロー,アンフォローする
router.post('/', auth, async (req, res: ExResponse) => {
  try {
    const user = res.locals.user
    const result = await followUserStream(user._id, req.body.user)

    res.send({ ...result })
  } catch (err: any) {
    catchErr(res, err)
  }
})

// フォローしているアカウントを取得する
router.get('/er', auth, async (req: ExRequest, res: ExResponse) => {
  const self = res.locals.user
  try {
    const { limit, skip } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readFollowUserLimit)

    // 他人のフォロワーを見たい場合は以下を使う、現状は必要なし
    // const userId = req.params.id
    const users = await getFollowers(self._id, limit, skip)

    res.send(users)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// フォローされているアカウントを取得する
router.get('/ed', auth, async (req: ExRequest, res: ExResponse) => {
  const self = res.locals.user
  try {
    const { limit, skip } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readFollowUserLimit)

    // 他人のフォロワーを見たい場合は以下を使う、現状は必要なし
    // const userId = req.params.id
    const users = await getFolloweds(self._id, limit, skip)

    res.send(users)
  } catch (err: any) {
    catchErr(res, err)
  }
})

export default router
