import type { Dispatch, SetStateAction } from 'react'
import type { NextApiResponse } from 'next'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { ErrorReport, ApiServerErrorRes, ErrorLevel } from 'interfaces/Error'
import { ERROR_MSG } from 'text/errorText'

// APIサーバーから受け取るエラー
export const catchErrorFromAPI = (e: any, errorUpdateContext: Dispatch<SetStateAction<ErrorReport[] | undefined>>) => {
  const errData: ApiServerErrorRes = e.response.data
  if (errData.error.message) {
    errorUpdateContext([{ id: nanoid(), message: errData.error.message, level: ErrorLevel.ALERT }])
  } else {
    errorUpdateContext([{ id: nanoid(), ...ERROR_MSG.SERVER_ERR }])
  }
}

// APIサーバーのエラーcatchをまとめた関数
export const catchErrorAtAPI = (e: any, res: NextApiResponse) => {
  if (axios.isAxiosError(e)) {
    const errorCode = e.response?.status ?? 400
    return res.status(errorCode).json({
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
}
