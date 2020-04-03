import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const rwsUrl = 'http://10.25.159.236:18091/pams';
export async function queryMainTAList(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryTaList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateProfileStatus(params) {
  return UAAService.request(`/b2b/agent/v1/profile/updateProfileStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function registerContractFile(params) {
  return UAAService.request(`/b2b/agent/v1/contract/registerContractFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export function offer(params) {
  return UAAService.request(`/pams/api/v1/offer/offeridentify/queryOfferList`, {
    method: 'POST',
    body: params,
  });
}

export async function addOfferList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/binding/queryCommodityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function queryCommodityBindingList(params) {
  const url = `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/binding/queryCommodityBindingList?${stringify(
    params
  )}`;
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function queryContractHistoryList(params) {
  return UAAService.request(`/b2b/agent/v1/contract/queryContractHistoryList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryProfileStatusHistoryList(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryProfileStatusHistory`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function add(params) {
  const url = `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/binding/saveCommissionBindingList`;
  return UAAService.request(url, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
