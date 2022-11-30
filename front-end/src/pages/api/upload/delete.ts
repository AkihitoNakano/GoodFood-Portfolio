import type { NextApiRequest, NextApiResponse } from 'next'
import { bucket } from './avatar'

import { ERROR_MSG } from 'text/errorText'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req

  if (method !== 'DELETE') return

  try {
    const result: any = await bucket.file(query.file as string).delete()
    if (result[0].statusCode !== 204) {
      console.log('古いアバター画像を削除できませんでした', result)
      return res.status(500).json({ error: { status: 500, message: ERROR_MSG.SERVER_ERR } })
    }
    return res.status(200).send('OK')
  } catch (err: any) {
    return res.status(500).json({ error: { status: 500, message: ERROR_MSG.NETWORK_ERROR } })
  }
}

export default handler
