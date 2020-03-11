import UAAService from '@/uaa-npm';

const dev = 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams';
const mock =
  'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e1c1fb0f5006f0021bfc342/PAMS';
const uaaPath = process.env.NODE_ENV === 'development' ? dev : '';

const uaaPathWithMock = process.env.NODE_ENV === 'development' ? mock : '';

export async function registrationTaInfo(params) {
  return UAAService.request(`${uaaPath}/profile/TARegistration`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryTaInfo(params) {
  return UAAService.request(`${uaaPath}/profile/queryTaInfo`, {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export async function queryAttributeList(params) {
  return UAAService.request(
    `${uaaPathWithMock}/proxy/ali/cxm/rwscxm/api/v1/basicproduct/attributeConfig/queryAttributeListByCode`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    }
  );
}

export async function queryCountry(params) {
  return UAAService.request(
    `${uaaPathWithMock}/proxy/ali/cxm/rwscxm/api/v1/customer/common/domain_infos`,
    {
      method: 'GET',
      params,
      body: {
        ...params,
      },
    }
  );
}

export async function queryOfferList(params) {
  return UAAService.request(`${uaaPath}/proxy/ali/pams/product/v1/offer/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryOfferDetail(params) {
  return UAAService.request(`${uaaPath}/proxy/ali/pams/product/v1/offer/detail`, {
    method: 'GET',
    params,
    body: {
      ...params,
    },
  });
}
