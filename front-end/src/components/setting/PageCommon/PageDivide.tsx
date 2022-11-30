import { FC, ChangeEvent } from 'react'
import tStyles from 'styles/Text.module.css'
import fStyles from 'styles/Form.module.css'
import lStyles from 'styles/Layout.module.css'

type ChangeDivideHandler = (e: ChangeEvent<HTMLSelectElement>) => void

const PageDivide: FC<{ dividedNum: number; changeDividedHandler: ChangeDivideHandler }> = ({
  dividedNum,
  changeDividedHandler,
}) => {
  return (
    <div className={`${lStyles.contentBox}`}>
      <label className={`${tStyles.title60}`} htmlFor='divideNum'>
        ページの分割数
      </label>
      <select
        value={dividedNum}
        onChange={changeDividedHandler}
        className={fStyles.selectInput}
        name='divideNum'
        id='selectNum'>
        <option value='1'>1</option>
        <option value='4'>4</option>
        <option value='6'>6</option>
      </select>
    </div>
  )
}

export default PageDivide
