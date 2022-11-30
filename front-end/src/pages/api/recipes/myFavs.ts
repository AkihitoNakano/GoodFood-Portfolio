import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getAccessTokenFromAPI } from 'functions/account/auth'
import { catchErrorAtAPI } from 'functions/error/errorHandle'
import { sendReqWithBody } from 'functions/cookie/sendCookie'
import { ERROR_MSG } from 'text/errorText'
import { METHOD_TYPE } from 'interfaces/Connection'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req

  const USER_FETCH_URL = `${process.env.SERVER_URL}/recipe/myFav?skip=${query.skip}`

  try {
    const accessToken = getAccessTokenFromAPI(req)
    if (!accessToken) {
      return res.status(401).json({ error: { status: 401, ...ERROR_MSG.NO_TOKEN } })
    }

    const result = await sendReqWithBody(METHOD_TYPE.GET, USER_FETCH_URL, accessToken)

    return res.status(200).json(result)
  } catch (e) {
    console.log('Error api/recipes/myFavs', e)
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
