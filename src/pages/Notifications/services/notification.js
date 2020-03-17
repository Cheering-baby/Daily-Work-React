import {stringify} from 'qs';
import UAAService from '@/uaa-npm';

export function create(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/notification/create`, {
    method: 'POST',
    body: params,
  });
}

export function modify(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/notification/modify`, {
    method: 'POST',
    body: params,
  });
}

export function queryNotificationList(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/notification/queryNotificationList`, {
    method: 'POST',
    body: params,
  });
}

export function deleteNotification(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/notification/delete`, {
    method: 'POST',
    body: params,
  });
}

export function templateList(params) {
  return UAAService.request(
    `/proxy/ali/b2b/user/v1/notification/templateList?${stringify(params)}`,
    {
      method: 'GET',
    }
  );
}

export function queryNotificationsType(type) {
  return UAAService.request(
    `/proxy/ali/b2b/user/v1/notification/queryNotificationDict?dicType=${type}`,
    {
      method: 'GET',
    }
  );
}
