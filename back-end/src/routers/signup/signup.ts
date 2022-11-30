import { Router } from 'express'
import User from '../../models/User'
import Profile from '../../models/Profile'
import State from '../../models/State'
import { sendValidationEmail } from '../utils/sendGrid'
import { handleError } from '../utils/errorHandle'
import { catchErr } from '../utils/errorHandle'
import { checkSingUpForm } from '../utils/routerFunc/signupFunc'

const router = Router()

// /signup

//　新規登録
router.post('/', async (req, res) => {
  let errorCode: number = 500
  try {
    const { accountName, email, password } = req.body.data

    checkSingUpForm(accountName, password, email)

    /* transaction */
    // 入力された値をUser, Profileに保存する
    const user = await User.create({ email, password })
    const profile = await Profile.create({ _id: user._id, accountName })
    /* transaction */
    // Stateにアカウントの状態を一時登録する
    const status = await State.findOne({ email: user.email })
    if (!status) {
      await State.create({ email: user.email, accountName: profile.accountName, state: 'new' })
    } else {
      status.state = 'new'
      status.save()
    }

    // TODO: sendGridの上限数を超えたため一時オフ
    // メールアドレスが有効かどうかのメールを送る
    // await sendValidationEmail(user.email, profile.accountName)

    res.send('OK')
  } catch (err: any) {
    // console.log(err)
    if (err.code === 11000) {
      let result = handleError(err)
      res.status(result.errCode).send(result.errMessage)
    } else {
      catchErr(res, err)
    }
  }
})

export default router
