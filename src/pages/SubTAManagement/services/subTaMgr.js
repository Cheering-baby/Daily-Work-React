import UAAService from '@/uaa-npm';

export async function registrationSubTaInfo(params) {
  return UAAService.request(`/subprofile/subTARegistration`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function querySubTaInfo(params) {
  return UAAService.request(`/proxy/ali/pams/subprofile/querySubTaInfo?subTaId=${params.subTaId}`, {
    method: 'GET',
  });
}

export async function querySubTaInfoWithNoId() {
  return UAAService.request(`/subprofile/querySubInfoWithNoId`, {
    method: 'GET',
  });
}

export async function querySubTaInfoWithMask(params) {
  return UAAService.request(`/subprofile/querySubTaInfoWithMask?subTaId=${params.subTaId}`, {
    method: 'GET',
  });
}

export async function queryDictionary(params) {
  return UAAService.request(
    `/common/queryDictionary?dictType=${params.dictType}&dictSubType=${params.dictSubType}`,
    {
      method: 'GET',
    }
  );
}
