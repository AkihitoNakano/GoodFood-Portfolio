import { Types, Schema, model } from 'mongoose'

export interface CommentSchemaFields {
  _id: Types.ObjectId
  creator: Types.ObjectId
  recipeId: Types.ObjectId
  responseId: Types.ObjectId
  comment: string
  createdAt: Date
}

const commentSchema = new Schema<CommentSchemaFields>({
  creator: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Recipe',
  },
  responseId: {
    type: Schema.Types.ObjectId,
  },
  comment: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
})

const Comment = model<CommentSchemaFields>('comment', commentSchema)

export default Comment
