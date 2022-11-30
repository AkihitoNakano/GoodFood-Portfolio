import { Router } from 'express'
import auth from '../../middleware/auth'
import cookieConfig from '../../config/cookie.config'
import { findByCredentials } from '../utils/routerFunc/loginFunc'
import { catchErr } from '../utils/errorHandle'
import { ExResponse } from '../utils/customInterface'
const router = Router()

// /login

router.get('/', (req, res) => {
  res.send('This is Login page')
})

// Login user
router.post('/', async (req, res) => {
  try {
    // emailとpasswordの組み合わせてユーザー確認
    const user = await findByCredentials(req.body.data.email, req.body.data.password)

    const token = await user.generateAuthToken()

    // ブラウザ側ではnext.jsでcookieを付与しているためこれは最終的には必要ない
    // postmanで確認する用
    res.cookie('gf_jwt', token, {
      httpOnly: true,
      maxAge: cookieConfig.maxAge,
    })

    res.send({ token, maxAge: cookieConfig.maxAge })
  } catch (err: any) {
    console.log('login error')
    catchErr(res, err)
  }
})

// logout
// 現在のトークンを破棄してログアウト
router.delete('/', auth, async (req, res: ExResponse) => {
  const user = res.locals.user
  try {
    await user.logout(req.cookies.gf_jwt)

    res.send('正常にログアウトしました')
  } catch (err: any) {
    console.log('Logout error')
    catchErr(res, err)
  }
})

// logout All
// 使われていない
router.delete('/all', auth, async (req, res: ExResponse) => {
  const user = res.locals.user
  try {
    await user.logoutAll()

    res.redirect('/index')
  } catch (err: any) {
    catchErr(res, err)
  }
})

export default router
