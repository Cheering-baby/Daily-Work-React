import UAAService from '@/uaa-npm';

export async function queryUserOrgTree(params) {
  return UAAService.request(`/b2b/user/v1/org/queryUserOrgTree`, {
    params,
    method: 'GET',
  });
}

export async function queryUsersInOrg(params) {
  return UAAService.request(`/b2b/user/v1/user/queryUsersInOrg`, {
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

export async function addUserOrg(params) {
  return UAAService.request(`/b2b/user/v1/org/addUserOrg`, {
    body: params,
    method: 'POST',
  });
}

export async function modifyUserOrg(params) {
  return UAAService.request(`/b2b/user/v1/org/modifyUserOrg`, {
    body: params,
    method: 'POST',
  });
}

export async function orgBatchAddUser(params) {
  return UAAService.request(`/b2b/user/v1/org/orgBatchAddUser`, {
    body: params,
    method: 'POST',
  });
}

export async function orgBatchRemoveUser(params) {
  return UAAService.request(`/b2b/user/v1/org/orgBatchRemoveUser`, {
    body: params,
    method: 'POST',
  });
}

export async function operateMoveUpOrg(params) {
  return UAAService.request(`/b2b/user/v1/org/operateMoveUpOrg`, {
    body: params,
    method: 'POST',
  });
}

export async function operateMoveDownOrg(params) {
  return UAAService.request(`/b2b/user/v1/org/operateMoveDownOrg`, {
    body: params,
    method: 'POST',
  });
}

export async function removeUserOrg(params) {
  return UAAService.request(`/b2b/user/v1/org/removeUserOrg`, {
    body: params,
    method: 'POST',
  });
}

export async function removeSubTARelation(params) {
  return UAAService.request(`/b2b/user/v1/org/removeSubTARelation`, {
    body: params,
    method: 'POST',
  });
}

export async function addSubTARelation(params) {
  return UAAService.request(`/b2b/user/v1/org/addSubTARelation`, {
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

export async function queryRootOrgByCompany(params) {
  return UAAService.request(`/b2b/user/v1/org/queryRootOrgByCompany`, {
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
