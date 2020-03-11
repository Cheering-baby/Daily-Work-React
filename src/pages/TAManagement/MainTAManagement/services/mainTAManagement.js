import UAAService from '@/uaa-npm';

/* eslint-disable */

export async function queryMainTAList(params) {
  return UAAService.request(`/proxy/ali/pams/profile/queryTaList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateProfileStatus(params) {
  return UAAService.request(`/proxy/ali/pams/profile/updateProfileStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function registerContractFile(params) {
  return UAAService.request(`/proxy/ali/pams/contract/registerContractFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryContractHistoryList(params) {
  return UAAService.request(`/proxy/ali/pams/contract/queryContractHistoryList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryProfileStatusHistoryList(params) {
  return UAAService.request(`/proxy/ali/pams/profile/queryProfileStatusHistory`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
