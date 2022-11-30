import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { serialize } from 'cookie'
import { getAccessTokenFromAPI } from 'functions/account/auth'
import { catchErrorAtAPI } from 'functions/error/errorHandle'
import { SelectMethodWithCookies } from 'functions/cookie/sendCookie'
import { ERROR_MSG } from 'text/errorText'
import { METHOD_TYPE } from 'interfaces/Connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  if (method !== 'DELETE') return

  try {
    const USER_FETCH_URL = `${process.env.SERVER_URL}/login`
    const accessToken = getAccessTokenFromAPI(req)
    if (!accessToken) {
      return res.status(401).json({ error: { status: 401, ...ERROR_MSG.NO_TOKEN } })
    }

    await SelectMethodWithCookies(METHOD_TYPE.DELETE, USER_FETCH_URL, accessToken)

    res.setHeader('Set-Cookie', [
      serialize('gf_jwt', '', {
        maxAge: -1,
        path: '/',
      }),
    ])

    return res.status(200).json('正常にログアウトしました')
  } catch (e: any) {
    console.log('Error api/user/logout', e)
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
    // return catchErrorAtAPI(e, res)
  }
}

export default handler
