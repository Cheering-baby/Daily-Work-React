import UAAService from '@/uaa-npm';

export async function queryUserRolesByCondition(params) {
  return UAAService.request(`/b2b/user/v1/role/queryUserRolesByCondition`, {
    params,
    method: 'GET',
  });
}

export async function addUserRole(params) {
  return UAAService.request(`/b2b/user/v1/role/addUserRole`, {
    body: params,
    method: 'POST',
  });
}

export async function modifyUserRole(params) {
  return UAAService.request(`/b2b/user/v1/role/modifyUserRole`, {
    body: params,
    method: 'POST',
  });
}

export async function queryMenuTree(params) {
  return UAAService.request(`/b2b/user/v1/menu/queryMenuTree`, {
    params,
    method: 'GET',
  });
}

export async function queryUserRoleDetail(params) {
  return UAAService.request(`/b2b/user/v1/role/queryUserRoleDetail`, {
    params,
    method: 'GET',
  });
}

export async function queryAllPrivileges(params) {
  return UAAService.request(`/b2b/user/v1/role/queryAllPrivileges`, {
    params,
    method: 'GET',
  });
}

export async function operUserPrivileges(params) {
  return UAAService.request(`/b2b/user/v1/role/operUserPrivileges`, {
    body: params,
    method: 'POST',
  });
}
