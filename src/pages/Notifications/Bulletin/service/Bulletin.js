import UAAService from '@/uaa-npm';

export function queryNotifications(currentPage, pageSize, type, targetType, status, title) {
  if (currentPage > 0) {
    currentPage -= 1;
  }
  return UAAService.request(
    `http://localhost:18081/notice?currentPage=${currentPage}&pageSize=${pageSize}&type=${type}&targetType=${targetType}&status=${status}&title=${title}`,
    {
      method: 'GET',
    }
  );
}

export function queryNotificationsType(type) {
  return UAAService.request(`http://localhost:18081/notice/queryNotificationDict?dicType=${type}`, {
    method: 'GET',
  });
}

export function editNotifications(param) {
  return UAAService.request(`http://localhost:18081/notice`, {
    method: 'POST',
    body: param,
  });
}
