import {stringify} from 'qs';
import UAAService from '@/uaa-npm';

export async function approvalList(data) {
  return UAAService.request(
    `/proxy/ali/b2b/user/v1/activity/queryActivityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function queryDetail(data) {
  return UAAService.request(
    `/proxy/ali/b2b/user/v1/activity/queryActivityDetail?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function accept(data) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/activity/accept`, {
    method: 'POST',
    body: data,
  });
}

export async function reject(data) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/activity/reject`, {
    method: 'POST',
    body: data,
  });
}

export async function reroute(data) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/activity/reroute`, {
    method: 'POST',
    body: data,
  });
}

export async function upload(data) {
  return UAAService.request(`/common/upload`, {
    method: 'POST',
    body: data,
  });
}

export async function queryMappingDetail(taId) {
  return UAAService.request(`/proxy/ali/b2b/profile/queryMappingInfo?taId=${taId}`, {
    method: 'GET',
  });
}

export async function registerContractFile(params) {
  return UAAService.request(`/contract/registerContractFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function taInfo(taId) {
  return UAAService.request(`/proxy/ali/b2b/profile/queryTaInfo?taId=${taId}`, {
    method: 'GET',
  });
}

export async function queryContractInfo(taId) {
  return UAAService.request(`/proxy/ali/b2b/contract/queryContractInfo?taId=${taId}`, {
    method: 'GET',
  });
}

export async function downloadFile(params) {
  return UAAService.request(`/common/downloadFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function statusList() {
  return UAAService.request(
    `/proxy/ali/b2b/user/v1/activity/queryActivityDict?dictType=ActivityStatus`,
    {
      method: 'GET',
    }
  );
}

export async function templateList(data) {
  return UAAService.request(
    `/proxy/ali/b2b/user/v1/activity/queryTemplateList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function queryRerouteList() {
  return UAAService.request(`/proxy/ali/b2b/user/v1/activity/queryRerouteList`, {
    method: 'GET',
  });
}
