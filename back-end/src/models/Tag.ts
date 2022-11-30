import { Types, Schema, model } from 'mongoose'

export interface tagSchemaFields {
  _id: Types.ObjectId
  tagName: string[]
  timestamps: Date
}

const tagSchema = new Schema<tagSchemaFields>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
    tagName: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
)

const Tag = model<tagSchemaFields>('tag', tagSchema)

export default Tag
