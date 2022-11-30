import { FC } from 'react'
import { RecipeContent } from 'interfaces/Recipe'
import { DivType } from 'interfaces/Page'
import { fontSize } from './Materials'
import tStyles from 'styles/Text.module.css'
import styles from 'styles/Print.module.css'

const PrintSteps: FC<{ data: RecipeContent; divType: DivType }> = ({ data, divType }) => {
  return (
    <>
      {data.steps && (
        <div className={`${styles.contentBox} ${styles.OneStepsWrap}`}>
          {data.steps.map((step, idx) => (
            <p key={idx} className={fontSize(divType)}>
              {idx + 1}.　{step}
            </p>
          ))}
        </div>
      )}
    </>
  )
}

export default PrintSteps
