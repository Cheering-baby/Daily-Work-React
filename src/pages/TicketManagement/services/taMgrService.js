import UAAService from '@/uaa-npm';

export function queryAccount(params) {
  return UAAService.request(`/b2b/account/queryAccountDetail`, {
    method: 'GET',
    params,
  });
}

export async function queryAccountInfo(taId) {
  return UAAService.request(`/b2b/agent/v1/profile/queryAccountInfo?taId=${taId}`, {
    method: 'GET',
  });
}

export async function queryInfoWithNoId() {
  return UAAService.request(`/b2b/agent/v1/profile/queryInfoWithNoId`, {
    method: 'GET',
  });
}

export async function queryTaInfo(params) {
  return UAAService.requestByRT(`/b2b/agent/v1/profile/queryTaInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function querySubTaInfo(params) {
  return UAAService.requestByRT(
    `/b2b/agent/v1/subprofile/querySubTaInfo?subTaId=${params.subTaId}`,
    {
      method: 'GET',
    }
  );
}
