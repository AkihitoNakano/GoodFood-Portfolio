import { FC, useEffect, useState } from 'react'
import axios from 'axios'
import RecipeGrid from 'components/recipeCard/RecipeGridHome'
import { RecipeContent } from 'interfaces/Recipe'
import { RecipeCard } from 'interfaces/Recipe'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { useUpdateError } from 'components/context/ErrorReportContext'
import FETCH_API_URL from 'text/API_URL'
import styles from 'styles/RecipeDetails.module.css'
import tStyles from 'styles/Text.module.css'

const RelatedRecipeList: FC<{ recipe: RecipeContent }> = ({ recipe }) => {
  const [relatedRecipe, setRelatedRecipe] = useState<RecipeCard[] | undefined>([])
  const errMsg = useUpdateError()

  const readRelatedRecipes = async () => {
    try {
      const relatedRecipe: RecipeCard[] = await axios
        .get(`${FETCH_API_URL.relatedRecipe}?input=${recipe.tags}&skip=0`)
        .then(res => res.data)

      setRelatedRecipe(() => relatedRecipe)
    } catch (e: any) {
      catchErrorFromAPI(e, errMsg)
    }
  }

  useEffect(() => {
    readRelatedRecipes()
  }, [])

  return (
    <>
      <div className={`${styles.contentBox} ${styles.relatedRecipeContainer}`}>
        <p className={`${styles.commentTitle} ${tStyles.title70}`}>関連レシピ</p>
      </div>
      <RecipeGrid recipes={relatedRecipe} title={''} />
    </>
  )
}

export default RelatedRecipeList
