import UAAService from '@/uaa-npm';

export async function queryUsersByCondition(params) {
  return UAAService.request(`/proxy/ali/pams/user/v1/user/queryUsersByCondition`, {
    params,
    method: 'GET',
  });
}

export async function addTAUser(params) {
  return UAAService.request(`/proxy/ali/pams/user/v1/user/addTAUser`, {
    body: params,
    method: 'POST',
  });
}

export async function modifyUser(params) {
  return UAAService.request(`/proxy/ali/pams/user/v1/user/modifyUser`, {
    body: params,
    method: 'POST',
  });
}
