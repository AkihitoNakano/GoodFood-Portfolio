import { Router } from 'express'
import auth from '../../middleware/auth'
import { catchErr } from '../utils/errorHandle'
import { ExResponse, ExRequest, PostComment } from '../utils/customInterface'
import { checkLimitAndSkip } from '../utils/errorHandle'
import docConfig from '../../config/document.config'
import { getCommentsFromRecipe, createComment, deleteComment } from '../utils/routerFunc/commentFunc'

const router = Router()

// recipe/comment

// recipeに対するコメントを取得する
router.get('/', auth, async (req: ExRequest, res: ExResponse) => {
  try {
    const recipeId = req.query.id
    const { limit, skip } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readCommentLimit)
    const comments = await getCommentsFromRecipe(recipeId, skip, limit)

    res.send(comments)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// recipeに対するコメントの作成
router.post('/', auth, async (req: ExRequest, res: ExResponse) => {
  const user = res.locals.user
  try {
    const commentBody: PostComment = req.body
    const comment = await createComment(user._id, commentBody)

    res.send(comment)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// コメントの削除
router.delete('/', auth, async (req, res: ExResponse) => {
  const user = res.locals.user
  try {
    await deleteComment(user._id, req.body.recipeId, req.body.commentId)

    res.send('OK')
  } catch (err: any) {
    catchErr(res, err)
  }
})

export default router
