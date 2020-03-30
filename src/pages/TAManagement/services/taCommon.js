import UAAService from '@/uaa-npm';
import { isNvl } from '@/utils/utils';

export async function registrationTaInfo(params) {
  return UAAService.request(`/b2b/agent/v1/profile/TARegistration`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modifyTaInfo(params) {
  return UAAService.request(`/b2b/agent/v1/profile/modifyTaInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryTaInfo(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryTaInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function queryInfoWithNoId() {
  return UAAService.request(`/b2b/agent/v1/profile/queryInfoWithNoId`, {
    method: 'GET',
  });
}

export async function queryTaInfoWithMask(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryTaInfoWithMask?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function checkCompanyExist(params) {
  let exitUrl = `/b2b/agent/v1/profile/checkCompanyExist?registrationNo=${params.registrationNo}`;
  if (!isNvl(params.taId)) {
    exitUrl += `&taId=${params.taId}`;
  }
  return UAAService.request(exitUrl, { method: 'GET' });
}

export async function queryTaMappingInfo(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryMappingInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function queryTaAccountInfo(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryAccountInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function queryDictionary(params) {
  let url = `/agent/common/queryDictionary?dictType=${params.dictType}`;
  if (params.dictSubType) {
    url += `&dictSubType=${params.dictSubType}`;
  }
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function queryAgentOpt(params) {
  return UAAService.request(`/agent/common/queryAgentOpt?queryType=${params.queryType}`, {
    method: 'GET',
  });
}

export async function queryUserDictionary(params) {
  return UAAService.request(`/userDictionary?dicType=${params.dicType}&dicName=${params.dicName}`, {
    method: 'GET',
  });
}

export async function querySalesPerson(params) {
  return UAAService.request(`/b2b/user/v1/user/querySalePersons?market=${params.market}`, {
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
