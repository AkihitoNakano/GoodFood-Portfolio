import mongoose, { Document, model, Model, Schema, SchemaDefinition, Types } from 'mongoose'

export interface ProfileSchemaField {
  _id: Types.ObjectId
  accountName: string
  displayName: string
  avatar: string
  introduction: string
  owner: Types.ObjectId
  follows: Types.ObjectId[]
  followeds: Types.ObjectId[]
  links: { twitter: string; instagram: string; meta: string; another: string }
  timestamp: Date
}

const profileSchema = new Schema<ProfileSchemaField>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    accountName: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    displayName: {
      type: String,
      default: 'no name',
      maxLength: 50,
    },
    avatar: {
      type: String,
      trim: true,
    },
    introduction: {
      type: String,
      default: '',
    },
    links: {
      twitter: { type: String },
      instagram: { type: String },
      meta: { type: String },
      another: { type: String },
    },
  },
  { timestamps: true }
)

const Profile = model<ProfileSchemaField>('Profile', profileSchema)

export default Profile
