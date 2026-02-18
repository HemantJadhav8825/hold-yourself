import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSafeRedirect } from '@/utils/security';

/**
 * Hook to enforce authentication for specific actions.
 * If the user is unauthenticated, it redirects them to login
 * with a `redirect` parameter pointing back to the current page.
 *
 * Usage:
 * const { requireAuth } = useRequireAuth();
 * 
 * const handleAction = () => {
 *   if (!requireAuth()) return;
 *   // perform action
 * };
 */
export function useRequireAuth() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const requireAuth = useCallback((customRedirectPath?: string) => {
        if (!user) {
            const rawTarget = customRedirectPath || pathname;
            const target = getSafeRedirect(rawTarget);
            const redirectUrl = `/login?redirect=${encodeURIComponent(target)}`;
            router.push(redirectUrl);
            return false;
        }
        return true;
    }, [user, router, pathname]);

    return { requireAuth };
}
