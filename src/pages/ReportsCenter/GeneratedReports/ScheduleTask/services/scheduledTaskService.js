import UAAService from '@/uaa-npm';

const rwsUrl = '';

const queryScheduleTaskListUrl = `${rwsUrl}/rwscxm/api/v1/report/schedule/pageScheduleReport`;
const queryScheduleTaskLogListUrl = `${rwsUrl}/b2b/report/v1/schedule/pageScheduleReportLog`;
const queryScheduleTaskDetailUrl = `${rwsUrl}/b2c/report/v1/schedule/detail`;
const createScheduleTaskUrl = `${rwsUrl}/b2b/report/v1/schedule/add`;
const updateScheduleTaskUrl = `${rwsUrl}/b2b/report/v1/schedule/edit`;
const disableScheduleTaskUrl = `${rwsUrl}/b2c/report/v1/schedule/disable`;
const queryDictionaryUrl = `${rwsUrl}/b2b/report/v1/common/queryDictionary`;
const queryPluAttributeUrl = `${rwsUrl}/b2c/product/v1/dictionary/attraction/list`;
const queryChannelsUrl = `${rwsUrl}/b2c/report/v1/channel/queryChannels`;
const queryReportNameListUrl = `${rwsUrl}/b2c/report/v1/schedule/fuzzySearchReportName`;
const queryAgentDictUrl = `${rwsUrl}/agent/common/queryDictionary`;

export function queryScheduleTaskList(params) {
  return UAAService.request(queryScheduleTaskListUrl, {
    method: 'POST',
    body: params,
  });
}

export function queryScheduleTaskLogList(params) {
  return UAAService.request(queryScheduleTaskLogListUrl, {
    method: 'POST',
    body: params,
  });
}

export function queryScheduleTaskDetail(params) {
  return UAAService.request(queryScheduleTaskDetailUrl, {
    method: 'GET',
    params,
  });
}

export function createScheduleTask(params) {
  return UAAService.request(createScheduleTaskUrl, {
    method: 'POST',
    body: params,
  });
}

export function updateScheduleTask(params) {
  return UAAService.request(updateScheduleTaskUrl, {
    method: 'POST',
    body: params,
  });
}

export function disableScheduleTask(params) {
  return UAAService.request(disableScheduleTaskUrl, {
    method: 'POST',
    body: params,
  });
}

export function queryReportDictionary(params) {
  return UAAService.request(queryDictionaryUrl, {
    method: 'GET',
    params,
  });
}

export function queryPluAttribute(params) {
  return UAAService.request(queryPluAttributeUrl, {
    method: 'POST',
    body: params,
  });
}

export function queryChannels(params) {
  return UAAService.request(queryChannelsUrl, {
    method: 'GET',
    params,
  });
}

export function queryReportNameList(params) {
  return UAAService.request(queryReportNameListUrl, {
    method: 'GET',
    params,
  });
}

export function queryAgentDict(params) {
  return UAAService.request(queryAgentDictUrl, {
    method: 'GET',
    params,
  });
}