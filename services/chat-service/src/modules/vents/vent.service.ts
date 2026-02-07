import { VentModel, IVent } from '../../models/vent.model';

export class VentService {
  async create(data: { 
    author: { id: string; pseudonym: string; color: string }; 
    circle: string; 
    content: string; 
    mood?: string 
  }): Promise<IVent> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    const vent = new VentModel({
      ...data,
      expiresAt,
      reactions: [],
    });
    return vent.save();
  }

  async findByCircle(circleId: string, limit: number = 20, offset: number = 0): Promise<IVent[]> {
    return VentModel.find({ circle: circleId })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async getRecentFeed(limit: number = 20): Promise<IVent[]> {
    return VentModel.find()
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async addReaction(ventId: string, userId: string, type: 'hug' | 'listen' | 'heart'): Promise<IVent | null> {
    return VentModel.findByIdAndUpdate(
      ventId,
      {
        $push: { reactions: { userId, type } },
      },
      { new: true }
    ).exec();
  }
}
