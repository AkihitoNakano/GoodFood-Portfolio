import { FC } from 'react'
import { RecipeContent } from 'interfaces/Recipe'
import { DivType } from 'interfaces/Page'
import tStyles from 'styles/Text.module.css'
import styles from 'styles/Print.module.css'

export const fontSize = (type: DivType) => {
  switch (type) {
    case 1:
      return `${tStyles.text30}`
    case 4:
      return `${tStyles.text30}`
    case 6:
      return `${tStyles.text30}`
  }
}

const Materials: FC<{ data: RecipeContent; type: 'ingredient' | 'flavor'; divType: DivType }> = ({
  data,
  type,
  divType,
}) => {
  return (
    <>
      {type === 'ingredient' ? (
        <>
          {data.ingredients && (
            <div className={`${styles.contentBox} ${styles.OneMaterialWrap}`}>
              {data.ingredients.map((ingredient, idx) => (
                <p key={idx} className={fontSize(divType)}>
                  ・{ingredient.name} {ingredient.amount}
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {data.flavors && (
            <div className={`${styles.contentBox} ${styles.OneMaterialWrap}`}>
              {data.flavors.map((flavor, idx) => (
                <p key={idx} className={fontSize(divType)}>
                  ・{flavor.name} {flavor.amount}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Materials
