import {stringify} from "qs";
import UAAService from '@/uaa-npm';

export async function queryDictionary(params) {
  let url = `/agent/common/queryDictionary?dictType=${params.dictType}`;
  if (params.dictSubType) {
    url += `&dictSubType=${params.dictSubType}`;
  }
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function querySalesPerson(params) {
  return UAAService.request(`/b2b/user/v1/user/querySalePersons?market=${params.market}`, {
    method: 'GET',
  });
}

export async function queryMainTAList(params) {
  return UAAService.request(`/b2b/agent/v1/profile/queryTaList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

const urlPathPrefix = '/b2b/account';

export function queryTransactonTypes() {
  return UAAService.request(`${urlPathPrefix}/queryTransactionTypes`, {
    method: 'GET',
  });
}

export function queryAccount(params) {
  return UAAService.request(`${urlPathPrefix}/queryAccountDetail`, {
    method: 'GET',
    params,
  });
}

export async function queryActivityList(data) {
  return UAAService.request(`/b2b/user/v1/activity/queryActivityList?${stringify(data)}`, {
    method: 'GET',
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

export function invoiceDetail(params) {
  return UAAService.request(`${urlPathPrefix}/invoiceDetail`, {
    method: 'GET',
    params,
  });
}

export async function invoiceDownload(params) {
  return UAAService.request(`${urlPathPrefix}/download/accountInvoice`, {
    method: 'GET',
    params,
  });
}
