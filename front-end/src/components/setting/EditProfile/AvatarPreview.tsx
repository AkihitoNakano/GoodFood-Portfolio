import { FC, useEffect, useState, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { cvtUrl } from 'functions/upload/convertImageUrl'
import { checkFileSize } from 'hooks/utils/document'
import { imageFileLimit } from 'text/Specification'
import styles from 'styles/EditProfile.module.css'
import btnStyles from 'styles/Button.module.css'

const AvatarPreview: FC<{
  avatar: string | undefined
  accountName: string
  file: File | null
  setFile: Dispatch<SetStateAction<File | null>>
}> = ({ avatar, accountName, file, setFile }) => {
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    if (!file) return

    let reader: FileReader | null = new FileReader()
    // onloadend ファイルの読み込みが終わった時呼び出される
    reader.onloadend = () => {
      const res = reader!.result
      if (res && typeof res === 'string') {
        setPreview(res)
      }
    }
    reader.readAsDataURL(file)
    return () => {
      reader = null
    }
  }, [file])

  // 画像イメージの変更
  const handleOnAddFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFile(e.target.files[0])
  }

  return (
    <>
      <label id='avatar'>アバター画像</label>
      {file ? (
        <img className={styles.avatar} src={preview} alt={file?.name} />
      ) : (
        <img className={styles.avatar} src={cvtUrl(avatar)} alt={accountName} />
      )}
      {checkFileSize(file, imageFileLimit.avatarImageLimit)}
      <label className={btnStyles.btnFileInput}>
        <input
          type='file'
          name='avatar'
          id='avatar'
          onChange={e => handleOnAddFile(e)}
          accept='image/png,image/jpg,image/jpeg'
        />
        変更する
      </label>
    </>
  )
}

export default AvatarPreview
