import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import cookie from 'cookie'
import { catchErrorAtAPI } from 'functions/error/errorHandle'
import { ERROR_MSG } from 'text/errorText'

const FETCH_URL = `${process.env.SERVER_URL}/login`

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  if (method !== 'POST') return
  try {
    const token = await axios.post(FETCH_URL, req.body).then(res => res.data)
    // cookieのセット
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('gf_jwt', token.token, {
        httpOnly: true,
        maxAge: token.maxAge,
        sameSite: 'strict',
        path: '/',
      })
    )

    return res.status(200).send('OK')
  } catch (e) {
    console.log('Error api/user/login', e)
    if (axios.isAxiosError(e)) {
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
    // const error = catchErrorAtAPI(e, res)
    // console.log(error)
    // return
  }
}

export default handler
