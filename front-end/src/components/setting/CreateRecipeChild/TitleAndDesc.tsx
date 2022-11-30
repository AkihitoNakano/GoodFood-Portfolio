import { FC, MutableRefObject, useEffect, useState } from 'react'
import styles from 'styles/CreateRecipe.module.css'
import tStyles from 'styles/Text.module.css'
import fStyles from 'styles/Form.module.css'
import lStyles from 'styles/Layout.module.css'

const TitleAndDesc: FC<{
  title: MutableRefObject<HTMLInputElement | null>
  describe: MutableRefObject<HTMLTextAreaElement | null>
}> = ({ title, describe }) => {
  const [titleCount, setTitleCount] = useState<number>(0)
  const [descCount, setDescCount] = useState<number>(0)

  return (
    <>
      <div className={`${lStyles.contentBox}`}>
        <label className={`${tStyles.title60}`} htmlFor='title'>
          タイトル
        </label>
        <p className={`${tStyles.sub40} ${styles.textCount}`}>{titleCount} / 30</p>
        <input
          ref={title}
          onChange={e => setTitleCount(e.currentTarget.value.length)}
          className={`${fStyles.formInput}`}
          type='text'
          id='title'
          placeholder='タイトルを記入して下さい'
          maxLength={30}
          required
        />
      </div>
      <div className={`${lStyles.contentBox}`}>
        <label className={`${tStyles.title60}`} htmlFor='describe'>
          レシピの説明
        </label>
        <p className={`${tStyles.sub40} ${styles.textCount}`}>{descCount} / 140</p>
        <textarea
          ref={describe}
          onChange={e => setDescCount(e.currentTarget.value.length)}
          className={`${fStyles.textArea}`}
          id='describe'
          placeholder='レシピの簡単な説明を書いて下さい'
          maxLength={140}
          required
        />
      </div>
    </>
  )
}

export default TitleAndDesc
