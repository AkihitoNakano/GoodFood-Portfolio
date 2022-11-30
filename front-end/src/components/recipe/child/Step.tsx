import { FC } from 'react'
import { RecipeContent } from 'interfaces/Recipe'
import styles from 'styles/RecipeDetails.module.css'
import tStyles from 'styles/Text.module.css'

const Step: FC<{ recipe: RecipeContent }> = ({ recipe }) => {
  return (
    <>
      <div className={`${styles.contentBox} ${styles.orderContainer}`}>
        <p className={`${styles.stepTitle} ${tStyles.title60}`}>手順</p>
        {recipe.steps && (
          <div className={`${styles.stepWrap}`}>
            {recipe.steps.map((step, idx) => (
              <div key={idx} className={`${styles.stepBox}`}>
                <p className={`${tStyles.title60g} ${styles.stepNum}`}>Step {idx}</p>
                <p className={`${styles.stepContent} ${tStyles.text50}`}>{step}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Step
