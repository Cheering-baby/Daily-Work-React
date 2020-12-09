import UAAService from '@/uaa-npm';

const localPath = process.env.NODE_ENV === 'development' ? '' : '';
const mock = 'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS'
export async function queryPluAttribute(params) {
  return UAAService.request(`${localPath}/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryPluListByCondition(params) {
  return UAAService.request(`${localPath}/b2c/product/v1/product/attraction/query`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function createShoppingCart(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/shoppingcart/create`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryShoppingCart(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/shoppingcart/query`, {
    method: 'GET',
    params,
    body: {
      ...params,
    },
  });
}

export async function addToShoppingCart(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/shoppingcart/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeShoppingCart(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/shoppingcart/remove`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function clearShoppingCart(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/shoppingcart/clear`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function calculateOrderOfferPrice(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/booking/calculate`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
