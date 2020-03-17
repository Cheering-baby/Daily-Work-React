import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const urlPathPrefix = '/proxy/ali/b2b/account';

export function queryAccount(params) {
  return UAAService.request(`${urlPathPrefix}/queryAccountDetail`, {
    method: 'GET',
    params,
  });
}

export function search(params) {
  return UAAService.request(
    `${urlPathPrefix}/queryAccountFlow?${stringify(params, { arrayFormat: 'repeat' })}`,
    {
      method: 'GET',
    }
  );
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
    params,
  });
}

export function topup(params) {
  return UAAService.request(`${urlPathPrefix}/topup`, {
    method: 'POST',
    body: params,
  });
}

export function createActivity(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/activity/create`, {
    method: 'POST',
    body: params,
  });
}

export async function queryActivityList(data) {
  return UAAService.request(
    `/proxy/ali/b2b/user/v1/activity/queryActivityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}
