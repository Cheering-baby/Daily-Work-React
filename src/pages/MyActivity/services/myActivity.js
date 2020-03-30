import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

export async function queryActivityList(data) {
  return UAAService.request(`/b2b/user/v1/activity/queryActivityList?${stringify(data)}`, {
    method: 'GET',
  });
}

export async function queryActivityDetail(data) {
  return UAAService.request(`/b2b/user/v1/activity/queryActivityDetail?${stringify(data)}`, {
    method: 'GET',
  });
}

export async function accept(data) {
  return UAAService.request(`/b2b/user/v1/activity/accept`, {
    method: 'POST',
    body: data,
  });
}

export async function reject(data) {
  return UAAService.request(`/b2b/user/v1/activity/reject`, {
    method: 'POST',
    body: data,
  });
}

export async function reroute(data) {
  return UAAService.request(`/b2b/user/v1/activity/reroute`, {
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

export async function registerContractFile(params) {
  return UAAService.request(`/b2b/agent/v1/contract/registerContractFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryTaInfo(taId) {
  return UAAService.request(`/b2b/agent/v1/profile/queryTaInfo?taId=${taId}`, {
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

export async function queryActivityDict() {
  return UAAService.request(`/b2b/user/v1/activity/queryActivityDict?dictType=ActivityStatus`, {
    method: 'GET',
  });
}

export async function queryTemplateList(data) {
  return UAAService.request(`/b2b/user/v1/activity/queryTemplateList?${stringify(data)}`, {
    method: 'GET',
  });
}

export async function queryRerouteList() {
  return UAAService.request(`/b2b/user/v1/activity/queryRerouteList`, {
    method: 'GET',
  });
}

export async function queryDictionary(params) {
  return UAAService.request(
    `/agent/common/queryDictionary?dictType=${params.dictType}&dictSubType=${params.dictSubType}`,
    {
      method: 'GET',
    }
  );
}

export async function querySubTaInfo(params) {
  return UAAService.request(`/b2b/agent/v1/subprofile/querySubTaInfo?subTaId=${params.subTaId}`, {
    method: 'GET',
  });
}

export async function deleteFile(params) {
  return UAAService.request(`/common/deleteFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
