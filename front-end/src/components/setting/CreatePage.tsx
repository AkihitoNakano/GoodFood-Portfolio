import { useState, useRef, memo, useEffect, FormEvent } from 'react'
import type { FC, ChangeEvent } from 'react'
import axios from 'axios'
import { nanoid } from 'nanoid'
import InputPage from 'components/setting/PageCommon/InputPage'
import LoaderSending from '../utils/LoaderSending '
import { useUpdateError } from '../context/ErrorReportContext'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import FETCH_API_URL from 'text/API_URL'
import { RecipeCard } from 'interfaces/Recipe'
import { ErrorLevel } from 'interfaces/Error'
import { catchErrorFromAPI } from 'functions/error/errorHandle'

const CreatePage: FC = () => {
  const [dividedNum, setDividedNum] = useState<number>(1)
  const [pageRecipes, setPageRecipes] = useState<RecipeCard[]>([])
  const [searchedRecipes, setSearchedRecipes] = useState<RecipeCard[] | undefined>([])

  const pageTitle = useRef<HTMLInputElement>(null)
  const setErrorMsg = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()

  const changeDividedHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setDividedNum(+e.target.value)
  }

  const selectRecipe = (recipe: RecipeCard) => {
    const isChecked = pageRecipes?.filter(pageRecipe => pageRecipe._id === recipe._id)
    if (isChecked.length > 0) {
      return setPageRecipes(prev => prev.filter(pRecipe => pRecipe._id !== recipe._id))
    }
    if (pageRecipes.length >= dividedNum) return
    return setPageRecipes(prev => [...prev, recipe])
  }

  // 作成したページデータを送信
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDataSending(true)
    if (pageRecipes.length === 0) {
      setIsDataSending(false)
      return setErrorMsg([{ id: nanoid(), message: 'レシピを一つ以上選択して下さい。', level: ErrorLevel.ALERT }])
    }
    const data = {
      pageName: pageTitle.current!.value,
      divisionNum: dividedNum,
      recipeIds: pageRecipes.map(recipe => recipe._id),
    }

    try {
      const result: any = await axios.post(FETCH_API_URL.postPage, { ...data }).then(res => res.data)
      setErrorMsg([{ id: nanoid(), message: 'ページが作成されました', level: ErrorLevel.INFO }])
      setIsDataSending(false)
      pageTitle.current!.value = ''
      setPageRecipes(() => [])
    } catch (e: any) {
      setIsDataSending(false)
      catchErrorFromAPI(e, setErrorMsg)
    }
  }

  return (
    <>
      {/* <input type='button' value='このページを印刷する' onClick={() => window.print()} /> */}
      {isDataSending && <LoaderSending />}
      <InputPage
        title='ページの作成'
        btnName='ページを作成'
        submitHandler={submitHandler}
        dividedNum={dividedNum}
        changeDividedHandler={changeDividedHandler}
        pageTitle={pageTitle}
        pageRecipes={pageRecipes}
        setPageRecipes={setPageRecipes}
        searchedRecipes={searchedRecipes}
        setSearchedRecipes={setSearchedRecipes}
        selectRecipe={selectRecipe}
      />
    </>
  )
}

export default CreatePage
