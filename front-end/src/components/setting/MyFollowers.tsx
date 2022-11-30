import { FC, useEffect, useState } from 'react'
import UserList from 'components/profile/UserList'
import useInfiniteScroll from 'hooks/useInfiniteScroll5'
import Loader from 'components/utils/Loader'
import { useProfLoadingContext } from '../context/ProfileContext'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { IUserIcon } from 'interfaces/User'
import { getData } from 'functions/api/profile'
import API_URL from 'text/API_URL'
import { useRouter } from 'next/router'

type FollowType = 'er' | 'ed'

const MyFollowers: FC = () => {
  const [users, setUsers] = useState<IUserIcon[] | undefined>([])
  const [page, setPage] = useState<number>(0)
  const [isMaxLimit, setIsMaxLimit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectKey, setSelectKey] = useState<FollowType>('er')

  const isProfLoading = useProfLoadingContext()
  const setErrorMsg = useUpdateError()
  const router = useRouter()
  // followerを取得する
  const readFollowUsers = async () => {
    const URL = `${API_URL.getFollowers}?key=${selectKey}&skip=${page}`
    return await getData(setErrorMsg, URL)
  }

  // フォロー中とフォロワーを切り替えるボタンを押した場合userを入れ替える
  useEffect(() => {
    if (selectKey === router.query.key) return
    const baseUrl = '/settings?page=follow&key='
    router.push(`${baseUrl}${selectKey}`)
    setUsers(() => [])
    setPage(() => 0)
    setIsMaxLimit(() => false)
  }, [selectKey])

  console.log(page)

  useInfiniteScroll({
    readDataFn: readFollowUsers,
    isPreLoading: isProfLoading,
    page,
    setPage,
    setListData: setUsers,
    isMaxLimit,
    setIsMaxLimit,
    setLoading,
    updateElem: selectKey,
  })

  return (
    <>
      <UserList users={users} setSelectKey={setSelectKey} />
      {loading && <Loader />}
    </>
  )
}

export default MyFollowers
