import type { FC, FormEvent, ChangeEvent, RefObject, Dispatch, SetStateAction } from 'react'
import PageDivide from 'components/setting/PageCommon/PageDivide'
import SelectedList from 'components/setting/PageCommon/RecipeList'
import SearchAndRecipeGrid from 'components/setting/PageCommon/SearchAndRecipeGrid'
import { RecipeCard } from 'interfaces/Recipe'
import tStyles from 'styles/Text.module.css'
import fStyles from 'styles/Form.module.css'
import styles from 'styles/CreatePage.module.css'
import bStyles from 'styles/Button.module.css'
import lStyles from 'styles/Layout.module.css'

const InputPage: FC<{
  title: string
  btnName: string
  submitHandler: (e: FormEvent<HTMLFormElement>) => void
  dividedNum: number
  changeDividedHandler: (e: ChangeEvent<HTMLSelectElement>) => void
  pageTitle: RefObject<HTMLInputElement>
  pageRecipes: RecipeCard[]
  setPageRecipes: Dispatch<SetStateAction<RecipeCard[]>>
  searchedRecipes: RecipeCard[] | undefined
  setSearchedRecipes: Dispatch<SetStateAction<RecipeCard[] | undefined>>
  selectRecipe: (recipe: RecipeCard) => void
}> = ({
  title,
  btnName,
  submitHandler,
  dividedNum,
  changeDividedHandler,
  pageTitle,
  pageRecipes,
  setPageRecipes,
  searchedRecipes,
  setSearchedRecipes,
  selectRecipe,
}) => {
  return (
    <>
      <div className={`${styles.container} settingCenterWrap`}>
        <h1>{title}</h1>
        <form onSubmit={submitHandler}>
          {/* 分割数 */}
          <PageDivide dividedNum={dividedNum} changeDividedHandler={changeDividedHandler} />
          {/* ページタイトル */}
          <div className={`${lStyles.contentBox}`}>
            <label className={`${tStyles.title60}`} htmlFor='title'>
              ページタイトル
            </label>
            <input
              ref={pageTitle}
              className={`${fStyles.formInput}`}
              type='text'
              required
              placeholder='ページのタイトルを記入して下さい'
            />
          </div>
          {/*選択したレシピを表示 */}
          <SelectedList pageRecipes={pageRecipes} setPageRecipes={setPageRecipes} dividedNum={dividedNum} />
          <button className={`${bStyles.btn} ${bStyles.btnMRedFree} ${styles.submitBtn}`}>{btnName}</button>
        </form>
        {/* search box and recipe grid */}
        <SearchAndRecipeGrid
          searchedRecipes={searchedRecipes}
          setSearchedRecipes={setSearchedRecipes}
          selectRecipe={selectRecipe}
          selectedPageRecipes={pageRecipes}
        />
      </div>
    </>
  )
}

export default InputPage
