import UAAService from '@/uaa-npm';

export async function querySubTAList(params) {
  return UAAService.request(`/proxy/ali/pams/subprofile/querySubTaList`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function queryProfileStatusHistoryList(params) {
  return UAAService.request(`/proxy/ali/pams/profile/queryProfileStatusHistory`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
