import { useRouter } from 'next/router'
import { useState, useEffect, FC } from 'react'
import axios from 'axios'
import ProfileCard from 'components/profile/ProfileCard'
import RecipeGridHome from 'components/recipeCard/RecipeGridHome'
import Loader from 'components/utils/Loader'
import Footer from 'components/footer/Footer'
import useInfiniteScroll from 'hooks/useInfiniteScroll4'
import {
  useProfileContext,
  useSetProfileContext,
  useSetProfLoadingContext,
  useProfLoadingContext,
} from 'components/context/ProfileContext'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { IUserProfile } from 'interfaces/User'
import { RecipeCard } from 'interfaces/Recipe'
import { getRecipes } from 'functions/api/recipe'
import API_URL from 'text/API_URL'

const UserProfile: FC = () => {
  const [recipes, setRecipes] = useState<RecipeCard[] | undefined>([])

  const [page, setPage] = useState<number>(0)
  const [isMaxLimit, setIsMaxLimit] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const setErrorMsg = useUpdateError()
  const profile = useProfileContext()
  const setProfile = useSetProfileContext()
  const isProfLoading = useProfLoadingContext()
  const setProfLoading = useSetProfLoadingContext()

  // recipeを読み込む前にprofデータを先に読み込む必要がある場合はuseEffectでprofを読み込む際読み込みと同時にレシピデータも同時にfetchすること

  // ユーザプロフィールをセットする
  useEffect(() => {
    const readProfileData = async () => {
      try {
        const initProfile: IUserProfile = await axios
          .get(`${API_URL.userProfile}${router.asPath}`)
          .then(res => res.data)
        setProfile(initProfile)
        setProfLoading(false)
      } catch (e: any) {
        // userがいなかった場合
        catchErrorFromAPI(e, setErrorMsg)
      }
    }
    readProfileData()
  }, [])

  // recipeを取得する
  const readUserRecipes = async () => {
    const URL = `${API_URL.recipeProfile}?id=${profile?._id}&skip=${page}`
    return await getRecipes(setErrorMsg, URL)
  }

  useInfiniteScroll<RecipeCard>({
    readDataFn: readUserRecipes,
    isPreLoading: isProfLoading,
    setListData: setRecipes,
    page,
    setPage,
    isMaxLimit,
    setIsMaxLimit,
    setLoading,
  })

  return (
    <main>
      {profile && (
        <>
          <ProfileCard />
          <RecipeGridHome recipes={recipes} title={'作成したレシピ'} />
          {loading && <Loader />}
        </>
      )}
      <Footer />
    </main>
  )
}

export default UserProfile
