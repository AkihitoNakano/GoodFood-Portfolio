import { Router } from 'express'
import auth from '../../middleware/auth'
import { ExResponse } from '../utils/customInterface'
import { catchErr } from '../utils/errorHandle'
import { PostProfile } from '../utils/customInterface'
import { updateProfile, getProfileData } from '../utils/routerFunc/profileFunc'

const router = Router()

// /user/profile

// profileページのユーザープロフィールデータを取得する
router.get('/:id', auth, async (req, res: ExResponse) => {
  const user = res.locals.user
  const profileUser = req.params.id

  try {
    const profile = await getProfileData(user._id, profileUser)

    res.send(profile)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// profileの修正を行う
router.patch('/', auth, async (req, res: ExResponse) => {
  const profileData: PostProfile = req.body
  const user = res.locals.user
  try {
    await updateProfile(user._id, profileData)

    res.send('OK')
  } catch (err: any) {
    catchErr(res, err)
  }
})

export default router
