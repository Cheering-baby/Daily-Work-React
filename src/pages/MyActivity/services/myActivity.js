import axios from 'axios';
import {stringify} from 'qs';
import UAAService from '@/uaa-npm';

// const rwsUrl = 'http://10.25.159.199:18091/pams';
export async function approvalList(data) {
  return UAAService.request(
    `/proxy/ali/pams/user/v1/activity/queryActivityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function queryDetail(data) {
  return UAAService.request(
    `/proxy/ali/pams/user/v1/activity/queryActivityDetail?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function createActivity(data) {
  return UAAService.request(
    `/proxy/ali/pams/user/v1/activity/createActivity?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function accept(data) {
  return UAAService.request(`/proxy/ali/pams/user/v1/activity/accept`, {
    method: 'POST',
    body: data,
  });
}

export async function reject(data) {
  return UAAService.request(`/proxy/ali/pams/user/v1/activity/reject`, {
    method: 'POST',
    body: data,
  });
}

export async function reroute(data) {
  return UAAService.request(`/proxy/ali/pams/user/v1/activity/reroute`, {
    method: 'POST',
    body: data,
  });
}

export async function queryMappingDetail(taId) {
  return UAAService.request(`/proxy/ali/pams/profile/queryMappingInfo?taId=${taId}`, {
    method: 'GET',
  });
}

export async function statusList(data) {
  return axios({
    url: `/pams/api/status`,
    method: 'POST',
    data,
  });
}

export async function templateList(data) {
  return axios({
    url: `/pams/api/templateList`,
    method: 'POST',
    data,
  });
}
