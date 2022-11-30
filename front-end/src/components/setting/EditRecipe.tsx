import { FC, useState, useRef, memo, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { nanoid } from 'nanoid'
import InputRecipe from './CreateRecipeChild/InputRecipe'
import LoaderSending from '../utils/LoaderSending '
import { getRandomValue } from 'functions/utils/random'
import { ExMaterial, RecipeContent, Step } from 'interfaces/Recipe'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import { useUpdateError } from '../context/ErrorReportContext'
import { mergeData, alertImageFileSize } from 'functions/eachComponent/commonRecipe'
import FETCH_API_URL from 'text/API_URL'
import { imageFileLimit } from 'text/Specification'
import { ErrorLevel } from 'interfaces/Error'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { getData } from 'functions/api/general'

const EditRecipe: FC = () => {
  const [file, setFile] = useState<File>()
  const [ingredients, setIngredients] = useState<ExMaterial[] | undefined>([])
  const [flavors, setFlavors] = useState<ExMaterial[] | undefined>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [preImage, setPreImage] = useState<string>('')
  const title = useRef<HTMLInputElement>(null)
  const describe = useRef<HTMLTextAreaElement>(null)
  const cookTime = useRef<HTMLInputElement>(null)
  const tags = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const setErrorMsg = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()

  // recipeIdからレシピデータを取得
  useEffect(() => {
    const getRecipe = async () => {
      const id = router.query.id as string
      const recipe: RecipeContent = await getData(setErrorMsg, `${FETCH_API_URL.getRecipeContent}?id=${id}`)

      // 値をセットする
      title.current!.value = recipe.title
      describe.current!.value = recipe.describe
      cookTime.current!.value = recipe.cookTime.toString()
      tags.current!.value = recipe.tags ? recipe.tags.join(' ') : ''

      setIngredients(() =>
        recipe.ingredients.map(ingredient => ({
          id: getRandomValue(5),
          name: ingredient.name,
          amount: ingredient.amount,
        }))
      )
      setFlavors(() =>
        recipe.flavors.map(flavor => ({
          id: getRandomValue(5),
          name: flavor.name,
          amount: flavor.amount,
        }))
      )
      setSteps(() => recipe.steps.map(step => ({ id: getRandomValue(5), desc: step })))
      setPreImage(() => recipe.img)
    }
    getRecipe()
  }, [])

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
      oldFile = preImage
    }

    const resultData = mergeData(fileName, title, describe, cookTime, ingredients, flavors, steps, tags)

    try {
      // データベースにデータを保存する
      await axios.patch(`${FETCH_API_URL.updateRecipe}?id=${router.query.id}`, { ...resultData })
      setErrorMsg([{ id: nanoid(), message: 'レシピが更新されました', level: ErrorLevel.INFO }])
      resetAll()
      // 古い画像の削除
      oldFile && (await axios.delete(`${FETCH_API_URL.deleteOldImage}?file=${oldFile}`))
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
    setPreImage('')
    title.current!.value = ''
    describe.current!.value = ''
    cookTime.current!.value = '0'
    tags.current!.value = ''
  }

  return (
    <>
      {isDataSending && <LoaderSending />}
      <InputRecipe
        pageTitle={'レシピの修正'}
        btnName={'レシピを修正する'}
        submitHandler={submitHandler}
        title={title}
        describe={describe}
        file={file}
        setFile={setFile}
        preImage={preImage}
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

export default EditRecipe
