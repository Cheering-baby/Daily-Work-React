import UAAService from '@/uaa-npm';

const urlPathPrefix = '/proxy/ali/pams/account';

/* eslint-disable */
export function queryAccount(params) {
  return UAAService.request(`${urlPathPrefix}/queryAccountDetail`, {
    method: 'GET',
    params: params,
  });
}

export function search(params) {
  return UAAService.request(`${urlPathPrefix}/queryAccountFlow`, {
    method: 'GET',
    params: params,
  });
}

export function queryTransactonTypes() {
  return UAAService.request(`${urlPathPrefix}/queryTransactionTypes`, {
    method: 'GET',
  });
}

export function queryWalletTypes() {
  return UAAService.request(`${urlPathPrefix}/queryWalletTypes`, {
    method: 'GET',
  });
}

export function invoiceDetail(params) {
  return UAAService.request(`${urlPathPrefix}/invoiceDetail`, {
    method: 'GET',
    params: params,
  });
}
