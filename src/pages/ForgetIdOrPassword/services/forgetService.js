import UAAService from '@/uaa-npm';

export async function forgetPassword(params) {
  return UAAService.request(`/b2b/user/v1/user/forgetPassword`, {
    body: params,
    method: 'POST',
  });
}

export async function queryUsersByEmail(params) {
  return UAAService.requestByRT(`/b2b/user/v1/user/queryUsersByEmail?email=${params}`, {
    method: 'GET',
  });
}
