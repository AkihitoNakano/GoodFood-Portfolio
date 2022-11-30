import type { Dispatch, FC, FormEvent, RefObject, SetStateAction } from 'react'
import TitleAndDesc from './TitleAndDesc'
import ImageUpload from './ImageUpload'
import CreateMaterials from './CreateMaterials'
import Steps from './Steps'
import Tags from './Tags'
import { ExMaterial, Step } from 'interfaces/Recipe'
import tStyles from 'styles/Text.module.css'
import fStyles from 'styles/Form.module.css'
import styles from 'styles/CreateRecipe.module.css'
import bStyles from 'styles/Button.module.css'
import lStyles from 'styles/Layout.module.css'

const InputRecipe: FC<{
  pageTitle: string
  btnName: string
  submitHandler: (e: FormEvent<HTMLFormElement>) => Promise<void>
  title: RefObject<HTMLInputElement>
  describe: RefObject<HTMLTextAreaElement>
  file: File | undefined
  setFile: Dispatch<SetStateAction<File | undefined>>
  preImage: string | undefined
  cookTime: RefObject<HTMLInputElement>
  ingredients: ExMaterial[] | undefined
  setIngredients: Dispatch<SetStateAction<ExMaterial[] | undefined>>
  flavors: ExMaterial[] | undefined
  setFlavors: Dispatch<SetStateAction<ExMaterial[] | undefined>>
  steps: Step[]
  setSteps: Dispatch<SetStateAction<Step[]>>
  tags: RefObject<HTMLInputElement>
}> = ({
  pageTitle,
  btnName,
  submitHandler,
  title,
  describe,
  file,
  setFile,
  preImage,
  cookTime,
  ingredients,
  setIngredients,
  flavors,
  setFlavors,
  steps,
  setSteps,
  tags,
}) => {
  return (
    <div className={`${styles.container} settingCenterWrap`}>
      <h1>{pageTitle}</h1>
      <form onSubmit={e => submitHandler(e)}>
        <TitleAndDesc title={title} describe={describe} />

        <ImageUpload file={file} setFile={setFile} preImage={preImage} />

        <div className={`${lStyles.contentBox}`}>
          <label className={`${tStyles.title60}`} htmlFor='cookTime'>
            調理時間
          </label>
          <div className={`${styles.cookTimeWrap}`}>
            <input ref={cookTime} className={`${fStyles.formInput}`} type='number' id='cookTime' required />分
          </div>
        </div>

        <CreateMaterials title={'材料'} material={ingredients} setMaterial={setIngredients} />
        <CreateMaterials title={'調味料'} material={flavors} setMaterial={setFlavors} />

        <Steps steps={steps} setSteps={setSteps} />

        <Tags tags={tags} />

        <button className={`${bStyles.btn} ${bStyles.btnLRed}`}>{btnName}</button>
      </form>
    </div>
  )
}

export default InputRecipe
