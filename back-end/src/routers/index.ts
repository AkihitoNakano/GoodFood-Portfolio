import { Router, Request, Response, NextFunction } from 'express'
import loginRouter from './login/login'
import signupRouter from './signup/signup'
import recipeRouter from './recipe/recipe'
import rootRouter from './user/root'
import followRouter from './follow/follow'
import userRouter from './user/user'
import pageRouter from './page/page'

const router = Router()

//  /*    Debug Router    */
import debugRouter from '../debug/testRouter'
router.use('/debug', debugRouter)
//  /*    Debug Router    */

// ルーティング
router.use('/signup', signupRouter)
router.use('/login', loginRouter)
router.use('/recipe', recipeRouter)
router.use('/follow', followRouter)
router.use('/user', userRouter)
router.use('/page', pageRouter)
router.use('/', rootRouter)

// ここの意味がいまいちわからない
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message })
})

export default router
