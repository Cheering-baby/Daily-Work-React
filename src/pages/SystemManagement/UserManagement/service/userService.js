import UAAService from '@/uaa-npm';

const rwsUrl = 'http://10.25.159.206:18091/pams';
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

export async function queryAllCompany() {
  return UAAService.request(
    `/b2b/agent/v1/profile/queryAllCompanyConfig?showColumnName=companyName`,
    {
      method: 'GET',
    }
  );
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
