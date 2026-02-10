/**
 * HOLDING SPACE RULES:
 *
 * 1. No public metrics (likes, counts, views).
 * 2. No ranking or engagement scoring.
 * 3. Feed must ALWAYS be chronological.
 * 4. No trending logic.
 * 5. No virality mechanics.
 *
 * If any feature violates emotional safety principles,
 * it must not be implemented.
 */

/**
 * Ensures that the provided query options enforce chronological sorting.
 * Throws an error if sorting is not by 'createdAt' in 'DESC' order.
 * 
 * @param queryOptions - The query options to validate.
 * @throws Error if sorting principles are violated.
 */
export function assertChronologicalOnly(queryOptions: { sort?: string; order?: string }): void {
  const { sort, order } = queryOptions;

  // Emotional safety: Chronological sorting is non-negotiable.
  if (sort && sort !== 'createdAt') {
    throw new Error('Emotional Safety Violation: Feed must be sorted by createdAt only.');
  }

  if (order && order.toUpperCase() !== 'DESC') {
    throw new Error('Emotional Safety Violation: Feed order must be DESC to ensure latest presence.');
  }
}
