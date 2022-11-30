import { FC, memo } from 'react'
import Moment from 'react-moment'
import { omitText } from 'functions/utils/docControl'
import { cvtUrl, cvtRecipeUrl } from 'functions/upload/convertImageUrl'
import { RecipeCard } from 'interfaces/Recipe'
import styles from 'styles/VStackRecipeGrid.module.css'
import tStyles from 'styles/Text.module.css'

type IsChecked = (recipeId: string) => JSX.Element

const VStackRecipeGrid: FC<{
  isChecked: IsChecked
  searchedRecipes: RecipeCard[] | undefined
  selectRecipe: (recipe: RecipeCard) => void
}> = memo(({ isChecked, searchedRecipes, selectRecipe }) => {
  return (
    <>
      <div className={styles.gridWrap}>
        {searchedRecipes?.map(recipe => {
          return (
            <div onClick={() => selectRecipe(recipe)} key={recipe._id} className={styles.cardContainer}>
              {isChecked(recipe._id)}
              <div className={`${styles.check}`}></div>
              <img className={styles.recipeImg} src={cvtRecipeUrl(recipe.img)} />
              <div className={styles.textInfoContainer}>
                <div className={styles.titleTopWrap}>
                  <p className={`${styles.recipeTitle} ${tStyles.title50} textSpaceReset`}>
                    {omitText(recipe.title, 21)}
                  </p>
                  <Moment className={`${tStyles.sub40} ${styles.userName}`} format='YYYY/MM/DD'>
                    {recipe.createdAt}
                  </Moment>
                </div>
                <p className={`${styles.recipeText} describeText`}>
                  {recipe.describe ? omitText(recipe.describe, 32) : '説明なし'}
                </p>
                <div className={styles.bottomWrap}>
                  <div className={styles.favWrap}>
                    <div className={styles.heartIcon} />
                    <p className={`${tStyles.sub40} ${styles.countText}`}>{recipe.count ?? 0}</p>
                  </div>
                  <div className={styles.userWrap}>
                    <img className={styles.avatar} src={cvtUrl(recipe.avatar)} />
                    <p className={`${tStyles.title40} ${styles.userName}`}>{recipe.displayName}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
})

export default VStackRecipeGrid
