import { Dispatch, SetStateAction, useState, useRef, FormEvent } from 'react'
import Moment from 'react-moment'
import useInfiniteScroll from 'hooks/useInfiniteScroll3'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { useProfLoadingContext } from 'components/context/ProfileContext'
import { cvtUrl, cvtRecipeUrl } from 'functions/upload/convertImageUrl'
import { RecipeCard } from 'interfaces/Recipe'
import { getRecipes } from 'functions/api/recipe'
import { omitText } from 'functions/utils/docControl'
import API_URL from 'text/API_URL'
import styles from 'styles/CreatePage.module.css'
import vgStyles from 'styles/VStackRecipeGrid.module.css'
import tStyles from 'styles/Text.module.css'
import fStyles from 'styles/Form.module.css'
import lStyles from 'styles/Layout.module.css'

const SearchAndRecipeGrid: React.FC<{
  searchedRecipes: RecipeCard[] | undefined
  setSearchedRecipes: Dispatch<SetStateAction<RecipeCard[] | undefined>>
  selectRecipe: (recipe: RecipeCard) => void
  selectedPageRecipes: RecipeCard[]
}> = ({ searchedRecipes, setSearchedRecipes, selectRecipe, selectedPageRecipes }) => {
  const [page, setPage] = useState<number>(0)
  const [isMaxLimit, setIsMaxLimit] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const searchText = useRef<HTMLInputElement>(null)

  const setErrorMsg = useUpdateError()
  const isProfLoading = useProfLoadingContext()

  // お気に入りのレシピを集める
  const readUserRecipes = async () => {
    const URL = `${API_URL.searchRecipeInFavs}?input=${searchText.current?.value}&skip=${page}`
    return await getRecipes(setErrorMsg, URL)
  }

  // レシピが選択されているか、されていればチェックをつける
  const isChecked = (recipeId: string) => {
    const isChecked = selectedPageRecipes?.filter(selectedRecipe => selectedRecipe._id === recipeId)
    if (isChecked.length > 0)
      return <img className={`${vgStyles.checked}`} src='/icons/general/check.svg' alt='check' />
    return
  }

  const clearText = () => {
    searchText.current!.value = ''
  }
  // 検索内容の結果を送信する
  const submitSearch = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    const URL = `${API_URL.searchRecipeInFavs}?input=${searchText.current?.value}&skip=0`
    const recipes = await getRecipes(setErrorMsg, URL)
    setSearchedRecipes([...recipes!])
    setPage(() => 0)
  }

  useInfiniteScroll({
    readDataFn: readUserRecipes,
    isPreLoading: isProfLoading,
    page,
    setPage,
    setListData: setSearchedRecipes,
    isMaxLimit,
    setIsMaxLimit,
    setLoading,
  })

  return (
    <>
      {/* search box */}
      <div className={`${lStyles.contentBox} `}>
        <form onSubmit={e => submitSearch(e)}>
          <label className={`${tStyles.title60}`} htmlFor='search'>
            お気に入りからページにしたいレシピを選択する
          </label>
          <div className={`${fStyles.searchForm} ${styles.searchForm}`}>
            <input ref={searchText} className={`${fStyles.search}`} type='text' placeholder='レシピを見つける' />
            <img
              onClick={() => clearText()}
              className={`${fStyles.clearSearch}`}
              src='/icons/general/x.svg'
              alt='close'
            />
            <img
              onClick={() => submitSearch()}
              className={`${fStyles.submitSearch}`}
              src='/icons/general/search.svg'
              alt='search'
            />
          </div>
        </form>
      </div>

      {/* recipe grid */}
      {searchedRecipes && (
        <div className={`${lStyles.contentBox} `}>
          <div className={`${styles.container} ${styles.stackGrid}`}>
            <div className={vgStyles.gridWrap}>
              {searchedRecipes.map(recipe => {
                return (
                  <div onClick={() => selectRecipe(recipe)} key={recipe._id} className={vgStyles.cardContainer}>
                    {isChecked(recipe._id)}
                    <div className={`${vgStyles.check}`}></div>
                    <img className={vgStyles.recipeImg} src={cvtRecipeUrl(recipe.img)} />
                    <div className={vgStyles.textInfoContainer}>
                      <div className={vgStyles.titleTopWrap}>
                        <p className={`${vgStyles.recipeTitle} ${tStyles.title50} textSpaceReset`}>
                          {omitText(recipe.title, 21)}
                        </p>
                        <Moment
                          className={`${tStyles.sub40} ${vgStyles.userName} ${vgStyles.date}`}
                          format='YYYY/MM/DD'>
                          {recipe.createdAt}
                        </Moment>
                      </div>
                      <p className={`${vgStyles.recipeText} describeText`}>
                        {recipe.describe ? omitText(recipe.describe, 32) : '説明なし'}
                      </p>
                      <div className={vgStyles.bottomWrap}>
                        <div className={vgStyles.favWrap}>
                          <div className={vgStyles.heartIcon} />
                          <p className={`${tStyles.sub40} ${vgStyles.countText}`}>{recipe.count ?? 0}</p>
                        </div>
                        <div className={vgStyles.userWrap}>
                          <img className={vgStyles.avatar} src={cvtUrl(recipe.avatar)} />
                          <p className={`${tStyles.title40} ${vgStyles.userName}`}>{recipe.displayName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchAndRecipeGrid
