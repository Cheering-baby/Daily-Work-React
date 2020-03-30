import UAAService from '@/uaa-npm';

export async function querySubTAList(params) {
  return UAAService.request(`/b2b/agent/v1/subprofile/querySubTaList`, {
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

export async function queryProfileStatusHistoryList(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryProfileStatusHistory`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
