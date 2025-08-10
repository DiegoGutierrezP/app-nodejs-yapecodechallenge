export class BaseResponse<T> {
  data: T;
  code?: number;
  message?: string;
}
