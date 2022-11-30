import { FC, useState } from 'react'
import RecipeGridHome from '../recipeCard/RecipeGridHome'
import Loader from '../utils/Loader'
import useInfiniteScroll from '../../hooks/useInfiniteScroll3'
import { useProfileContext, useProfLoadingContext } from '../context/ProfileContext'
import { useUpdateError } from '../context/ErrorReportContext'
import { RecipeCard } from '../../interfaces/Recipe'
import { getRecipes } from '../../functions/api/recipe'
import API_URL from '../../text/API_URL'

const ContentMyRecipe: FC = () => {
  const [recipes, setRecipes] = useState<RecipeCard[] | undefined>([])
  const [page, setPage] = useState<number>(0)
  const [isMaxLimit, setIsMaxLimit] = useState(false)
  // recipe読み込みのローディング
  const [loading, setLoading] = useState(false)

  const profile = useProfileContext()
  const isProfLoading = useProfLoadingContext()
  const setErrorMsg = useUpdateError()

  // recipeを取得する
  const readUserRecipes = async () => {
    const URL = `${API_URL.recipeProfile}?id=${profile?._id}&skip=${page}`
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
      <RecipeGridHome recipes={recipes} title={'作成したレシピ'} />
      {loading && <Loader />}
    </>
  )
}

export default ContentMyRecipe
