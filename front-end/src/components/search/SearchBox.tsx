import { Dispatch, SetStateAction } from 'react'
import styles from 'styles/SearchBox.module.css'
import { InputSearchText } from 'interfaces/Query'

const SearchBox: React.FC<{
  inputText: InputSearchText
  setInputText: Dispatch<SetStateAction<InputSearchText>>
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
          required
        />
        <img className={styles.clear} onClick={clearInput} src='/icons/general/x.svg' alt='close' />
        <img onClick={submitHandler} className={styles.search} src='/icons/general/search.svg' alt='search' />
      </form>
    </>
  )
}

export default SearchBox
