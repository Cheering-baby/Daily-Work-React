import UAAService from '@/uaa-npm';

export function queryDict(params) {
  return UAAService.request('/b2b/report/v1/common/queryDictionary', {
    method: 'GET',
    params,
  });
}

export function page(params) {
  return UAAService.request('/b2b/report/v1/schedule/pageScheduleReportLog', {
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
