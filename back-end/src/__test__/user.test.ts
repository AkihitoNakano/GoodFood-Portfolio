import mongoose from 'mongoose'
import supertest from 'supertest'
import cookie from 'cookie'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../app'
import User from '../models/User'
import {
  userPayLoad,
  sameAccNameUserPayLoad,
  shortPasswordLengthUserPayLoad,
  longPasswordLengthUserPayLoad,
  userLoginPayLoad,
  invalidPasswordLoginPayload,
} from './setup/users'
import cookieParser from 'cookie-parser'

describe('User registration', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()

    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  // user signup
  describe('user signup', () => {
    describe('given the accountName, email and password are valid', () => {
      it('should return 200 and OK', async () => {
        const result = await supertest(app).post('/signup').send(userPayLoad)
        expect(result.statusCode).toBe(200)
        expect(result.text).toEqual('OK')
      })
    })

    describe('given the accountName, email and password are invalid', () => {
      it('should return 500 because of the same user data', async () => {
        const result = await supertest(app).post('/signup').send(sameAccNameUserPayLoad)
        expect(result.statusCode).toBe(400)
        expect(result.text).toEqual('e-mailアドレスまたはアカウントネームが既に使われています')
      })
      it('should return 400 because of shorthand password', async () => {
        const { statusCode, text } = await supertest(app).post('/signup').send(shortPasswordLengthUserPayLoad)
        expect(statusCode).toBe(400)
        expect(text).toEqual('パスワード 半角英数字6以上、16以内にしてください')
      })
      it('should return 400 because of longer password', async () => {
        const { statusCode, text } = await supertest(app).post('/signup').send(longPasswordLengthUserPayLoad)
        expect(statusCode).toBe(400)
        expect(text).toEqual('パスワード 半角英数字6以上、16以内にしてください')
      })
    })
  })

  // ログインユーザー
  describe('User login', () => {
    describe('given the email and password are valid', () => {
      it('should retrun 200 and token', async () => {
        const result = await supertest(app).post('/login').send(userLoginPayLoad)
        expect(result.statusCode).toBe(200)
        expect(result.header['set-cookie'][0]).toBeTruthy()
      })
    })
    describe('given the email and password are invalid', () => {
      it('should return 404', async () => {
        const { statusCode, text } = await supertest(app).post('/login').send(invalidPasswordLoginPayload)
        expect(statusCode).toBe(404)
        expect(text).toEqual('emailとパスワードの組み合わせが間違っています')
      })
    })
  })

  describe('User logout', () => {
    it('should logout from single device is success', async () => {
      const { header } = await supertest(app).post('/login').send(userLoginPayLoad)
      const usersCookie = cookie.parse(header['set-cookie'][0])
      const token = usersCookie.gf_jwt

      const { statusCode, text } = await supertest(app).delete('/login').set('cookie', `gf_jwt=${token}`)
      expect(statusCode).toBe(200)
      expect(text).toStrictEqual('正常にログアウトしました')
    })
    it('should loggout from single device is not success because of invalid jwt', async () => {
      const invalidToken = 'fjaowejfa;weji2joasdjf92wu3829jofawje233u42'
      const { statusCode, text } = await supertest(app).delete('/login').set('cookie', `gf_jwt=${invalidToken}`)
      expect(statusCode).toBe(401)
      expect(text).toStrictEqual('トークンがない可能性があります。ログインしてください')
    })
  })
})
