import { Types, Schema, model } from 'mongoose'

export interface FavSchemaFields {
  _id: Types.ObjectId
  recipeId: Types.ObjectId
  owner: Types.ObjectId
  timestamps: Date
}

const favSchema = new Schema<FavSchemaFields>(
  {
    recipeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
)

const Fav = model<FavSchemaFields>('fav', favSchema)

export default Fav
