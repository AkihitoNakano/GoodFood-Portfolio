import { FC, memo, useState } from 'react'
import RecipeGridHome from '../recipeCard/RecipeGridHome'
import useInfiniteScroll from 'hooks/useInfiniteScroll3'
import Loader from 'components/utils/Loader'
import { useProfLoadingContext } from 'components/context/ProfileContext'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { RecipeCard } from 'interfaces/Recipe'
import { getRecipes } from 'functions/api/recipe'
import API_URL from 'text/API_URL'

const ContentFav: FC = memo(() => {
  const [recipes, setRecipes] = useState<RecipeCard[] | undefined>([])
  const [page, setPage] = useState<number>(0)
  const [isMaxLimit, setIsMaxLimit] = useState(false)
  // recipe読み込みのローディング
  const [loading, setLoading] = useState(false)

  const isProfLoading = useProfLoadingContext()
  const setErrorMsg = useUpdateError()

  // recipeを取得する
  const readUserRecipes = async () => {
    const URL = `${API_URL.favs}?&skip=${page}`
    return await getRecipes(setErrorMsg, URL)
  }

  useInfiniteScroll({
    readDataFn: readUserRecipes,
    isPreLoading: isProfLoading,
    page,
    setPage,
    setListData: setRecipes,
    isMaxLimit,
    setIsMaxLimit,
    setLoading,
  })

  return (
    <>
      <RecipeGridHome recipes={recipes} title={'お気に入りレシピ'} />
      {loading && <Loader />}
    </>
  )
})

export default ContentFav
