import { Router } from 'express'
import docConfig from '../../config/document.config'
import { UserSchemaFields } from '../../models/User'
import Fav from '../../models/Fav'
import Tag from '../../models/Tag'
import favRouter from './fav'
import commentRouter from './comment'
import { CreateRecipe, RecipeContents, FindRecipe, UpdateAndDelRecipe } from '../utils/recipeClass'
import { ErrorOutput, errRes } from '../utils/errInterface'
import { createTag, updateTag } from '../utils/routerFunc/tagFunc'

import auth from '../../middleware/auth'
import { catchErr, checkLimitAndSkip } from '../utils/errorHandle'
import { ExResponse, ExRequest, RecipeContent, RecipeCard } from '../utils/customInterface'
import {
  readRecipe,
  getFollowUsersLatestRecipes,
  getEvaluatedRecipe,
  searchRecipes,
  countSearchRecipes,
  getUserRecipe,
  getMyFavoriteRecipes,
  getRelatedRecipe,
  searchRecipesWithTag,
  isMyRecipe,
  searchRecipesInFav,
  readRecipesFromMultiIds,
  readMultiDetailedRecipes,
  searchRecipesFromAtlas,
} from '../utils/routerFunc/recipeFunc'

const router = Router()

// /recipe

router.use('/fav', favRouter)
router.use('/comment', commentRouter)

