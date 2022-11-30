import { FC, memo, useEffect } from 'react'
import axios from 'axios'
import LeftSide from './LeftSide'
import CenterContent from './CenterContent'
import Footer from 'components/footer/Footer'
import { useSetProfileContext, useResetProfileContext, useSetProfLoadingContext } from '../context/ProfileContext'
import { useCenterContent, useSetCenterContent } from 'components/context/SettingCenterContent'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { IUserProfile, UserAccount } from 'interfaces/User'
import API_URL from 'text/API_URL'
import { ContentType } from 'interfaces/Query'

const Setting: FC<{ accData: UserAccount | undefined }> = memo(({ accData }) => {
  const setProfile = useSetProfileContext()
  const setProfLoading = useSetProfLoadingContext()
  const isResetProfile = useResetProfileContext()
  const setErrorMsg = useUpdateError()

  const centerContent = useCenterContent()
  const setCenterContent = useSetCenterContent()
  // ユーザプロフィールをセットする
  useEffect(() => {
    const readProfileData = async () => {
      try {
        const initProfile: IUserProfile = await axios
          .get(`${API_URL.userProfile}/${accData?.accountName}`)
          .then(res => res.data)
        setProfile(initProfile)
        setProfLoading(false)
      } catch (e: any) {
        catchErrorFromAPI(e, setErrorMsg)
      }
    }
    readProfileData()
  }, [isResetProfile])

  // center contentをクエリからinitializeする
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const page = searchParams.get('page') ?? ContentType.myRecipe
    setCenterContent(page)
  }, [])

  return (
    <main>
      <div className='settings'>
        <LeftSide />
        <CenterContent key={centerContent} content={centerContent} />
      </div>
      <Footer />
    </main>
  )
})

export default Setting
