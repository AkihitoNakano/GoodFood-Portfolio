import { useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useUpdateError } from '../components/context/ErrorReportContext'
import { catchErrorFromAPI } from '../functions/error/errorHandle'
import { IUserIcon } from 'interfaces/User'

type IInfiniteScroll = {
  readDataFn: () => Promise<IUserIcon[] | undefined>
  isPreLoading: boolean
  page: number
  setPage: Dispatch<SetStateAction<number>>
  setListData: Dispatch<SetStateAction<IUserIcon[] | undefined>>
  isMaxLimit: boolean
  setIsMaxLimit: Dispatch<SetStateAction<boolean>>
  setLoading: Dispatch<SetStateAction<boolean>>
  searchTotalNum?: () => Promise<void>
  updateElem: any
}

const useInfiniteScroll = ({
  readDataFn,
  isPreLoading,
  page,
  setPage,
  setListData,
  isMaxLimit,
  setIsMaxLimit,
  setLoading,
  searchTotalNum,
  updateElem,
}: IInfiniteScroll) => {
  const setErrorMsg = useUpdateError()
  // Infinite scrollの処理
  useEffect(() => {
    if (isPreLoading) return
    const readNextPage = async () => {
      try {
        const array = await readDataFn()
        // page !==0の意味は最初は必ず[]を返すから、ただし初めから配列がない場合はどうするか（例：レシピ0) 今は0でも問題ない
        if (array && array.length === 0 && page !== 0) setIsMaxLimit(true)
        if (array && !isMaxLimit) {
          setListData(prev => [...prev!, ...array])
          searchTotalNum && (await searchTotalNum())
        }
        setLoading(false)
      } catch (e) {
        catchErrorFromAPI(e, setErrorMsg)
      }
    }
    readNextPage()
  }, [page, isPreLoading, updateElem])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page])

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight &&
      !isMaxLimit
    ) {
      setLoading(true)
      setPage(prev => prev + 1)
    }
  }
}

export default useInfiniteScroll
