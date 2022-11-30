import { Types, model, Schema, Document, Query } from 'mongoose'

interface followSchemaFields {
  follower: Types.ObjectId
  followed: Types.ObjectId
}

const followSchema = new Schema<followSchemaFields>({
  follower: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  followed: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
})

const Follow = model<followSchemaFields>('follow', followSchema)

export default Follow
