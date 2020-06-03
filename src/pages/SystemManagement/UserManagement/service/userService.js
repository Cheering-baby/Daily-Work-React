import UAAService from '@/uaa-npm';

export async function queryUsersByCondition(params) {
  return UAAService.request(`/b2b/user/v1/user/queryUsersByCondition`, {
    params,
    method: 'GET',
  });
}

export async function addTAUser(params) {
  return UAAService.request(`/b2b/user/v1/user/addTAUser`, {
    body: params,
    method: 'POST',
  });
}

export async function modifyUser(params) {
  return UAAService.request(`/b2b/user/v1/user/modifyUser`, {
    body: params,
    method: 'POST',
  });
}

export async function queryAllCompany(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryAllCompanyConfig`, {
    params,
    method: 'GET',
  });
}

export async function queryUsersInCompany(params) {
  return UAAService.request(`/b2b/user/v1/user/queryUsersInCompany`, {
    params,
    method: 'GET',
  });
}

export async function queryUserRolesByCondition(params) {
  return UAAService.request(`/b2b/user/v1/role/queryUserRolesByCondition`, {
    params,
    method: 'GET',
  });
}

export async function queryCompanyInfo(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryCompanyInfo`, {
    params,
    method: 'GET',
  });
}

export async function queryDictionary(params) {
  return UAAService.request(
    `/agent/common/queryDictionary?dictType=${params.dictType}&dictSubType=${params.dictSubType}`,
    {
      method: 'GET',
    }
  );
}

export async function sendEmail(params) {
  return UAAService.request(`/b2b/user/v1/user/sendEmail`, {
    body: params,
    method: 'POST',
  });
}

export async function resetPassword(params) {
  return UAAService.request(`/b2b/user/v1/user/resetPassword`, {
    body: params,
    method: 'POST',
  });
}
