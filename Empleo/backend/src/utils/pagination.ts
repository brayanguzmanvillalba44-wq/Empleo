import { QueryParams } from '../types';

export function getPaginationParams(query: QueryParams) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || '10', 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function getSortParams(query: QueryParams) {
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder || 'desc';
  return { [sortBy]: sortOrder };
}

