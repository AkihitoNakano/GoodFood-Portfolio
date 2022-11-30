import { FC, memo } from 'react'
import Moment from 'react-moment'
import { RecipeCard } from 'interfaces/Recipe'
import { cvtUrl, cvtRecipeUrl } from 'functions/upload/convertImageUrl'
import { omitText } from 'functions/utils/docControl'
import { useRouter } from 'next/router'
import styles from 'styles/RecipeGrid.module.css'
import tStyles from 'styles/Text.module.css'

const RecipeGridHome: FC<{ recipes: RecipeCard[] | undefined; title: string }> = memo(({ recipes, title }) => {
  // console.log(recipes)
  const router = useRouter()

  const jumpToDetailPage = (recipeId: string) => router.push(`/recipe/details?id=${recipeId}`)

  return (
    <>
      {recipes && (
        <div className={styles.container}>
          <h1>{title}</h1>
          <div className={styles.gridWrap}>
            {recipes?.map((recipe, idx) => {
              return (
                <div key={`${recipe._id}_${idx}`} className={styles.cardContainer}>
                  <img
                    onClick={() => jumpToDetailPage(recipe._id)}
                    className={styles.recipeImg}
                    src={cvtRecipeUrl(recipe.img)}
                  />
                  <div className={styles.textInfoContainer}>
                    <div className={styles.titleTopWrap}>
                      <p className={`${styles.recipeTitle} textSpaceReset`}>{omitText(recipe.title, 8)}</p>
                      <Moment className={tStyles.text30} format='YY/MM/DD'>
                        {recipe.createdAt}
                      </Moment>
                    </div>
                    <p className={`${styles.recipeText} describeText`}>
                      {recipe.describe ? omitText(recipe.describe, 15) : '説明なし'}
                    </p>
                    <div className={styles.bottomWrap}>
                      <div className={styles.favWrap}>
                        <div className={styles.heartIcon} />
                        <p className={styles.countText}>{recipe.count ?? 0}</p>
                      </div>
                      <div className={styles.userWrap}>
                        <img className={styles.avatar} src={cvtUrl(recipe.avatar)} />
                        <p onClick={() => router.push(`/${recipe.accountName}`)} className={styles.userName}>
                          {omitText(recipe.displayName, 15)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
})

export default RecipeGridHome
