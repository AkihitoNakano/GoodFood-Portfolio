import { useState, useRef, memo, useEffect, FormEvent } from 'react'
import type { FC, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { nanoid } from 'nanoid'
import LoaderSending from '../utils/LoaderSending '
import InputPage from 'components/setting/PageCommon/InputPage'
import { useUpdateError } from '../context/ErrorReportContext'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import { RecipeCard } from 'interfaces/Recipe'
import { ErrorLevel } from 'interfaces/Error'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { getData } from 'functions/api/general'
import { Page } from 'interfaces/Page'
import API_URL from 'text/API_URL'

const EditPage: FC = () => {
  const [dividedNum, setDividedNum] = useState<number>(1)
  const [pageRecipes, setPageRecipes] = useState<RecipeCard[]>([])
  const [searchedRecipes, setSearchedRecipes] = useState<RecipeCard[] | undefined>([])

  const pageTitle = useRef<HTMLInputElement>(null)
  const setErrorMsg = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()
  const router = useRouter()

  // Editで追加した部分
  // initializer, page idからpageデータを取得
  useEffect(() => {
    const getPage = async () => {
      const id = router.query.id as string
      const page: Page = await getData(setErrorMsg, `${API_URL.getSinglePage}?id=${id}`)
      // recipeIdからRecipeCardを取り出す
      const pageRecipes = await getData(setErrorMsg, `${API_URL.multiRecipes}?id=${page.recipeIds}`)
      // 値をセットする
      setDividedNum(() => page.divisionNum)
      pageTitle.current!.value = page.pageName
      setPageRecipes(() => [...pageRecipes])
    }
    getPage()
  }, [])

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
      pageId: router.query.id,
      divisionNum: dividedNum,
      recipeIds: pageRecipes.map(recipe => recipe._id),
    }

    try {
      const result: any = await axios.patch(API_URL.deleteAndEditPage, { ...data }).then(res => res.data)
      setErrorMsg([{ id: nanoid(), message: 'ページが更新されました', level: ErrorLevel.INFO }])
      setIsDataSending(false)
    } catch (e: any) {
      setIsDataSending(false)
      catchErrorFromAPI(e, setErrorMsg)
    }
  }

  return (
    <>
      {isDataSending && <LoaderSending />}
      <InputPage
        title='ページの編集'
        btnName='ページを更新する'
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

export default EditPage
