import axios from 'axios'
import { ErrorUpdateContext } from 'interfaces/Error'
import { catchErrorFromAPI } from 'functions/error/errorHandle'

// データを取得する
export const getData = async (errorUpdateContext: ErrorUpdateContext, URL: string) => {
  try {
    const result = await axios.get(URL).then(res => res.data)
    return result
  } catch (e: any) {
    catchErrorFromAPI(e, errorUpdateContext)
  }
}

// データをポストする、レシピに限らない
export const postData = async (errorUpdateContext: ErrorUpdateContext, URL: string, body: any) => {
  try {
    const result: any = await axios.post(URL, body).then(res => res.data)
    return result
  } catch (e: any) {
    catchErrorFromAPI(e, errorUpdateContext)
  }
}
