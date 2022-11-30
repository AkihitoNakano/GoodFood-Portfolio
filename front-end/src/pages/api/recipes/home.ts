import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { catchErrorAtAPI } from 'functions/error/errorHandle'
import { ERROR_MSG } from 'text/errorText'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req

  const USER_FETCH_URL = `${process.env.SERVER_URL}/recipe/recommend?skip=${query.skip}`
  try {
    const result = await axios.get(USER_FETCH_URL).then(res => res.data)
    return res.status(200).json(result)
  } catch (e) {
    console.log('Error api/recipes/home', e)
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
