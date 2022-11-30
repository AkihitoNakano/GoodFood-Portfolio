import { MutableRefObject, FC } from 'react'
import styles from 'styles/CreateRecipe.module.css'
import tStyles from 'styles/Text.module.css'
import fStyles from 'styles/Form.module.css'
import lStyles from 'styles/Layout.module.css'

const Tags: FC<{
  tags: MutableRefObject<HTMLInputElement | null>
}> = ({ tags }) => {
  return (
    <div className={`${lStyles.contentBox}`}>
      <label className={`${tStyles.title60}`} htmlFor='tag'>
        タグ
      </label>
      <p className={`${tStyles.sub40}`}>※スペースで区切って下さい</p>
      <input
        ref={tags}
        className={`${fStyles.formInput} ${styles.tagWrap}`}
        type='text'
        id='tag'
        placeholder={'中華 唐辛子 豚ミンチ'}
      />
    </div>
  )
}

export default Tags
