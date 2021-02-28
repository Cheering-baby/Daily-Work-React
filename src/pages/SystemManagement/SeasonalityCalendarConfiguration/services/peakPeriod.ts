import UAAService from '@/uaa-npm';

const mock =
  'http://dev-easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS';
const localPath = process.env.NODE_ENV === 'development' ? '' : '';
// const test = 'http://10.25.159.248:18088'
export async function queryLegendColor(params) {
  return UAAService.request(`${localPath}/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    body: params,
  });
}

export async function queryLegendConfigList(params) {
  return UAAService.request(`${localPath}/b2b/product/v1/legendConfig/list`, {
    method: 'GET',
    params,
  });
}

export async function settingLegendConfigs(params) {
  return UAAService.request(`${localPath}/b2b/product/v1/legendConfig/setting`, {
    method: 'POST',
    body: params,
  });
}

export async function queryPeakDateList(params) {
  return UAAService.request(`${localPath}/b2b/product/v1/configuration/queryPeakDateList`, {
    method: 'POST',
    body: params,
  });
}

export async function settingPeakPeriods(params) {
  return UAAService.request(`${localPath}/b2b/product/v1/configuration/settingPeakPeriods`, {
    method: 'POST',
    body: params,
  });
}
