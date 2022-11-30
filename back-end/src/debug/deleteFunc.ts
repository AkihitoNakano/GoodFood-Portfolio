import Recipe from '../models/Recipe'
import Comment from '../models/Comment'
import Fav from '../models/Fav'
import Tag from '../models/Tag'
import Page from '../models/Page'

export const deleteAllRecipes = async () => {
  try {
    await Recipe.deleteMany({})
    await Comment.deleteMany({})
    await Fav.deleteMany({})
    await Tag.deleteMany({})
    await Page.deleteMany({})
  } catch (err) {
    console.log(err)
  }
}
