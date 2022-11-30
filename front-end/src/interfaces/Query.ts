import { ParsedUrlQuery } from 'node:querystring'

export type InputSearchText = string | string[] | undefined

export const ContentType = {
  editProf: 'editProfile',
  changePass: 'changePassword',
  favs: 'favs',
  follow: 'follow',
  myRecipe: 'myRecipe',
  createRecipe: 'createRecipe',
  editRecipe: 'editRecipe',
  page: 'page',
  createPage: 'createPage',
  editPage: 'editPage',
  account: 'account',
}
