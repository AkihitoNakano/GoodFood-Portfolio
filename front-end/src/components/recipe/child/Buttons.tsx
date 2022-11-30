import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { RecipeContent } from 'interfaces/Recipe'
import { useAccount } from 'components/context/AccountContext'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { ErrorLevel } from 'interfaces/Error'
import { shareToTwitter } from 'functions/utils/share'
import FETCH_API_URL from 'text/API_URL'
import styles from 'styles/RecipeDetails.module.css'
import bStyles from 'styles/Button.module.css'
import tStyles from 'styles/Text.module.css'

type SetFavCount = Dispatch<SetStateAction<number>>

const Buttons: FC<{ recipe: RecipeContent; accLoading: boolean; setFavCount: SetFavCount }> = ({
  recipe,
  accLoading,
  setFavCount,
}) => {
  const [favState, setFavState] = useState<boolean>()
  const [isMyRecipe, setIsMyRecipe] = useState<boolean>(false)

  const account = useAccount()
  const errMsg = useUpdateError()
  const router = useRouter()

  // recipeをお気に入りに登録しているか確認する
  useEffect(() => {
    if (accLoading) return
    if (!account) return
    const isUserFavThisRecipe = async () => {
      try {
        const isFav = await axios.get(`${FETCH_API_URL.isFav}?id=${recipe._id}`).then(res => res.data)
        setFavState(isFav)
      } catch (err: any) {
        catchErrorFromAPI(err, errMsg)
      }
    }
    isUserFavThisRecipe()
  }, [accLoading])

  // 自分が作成したレシピかどうか
  useEffect(() => {
    if (accLoading) return
    if (!account) return
    const isMyRecipe = async () => {
      try {
        const isMyRecipe = await axios.get(`${FETCH_API_URL.isMyRecipe}?id=${recipe._id}`).then(res => res.data)
        setIsMyRecipe(isMyRecipe)
      } catch (err: any) {
        catchErrorFromAPI(err, errMsg)
      }
    }
    isMyRecipe()
  }, [accLoading])

  // recipeをお気に入りに登録する
  const registerFav = async () => {
    try {
      const registerFav = await axios.post(`${FETCH_API_URL.registerFav}`, { recipe: recipe._id }).then(res => res.data)
      setFavState(true)
      setFavCount(prev => prev + 1)
    } catch (err: any) {
      catchErrorFromAPI(err, errMsg)
    }
  }

  // recipeをお気に入りから削除する
  const deleteFav = async () => {
    try {
      const registerFav = await axios.delete(`${FETCH_API_URL.deleteFav}?id=${recipe._id}`).then(res => res.data)
      setFavState(false)
      setFavCount(prev => prev - 1)
    } catch (err: any) {
      catchErrorFromAPI(err, errMsg)
    }
  }

  // recipeを削除する
  const deleteRecipe = async () => {
    try {
      await axios.delete(`${FETCH_API_URL.deleteRecipe}?id=${recipe._id}`)
      if (recipe.img && recipe.img !== '') {
        await axios.delete(`${FETCH_API_URL.deleteOldImage}?file=${recipe.img}`)
      }
      errMsg([{ id: nanoid(), message: 'レシピが削除されました', level: ErrorLevel.INFO }])
      router.push('/settings?page=myRecipe')
    } catch (err: any) {
      catchErrorFromAPI(err, errMsg)
    }
  }

  // recipeを編集する
  const editRecipe = (recipeId: string) => {
    location.href = `/settings?page=editRecipe&id=${recipeId}`
  }

  // 印刷する
  const printPage = (recipeId: string) => {
    window.open(`/print/0?recipe=${recipeId}`)
  }

  // Twitterにシェアする
  const share = () => {
    shareToTwitter(recipe.title, recipe.title, location.href)
  }

  return (
    <>
      <div className={`${styles.contentBox} ${styles.buttonsWrap}`}>
        {account && (
          <button className={`${bStyles.btn} ${bStyles.btnMWhite}`}>
            <div className={`${styles.heartIcon2}`}></div>
            {favState ? <p onClick={deleteFav}>お気に入り解除</p> : <p onClick={registerFav}>お気に入りに登録</p>}
          </button>
        )}

        <button onClick={() => printPage(recipe._id)} className={`${bStyles.btn} ${bStyles.btnMWhite}`}>
          <div className={`${styles.printIcon}`}></div>
          <p>印刷</p>
        </button>
        <button onClick={share} className={`${bStyles.btn} ${bStyles.btnMWhite}`}>
          <div className={`${styles.shareIcon}`}></div>
          <p>シェア</p>
        </button>
        {isMyRecipe && (
          <>
            <button onClick={deleteRecipe} className={`${bStyles.btn} ${bStyles.btnMWhite}`}>
              <div className={`${styles.trashIcon}`}></div>
              <p className={`${tStyles.secRed}`}>削除</p>
            </button>
            <button onClick={() => editRecipe(recipe._id)} className={`${bStyles.btn} ${bStyles.btnMWhite}`}>
              <div className={`${styles.editIcon}`}></div>
              <p>編集</p>
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default Buttons
