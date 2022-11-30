import { FC } from 'react'
import { RecipeContent } from 'interfaces/Recipe'
import styles from 'styles/RecipeDetails.module.css'
import tStyles from 'styles/Text.module.css'

const CookTime: FC<{ recipe: RecipeContent }> = ({ recipe }) => {
  return (
    <>
      <div className={`${styles.contentBox} ${styles.cookTimeWrap}`}>
        <div className={styles.cookTitleWrap}>
          <div className={styles.timeIcon}></div>
          <p className={tStyles.title60}>調理時間</p>
        </div>
        <p className={styles.time}>{recipe.cookTime}分</p>
      </div>
    </>
  )
}

export default CookTime
