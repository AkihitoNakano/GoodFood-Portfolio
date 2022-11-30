import { Dispatch, FC, SetStateAction } from 'react'
import Moment from 'react-moment'
import tStyles from 'styles/Text.module.css'
import styles from 'styles/CreatePage.module.css'
import lStyles from 'styles/Layout.module.css'
import { omitText } from 'functions/utils/docControl'
import { RecipeCard } from 'interfaces/Recipe'

const PageDivide: FC<{
  pageRecipes: RecipeCard[]
  setPageRecipes: Dispatch<SetStateAction<RecipeCard[]>>
  dividedNum: number
}> = ({ pageRecipes, setPageRecipes, dividedNum }) => {
  // リストからレシピを削除する
  const deleteFromPageList = (recipeId: string) => {
    setPageRecipes(prev => prev?.filter(recipe => recipe._id !== recipeId))
  }

  return (
    <div className={`${lStyles.contentBox} ${styles.pageList}`}>
      <label className={`${tStyles.title60} `} htmlFor='selectedItems'>
        選択したレシピ　{pageRecipes.length} / {dividedNum}
      </label>
      <table>
        <thead className={`${styles.tableHead}`}>
          <tr>
            <th>No.</th>
            <th>レシピ名</th>
            <th>作成日　</th>
          </tr>
        </thead>
        <tbody>
          {pageRecipes.map((data, idx) => (
            <tr key={data._id} className={`${styles.pageRow}`}>
              <td className={`${tStyles.sub50}`}>00{idx}</td>
              <td>{omitText(data.title, 23)}</td>
              <td>
                <Moment className={`${tStyles.sub40} ${styles.userName}`} format='YYYY/MM/DD'>
                  {data.createdAt}
                </Moment>
              </td>
              <td onClick={() => deleteFromPageList(data._id)} className={`${styles.cancelList}`}>
                <img src='/icons/general/x.svg' alt='' />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PageDivide
