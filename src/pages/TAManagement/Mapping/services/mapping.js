import UAAService from '@/uaa-npm';

export async function mappingList(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryMappingList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// export async function like(filter, pagination) {
//   const paramstring = stringify({
//     'pageInfo.pageSize': pagination.pageSize,
//     'pageInfo.currentPage': pagination.currentPage,
//     'pageInfo.idOrName': pagination.idOrName,
//     'pageInfo.applicationBeginDate': pagination.applicationBeginDate,
//     'pageInfo.applicationEndDate': pagination.applicationEndDate,
//     'pageInfo.status': pagination.status,
//   });
//   const url = `/b2b/profile/queryMappingList?${paramstring}`;
//   return UAAService.request(url, {
//     method: 'GET',
//   });
// }

export async function queryDictionary(params) {
  let url = `/agent/common/queryDictionary?dictType=${params.dictType}`;
  if (params.dictSubType) {
    url += `&dictSubType=${params.dictSubType}`;
  }
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function queryMappingDetail(taId) {
  return UAAService.request(`/b2b/agent/v1/profile/queryMappingInfo?taId=${taId}`, {
    method: 'GET',
  });
}

export async function endInvitation(params) {
  return UAAService.request(`/b2b/agent/v1/profile/registerMappingInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function querySalePerson() {
  return UAAService.request(`/b2b/user/v1/user/querySalePersons`, {
    method: 'GET',
  });
}

export async function registerMappingInfo() {
  return UAAService.request(`/b2b/agent/v1/profile/registerMappingInfo`, {
    method: 'POST',
    body: {},
  });
}
