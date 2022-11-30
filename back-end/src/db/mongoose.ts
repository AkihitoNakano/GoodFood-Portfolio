import mongoose from 'mongoose'
import 'dotenv/config'

// 開発環境用のオンプレミスDB
const onPremiseMongo = 'mongodb://localhost:27017/cooking-recipe-card-local'

// Local mongodb
// const url: string = 'mongodb://localhost:27017/cooking-recipe-card-local'
// ATLAS
const url: string = process.env.MONGODB_URL as string

let database: string
if (url === onPremiseMongo) {
  database = 'Localデータベース'
} else {
  database = 'ATLAS'
}

// データベース接続
mongoose
  .connect(url)
  .then(() => console.log(`${database}に接続しました`))
  .catch(e => console.log(e))