// ユーザーのレシピを取得
router.get('/', auth, async (req: ExRequest, res: ExResponse) => {
  try {
    const { id } = req.query
    const { skip, limit } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readRecipeLimit)
    console.log('id', id, 'skip', skip, 'limit', limit)
    const userRecipes = await getUserRecipe(id, skip, limit)

    res.send(userRecipes)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// 指定したレシピIDで単体のレシピを取得
router.get('/details', async (req: ExRequest, res) => {
  try {
    const { id } = req.query
    const recipe: RecipeContent[] = await readRecipe(id)

    res.send(recipe)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// 指定したレシピIDで複数のレシピを取得
router.get('/detailsMulti', async (req: ExRequest, res) => {
  try {
    let arrRecipeId = req.query.id
    if (arrRecipeId === undefined) arrRecipeId = ''
    const recipes = await readMultiDetailedRecipes(arrRecipeId)
    res.send(recipes)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// レシピを新規作成
router.post('/', auth, async (req, res) => {
  try {
    const user: UserSchemaFields = res.locals.user
    // console.log(req.body)
    //--- transaction ---
    // レシピを作成
    const body: RecipeContents = { ...req.body }
    const recipe = new CreateRecipe(user._id, body)
    const createdRecipe = await recipe.create()

    // タグが記入されていればトリムして登録する
    await createTag(createdRecipe._id, req.body.tag)

    //--- transaction ---

    res.send('OK')
  } catch (err: any) {
    console.log(err)
    const { code, message } = ErrorOutput.splitErrorContent(err.message)
    if (code && message) {
      res.status(code).send(message)
    } else {
      res.status(500).send(err)
    }
  }
})

// レシピを更新
router.patch('/:id', auth, async (req, res) => {
  const user: UserSchemaFields = res.locals.user
  try {
    // レシピを検索
    const myRecipe = await new UpdateAndDelRecipe(user._id, req.params.id).build()
    await myRecipe.checkRecipe()
    // ---- transaction ------
    // レシピを更新する
    await myRecipe.updateRecipe({ ...req.body })
    // タグを更新する
    await updateTag(req.params.id, req.body.tag)

    // ---- transaction ------

    res.send()
  } catch (err: any) {
    console.log(err)
    const { code, message } = ErrorOutput.splitErrorContent(err.message)
    if (code && message) {
      res.status(code).send(message)
    } else {
      res.status(500).send(err)
    }
  }
})

// レシピを削除 - 単体
router.delete('/:id', auth, async (req, res) => {
  const user: UserSchemaFields = res.locals.user
  try {
    // レシピを検索
    const myRecipe = await new UpdateAndDelRecipe(user._id, req.params.id).build()
    await myRecipe.checkRecipe()

    // --- transaction ----
    // レシピを削除する
    await myRecipe.delete()
    // タグを削除する
    await Tag.findByIdAndDelete(myRecipe.myRecipe!._id)

    // レシピのFavユーザーを削除する
    await Fav.deleteOne({ _id: myRecipe.myRecipe!._id, owner: user._id })

    // --- transaction ----
    res.send()
  } catch (err: any) {
    console.log(err)
    const { code, message } = ErrorOutput.splitErrorContent(err.message)
    if (code && message) {
      res.status(code).send(message)
    } else {
      res.status(500).send(err)
    }
  }
})

// followユーザーのレシピを取得
router.get('/followers', auth, async (req, res: ExResponse) => {
  const user = res.locals.user
  try {
    const recipes = await getFollowUsersLatestRecipes(user._id)

    res.send(recipes)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// Recommendされたレシピを取得する
router.get('/recommend', async (req: ExRequest, res) => {
  try {
    const { skip, limit } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readRecipeLimit)
    const recipes = await getEvaluatedRecipe(limit, skip)

    res.send(recipes)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// 検索からレシピを探す
// TODO: 複数の検索単語に対してOR条件で検索できるようにする
router.get('/search', async (req: ExRequest, res) => {
  try {
    let { input } = req.query
    // const inputArr = input?.split(/[,|、|\s]+/)
    // console.log(inputArr)

    if (input == 'undefined') {
      input = ''
    }
    console.log('input', input)
    const { skip, limit } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readRecipeLimit)

    // mongodbのserverless functionを使用したtext search. full text, partial text にも対応しているが遅い
    // const recipes = await searchRecipesFromAtlas(input as string)

    // mongooseのaggregateを使った検索
    let recipes: RecipeCard[]
    if (input?.charAt(0) === '@') {
      // タグ検索
      input = input.slice(1)

      recipes = await searchRecipesWithTag(input!, skip, limit)
    } else {
      recipes = await searchRecipes(input!, skip, limit)
    }
    res.send(recipes)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// 検索結果のトータル数を取得
router.get('/total', async (req: ExRequest, res) => {
  try {
    let { input } = req.query
    input ?? ''
    const count: number = await countSearchRecipes(input)

    res.send(count.toString())
  } catch (err: any) {
    catchErr(res, err)
  }
})

// お気に入りに登録しているレシピを取得する
router.get('/myFav', auth, async (req: ExRequest, res: ExResponse) => {
  const user = res.locals.user
  try {
    let { skip, limit } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readRecipeLimit)
    const recipes = await getMyFavoriteRecipes(user._id, skip, limit)

    res.send(recipes)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// 関連しているレシピを取得する
router.get('/related', async (req: ExRequest, res: ExResponse) => {
  try {
    let { input } = req.query
    if (input == 'undefined') {
      input = ''
    }
    const { skip, limit } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readRecipeLimit)
    const recipes = await getRelatedRecipe(input!, skip, limit)

    console.log('recipes', recipes)
    res.send(recipes)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// 自分が作成したレシピであるかどうか
router.get('/isMyRecipe', auth, async (req: ExRequest, res: ExResponse) => {
  const user = res.locals.user
  try {
    const { id } = req.query
    const isMine = await isMyRecipe(user._id, id)

    res.send(isMine)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// TODO: 複数の検索単語に対してOR条件で検索できるようにする
router.get('/fav/search', auth, async (req: ExRequest, res: ExResponse) => {
  const user = res.locals.user
  try {
    let { input } = req.query
    if (input == undefined) input = ''
    const { skip, limit } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readRecipeLimit)

    const recipe = await searchRecipesInFav(user._id, input, skip, limit)

    res.send(recipe)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// 配列型の複数のrecipeIdからRecipeCardデータを取得
router.get('/multi', auth, async (req: ExRequest, res) => {
  try {
    let arrRecipeId = req.query.id
    if (arrRecipeId === undefined) arrRecipeId = ''
    const recipes = await readRecipesFromMultiIds(arrRecipeId)
    res.send(recipes)
  } catch (err: any) {
    catchErr(res, err)
  }
})

export default router
