import { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import HeadComp from 'components/head/Head'
import Footer from 'components/footer/Footer'
import Loader from 'components/utils/Loader'
import RecipeGridHome from 'components/recipeCard/RecipeGridHome'
import FakeSearchBox from 'components/search/FakeSearchBox'
import useInfiniteScroll from 'hooks/useInfiniteScroll4'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { RecipeCard } from 'interfaces/Recipe'
import { getRecipes } from 'functions/api/recipe'
import API_URL from 'text/API_URL'

interface Data {
  data: RecipeCard[]
}

const Index: NextPage = () => {
  const [recipes, setRecipes] = useState<RecipeCard[] | undefined>([])
  const [inputText, setInputText] = useState<string>('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isMaxLimit, setIsMaxLimit] = useState(false)

  const router = useRouter()
  const setErrorMsg = useUpdateError()
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
    setListData: setRecipes,
    page,
    setPage,
    isMaxLimit,
    setIsMaxLimit,
    setLoading,
  })
  return (
    <main>
      <HeadComp title='Good Food Home' />
      <FakeSearchBox setInputText={setInputText} inputText={inputText} submitHandler={submitInputHandler} />
      <RecipeGridHome recipes={recipes} title={'おすすめレシピ'} />
      {loading && <Loader />}
      <Footer />
    </main>
  )
}

export default Index
