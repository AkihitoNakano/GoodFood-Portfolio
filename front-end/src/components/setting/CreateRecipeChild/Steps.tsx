import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import { Step } from 'interfaces/Recipe'
import { getRandomValue } from 'functions/utils/random'
import styles from 'styles/CreateRecipe.module.css'
import tStyles from 'styles/Text.module.css'
import bStyles from 'styles/Button.module.css'
import fStyles from 'styles/Form.module.css'
import lStyles from 'styles/Layout.module.css'

const Steps: FC<{
  steps: Step[]
  setSteps: Dispatch<SetStateAction<Step[]>>
}> = ({ steps, setSteps }) => {
  const changeHandler = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    setSteps(() => steps?.map((data, id) => (data.id === idx ? { ...data, desc: e.target.value } : { ...data })))
  }

  // rowを追加
  const addRow = () => {
    setSteps(prev => [...prev!, { id: getRandomValue(5), desc: '' }])
  }

  const closeRow = (idx: number) => {
    setSteps(() => steps?.filter((data, id) => data.id !== idx))
  }

  return (
    <div className={`${lStyles.contentBox} ${styles.stepContainer}`}>
      <label className={`${tStyles.title60}`}>手順</label>
      <div className={`${styles.stepBox}`}>
        {steps?.map((data, idx) => (
          <div key={data.id} className={`${styles.stepRowWrap}`}>
            <label className={tStyles.text60} htmlFor={`${data.id}`}>
              　Step {idx}
            </label>
            <input
              className={`${fStyles.formInput}`}
              type='text'
              id={`${data.id}`}
              required
              onChange={e => changeHandler(e, data.id)}
              value={data.desc}
            />
            <div onClick={() => closeRow(data.id)} className={`${styles.closeRow} ${styles.imgClose}`}></div>
          </div>
        ))}
      </div>

      <button className={`${bStyles.btn} ${bStyles.btnMGreen}`} onClick={addRow} type='button'>
        +ステップを追加
      </button>
    </div>
  )
}

export default Steps
