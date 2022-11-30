import express from 'express'
// import './db/mongoose'
import cookieParser from 'cookie-parser'

import indexRouter from './routers/index'

export const app = express()

// middleware
app.use(express.static('/public'))
app.use(express.json())
app.use(cookieParser())

app.disable('x-powered-by')

app.use('/', indexRouter)

export default app
