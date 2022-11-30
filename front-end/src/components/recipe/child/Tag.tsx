import { FC } from 'react'
import { useRouter } from 'next/router'
import { RecipeContent } from 'interfaces/Recipe'
import styles from 'styles/RecipeDetails.module.css'
import tStyles from 'styles/Text.module.css'

const RecipeTag: FC<{ recipe: RecipeContent }> = ({ recipe }) => {
  const router = useRouter()

  const searchTag = (tag: string) => {
    router.push(`/recipe/search?input=@${tag}`)
  }

  return (
    <>
      <div className={`${styles.contentBox} ${styles.tagContainer}`}>
        <p className={`${styles.commentTitle} ${tStyles.title70}`}>タグ</p>
        <div>
          {recipe.tags?.map((tag, idx) => (
            <span key={idx} onClick={() => searchTag(tag)} className={styles.tagName}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

export default RecipeTag
