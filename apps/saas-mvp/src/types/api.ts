export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError = {
  ok: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
