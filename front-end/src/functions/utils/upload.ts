import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import multer from 'multer'

export const createFileName = (type: 'avatar' | 'recipe') => {
  return `${type}/${Math.floor(Math.random() * 100)}/${nanoid()}.png`
}

export const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).end('Something broke!')
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found')
  },
})

export const upload = (maxSize: number): multer.Multer => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * maxSize },
    fileFilter(req, file, cb) {
      if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
        return cb(new Error('Please upload an avatar image'))
      }

      cb(null, true)
    },
  })
}
