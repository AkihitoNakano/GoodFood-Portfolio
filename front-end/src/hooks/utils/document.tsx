import tStyles from 'styles/Text.module.css'

// fileサイズで警告を出す
export const checkFileSize = (file: File | null | undefined, limit: number) => {
  if (!file) return
  if (file.size >= limit) {
    return <p className={tStyles.red}>{`ファイルサイズは${limit / (1024 * 1024)}MB以内におさめてください！`}</p>
  }
}
