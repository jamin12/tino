export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: Pagination;
};
