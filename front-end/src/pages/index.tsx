import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import HeadComp from '../components/head/Head'
import Footer from 'components/footer/Footer'
import FakeSearchBox from '../components/search/FakeSearchBox'
import RecipeGridHome from '../components/recipeCard/RecipeGridHome'
import Loader from '../components/utils/Loader'
import AccountLoader from '../components/utils/AccountLoader'
import useInfiniteScroll from '../hooks/useInfiniteScroll4'
import { RecipeCard } from '../interfaces/Recipe'
import { AccountOrError } from '../interfaces/Error'
import { UseUserAuth } from '../hooks/userAuth'
import { useUpdateError } from '../components/context/ErrorReportContext'
import getUserAuth from '../functions/account/auth'
import { getRecipes } from '../functions/api/recipe'
import API_URL from '../text/API_URL'

// /
const Home: NextPage<AccountOrError> = ({ data, error }) => {
  // 検索ボックスinputの管理
  const [inputText, setInputText] = useState<string>('')
  // レシピカードのskip数の管理
  const [page, setPage] = useState(0)
  // おすすめレシピカードの管理
  const [recommendRecipes, setRecommendRecipe] = useState<RecipeCard[] | undefined>([])
  // フォローユーザーのレシピカード
  const [followUsersRecipes, setFollowUsersRecipes] = useState<RecipeCard[] | undefined>([])
  const [loading, setLoading] = useState(false)
  const [isMaxLimit, setIsMaxLimit] = useState(false)

  const setErrorMsg = useUpdateError()
  const router = useRouter()

  // アカウント情報をNavにセットする
  const accLoading = UseUserAuth({ data, error })

  // フォローユーザーのレシピを取得する
  useEffect(() => {
    const getFollowersRecipe = async () => {
      const followersRecipes = await getRecipes(setErrorMsg, API_URL.followersLatest)
      setFollowUsersRecipes(followersRecipes)
    }
    getFollowersRecipe()
  }, [])

  // 検索内容を送信する
  const submitInputHandler = (): void => {
    router.push(`/recipe/search?input=${inputText}`)
  }

  const readRecipes = async () => {
    return await getRecipes(setErrorMsg, `${API_URL.recommend}/?skip=${page}`)
  }

  // Infinite Scroll
  useInfiniteScroll<RecipeCard>({
    readDataFn: readRecipes,
    setListData: setRecommendRecipe,
    page,
    setPage,
    isMaxLimit,
    setIsMaxLimit,
    setLoading,
  })

  return (
    <main>
      {accLoading.isLoading && <AccountLoader />}
      <HeadComp title='Good Food Home' />
      <FakeSearchBox setInputText={setInputText} inputText={inputText} submitHandler={submitInputHandler} />
      <RecipeGridHome recipes={followUsersRecipes} title={'フォローユーザーの最新レシピ'} />
      <RecipeGridHome recipes={recommendRecipes} title={'おすすめレシピ'} />
      {loading && <Loader />}
      <Footer />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  return await getUserAuth(context)
}

export default Home
