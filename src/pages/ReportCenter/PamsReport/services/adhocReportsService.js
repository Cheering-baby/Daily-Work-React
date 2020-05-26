import UAAService from '@/uaa-npm';

const NORMAL = '';
// const MOCK = `${window.location.origin}`;
// const LOCAL = 'http://10.25.159.231:18088/api';
// const DEV = 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com';

export const exportReportUrl = `${window.location.origin}/pams/b2b/report/v1/common/exportReportByFilter`;
const queryAdhocReportListUrl = `${NORMAL}/b2b/report/v1/ad-hoc/list`;
const queryReportByFilterUrl = `${NORMAL}/b2b/report/v1/common/queryReportByFilter`;
const queryReportFilterUrl = `${NORMAL}/b2b/report/v1/common/queryFilter`;
const queryAgentDictionaryUrl = `${NORMAL}/agent/common/queryDictionary`;
const queryReportDictionaryUrl = `${NORMAL}/b2b/report/v1/common/queryDictionary`;
const queryPluAttributeUrl = `${NORMAL}/b2c/product/v1/dictionary/attraction/list`;
const querySalePersonUrl = `${NORMAL}/b2b/user/v1/user/querySalePersons`;

export function queryAdhocReportList(params) {
  return UAAService.request(queryAdhocReportListUrl, {
    method: 'GET',
    params,
  });
}

export function queryReportByFilter(params) {
  return UAAService.request(queryReportByFilterUrl, {
    method: 'POST',
    body: params,
  });
}

export function queryReportFilter(params) {
  return UAAService.request(queryReportFilterUrl, {
    method: 'GET',
    params,
  });
}

export function queryAgentDictionary(params) {
  return UAAService.request(queryAgentDictionaryUrl, {
    method: 'GET',
    params,
  });
}

export function queryReportDictionary(params) {
  return UAAService.request(queryReportDictionaryUrl, {
    method: 'GET',
    params,
  });
}

export async function queryPluAttribute(params) {
  return UAAService.request(queryPluAttributeUrl, {
    method: 'POST',
    body: params,
  });
}

export async function querySalePerson() {
  return UAAService.request(querySalePersonUrl, {
    method: 'GET',
  });
}
