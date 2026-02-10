import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserPreferenceModel } from '../models/UserPreference';

export class PreferenceController {
  /**
   * PATCH /preferences
   * Updates user muted tags.
   */
  async updatePreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.sub;
      const { mutedTags } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User ID not found in token' });
      }

      if (mutedTags !== undefined) {
        if (!Array.isArray(mutedTags)) {
          return res.status(400).json({ error: 'mutedTags must be an array of strings' });
        }

        // Constraints: Max 20 tags, trim, deduplicate
        const processedTags = [...new Set(
          mutedTags
            .map(t => String(t).trim().toLowerCase())
            .filter(t => t.length > 0)
        )].slice(0, 20);

        await UserPreferenceModel.findOneAndUpdate(
          { userId },
          { mutedTags: processedTags },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.json({ success: true, mutedTags: processedTags });
      }

      res.status(400).json({ error: 'No preferences provided to update' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /preferences
   * Retrieves user preferences.
   */
  async getPreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'User ID not found in token' });
      }

      let preference = await UserPreferenceModel.findOne({ userId });
      
      if (!preference) {
        preference = await UserPreferenceModel.create({ userId, mutedTags: [] });
      }

      res.json({ mutedTags: preference.mutedTags });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
