import axios from 'axios'
import { ErrorUpdateContext } from 'interfaces/Error'
import { RecipeCard } from 'interfaces/Recipe'
import { catchErrorFromAPI } from 'functions/error/errorHandle'

// レシピを取得する bodyにデータは含めない
export const getRecipes = async (errorUpdateContext: ErrorUpdateContext, URL: string) => {
  try {
    const recipes: RecipeCard[] = await axios.get(URL).then(res => res.data)
    // console.log('recipesFunc', recipes)
    return recipes
  } catch (e: any) {
    catchErrorFromAPI(e, errorUpdateContext)
  }
}

// レシピの数を返す
export const getTotalNumber = async (errorUpdateContext: ErrorUpdateContext, URL: string) => {
  try {
    const totalNum: number = await axios.get(URL).then(res => res.data)
    return totalNum
  } catch (e: any) {
    catchErrorFromAPI(e, errorUpdateContext)
  }
}
