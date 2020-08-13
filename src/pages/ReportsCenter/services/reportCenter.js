import UAAService from '@/uaa-npm';

export function queryDisplay(params) {
  return UAAService.request(`/b2b/report/v1/common/queryDisplay?reportType=${params}`, {
    method: 'GET',
    // params,
  });
}

export function queryFilter(params) {
  return UAAService.request(`/b2b/report/v1/common/queryFilter?reportType=${params}`, {
    method: 'GET',
    // params,
  });
}

export function queryDict(params) {
  return UAAService.request(`/b2b/report/v1/common/queryDictionary`, {
    method: 'GET',
    params,
  });
}

export function queryAgentDict(params) {
  return UAAService.request(`/agent/common/queryDictionary`, {
    method: 'GET',
    params,
  });
}

export function addReports(params) {
  return UAAService.request(`/b2b/report/v1/schedule/add`, {
    method: 'POST',
    body: params,
  });
}

export function editReports(params) {
  return UAAService.request(`/b2b/report/v1/schedule/edit`, {
    method: 'POST',
    body: params,
  });
}

export function queryScheduleTaskDetail(params) {
  return UAAService.request(`/b2c/report/v1/schedule/detail`, {
    method: 'GET',
    params,
  });
}

export async function queryUserRolesByCondition(params) {
  return UAAService.request(`/b2b/user/v1/role/queryUserRolesByCondition`, {
    params,
    method: 'GET',
  });
}

export async function queryPluAttribute(params) {
  return UAAService.request(
    `/b2c/product/v1/offer/offerBookingCategory/queryOfferBookingCategory`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    }
  );
}

export function querySalePersons() {
  return UAAService.request(`/b2b/user/v1/user/querySalePersons`, {
    method: 'GET',
  });
}
