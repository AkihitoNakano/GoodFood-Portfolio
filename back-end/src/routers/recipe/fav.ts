import { Router } from 'express'
import auth from '../../middleware/auth'
import Fav from '../../models/Fav'
import { catchErr } from '../utils/errorHandle'
import { findRecipe, isUserInFav } from '../utils/routerFunc/recipeFunc'
import { getFavUsersFromRecipe, isFavThisRecipe } from '../utils/routerFunc/favFunc'
import { ExRequest, ExResponse } from 'routers/utils/customInterface'

const router = Router()

// /recipe/fav
// お気に入りに登録

// レシピにお気に入り登録しているユーザーを取得する
router.get('/', auth, async (req, res) => {
  try {
    const recipeId: string = req.body.recipe
    // レシピがあるかどうか確認
    const recipe = await findRecipe(recipeId, { _id: 1 })
    // favスキーマからレシピをお気に入り登録しているユーザーを取得する
    const users = await getFavUsersFromRecipe(recipe._id, { _id: 0, profile: 1 })

    res.send(users)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// ユーザーがレシピをお気に入りに登録しているかどうか確認する
router.get('/isFav', auth, async (req: ExRequest, res: ExResponse) => {
  const user = res.locals.user
  try {
    const { id } = req.query
    const isFav = await isFavThisRecipe(user.id, id)

    res.send(isFav)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// Favにレシピとお気に入りにユーザーを登録
router.post('/', auth, async (req, res: ExResponse) => {
  const user = res.locals.user
  try {
    const recipeId: string = req.body.recipe

    // レシピがあるかどうか確認
    const recipe = await findRecipe(recipeId)
    // レシピのfavにユーザーが登録されているかどうか確認する
    await isUserInFav(recipe._id, user._id)

    // Favを新規作成する
    await Fav.create({ recipeId: recipe._id, owner: user._id })

    res.send('お気に入りに登録しました')
  } catch (err: any) {
    catchErr(res, err)
  }
})

// レシピのお気に入りを削除
router.delete('/', auth, async (req: ExRequest, res: ExResponse) => {
  const user = res.locals.user
  try {
    const recipeId = req.query.id
    // レシピがあるかどうか確認
    const recipe = await findRecipe(recipeId)
    // レシピのfavにユーザーが登録されているかどうか確認する
    await isUserInFav(recipe._id, user._id, false)
    // favを削除
    await Fav.deleteOne({ recipeId: recipe._id, owner: user._id })

    res.send('お気に入りを取り消しました')
  } catch (err: any) {
    catchErr(res, err)
  }
})

export default router
