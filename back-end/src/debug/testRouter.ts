import { Router } from 'express'
import User from '../models/User'
import Profile from '../models/Profile'
import { createTestUsers, createRandomRecipe, createRandomUser } from './testFunc'
import { usersName } from './users'
import { deleteAllRecipes } from './deleteFunc'
import { createRandomFav } from './FavFanc'

const router = Router()

// /debug

// create test users
router.post('/', async (req, res) => {
  try {
    const users = createTestUsers(usersName)
    for (let user of users) {
      const createUser = await User.create({ email: user.email, password: user.password })
      await Profile.create({ _id: createUser._id, accountName: user.accountName })
    }

    res.send('OK')
  } catch (err: any) {
    console.log(err)
    res.sendStatus(500).send(err)
  }
})

// create random user
router.post('/randomUser', async (req, res) => {
  try {
    await createRandomUser()
    res.send('OK')
  } catch (err: any) {
    console.log(err)
    res.sendStatus(500).send(err)
  }
})

// create recipe 全員が:numの回数だけレシピを作成する
router.post('/recipe/:num', async (req, res) => {
  try {
    let repeatNum = +req.params.num - 1
    if (repeatNum <= 0) repeatNum = 1
    console.log('num', repeatNum)
    createRandomRecipe(repeatNum)
    res.send()
  } catch (err: any) {
    console.log(err)
    res.sendStatus(500).send(err)
  }
})

// ユーザーがランダムにレシピにお気に入り登録する
router.post('/recipe-fav/', async (req, res) => {
  try {
    await createRandomFav()
    res.send('OK')
  } catch (err: any) {
    console.log(err)
    res.sendStatus(500).send(err)
  }
})

// recipeを削除する
router.delete('/recipe-delete', async (req, res) => {
  try {
    await deleteAllRecipes()

    res.send('Delete All Recipes')
  } catch (err) {
    console.log(err)
    res.sendStatus(500).send(err)
  }
})

// userを全て削除する
// router.delete('/user', async (req, res) => {
//   try {
//   } catch (err: any) {
//     console.log(err)
//     res.status(500).send(err)
//   }
// })

export default router
