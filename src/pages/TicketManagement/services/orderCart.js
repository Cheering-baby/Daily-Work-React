import UAAService from '@/uaa-npm';

const localPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';

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

export async function calculateOrderOfferPrice(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/booking/calculate`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
