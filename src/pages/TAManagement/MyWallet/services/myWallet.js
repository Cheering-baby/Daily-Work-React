import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const urlPathPrefix = '/b2b/account';
// const test = 'http://10.25.159.214:18091/pams';
// const urlPathPrefix = 'http://10.25.159.214:18091/pams/account';
// const urlPathPrefix = 'http://localhost:8000/pams/account';

export function queryAccount(params) {
  //
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
  return UAAService.request(`/b2b/user/v1/activity/create`, {
    method: 'POST',
    body: params,
  });
}

export async function queryActivityList(data) {
  return UAAService.request(`/b2b/user/v1/activity/queryActivityList?${stringify(data)}`, {
    method: 'GET',
  });
}

export async function invoiceDownload(params) {
  return UAAService.request(`${urlPathPrefix}/download/accountInvoice`, {
    method: 'GET',
    params,
  });
}
