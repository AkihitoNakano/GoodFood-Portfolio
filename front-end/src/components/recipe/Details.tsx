import { FC, useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import Footer from 'components/footer/Footer'
import RecipeTag from './child/Tag'
import ListComment from './child/ListComment'
import Step from './child/Step'
import IngredientAndFlavors from './child/IngredientAndFlavor'
import DetailHead from './child/DetailHead'
import CookTime from './child/CookTime'
import Buttons from './child/Buttons'
import RelatedRecipeList from './child/RelatedRecipeList'
import { RecipeContent } from 'interfaces/Recipe'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { ErrorLevel } from 'interfaces/Error'
import styles from 'styles/RecipeDetails.module.css'

const Details: FC<{ recipe: RecipeContent; accLoading: boolean }> = ({ recipe, accLoading }) => {
  const [favCount, setFavCount] = useState<number>(0)
  const errorMsg = useUpdateError()

  useEffect(() => {
    if (!recipe) {
      errorMsg([{ id: nanoid(), message: 'idに該当するレシピが見つかりませんでした。', level: ErrorLevel.ALERT }])
    }
  }, [])

  // favCount を最初にセットする。　fav countはお気に入り登録で変動するため
  useEffect(() => {
    const count = recipe.count ?? 0
    setFavCount(() => count)
  }, [accLoading])

  // recipeが更新されたらfavCountも更新
  useEffect(() => {
    setFavCount(() => recipe.count)
  }, [recipe])

  return (
    <main>
      {!recipe ? (
        <div>該当するレシピはありません</div>
      ) : (
        <>
          <div className={styles.detailContainer}>
            <DetailHead recipe={recipe} favCount={favCount} />
            {/*  button */}
            <Buttons recipe={recipe} accLoading={accLoading} setFavCount={setFavCount} />
            {/* cook time */}
            <CookTime recipe={recipe} />
            {/* 材料  調味料 */}
            <IngredientAndFlavors recipe={recipe} />
            {/* 手順 */}
            <Step recipe={recipe} />
            {/* comment */}
            <ListComment recipe={recipe} />
            {/* tag */}
            <RecipeTag recipe={recipe} />
            {/* 関連レシピ */}
            <RelatedRecipeList recipe={recipe} />
          </div>
        </>
      )}
      <Footer />
    </main>
  )
}

export default Details
