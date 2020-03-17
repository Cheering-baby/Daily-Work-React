import UAAService from '@/uaa-npm';

export function queryNotificationList(params) {
  return UAAService.request(`/proxy/ali/b2b/user/v1/notification/queryNotificationList`, {
    method: 'POST',
    body: params,
  });
}
