import UAAService from '@/uaa-npm';

const NORMAL = '';
// const MOCK = window.location.origin;
// const LOCAL = 'http://10.25.159.231:18088';

const queryScheduledTaskListUrl = `${NORMAL}/b2b/report/v1/scheduledTask/pageList`;
const queryScheduledTaskDetailUrl = `${NORMAL}/b2b/report/v1/scheduledTask/detail`;
const createScheduledTaskUrl = `${NORMAL}/b2b/report/v1/scheduledTask/add`;
const updateScheduledTaskUrl = `${NORMAL}/b2b/report/v1/scheduledTask/update`;
const deleteScheduledTaskUrl = `${NORMAL}/b2b/report/v1/scheduledTask/remove`;
const queryReceiverListUrl = `${NORMAL}/b2b/user/v1/user/queryUsers`;

export function queryScheduledTaskList(params) {
  return UAAService.request(queryScheduledTaskListUrl, {
    method: 'POST',
    body: params,
  });
}

export function queryScheduledTaskDetail(params) {
  return UAAService.request(queryScheduledTaskDetailUrl, {
    method: 'GET',
    params,
  });
}

export function createScheduledTask(params) {
  return UAAService.request(createScheduledTaskUrl, {
    method: 'POST',
    body: params,
  });
}

export function updateScheduledTask(params) {
  return UAAService.request(updateScheduledTaskUrl, {
    method: 'POST',
    body: params,
  });
}

export function deleteScheduledTask(params) {
  return UAAService.request(deleteScheduledTaskUrl, {
    method: 'POST',
    body: params,
  });
}

export function queryReceiverList(params) {
  return UAAService.request(queryReceiverListUrl, {
    method: 'GET',
    params,
  });
}
