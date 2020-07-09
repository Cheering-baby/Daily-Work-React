import UAAService from '@/uaa-npm';
import { isNvl } from '@/utils/utils';

const mock =
  'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS';
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
  let emailUrl = `${mock}/b2b/agent/v1/subprofile/fetchInfoByMail?email=${params.email}`;
  if (!isNvl(params.subTaId)) {
    emailUrl += `&subTaId=${params.subTaId}`;
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
