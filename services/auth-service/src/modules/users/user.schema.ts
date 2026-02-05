import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username?: string;
  displayName?: string;
  bio?: string;
  passwordHash?: string;
  authProvider: 'email' | 'google';
  googleId?: string;
  avatar?: string;
  role: string;
  scopes: string[];
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    displayName: { type: String },
    bio: { type: String },
    passwordHash: { type: String, required: false },
    authProvider: { type: String, required: true, enum: ['email', 'google'], default: 'email' },
    googleId: { type: String, index: { unique: true, sparse: true } },
    avatar: { type: String },
    role: { type: String, required: true },
    scopes: { type: [String], default: [] },
    isRevoked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
