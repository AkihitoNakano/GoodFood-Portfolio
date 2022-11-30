import type { Dispatch, SetStateAction } from 'react'
import { UserAccount } from '../interfaces/User'

export const ErrorLevel = {
  INFO: 'info',
  ALERT: 'alert',
  NONE: 'none',
}

export interface ErrorReport {
  id: string
  message: string
  level: string
}

export interface ApiServerErrorRes {
  error: { status: number; message: string }
}

// Errorコンテキスト分をアップデートするcontextのtype
export type ErrorUpdateContext = Dispatch<SetStateAction<ErrorReport[] | undefined>>

export type AccountOrError = {
  data?: UserAccount
  error?: ErrorReport[]
}
