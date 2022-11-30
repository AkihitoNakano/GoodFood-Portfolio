import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { catchErrorAtAPI } from 'functions/error/errorHandle'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  try {
    const USER_FETCH_URL = encodeURI(`${process.env.SERVER_URL}/recipe/details?id=${query.id}`)
    const result = await axios.get(USER_FETCH_URL).then(res => res.data)

    return res.status(200).json(result[0])
  } catch (e) {
    console.log('Error api/recipes/detail', e)
    return catchErrorAtAPI(e, res)
  }
}

export default handler
