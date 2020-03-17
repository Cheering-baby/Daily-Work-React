import UAAService from '@/uaa-npm';

const dev = 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams';
const mock =
  'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e1c1fb0f5006f0021bfc342/PAMS';
const uaaPath = process.env.NODE_ENV === 'development' ? dev : '';

const uaaPathWithMock = process.env.NODE_ENV === 'development' ? mock : '';

const localPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';

export async function queryPluAttribute(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryPluListByCondition(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2c/product/v1/product/attraction/query`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function createShoppingCart(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2c/transaction/v1/shoppingcart/createShoppingCart`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryShoppingCart(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2c/transaction/v1/shoppingcart/queryShoppingCart`, {
    method: 'GET',
    params,
    body: {
      ...params,
    },
  });
}

export async function addToShoppingCart(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2c/transaction/v1/shoppingcart/addToShoppingCart`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeShoppingCart(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2c/transaction/v1/shoppingcart/removeShoppingCart`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function calculateOrderOfferPrice(params) {
  return UAAService.request(`${localPath}/proxy/ali/b2c/transaction/v1/book/calculateBooking`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


