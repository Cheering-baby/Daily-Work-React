import UAAService from '@/uaa-npm';
import { isNvl } from '@/utils/utils';

export async function registrationSubTaInfo(params) {
  return UAAService.request(`/b2b/agent/v1/subprofile/subTARegistration`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modifySubTaInfo(params) {
  return UAAService.request(`/b2b/agent/v1/subprofile/modifySubTaInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
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

export async function querySubTaInfoWithNoId() {
  return UAAService.request(`/b2b/agent/v1/subprofile/querySubInfoWithNoId`, {
    method: 'GET',
  });
}

export async function querySubTaInfoWithMask(params) {
  return UAAService.request(
    `/b2b/agent/v1/subprofile/querySubTaInfoWithMask?subTaId=${params.subTaId}`,
    {
      method: 'GET',
    }
  );
}

export async function querySubTaInfoWithEmail(params) {
  let emailUrl = `/b2b/agent/v1/subprofile/fetchInfoByMail?taId=${params.taId}&signature=${params.signature}&scene=sendInvitation`;
  if (!isNvl(params.email)) {
    emailUrl += `&email=${params.email}`;
  }
  if (!isNvl(params.companyName)) {
    emailUrl += `&companyName=${params.companyName}`;
  }
  return UAAService.requestByRT(emailUrl, { method: 'GET' });
}

export async function queryDictionary(params) {
  return UAAService.request(
    `/agent/common/queryDictionary?dictType=${params.dictType}&dictSubType=${params.dictSubType}`,
    {
      method: 'GET',
    }
  );
}
