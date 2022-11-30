import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { catchErrorAtAPI } from 'functions/error/errorHandle'
import { ERROR_MSG } from 'text/errorText'

const FETCH_URL = `${process.env.SERVER_URL}/signup`

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  if (method !== 'POST') return

  try {
    await axios.post(FETCH_URL, req.body).then(res => res.data)

    return res.status(200).send('OK')
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log('Error api/user/signup', e)
      return res.status(400).json({
        error: {
          status: e.response?.status,
          message: e.response?.data,
        },
      })
    }
    return res.status(500).json({
      error: {
        status: 500,
        message: ERROR_MSG.SERVER_ERR,
      },
    })
    // return catchErrorAtAPI(e, res)
  }
}

export default handler
