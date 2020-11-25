import UAAService from '@/uaa-npm';
const mock = 'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS'
const uaaPath =
  process.env.NODE_ENV === 'development'
    ? 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com'
    : '';
export const exportReportUrl = `${uaaPath}/pams/b2b/report/v1/common/exportReportByFilter`;
export const downloadReportScheduleFile = `/rwscxm/api/v1/report/schedule/downloadScheduleReportFile`;
export function queryScheduleReport(params) {
  return UAAService.request(`/rwscxm/api/v1/report/schedule/pageScheduleReport`, {
    method: 'POST',
    body: params,
  });
}

export function queryReport(params) {
  return UAAService.request(`/b2c/report/v1/schedule/pageScheduleReportLog`, {
    method: 'POST',
    body: params,
  });
}

export function queryDisplay(params) {
  return UAAService.request(`/b2c/report/v1/common/queryDisplay`, {
    method: 'GET',
    params,
  });
}

export function scheduleReportByFilter(params) {
  return UAAService.request(`/b2c/report/v1/schedule/queryScheduleReportByFilter`, {
    method: 'POST',
    body: params,
  });
}

export function queryFilter(params) {
  return UAAService.request(`/b2c/report/v1/common/queryFilter`, {
    method: 'GET',
    params,
  });
}

export function queryDict(params) {
  return UAAService.request(`/b2b/report/v1/common/queryDictionary`, {
    method: 'GET',
    params,
  });
}

export function queryDictPage(params) {
  return UAAService.request(`/b2c/report/v1/queryDictionaryByPage`, {
    method: 'POST',
    body: params,
  });
}

export function queryReportByFilter(params) {
  return UAAService.request(mock + `/b2b/report/v1/common/queryReportByFilter`, {
    method: 'POST',
    body: params,
  });
}

export function download(params) {
  return UAAService.request(`/b2b/report/v1/common/exportReportByFilter`, {
    method: 'POST',
    body: params,
  });
}
