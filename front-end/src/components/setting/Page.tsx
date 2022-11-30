import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { nanoid } from 'nanoid'
import Moment from 'react-moment'
import LoaderSending from '../utils/LoaderSending '
import { useUpdateError } from '../context/ErrorReportContext'
import { useProfLoadingContext } from 'components/context/ProfileContext'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import useInfiniteScroll from 'hooks/useInfiniteScroll4'
import API_URL from 'text/API_URL'
import { Page } from 'interfaces/Page'
import { ErrorLevel } from 'interfaces/Error'
import { getData } from 'functions/api/general'
import { omitText } from 'functions/utils/docControl'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import tStyles from 'styles/Text.module.css'
import styles from 'styles/Page.module.css'
import lStyles from 'styles/Layout.module.css'

const Page: FC = () => {
  const [myPages, setMyPages] = useState<Page[] | undefined>([])
  const [page, setPage] = useState<number>(0)
  const [isMaxLimit, setIsMaxLimit] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const isProfLoading = useProfLoadingContext()
  const setErrorMsg = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()

  const getPages = async () => {
    const URL = `${API_URL.getPages}?skip=${page}`
    return await getData(setErrorMsg, URL)
  }

  // 印刷ページを表示する
  const showPrintPage = (pageId: string) => {
    window.open(`/print/${pageId}`)
    console.log(pageId)
  }

  // page編集画面へ飛ぶ
  const editPage = (pageId: string) => {
    location.href = `/settings?page=editPage&id=${pageId}`
  }

  // ページを削除する
  const deletePage = async (pageId: string) => {
    setIsDataSending(true)
    try {
      const isDelete = await axios.delete(`${API_URL.deleteAndEditPage}?id=${pageId}`)
      setMyPages(prev => prev?.filter(page => page._id !== pageId))
      setIsDataSending(false)
      setErrorMsg([{ id: nanoid(), message: 'ページが削除されました', level: ErrorLevel.INFO }])
    } catch (err: any) {
      setIsDataSending(false)
      catchErrorFromAPI(err, setErrorMsg)
    }
  }

  useInfiniteScroll({
    readDataFn: getPages,
    isPreLoading: isProfLoading,
    page,
    setPage,
    setListData: setMyPages,
    isMaxLimit,
    setIsMaxLimit,
    setLoading,
  })

  return (
    <>
      {isDataSending && <LoaderSending />}
      <div className={`${styles.container} settingCenterWrap`}>
        <h1>ページ</h1>
        <div className={`${lStyles.contentBox} ${styles.pageList}`}>
          <table>
            <thead className={`${styles.tableHead}`}>
              <tr>
                <th>No.</th>
                <th>ページ名</th>
                <th>分割数</th>
                <th>作成日</th>
              </tr>
            </thead>
            <tbody>
              {myPages?.map((data, idx) => (
                <tr key={data._id} className={`${styles.pageRow}`}>
                  <td className={`${tStyles.sub50} ${styles.number}`}>00{idx}</td>
                  <td onClick={() => showPrintPage(data._id)} className={`${tStyles.title50g} ${styles.pageName}`}>
                    {omitText(data.pageName, 16)}
                  </td>
                  <td className={`${tStyles.text40} ${styles.number}`}>{data.divisionNum}</td>
                  <td>
                    <Moment className={`${tStyles.sub40} ${styles.userName} ${styles.number}`} format='YYYY/MM/DD'>
                      {data.createdAt}
                    </Moment>
                  </td>
                  <td onClick={() => ''} className={`${styles.cancelList}`}>
                    <div className={`${styles.editAndDelete}`}>
                      <p onClick={() => editPage(data._id)} className={`${styles.editPage}`}>
                        編集
                      </p>
                      <p onClick={() => deletePage(data._id)} className={`${styles.deletePage}`}>
                        削除
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Page
