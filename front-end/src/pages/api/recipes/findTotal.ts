import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { catchErrorAtAPI } from '../../../functions/error/errorHandle'
import { ERROR_MSG } from '../../../text/errorText'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const USER_FETCH_URL = encodeURI(`${process.env.SERVER_URL}/recipe/total?input=${query.input}`)
  try {
    const totalNum = await axios.get(USER_FETCH_URL).then(res => res.data)

    return res.status(200).json(totalNum)
  } catch (e) {
    console.log('Error api/recipes/findTotal', e)
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
