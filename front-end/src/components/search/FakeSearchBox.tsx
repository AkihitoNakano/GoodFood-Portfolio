import { Dispatch, SetStateAction } from 'react'
import styles from 'styles/SearchBox.module.css'

const FakeSearchBox: React.FC<{
  inputText: string
  setInputText: Dispatch<SetStateAction<string>>
  submitHandler: () => void
}> = ({ inputText, setInputText, submitHandler }) => {
  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const clearInput = () => {
    setInputText(() => '')
  }

  return (
    <>
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          submitHandler()
        }}>
        <input
          className={styles.input}
          type='text'
          value={inputText}
          placeholder='レシピを検索してみよう! '
          onChange={changeInputHandler}
        />
        <img className={styles.clear} onClick={clearInput} src='/icons/general/x.svg' alt='close' />
        <img onClick={submitHandler} className={styles.search} src='/icons/general/search.svg' alt='search' />
      </form>
    </>
  )
}

export default FakeSearchBox
