import { Router } from 'express'
import { catchErr } from '../utils/errorHandle'

import { getProfileAndRecipe } from '../utils/routerFunc/profileFunc'

import auth from '../../middleware/auth'

const router = Router()

// /

// ユーザーのプロフィールとレシピを取得 マイページ
router.get('/:id', auth, async (req, res) => {
  try {
    const accountName = req.params.id
    const profileAndRecipe = await getProfileAndRecipe(accountName, { updatedAt: 0, __v: 0 }, { updatedAt: 0, __v: 0 })

    res.send(profileAndRecipe)
  } catch (err: any) {
    catchErr(res, err)
  }
})

export default router
