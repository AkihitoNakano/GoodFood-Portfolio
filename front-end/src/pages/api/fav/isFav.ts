import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getAccessTokenFromAPI } from 'functions/account/auth'
import { sendReqWithBody } from 'functions/cookie/sendCookie'
import { catchErrorAtAPI } from 'functions/error/errorHandle'
import { ERROR_MSG } from 'text/errorText'
import { METHOD_TYPE } from 'interfaces/Connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  try {
    const USER_FETCH_URL = encodeURI(`${process.env.SERVER_URL}/recipe/fav/isFav?id=${query.id}`)
    const accessToken = getAccessTokenFromAPI(req)
    if (!accessToken) {
      return res.status(401).json({ error: { status: 401, ...ERROR_MSG.NO_TOKEN } })
    }

    const result = await sendReqWithBody(METHOD_TYPE.GET, USER_FETCH_URL, accessToken)

    return res.status(200).json(result)
  } catch (e) {
    console.log('Error api/fav/isFav', e)

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
