export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  location?: string;
  category?: string;
  type?: string;
  modality?: string;
  minSalary?: string;
  maxSalary?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

