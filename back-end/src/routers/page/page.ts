import { Router } from 'express'
import { ExRequest, ExResponse, PostPageData } from '../utils/customInterface'
import auth from '../../middleware/auth'
import { catchErr } from '../utils/errorHandle'
import { createPage, updatePage, deletePage, getPage, getUsersPages } from '../utils/routerFunc/pageFunc'
import docConfig from '../../config/document.config'
import { checkLimitAndSkip } from '../utils/errorHandle'

const router = Router()

// /page

// (単体)pageを読み込む
router.get('/id/:id', auth, async (req, res) => {
  try {
    const page = await getPage(req.params.id)

    res.send(page)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// ユーザーpageを読み込む
router.get('/user', auth, async (req: ExRequest, res: ExResponse) => {
  const user = res.locals.user
  try {
    const { limit, skip } = checkLimitAndSkip(undefined, req.query.skip, docConfig.readPageLimit)

    const pages = await getUsersPages(user._id, limit, skip)

    res.send(pages)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// pageを作成する
router.post('/', auth, async (req, res) => {
  const user = res.locals.user
  const body: PostPageData = req.body

  try {
    const newPage = await createPage(user._id, { ...body })
    res.send(newPage)
  } catch (err: any) {
    catchErr(res, err)
  }
})
// pageを編集する
router.patch('/', auth, async (req, res) => {
  const user = res.locals.user
  const body: PostPageData = req.body
  try {
    const pageId = await updatePage(user._id, req.body.pageId, { ...body })
    res.send(pageId)
  } catch (err: any) {
    catchErr(res, err)
  }
})

// pageを削除する
router.delete('/', auth, async (req: ExRequest, res) => {
  const user = res.locals.user
  try {
    let pageId = req.query.id
    if (pageId == undefined) pageId = ''
    await deletePage(user._id, pageId)

    res.send('ページを削除しました')
  } catch (err: any) {
    catchErr(res, err)
  }
})

export default router
