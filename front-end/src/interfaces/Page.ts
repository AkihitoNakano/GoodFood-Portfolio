export interface Page {
  _id: string
  pageName: string
  divisionNum: number
  creator: string
  recipeIds: string[]
  createdAt: Date
  updatedAt: Date
}

export type DivType = 1 | 4 | 6
