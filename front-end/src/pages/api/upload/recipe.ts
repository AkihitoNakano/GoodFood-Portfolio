import path from 'path'
import { ExtendedRequest } from './avatar'
import { Storage } from '@google-cloud/storage'
import { createFileName, handler, upload } from 'functions/utils/upload'
import { catchErrorAtAPI } from 'functions/error/errorHandle'

export const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: path.join(process.cwd(), 'key/myKey.json'),
})
export const bucket = storage.bucket('good_food')
const uploadFile = upload(5).single('file')

export const config = { api: { bodyParser: false } }

handler.use(uploadFile)
handler.post<ExtendedRequest>(async (req, res) => {
  try {
    const fileName = createFileName('recipe')

    const blob = bucket.file(fileName)
    await blob.save(req.file.buffer)

    res.status(200).send(fileName)
  } catch (err) {
    console.log('/api/upload/recipeImg', err)
    catchErrorAtAPI(err, res)
  }
})

export default handler
