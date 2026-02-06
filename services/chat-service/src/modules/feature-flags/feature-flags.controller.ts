import { Request, Response } from 'express';
import { FeatureFlagsService } from './feature-flags.service';
import { structuredLog } from '@hold-yourself/utils';
import { FeatureFlags } from '../../config/feature-flags';

export class FeatureFlagsController {
  /**
   * GET /api/v1/admin/feature-flags
   * List all feature flags
   */
  public static async listFlags(req: Request, res: Response): Promise<void> {
    try {
      const flags = FeatureFlagsService.getAllFlags();
      
      structuredLog('info', 'feature_flags:list', 'Feature flags retrieved', {
        userId: (req as any).user?.sub,
      });

      res.json({ flags });
    } catch (error: any) {
      structuredLog('error', 'feature_flags:list_error', 'Error listing feature flags', {
        error: error.message,
        userId: (req as any).user?.sub,
      });
      res.status(500).json({ error: 'Failed to retrieve feature flags' });
    }
  }

  /**
   * PUT /api/v1/admin/feature-flags/:flagName
   * Update a specific feature flag
   */
  public static async updateFlag(req: Request, res: Response): Promise<void> {
    try {
      const { flagName } = req.params;
      const { enabled } = req.body;

      // Validate flag name
      const validFlags: (keyof FeatureFlags)[] = ['ENABLE_TYPING_INDICATORS', 'ENABLE_READ_RECEIPTS'];
      if (!validFlags.includes(flagName as keyof FeatureFlags)) {
        res.status(400).json({ error: 'Invalid flag name' });
        return;
      }

      // Validate enabled value
      if (typeof enabled !== 'boolean') {
        res.status(400).json({ error: 'enabled must be a boolean' });
        return;
      }

      const updatedFlags = FeatureFlagsService.updateFlag(flagName as keyof FeatureFlags, enabled);

      structuredLog('info', 'feature_flags:update', `Feature flag updated: ${flagName}`, {
        flagName,
        enabled,
        userId: (req as any).user?.sub,
      });

      res.json({ 
        message: `Feature flag ${flagName} updated successfully`,
        flags: updatedFlags 
      });
    } catch (error: any) {
      structuredLog('error', 'feature_flags:update_error', 'Error updating feature flag', {
        error: error.message,
        flagName: req.params.flagName,
        userId: (req as any).user?.sub,
      });
      res.status(500).json({ error: 'Failed to update feature flag' });
    }
  }
}
