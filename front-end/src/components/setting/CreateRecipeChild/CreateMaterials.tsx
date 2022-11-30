import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import { ExMaterial } from 'interfaces/Recipe'
import { getRandomValue } from 'functions/utils/random'
import styles from 'styles/CreateRecipe.module.css'
import tStyles from 'styles/Text.module.css'
import bStyles from 'styles/Button.module.css'
import fStyles from 'styles/Form.module.css'
import lStyles from 'styles/Layout.module.css'

const CreateMaterial: FC<{
  title: string
  material: ExMaterial[] | undefined
  setMaterial: Dispatch<SetStateAction<ExMaterial[] | undefined>>
}> = ({ title, material, setMaterial }) => {
  const changeHandler = (e: ChangeEvent<HTMLInputElement>, idx: number, type: 'name' | 'amount') => {
    if (type === 'name') {
      setMaterial(() =>
        material?.map((data, id) => (data.id === idx ? { ...data, name: e.target.value } : { ...data }))
      )
    } else {
      setMaterial(() =>
        material?.map((data, id) => (data.id === idx ? { ...data, amount: e.target.value } : { ...data }))
      )
    }
  }

  // rowを追加
  const addRow = () => {
    setMaterial(prev => [...prev!, { id: getRandomValue(5), name: '', amount: '' }])
  }

  const closeRow = (idx: number) => {
    setMaterial(() => material?.filter((data, id) => data.id !== idx))
  }

  return (
    <div className={`${lStyles.contentBox} ${styles.materialContainer}`}>
      <div className={`${styles.tableBox}`}>
        <div className={`${styles.materialHeadWrap}`}>
          <p className={`${tStyles.title60}`}>{title}</p>
          <p className={`${tStyles.title60}`}>分量（一人前）</p>
        </div>

        {material?.map(data => (
          <div key={data.id} className={`${styles.materialRowWrap}`}>
            <input
              className={`${fStyles.formInput}`}
              type='text'
              required
              onChange={e => changeHandler(e, data.id, 'name')}
              value={data.name}
            />
            <input
              className={`${fStyles.formInput}`}
              type='text'
              required
              onChange={e => changeHandler(e, data.id, 'amount')}
              value={data.amount}
            />
            <div onClick={() => closeRow(data.id)} className={`${styles.closeRow} ${styles.cancelMaterial}`}></div>
          </div>
        ))}
      </div>

      <button onClick={addRow} className={`${bStyles.btn} ${bStyles.btnMGreen}`} type='button'>
        +{title}を追加
      </button>
    </div>
  )
}

export default CreateMaterial
