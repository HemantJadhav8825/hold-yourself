import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: string[]; // User IDs
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    participants: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (v: string[]) => v.length === 2,
          message: 'A conversation must have exactly 2 participants.',
        },
        {
          validator: (v: string[]) => new Set(v).size === v.length,
          message: 'Participants must be unique.',
        }
      ],
    },
    lastMessageAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for quick participant lookup
ConversationSchema.index({ participants: 1 });

export const ConversationModel = mongoose.model<IConversation>('Conversation', ConversationSchema);
