import sharp from 'sharp'
import path from 'path'
import { Storage } from '@google-cloud/storage'
import { createFileName, handler, upload } from 'functions/utils/upload'
import { catchErrorAtAPI } from 'functions/error/errorHandle'
import { imageFileLimit } from 'text/Specification'

export interface ExtendedRequest {
  file: IFile
}
interface IFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
}

export const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: path.join(process.cwd(), 'key/myKey.json'),
})
export const bucket = storage.bucket('good_food')

export const config = { api: { bodyParser: false } }

const uploadFile = upload(imageFileLimit.avatarImageLimit).single('file')

handler.use(uploadFile)
handler.patch<ExtendedRequest>(async (req, res) => {
  try {
    const resizedImage = await sharp(req.file.buffer).resize({ width: 128, height: 128 }).png().toBuffer()
    const fileName = createFileName('avatar')
    const blob = bucket.file(fileName)
    await blob.save(resizedImage)

    res.status(200).send(fileName)
  } catch (err) {
    console.log('/api/upload/avatar', err)
    return catchErrorAtAPI(err, res)
  }
})

export default handler
