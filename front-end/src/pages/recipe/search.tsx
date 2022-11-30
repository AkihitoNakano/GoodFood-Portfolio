import { useState } from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import HeadComp from 'components/head/Head'
import Footer from 'components/footer/Footer'
import SearchBox from 'components/search/SearchBox'
import RecipeGridHome from 'components/recipeCard/RecipeGridHome'
import SearchResult from 'components/search/SearchResult'
import Loader from 'components/utils/Loader'
import useInfiniteScroll from 'hooks/useInfiniteScroll4'
import { InputSearchText } from 'interfaces/Query'
import { RecipeState, RecipeCard } from 'interfaces/Recipe'
import { getRecipes, getTotalNumber } from 'functions/api/recipe'
import { useUpdateError } from 'components/context/ErrorReportContext'
import API_URL from 'text/API_URL'

const SearchRecipe: NextPage<{ text: string }> = ({ text }) => {
  // 検索欄のテキスト
  const [searchText, setSearchText] = useState<InputSearchText>(text)
  // 検索結果後のテキスト
  const [resultText, setResultText] = useState<InputSearchText>(searchText)
  // 検索したレシピ
  const [searchRecipes, setSearchedRecipe] = useState<RecipeState>([])
  // 検索レシピの総数
  const [totalRecipesNum, setTotalRecipesNum] = useState(0)
  const [page, setPage] = useState(0)
  const [isMaxLimit, setIsMaxLimit] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  // エラーコンテキスト
  const setErrorMsg = useUpdateError()

  // 検索結果数取得の処理をまとめただけ
  const getTotalRecipeNum = async () => {
    const totalRecipesNum = await getTotalNumber(setErrorMsg, `${API_URL.totalSearchNum}?input=${searchText}`)
    setTotalRecipesNum(() => totalRecipesNum!)
  }

  // 検索内容を送信
  const submitInputHandler = async (): Promise<void> => {
    const recipes: RecipeState = await getRecipes(setErrorMsg, `${API_URL.search}/?input=${searchText}&skip=${0}`)
    setSearchedRecipe(() => [...recipes!])
    await getTotalRecipeNum()
    setResultText(() => searchText)

    router.push(`/recipe/search?input=${searchText}`)
  }

  // データを取得する関数を定義
  const readRecipes = async () => {
    return await getRecipes(setErrorMsg, `${API_URL.search}/?input=${searchText}&skip=${page}`)
  }

  // Infinite scrollの処理
  useInfiniteScroll<RecipeCard>({
    readDataFn: readRecipes,
    setListData: setSearchedRecipe,
    page,
    setPage,
    isMaxLimit,
    setIsMaxLimit,
    setLoading,
    searchTotalNum: getTotalRecipeNum,
  })

  return (
    <main>
      <HeadComp title='Good Food Home' />

      <SearchBox setInputText={setSearchText} inputText={searchText} submitHandler={submitInputHandler} />
      {searchRecipes && (
        <>
          <SearchResult input={resultText} resultNum={totalRecipesNum} />
          <RecipeGridHome recipes={searchRecipes} title={''}></RecipeGridHome>
        </>
      )}
      {loading && <Loader />}
      <Footer />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  return { props: { text: context.query.input } }
}

export default SearchRecipe
