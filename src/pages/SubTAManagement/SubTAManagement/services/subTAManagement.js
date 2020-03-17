import UAAService from '@/uaa-npm';

export async function querySubTAList(params) {
  return UAAService.request(`/proxy/ali/b2b/subprofile/querySubTaList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateProfileStatus(params) {
  return UAAService.request(`/proxy/ali/b2b/profile/updateProfileStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryProfileStatusHistoryList(params) {
  return UAAService.request(`/proxy/ali/b2b/profile/queryProfileStatusHistory`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
