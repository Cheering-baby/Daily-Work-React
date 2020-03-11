import UAAService from '@/uaa-npm';

export async function registrationTaInfo(params) {
  return UAAService.request(`/profile/TARegistration`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modifyTaInfo(params) {
  return UAAService.request(`/proxy/ali/pams/profile/modifyTaInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryTaInfo(params) {
  return UAAService.request(`/proxy/ali/pams/profile/queryTaInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function queryInfoWithNoId() {
  return UAAService.request(`/profile/queryInfoWithNoId`, {
    method: 'GET',
  });
}

export async function queryTaInfoWithMask(params) {
  return UAAService.request(`/profile/queryTaInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function queryTaMappingInfo(params) {
  return UAAService.request(`/proxy/ali/pams/profile/queryMappingInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function queryTaAccountInfo(params) {
  return UAAService.request(`/proxy/ali/pams/profile/queryAccountInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function queryDictionary(params) {
  return UAAService.request(
    `/common/queryDictionary?dictType=${params.dictType}&dictSubType=${params.dictSubType}`,
    {
      method: 'GET',
    }
  );
}

export async function queryUserDictionary(params) {
  return UAAService.request(`/userDictionary?dicType=${params.dicType}&dicName=${params.dicName}`, {
    method: 'GET',
  });
}

export async function querySalesPerson(params) {
  return UAAService.request(`/user/v1/user/querySalePersons?market=${params.market}`, {
    method: 'GET',
  });
}

export async function deleteFile(params) {
  return UAAService.request(`/common/deleteFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
