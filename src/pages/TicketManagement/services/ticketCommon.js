import UAAService from '@/uaa-npm';

const dev = 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams';
const mock =
  'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e1c1fb0f5006f0021bfc342/PAMS';
const uaaPath = process.env.NODE_ENV === 'development' ? dev : window.location.origin;

const uaaPathWithMock = process.env.NODE_ENV === 'development' ? dev : window.location.origin;

const localPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';

export async function queryAttributeList(params) {
  return UAAService.request(
    `${localPath}/proxy/ali/cxm/rwscxm/api/v1/basicproduct/attributeConfig/queryAttributeListByCode`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    }
  );
}

export async function queryCountry(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2c/customer/v1/domain/query`, {
    method: 'GET',
    params,
    body: {
      ...params,
    },
  });
}

export async function queryOfferList(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2b/product/v1/offer/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryOfferDetail(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2b/product/v1/offer/detail`, {
    method: 'GET',
    params,
    body: {
      ...params,
    },
  });
}

export async function queryPeakDateList(params) {
  return UAAService.request(
    `${uaaPathWithMock}/proxy/ali/b2b/product/v1/configuration/queryPeakDateList`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    }
  );
}
