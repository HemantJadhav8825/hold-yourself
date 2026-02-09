import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreference extends Document {
  userId: string;
  mutedTags: string[];
  updatedAt: Date;
}

const UserPreferenceSchema = new Schema<IUserPreference>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    mutedTags: { type: [String], default: [] },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

export const UserPreferenceModel = mongoose.model<IUserPreference>('UserPreference', UserPreferenceSchema);
