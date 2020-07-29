import UAAService from '@/uaa-npm';

const localPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';
const mock = 'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS';

export async function queryAgentOpt(params) {
  return UAAService.request(`/agent/common/queryAgentOpt?queryType=${params.queryType}`, {
    method: 'GET',
  });
}

export async function queryCountry(params) {
  return UAAService.request(`${localPath}/b2c/customer/v1/domain/query`, {
    method: 'GET',
    params,
    body: {
      ...params,
    },
  });
}

export async function queryPluAttribute(params) {
  return UAAService.request(`${localPath}/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryOfferList(params) {
  return UAAService.request(`${mock}/b2b/product/v1/offer/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryOfferDetail(params) {
  return UAAService.request(`${mock}/b2b/product/v1/offer/detail`, {
    method: 'GET',
    params,
    body: {
      ...params,
    },
  });
}

export async function queryPeakDateList(params) {
  return UAAService.request(`${localPath}/b2b/product/v1/configuration/queryPeakDateList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryOfferBookingCategory(params) {
  return UAAService.request(`${localPath}/b2b/product/v1/offer/portalBookingCategory`, {
    method: 'GET',
    params,
    body: {
      ...params,
    },
  });
}
