import UAAService from '@/uaa-npm';

const mock = 'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS'

export function queryDict(params) {
  return UAAService.request('/b2b/report/v1/common/queryDictionary', {
    method: 'GET',
    params,
  });
}

export function page(params) {
  return UAAService.request(mock + '/b2b/report/v1/schedule/pageScheduleReportLog', {
    method: 'POST',
    body: params,
  });
}

export function searchReportName(params) {
  return UAAService.request('/b2c/report/v1/schedule/fuzzySearchReportName', {
    method: 'GET',
    params,
  });
}
