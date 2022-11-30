import axios from 'axios'
import { ErrorUpdateContext } from 'interfaces/Error'
import { IUserIcon } from 'interfaces/User'
import { catchErrorFromAPI } from 'functions/error/errorHandle'

// レシピを取得する bodyにデータは含めない
export const getData = async (errorUpdateContext: ErrorUpdateContext, URL: string) => {
  try {
    const data: IUserIcon[] = await axios.get(URL).then(res => res.data)
    return data
  } catch (e: any) {
    catchErrorFromAPI(e, errorUpdateContext)
  }
}
