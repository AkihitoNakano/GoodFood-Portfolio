import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUpdateError } from '../components/context/ErrorReportContext'
import { useAccount, useUpdateAccount } from '../components/context/AccountContext'
import { AccountOrError } from '../interfaces/Error'
import { UserAccount } from 'interfaces/User'

// アカウントデータが必ず必要な場合はこちらを使用
export const UseUserAuth = ({ data, error }: AccountOrError) => {
  const router = useRouter()
  const setErrorMsg = useUpdateError()
  const setAccount = useUpdateAccount()
  const [isAccountLoading, setAccountLoading] = useState(true)

  useEffect(() => {
    // アカウント情報をNavにセットする
    if (!error) {
      setAccount(data)
      setAccountLoading(false)
      // チラつきが気になる場合時間を延ばす
      // setTimeout(() => {}, 500)
    } else {
      // エラーを表示する
      setErrorMsg(error)
      router.push('/index')
    }
  }, [])

  return { isLoading: isAccountLoading }
}

// アカウントデータがもしあればセットする
export const UseUserDataIfAny = (userAccount: UserAccount) => {
  const [isAccountLoading, setAccountLoading] = useState(true)
  const setAccount = useUpdateAccount()
  const userData = useAccount()

  useEffect(() => {
    if (userData) return setAccountLoading(false)
    if (!userAccount) return setAccountLoading(false)
    setAccount(userAccount)
    setAccountLoading(false)
    // setTimeout(() => {}, 500)
  }, [])

  return isAccountLoading
}
