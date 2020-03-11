import UAAService from '@/uaa-npm';

export async function queryUserRolesByCondition(params) {
  return UAAService.request(`/proxy/ali/pams/user/v1/role/queryUserRolesByCondition`, {
    params,
    method: 'GET',
  });
}

export async function addUserRole(params) {
  return UAAService.request(`/proxy/ali/pams/user/v1/role/addUserRole`, {
    body: params,
    method: 'POST',
  });
}

export async function modifyUserRole(params) {
  return UAAService.request(`/proxy/ali/pams/user/v1/role/modifyUserRole`, {
    body: params,
    method: 'POST',
  });
}

export async function queryMenuTree(params) {
  return UAAService.request(`/proxy/ali/pams/user/v1/menu/queryMenuTree`, {
    params,
    method: 'GET',
  });
}
