import UAAService from '@/uaa-npm';

export async function queryUsersByCondition(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/user/queryUsersByCondition`, {
    params,
    method: 'GET',
  });
}

export async function addTAUser(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/user/addTAUser`, {
    body: params,
    method: 'POST',
  });
}

export async function modifyUser(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/user/modifyUser`, {
    body: params,
    method: 'POST',
  });
}

export async function queryAllCompany() {
  return UAAService.request(
    `/proxy/ali/b2b/profile/queryAllCompanyConfig?showColumnName=companyName`,
    {
      method: 'GET',
    }
  );
}

export async function queryUsersInCompany(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/user/queryUsersInCompany`, {
    params,
    method: 'GET',
  });
}

export async function queryUserRolesByCondition(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/role/queryUserRolesByCondition`, {
    params,
    method: 'GET',
  });
}

export async function querySubTaCompany(params) {
  // TODO
  return UAAService.request(
    `/proxy/ali/b2b/profile/queryAllCompanyConfig?showColumnName=companyName`,
    {
      params,
      method: 'GET',
    }
  );
}
