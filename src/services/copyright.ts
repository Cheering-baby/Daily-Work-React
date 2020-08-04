import UAAService from '@/uaa-npm';
import Axios, { AxiosResponse } from 'axios';
import { Result, BaseResponse } from '@/types';
import { SettingResult } from '@/types/settingResult';

/* eslint-disable */
/**
 *
 */
export async function queryDictionary(): Promise<BaseResponse<Result<SettingResult>>> {
  // return Axios.get('/b2b/user/v1/user/system/copyright/queryDictionary');
    return UAAService.request('/b2b/user/v1/user/system/copyright/queryDictionary');
}
export async function setDictionary(params: any): Promise<BaseResponse<Result<any>>> {
  const url = '/b2b/user/v1/user/system/copyright/setDictionary';
  // return Axios.post(url, params);
    return UAAService.request('/b2b/user/v1/user/system/copyright/setDictionary', {
      method: 'POST',
      body: params,
    });
}
export async function upload(data: any): Promise<BaseResponse<Result<any>>> {
  console.log(data)
  // return Axios.post('/common/upload',data)
  return UAAService.request(`/common/upload`, {
    method: 'POST',
    data,
    // headers: { 'Content-Type': 'multipart/form-data' },
  });
}
export async function uploadFile(
  code: 'termsConditions' | 'frequentlyAskedQuestions' | 'contactUs',
  file: any
): Promise<BaseResponse<any>> {
  const formData = new FormData();
  formData.append('code', code)
  formData.append('file', file)
  return Axios.post('/b2b/user/v1/user/system/copyright/uploadFile', formData);
}
export async function downloadFile(
  code: 'termsConditions' | 'frequentlyAskedQuestions' | 'contactUs'
): Promise<BaseResponse<any>> {
  return UAAService.request('/b2b/user/v1/user/system/copyright/downloadFile', {
    method: 'POST',
    responseType: 'blob',
    data: { code },
  });
}
