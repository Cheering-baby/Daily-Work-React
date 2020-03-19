import UAAService from '@/uaa-npm';
import { isNvl } from '@/utils/utils';

export async function registrationSubTaInfo(params) {
  return UAAService.request(`/proxy/ali/b2b/subprofile/subTARegistration`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function querySubTaInfo(params) {
  return UAAService.request(`/proxy/ali/b2b/subprofile/querySubTaInfo?subTaId=${params.subTaId}`, {
    method: 'GET',
  });
}

export async function querySubTaInfoWithNoId() {
  return UAAService.request(`/proxy/ali/b2b/subprofile/querySubInfoWithNoId`, {
    method: 'GET',
  });
}

export async function querySubTaInfoWithMask(params) {
  return UAAService.request(
    `/proxy/ali/b2b/subprofile/querySubTaInfoWithMask?subTaId=${params.subTaId}`,
    {
      method: 'GET',
    }
  );
}

export async function querySubTaInfoWithEmail(params) {
  let emailUrl = `/proxy/ali/b2b/subprofile/fetchInfoByMail?email=${params.email}`;
  if (!isNvl(params.subTaId)) {
    emailUrl += `&subTaId=${params.subTaId}`;
  }
  return UAAService.request(emailUrl, { method: 'GET' });
}

export async function queryDictionary(params) {
  return UAAService.request(
    `/agent/common/queryDictionary?dictType=${params.dictType}&dictSubType=${params.dictSubType}`,
    {
      method: 'GET',
    }
  );
}
