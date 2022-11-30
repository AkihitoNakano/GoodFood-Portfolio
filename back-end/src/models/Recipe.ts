import { model, Model, Schema, Types, Document } from 'mongoose'

export interface RecipeFields extends Document {
  _id: Types.ObjectId
  owner: Types.ObjectId
  title: string
  describe: string
  cookTime: number
  img: string
  ingredients: { name: string; amount: string }[]
  flavors: { name: string; amount: string }[]
  steps: string[]
  timestamps: Date
}

const recipeSchema = new Schema<RecipeFields>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    describe: {
      type: String,
    },
    cookTime: {
      type: Number,
    },
    img: {
      type: String,
    },
    ingredients: [{ name: { type: String }, amount: { type: String } }],
    flavors: [{ name: { type: String }, amount: { type: String } }],
    steps: [{ type: String }],
  },
  { timestamps: true }
)

const Recipe = model<RecipeFields>('Recipe', recipeSchema)

export default Recipe
