import { Types } from 'mongoose'
import Recipe, { RecipeFields } from '../../models/Recipe'
import { tagSchemaFields } from '../../models/Tag'
import { ErrorOutput } from './errInterface'

export interface RecipeContents {
  title: string
  cookTime: number
  img: string
  ingredients: { name: string; amount: string }[]
  flavors: { name: string; amount: string }[]
  steps: string[]
}

// レシピクラスのベース
export class BaseRecipe {
  constructor(readonly userId: Types.ObjectId) {}
}

//レシピを新規作成する
export class CreateRecipe extends BaseRecipe {
  readonly body
  constructor(readonly userId: Types.ObjectId, body: RecipeContents) {
    super(userId)
    this.body = body
  }

  async create(): Promise<RecipeFields> {
    const recipe: RecipeFields = await Recipe.create({ ...this.body, owner: this.userId })

    if (!recipe) {
      const err = new ErrorOutput(400, 'レシピが作成できませんでした')
      throw new Error(err.errContent)
    }
    return recipe
  }
}

// レシピIDからレシピを見つける
export class FindRecipe extends BaseRecipe {
  constructor(readonly userId: Types.ObjectId, readonly recipeId: string) {
    super(userId)
  }

  // レシピを見つける
  public static async getRecipe(id: string): Promise<RecipeFields | null> {
    return await Recipe.findOne({ _id: id })
  }
}

// レシピを編集して更新する
export class UpdateAndDelRecipe extends FindRecipe {
  myRecipe: RecipeFields | null
  constructor(readonly userId: Types.ObjectId, readonly recipeId: string) {
    super(userId, recipeId)
    this.myRecipe = null
  }

  // 初期子myRecipeにレシピデータを入れてclassを返す
  async build(): Promise<UpdateAndDelRecipe> {
    const recipe = new UpdateAndDelRecipe(this.userId, this.recipeId)
    recipe.myRecipe = await Recipe.findOne({ _id: this.recipeId })
    return recipe
  }

  async checkRecipe(): Promise<void | Error> {
    const myRecipe = await Recipe.findOne({ _id: this.recipeId })
    if (!myRecipe) {
      const err = new ErrorOutput(404, 'レシピが見つかりませんでした')
      throw new Error(err.errContent)
    } else {
      //　レシピを作ったオーナーであるかどうか
      // TODO: 他ユーザーを使って検証が必要
      if (!this.isCreatedByYou(myRecipe)) {
        const err = new ErrorOutput(403, '許可されていません')
        throw new Error(err.errContent)
      }
    }
  }

  // オーナが作成したかどうか
  isCreatedByYou(recipe: RecipeFields): boolean {
    return recipe.owner.toString() === this.userId.toString()
  }

  // レシピの内容を更新する
  async updateRecipe(body: tagSchemaFields): Promise<void> {
    const updatedRecipe = await Recipe.findByIdAndUpdate({ _id: this.recipeId }, { ...body })

    if (!updatedRecipe) {
      const err = new ErrorOutput(404, 'レシピが更新できませんでした')
      throw new Error(err.errContent)
    }
  }

  // レシピを削除する
  // 単体削除
  async delete(): Promise<void> {
    await Recipe.deleteOne({ _id: this.myRecipe!._id })
  }
}
