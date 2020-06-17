import { stringify } from 'qs';
import axios from 'axios';
import UAAService from '@/uaa-npm';

// export async function queryGrantOffer(params) {
//   const url = `/b2b/agent/v1/commission/binding/queryGrantBindingList`;
//   return UAAService.request(url, {
//     method: 'POST',
//     body: {
//       ...params,
//     },
//   });
// }

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

export async function queryCommodityList(params) {
  const url = `/b2b/agent/v1/commission/binding/queryCommodityList?${stringify(params)}`;
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function queryAgentBindingList(params) {
  const url = `/b2b/agent/v1/commission/binding/queryAgentBindingList?${stringify(params)}`;
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function queryCommodityBindingList(params) {
  const url = `/b2b/agent/v1/commission/binding/queryCommodityBindingList?${stringify(params)}`;
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
  const url = `/b2b/agent/v1/commission/binding/batchSaveAgentBindingList`;
  return UAAService.request(url, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export function queryGrantOffer(params) {
  return axios({
    url: `/b2b/agent/v1/commission/binding/queryGrantBindingList`,
    method: 'POST',
    data: params,
  });
}
