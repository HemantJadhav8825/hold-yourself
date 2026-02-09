import { Router, Request, Response } from 'express';
import { assertChronologicalOnly } from '../guardrails';

const router = Router();

/**
 * GET /shares
 * Returns a list of shares, enforced to be chronological.
 */
router.get('/shares', (req: Request, res: Response) => {
  const { sort, order } = req.query as { sort?: string; order?: string };

  try {
    // Chronological ordering is mandatory for emotional safety.
    assertChronologicalOnly({ sort, order });

    // Explicitly enforce chronological sort in the logic (v0 returns empty array)
    const shares: any[] = []; // Explicitly sort by createdAt DESC in future DB query

    res.json({
      success: true,
      data: shares,
      message: 'Chronological feed retrieved successfully.'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
