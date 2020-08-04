export interface Result<T = any> {
  resultCode: string;
  resultMsg: string;
  result: T;
}

export interface BaseResponse<T = any> {
   data: T,
   errorMsg: any;
   filename: string,
   file: Blob,
   success: boolean,
}