import UAAService from '@/uaa-npm';

const dev = 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams';
const mock =
  'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e1c1fb0f5006f0021bfc342/PAMS';
const uaaPath = process.env.NODE_ENV === 'development' ? dev : '';

const uaaPathWithMock = process.env.NODE_ENV === 'development' ? mock : '';

const localPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';

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

export async function queryInfoWithNoId(taId) {
  return UAAService.request(`/b2b/agent/v1/profile/queryInfoWithNoId`, {
    method: 'GET',
  });
}

export async function queryTaInfo(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryTaInfo?taId=${params.taId}`, {
    method: 'GET',
  });
}

export async function querySubTaInfo(params) {
  return UAAService.request(`/b2b/agent/v1/subprofile/querySubTaInfo?subTaId=${params.subTaId}`, {
    method: 'GET',
  });
}
