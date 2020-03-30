import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

export function createNotification(params) {
  return UAAService.request(`/b2b/user/v1/notification/create`, {
    method: 'POST',
    body: params,
  });
}

export function modifyNotification(params) {
  return UAAService.request(`/b2b/user/v1/notification/modify`, {
    method: 'POST',
    body: params,
  });
}

export function queryNotificationList(params) {
  return UAAService.request(`/b2b/user/v1/notification/queryNotificationList`, {
    method: 'POST',
    body: params,
  });
}

export function deleteNotification(params) {
  return UAAService.request(`/b2b/user/v1/notification/delete`, {
    method: 'POST',
    body: params,
  });
}

export function templateList(params) {
  return UAAService.request(`/b2b/user/v1/notification/templateList?${stringify(params)}`, {
    method: 'GET',
  });
}

export function queryNotificationsType(type) {
  return UAAService.request(`/b2b/user/v1/notification/queryNotificationDict?dicType=${type}`, {
    method: 'GET',
  });
}

export function queryAllCompanyConfig() {
  return UAAService.request(
    `/b2b/agent/v1/profile/queryAllCompanyConfig?showColumnName=companyName`,
    {
      method: 'GET',
    }
  );
}

export async function deleteFile(params) {
  return UAAService.request(`/common/deleteFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateReadStatus(params) {
  return UAAService.request(`/b2b/user/v1/notification/updateReadStatus`, {
    method: 'POST',
    body: params,
  });
}
