import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import axios from 'axios';
import { AUTH_CONFIG } from '../auth/auth.config';

const router = Router();
const HOLDING_SPACE_SERVICE_URL = AUTH_CONFIG.HOLDING_SPACE_SERVICE_URL;

router.post('/share', requireAuth, async (req, res) => {
    try {
        const { entryId, content } = req.body;

        if (!entryId || typeof entryId !== 'string') {
            return res.status(400).json({ success: false, error: 'Invalid entryId' });
        }

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid content' });
        }

        // Forward to Holding Space Service to create the post
        // We explicitly set visibility to 'ghost' to maintain the "ghost mode default" invariant
        const payload = {
            content: content.trim(),
            visibility: 'ghost',
        };

        const url = `${HOLDING_SPACE_SERVICE_URL}/v1/shares`;

        console.log(`[Unspoken] Forwarding share request to Holding Space Service (entryId: ${entryId})`);

        const response = await axios.post(url, payload, {
            headers: {
                Authorization: req.headers.authorization
            }
        });

        // The holding space service might return the ID in different formats depending on the DB
        const postId = response.data.id || response.data._id || response.data.shareId;

        res.status(201).json({
            success: true,
            postId: postId
        });

    } catch (error: any) {
        console.error('❌ [Unspoken] Share to Holding Space failed:', error.message);
        if (error.response) {
            console.error('   - Status:', error.response.status);
            console.error('   - Data:', error.response.data);
        }

        // We return a generic error to the client to prevent leaking internal stack traces or service details
        res.status(500).json({
            success: false,
            error: 'Failed to share to Holding Space. Please try again later.'
        });
    }
});

export default router;
