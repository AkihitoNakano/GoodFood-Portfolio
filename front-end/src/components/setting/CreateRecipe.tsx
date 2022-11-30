import { FC, useState, useRef, FormEvent } from 'react'
import axios from 'axios'
import { nanoid } from 'nanoid'
import InputRecipe from './CreateRecipeChild/InputRecipe'
import LoaderSending from '../utils/LoaderSending '
import { ExMaterial, Step } from 'interfaces/Recipe'
import { useUpdateError } from '../context/ErrorReportContext'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import { mergeData, alertImageFileSize } from 'functions/eachComponent/commonRecipe'
import FETCH_API_URL from 'text/API_URL'
import { imageFileLimit } from 'text/Specification'
import { ErrorLevel } from 'interfaces/Error'
import { catchErrorFromAPI } from 'functions/error/errorHandle'

const CreateRecipe: FC = () => {
  const [file, setFile] = useState<File>()
  const [ingredients, setIngredients] = useState<ExMaterial[] | undefined>([])
  const [flavors, setFlavors] = useState<ExMaterial[] | undefined>([])
  const [steps, setSteps] = useState<Step[]>([])
  const title = useRef<HTMLInputElement>(null)
  const describe = useRef<HTMLTextAreaElement>(null)
  const cookTime = useRef<HTMLInputElement>(null)
  const tags = useRef<HTMLInputElement>(null)

  const setErrorMsg = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()

  // データを送信
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDataSending(() => true)

    // ファイルをcloud storageにアップロードする
    let fileName: string | undefined
    let oldFile: string | undefined
    if (file) {
      // fileがデータ上限をを超えているか
      if (file.size >= imageFileLimit.recipeImageLimit) {
        setIsDataSending(() => false)
        return setErrorMsg([alertImageFileSize(nanoid(), imageFileLimit.recipeImageLimit, ErrorLevel.ALERT)])
      }

      const formData = new FormData()
      formData.append('file', file)
      const { data, status } = await axios.post(FETCH_API_URL.uploadRecipeImage, formData)
      if (status !== 200) throw new Error()

      fileName = data
    }

    const resultData = mergeData(fileName, title, describe, cookTime, ingredients, flavors, steps, tags)

    try {
      // データベースにデータを保存する
      await axios.post(FETCH_API_URL.crateRecipe, { ...resultData })
      setErrorMsg([{ id: nanoid(), message: 'レシピが作成されました', level: ErrorLevel.INFO }])
      resetAll()
      setIsDataSending(() => false)
    } catch (e: any) {
      setIsDataSending(() => false)
      catchErrorFromAPI(e, setErrorMsg)
    }
  }

  // 全ての値をリセットする
  const resetAll = () => {
    setFile(() => undefined)
    setIngredients([])
    setFlavors([])
    setSteps([])
    title.current!.value = ''
    describe.current!.value = ''
    cookTime.current!.value = '0'
    tags.current!.value = ''
  }

  return (
    <>
      {isDataSending && <LoaderSending />}
      <InputRecipe
        pageTitle={'レシピの作成'}
        btnName={'レシピを作成する'}
        submitHandler={submitHandler}
        title={title}
        describe={describe}
        file={file}
        setFile={setFile}
        preImage={undefined}
        cookTime={cookTime}
        ingredients={ingredients}
        setIngredients={setIngredients}
        flavors={flavors}
        setFlavors={setFlavors}
        steps={steps}
        setSteps={setSteps}
        tags={tags}
      />
    </>
  )
}

export default CreateRecipe
