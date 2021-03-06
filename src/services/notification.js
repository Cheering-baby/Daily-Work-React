import UAAService from '@/uaa-npm';

/* eslint-disable */
export function queryNotificationList(params) {
  return UAAService.request(`/b2b/user/v1/notification/queryNotificationList`, {
    method: 'POST',
    body: params,
  });
}

export function queryBellNotification(params) {
  return UAAService.requestByRT(
    `/b2b/user/v1/notification/queryBellNotification?currentPage=${params.pageInfo.currentPage}&pageSize=${params.pageInfo.pageSize}`,
    {
      method: 'GET',
    }
  );
}
