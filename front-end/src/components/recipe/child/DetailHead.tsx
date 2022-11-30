import { FC } from 'react'
import { useRouter } from 'next/router'
import { RecipeContent } from 'interfaces/Recipe'
import { cvtUrl, cvtRecipeUrl } from 'functions/upload/convertImageUrl'
import Moment from 'react-moment'
import styles from 'styles/RecipeDetails.module.css'
import tStyles from 'styles/Text.module.css'

const ShowDate: FC<{ date: Date; text: string }> = ({ date, text }) => {
  return (
    <>
      <div className={styles.dateAndTextWrap}>
        <p>{text}</p>
        <Moment className={styles.date} format='YYYY年MM月DD日'>
          {date}
        </Moment>
      </div>
    </>
  )
}

const DetailHead: FC<{ recipe: RecipeContent; favCount: number }> = ({ recipe, favCount }) => {
  const router = useRouter()
  // 更新日と作成日が同じであれば作成日のみを表示する
  const IsEqualDate = (recipe: RecipeContent) => {
    if (recipe.createdAt === recipe.updatedAt) {
      return <ShowDate date={recipe.createdAt} text={'作成日'} />
    }
    return (
      <>
        <ShowDate date={recipe.createdAt} text={'作成日'} />
        <ShowDate date={recipe.updatedAt} text={'更新日'} />
      </>
    )
  }

  const jumpToPage = (url: string) => {
    router.push(url)
  }

  return (
    <>
      <div className={`${styles.headWrap}`}>
        {recipe.img && <img src={cvtRecipeUrl(recipe.img, 'null')} className={styles.recipeImg} alt={recipe.title} />}

        <div className={` ${styles.headDescribeWrap}`}>
          <div className={styles.titleTopWrap}>
            <h1>{recipe.title}</h1>
          </div>

          <div className={`${styles.favAndDateWrap}`}>
            <div className={styles.favWrap}>
              <div className={styles.heartIcon}></div>
              <p className={`${tStyles.sub40}`}>{favCount}</p>
            </div>
            <div className={styles.dateWrap}>{IsEqualDate(recipe)}</div>
          </div>

          <p className={styles.describe}>{recipe.describe}</p>
          <div className={styles.ownerWrap}>
            <p>
              Made by <span onClick={() => jumpToPage(`/${recipe.accountName}`)}>{recipe.displayName}</span>
            </p>
            <img src={cvtUrl(recipe.avatar)} alt={recipe.displayName} />
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailHead
