import { Types, Schema, model } from 'mongoose'

interface PageSchemaFields {
  _id: Types.ObjectId
  pageName: string
  divisionNum: number
  creator: Types.ObjectId
  recipeIds: Types.ObjectId[]
  timestamps: Date
}

const pageSchema = new Schema<PageSchemaFields>(
  {
    pageName: {
      type: String,
    },
    divisionNum: {
      type: Number,
      default: 1,
      minlength: 1,
      maxlength: 6,
    },
    creator: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    recipeIds: [Schema.Types.ObjectId],
  },
  { timestamps: true }
)

const Page = model<PageSchemaFields>('page', pageSchema)

export default Page
