import { ISupport } from '../models/Support';
import { SupportDTO } from '@hold-yourself/types';

/**
 * Strict serializer for Support documents.
 * Prevents internal fields exposure.
 */
export const serializeSupport = (support: ISupport): SupportDTO => {
  return {
    id: support._id.toString(),
    shareId: support.shareId.toString(),
    type: support.type,
    createdAt: support.createdAt.toISOString(),
  };
};
