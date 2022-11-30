import { NextPage } from 'next'
import styles from 'styles/SearchResult.module.css'
import { InputSearchText } from 'interfaces/Query'

type SearchResult = { input: InputSearchText; resultNum: number }

const SearchResult: NextPage<SearchResult> = ({ input, resultNum }) => {
  return (
    <div className={styles.searchResultContainer}>
      <p className={styles.resultText}>検索結果 : {input}</p>
      <p className={styles.resultText}>{resultNum}件</p>
    </div>
  )
}

export default SearchResult
