/**
 * Sanitizes a redirect path to prevent Open Redirect vulnerabilities.
 * Ensures the path is relative and starts with '/'.
 * Rejects protocol-relative URLs (//) and absolute URLs (http://, https://).
 *
 * @param path The candidate redirect path
 * @param defaultPath The fallback path (default: '/')
 * @returns A safe relative path
 */
export function getSafeRedirect(path: string | null | undefined, defaultPath: string = '/'): string {
    if (!path) return defaultPath;

    // Prevent protocol-relative URLs (//example.com)
    if (path.startsWith('//')) return defaultPath;

    // Prevent absolute URLs (http://, https://, etc.)
    if (path.includes('://')) return defaultPath;

    // Ensure it starts with /
    if (!path.startsWith('/')) return defaultPath;

    // Simple strict check: allow only if it looks like a pathname + query
    // We already checked it starts with /, doesn't have //, doesn't have ://

    return path;
}
