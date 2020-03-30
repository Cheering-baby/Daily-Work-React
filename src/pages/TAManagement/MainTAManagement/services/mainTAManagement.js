import UAAService from '@/uaa-npm';

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

export async function addOfferList(requestData) {
  const paramstring = stringify({
    pageSize: requestData.pageSize,
    currentPage: requestData.currentPage,
    bindingId: requestData.bindingId,
    bindingType: requestData.bindingType,
    commodityType: requestData.commodityType,
    commonSearchText: requestData.commonSearchText,
    themeParkCode: requestData.themeParkCode,
  });
  const url = `${lzqUrl}/pams/proxy/ali/b2b/api/v1/agent/commission/binding/queryCommodityList?${paramstring}`;
  return UAAService.request(url, {
    method: 'GET',
  });
}

export function queryCommodityList() {
  return UAAService.request(`/pams/api/v1/agent/commission/binding/queryCommodityList`, {
    method: 'GET',
  });
  // export async function queryAgentBindingList(params) {
  //   const params2 = stringify({
  //     'pageSize': params.pageSize,
  //     'currentPage': params.currentPage,
  //     'agentId': params.agentId,
  //     'bindingType': params.bindingType,
  //   });
  //   const url = `${lzqUrl}/pams/proxy/ali/b2b/api/v1/agent/commission/binding/queryAgentBindingList?${params2}`;
  //   return UAAService.request(url, {
  //     method: 'GET',
  //   });
}

export async function saveCommissionBindingList() {
  const url = `${lzqUrl}/pams/proxy/ali/b2b/api/v1/agent//pams/api/v1/agent/commission/binding/saveCommissionBindingList`;
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function queryAgentBindingList(params) {
  const params2 = stringify({
    pageSize: params.pageSize,
    currentPage: params.currentPage,
    agentId: params.agentId,
    bindingType: params.bindingType,
  });
  const url = `${lzqUrl}/pams/proxy/ali/b2b/api/v1/agent/commission/binding/queryAgentBindingList?${params2}`;
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
