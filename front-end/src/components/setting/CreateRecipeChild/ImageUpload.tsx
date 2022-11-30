import { useState, useEffect } from 'react'
import type { FC, Dispatch, SetStateAction, ChangeEvent } from 'react'
import { cvtRecipeUrl } from 'functions/upload/convertImageUrl'
import { checkFileSize } from 'hooks/utils/document'
import { imageFileLimit } from 'text/Specification'
import bStyles from 'styles/Button.module.css'
import tStyles from 'styles/Text.module.css'
import styles from 'styles/CreateRecipe.module.css'
import lStyles from 'styles/Layout.module.css'

const ImageUpload: FC<{
  file: File | undefined
  setFile: Dispatch<SetStateAction<File | undefined>>
  preImage: string | undefined
}> = ({ file, setFile, preImage }) => {
  const [image, setImage] = useState<string>('')

  useEffect(() => {
    if (!file) return setImage('')

    let reader: FileReader | null = new FileReader()
    // onloadend ファイルの読み込みが終わった時呼び出される
    reader.onloadend = () => {
      const res = reader!.result
      if (res && typeof res === 'string') {
        setImage(res)
      }
    }
    reader.readAsDataURL(file)
    return () => {
      reader = null
    }
  }, [file, image])

  // 画像イメージの変更
  const handleOnAddFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFile(e.target.files[0])
  }

  // 画像の破棄
  const cancelImage = () => {
    setFile(undefined)
    setImage('')
  }

  // 画像の読み込み、ちょっと複雑、preImageは更新用のデータからurlで画像データを取得する
  const readImage = () => {
    if (preImage || image) {
      let insertImage
      if (image !== '' || preImage === undefined) {
        insertImage = image
      } else if (preImage !== '') {
        insertImage = cvtRecipeUrl(preImage)
      }
      return <img className={`${styles.imagePreview}`} src={insertImage} alt='recipe' />
    }
    return
  }

  return (
    <div className={`${lStyles.contentBox} ${styles.imagePreviewWrap} `}>
      <label className={`${tStyles.title60}`} htmlFor='upload'>
        画像のアップロード
      </label>
      {readImage()}
      {checkFileSize(file, imageFileLimit.recipeImageLimit)}
      <label htmlFor='image' className={`${bStyles.btnFileInput} ${styles.imgInput}`}>
        <input
          type='file'
          name='image'
          id='image'
          onChange={e => handleOnAddFile(e)}
          accept='image/png,image/jpg,image/jpeg'
        />
        変更する
      </label>
      {image && <div onClick={cancelImage} className={`${styles.closeRow} ${styles.imgClose}`}></div>}
    </div>
  )
}

export default ImageUpload
