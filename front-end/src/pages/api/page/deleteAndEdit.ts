import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getAccessTokenFromAPI } from 'functions/account/auth'
import { catchErrorAtAPI } from 'functions/error/errorHandle'
import { sendReqWithBody } from 'functions/cookie/sendCookie'
import { ERROR_MSG } from 'text/errorText'
import { METHOD_TYPE } from 'interfaces/Connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req
  if (method === 'DELETE') {
    const USER_FETCH_URL = `${process.env.SERVER_URL}/page?id=${query.id}`

    try {
      const accessToken = getAccessTokenFromAPI(req)
      // アクセストークンがない場合401を返す
      if (!accessToken) {
        return res.status(401).json({ error: { status: 401, ...ERROR_MSG.NO_TOKEN } })
      }

      const result = await sendReqWithBody(METHOD_TYPE.DELETE, USER_FETCH_URL, accessToken)

      return res.status(200).json(result)
    } catch (e) {
      console.log('Error api/page/deleteAndEdit', e)
      return catchErrorAtAPI(e, res)
    }
    // PATCH EDIT PAGE
  } else if (method === 'PATCH') {
    const USER_FETCH_URL = `${process.env.SERVER_URL}/page`

    try {
      const accessToken = getAccessTokenFromAPI(req)
      // アクセストークンがない場合401を返す
      if (!accessToken) {
        return res.status(401).json({ error: { status: 401, ...ERROR_MSG.NO_TOKEN } })
      }

      const result = await sendReqWithBody(METHOD_TYPE.PATCH, USER_FETCH_URL, accessToken, req.body)

      return res.status(200).json(result)
    } catch (e) {
      console.log('Error api/page/deleteAndEdit edit', e)
      return catchErrorAtAPI(e, res)
    }
  } else {
    return
  }
}

export default handler
