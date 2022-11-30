import axios from 'axios'
import { ErrorUpdateContext } from 'interfaces/Error'
import { catchErrorFromAPI } from 'functions/error/errorHandle'

export const logout = async (errorUpdateContext: ErrorUpdateContext, URL: string) => {
  try {
    const res = await axios.delete(URL)
    return res
  } catch (e: any) {
    catchErrorFromAPI(e, errorUpdateContext)
  }
}
