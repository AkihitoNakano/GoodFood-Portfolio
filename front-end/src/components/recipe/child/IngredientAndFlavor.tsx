import { FC } from 'react'
import { RecipeContent } from 'interfaces/Recipe'
import styles from 'styles/RecipeDetails.module.css'
import tStyles from 'styles/Text.module.css'

const IngredientAndFlavors: FC<{ recipe: RecipeContent }> = ({ recipe }) => {
  return (
    <>
      <div className={`${styles.contentBox} ${styles.ingredientContainer}`}>
        <table>
          <thead>
            <tr className={`${styles.tableHead} ${tStyles.title60}`}>
              <th className={`${styles.ingredientIcon} ${styles.tableTh}`}>材料</th>
              <th className={`${styles.trRight}`}>分量</th>
            </tr>
          </thead>
          <tbody>
            {recipe.ingredients.map((data, idx) => (
              <tr key={`${recipe._id}_${idx}`}>
                <td className={styles.checkBox}>{data.name}</td>
                <td className={`${styles.trRight}`}>{data.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`${styles.contentBox} ${styles.flavorContainer}`}>
        <table>
          <thead>
            <tr className={`${styles.tableHead} ${tStyles.title60}`}>
              <th className={`${styles.flavorIcon} ${styles.tableTh}`}>調味料</th>
              <th className={`${styles.trRight}`}>分量</th>
            </tr>
          </thead>
          <tbody>
            {recipe.flavors.map((data, idx) => (
              <tr key={`${recipe._id}_${idx}`}>
                <td className={styles.checkBox}>{data.name}</td>
                <td className={`${styles.trRight}`}>{data.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default IngredientAndFlavors
