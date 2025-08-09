export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  errorCode?: number;
  errorMessage?: string;
}