import { Types, Schema, model } from 'mongoose'

export interface StateSchemaFields {
  _id: Types.ObjectId
  email: string
  accountName: string
  state: 'new' | 'change'
  timestamp: Date
}

const stateSchema = new Schema<StateSchemaFields>(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    accountName: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  { timestamps: true }
)

const State = model<StateSchemaFields>('state', stateSchema)

export default State
