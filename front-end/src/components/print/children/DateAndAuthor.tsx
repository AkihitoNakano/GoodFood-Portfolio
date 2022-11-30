import { FC } from 'react'
import Moment from 'react-moment'
import { RecipeContent } from 'interfaces/Recipe'
import { DivType } from 'interfaces/Page'
import styles from 'styles/Print.module.css'
import tStyles from 'styles/Text.module.css'

const fontSize = (type: DivType) => {
  switch (type) {
    case 1:
      return `${tStyles.text30} ${styles.OneDate}`
    case 4:
      return `${tStyles.text10} ${styles.OneDate}`
    case 6:
      return `${tStyles.text60} ${styles.OneDate}`
  }
}

const DateAndAuthor: FC<{ data: RecipeContent; divType: DivType }> = ({ data, divType }) => {
  return (
    <>
      <div className={` ${styles.OneDateAndNameWrap}`}>
        <Moment className={fontSize(divType)} format='作成日 YYYY年MM月DD日'>
          {data.createdAt}
        </Moment>
        <p className={fontSize(divType)}>by {data.displayName}</p>
      </div>
    </>
  )
}

export default DateAndAuthor
