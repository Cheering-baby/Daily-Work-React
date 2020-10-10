import moment from 'moment';
import { message } from 'antd';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITH_TIME,
  EMPTY_ARR,
  PAGE_SIZE,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/common';
import { PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/scheduleTaskPath';
import {
  disableScheduleTask,
  queryReportDictionary,
  queryReportNameList,
  queryScheduleTaskDetail,
  queryScheduleTaskLogList,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/services/scheduledTaskService';
import {
  doFilter,
  transform2ListParams,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/utils/scheduledTaskFetchUtils';
import FetchFilterResponseProcessor from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/utils/Processor/Fetch/FetchFilterResponseProcessor';
import { REPORT_TYPE_MAP2 } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/authority';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

const defaultState = {
  reportList: EMPTY_ARR,
  calendarOptions: {},
  filterOptions: {},
  sortOptions: {},
  filterList: EMPTY_ARR,
  basicTable: {
    columns: EMPTY_ARR,
    totalSize: 0,
    pageSize: PAGE_SIZE,
    currentPage: 1,
    dataList: EMPTY_ARR,
  },
  detailList: [],
  reportTypeOptions: EMPTY_ARR,
};

export default {
  namespace: 'scheduleTask',
  state: defaultState,

  effects: {
    *fetchScheduleTaskLogList({ payload = {} }, { call, put, select }) {
      const {
        basicTable: { currentPage, pageSize },
        calendarOptions,
        filterOptions,
        sortOptions,
        reportTypeOptions,
      } = yield select(({ scheduleTask }) => scheduleTask);

      const {
        calendarOptions: newCalendarOptions = calendarOptions,
        filterOptions: newFilterOptions = filterOptions,
        sortOptions: newSortOptions = sortOptions,
        currentPage: newCurrentPage = currentPage,
        pageSize: newPageSize = pageSize,
      } = payload;

      yield put({
        type: 'updateState',
        payload: {
          calendarOptions: newCalendarOptions,
          filterOptions: newFilterOptions,
          sortOptions: newSortOptions,
        },
      });

      const response = yield call(
        queryScheduleTaskLogList,
        transform2ListParams({
          calendarOptions: newCalendarOptions,
          filterOptions: newFilterOptions,
          sortOptions: newSortOptions,
          currentPage: newCurrentPage,
          pageSize: newPageSize,
          reportTypeOptions,
        })
      );
      if (!response || !response.data || response.data.resultCode !== '0') {
        message.warn(`Failed to search.`);
        return;
      }
      const {
        data: { result = {} },
      } = response;
      yield put({ type: 'saveScheduleTaskLogList', payload: { result } });
    },

    *fetchScheduleTaskDetail({ payload }, { call, put }) {
      const response = yield call(queryScheduleTaskDetail, payload);
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: { result: taskDetail },
      } = response;
      const { whereColumnList } = taskDetail;
      yield put({
        type: 'fetchFilterListData',
        payload: {
          filterList: whereColumnList,
          saveType: 'saveScheduledTaskDetail',
          savePayload: { taskDetail },
        },
      });
      yield put({
        type: 'updateState',
        payload: {
          detailList: taskDetail,
        },
      });
    },

    *disableScheduleTask({ payload }, { call }) {
      const response = yield call(disableScheduleTask, payload);
      return !(!response || !response.data || response.data.resultCode !== '0');
    },

    *fetchDictionary(_, { call, put, select }) {
      const response = yield call(queryReportDictionary, { dictType: 12 });
      if (!response || !response.data || response.data.resultCode !== '0') return false;
      const {
        data: { result: dictInfoList },
      } = response;
      const { userAuthorities } = yield select(({ user }) => user);
      yield put({ type: 'saveDictInfoList', payload: { dictInfoList, userAuthorities } });
      return true;
    },

    *fetchFilterListData(
      {
        payload: {
          filterList,
          saveType,
          savePayload: { taskDetail },
        },
      },
      { call, put }
    ) {
      for (let index = 0; index <= filterList.length - 1; index += 1) {
        const { preprocess, service, params, process } = FetchFilterResponseProcessor(
          {},
          filterList[index]
        );
        if (params) {
          Object.keys(params).forEach(item => {
            if (!params[item]) {
              delete params[item];
            }
          });
        }
        if (preprocess && preprocess() && params && Object.keys(params).length > 0) {
          try {
            const res = yield call(service, params);
            if (res) {
              const store = { _response: res, filterList, index };
              process(store, filterList[index]);
            }
          } catch (e) {
            message.warn('Failed to call queryDictionary api.');
          }
        }
      }
      Object.assign(taskDetail, { filterList });
      yield put({ type: saveType, payload: { taskDetail } });
    },

    *fetchReportNameListData({ payload }, { call, put }) {
      const response = yield call(queryReportNameList, payload);
      if (!response || !response.data || response.data.resultCode !== '0') return false;
      const {
        data: { result = [] },
      } = response;
      yield put({
        type: 'updateState',
        payload: {
          reportNameOptions: result.map(item => ({
            value: item.value,
            text: item.value,
          })),
        },
      });
      return true;
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },

    saveScheduleTaskLogList(state, { payload }) {
      const {
        result: { dataList: _dataList = [], pageInfo },
      } = payload;

      const calendarDataMap = new Map();
      const dataList = [];
      _dataList.forEach(item => {
        const executeTime =
          item.executeTime && moment(item.executeTime).format(DATE_FORMAT_WITH_TIME);
        const expectTime = item.expectTime && moment(item.expectTime).format(DATE_FORMAT_WITH_TIME);
        const modifiedDateTime =
          item.updateTime && moment(item.updateTime).format(DATE_FORMAT_WITH_TIME);
        const data = {
          ...item,
          key: item.jobLogCode,
          expectTime,
          modifiedDateTime,
          generationDateTime: expectTime,
          generatedDate: executeTime,
          status: item.jobStatus,
          reportsName: item.taskName,
          scheduleReportName: item.reportName,
        };
        dataList.push(data);

        const processDate = item.expectTime && moment(item.expectTime).format(DATE_FORMAT);
        const dataArr = calendarDataMap.get(processDate, item);
        if (dataArr instanceof Array) {
          dataArr.push(data);
        } else {
          calendarDataMap.set(processDate, [data]);
        }
      });

      return {
        ...state,
        calendarDataMap,
        basicTable: {
          ...pageInfo,
          dataList,
        },
      };
    },

    saveScheduledTaskDetail(state, { payload }) {
      const { taskDetail } = payload;
      const { cronType, displayColumnList = [], filterList = [] } = taskDetail;
      const detailFormItems = [
        { label: 'Schedule Report Name', texts: [taskDetail.reportName] },
        { label: 'Reports Name', texts: [taskDetail.taskName] },
        { label: 'Report Frequency', texts: [taskDetail.cronType] },
        { label: 'Report Type', texts: [taskDetail.reportType] },
      ];
      doFilter(filterList).forEach(({ filterName: label, filterValue, keyMap, type, filterType, isRequiredWhere }) => {
        let texts = filterValue && filterValue.split(',');
        // RANGE_PICKER special deal
        if(['Daily', 'Monthly'].includes(cronType) && filterType === 'RANGE_PICKER' && isRequiredWhere === '1') {
          const reportNameSplit = taskDetail.taskName.split('_')[1].split('-');
          const text = `${moment(reportNameSplit[0], 'YYYYMMDD').format('DD-MMM-YYYY')} ~ ${moment(reportNameSplit[1], 'YYYYMMDD').format('DD-MMM-YYYY')}`;
          texts = [text];
        } else if (keyMap) {
            texts = texts.map(item => keyMap[item] || item);
        }
        detailFormItems.push({ label, texts, type });
      });

      const fields = [];
      displayColumnList
        .filter(({ isChecked }) => isChecked === '1')
        .forEach(({ displayName }) => {
          fields.push(displayName);
        });
      detailFormItems.push({ label: 'Field', texts: fields });

      detailFormItems.push(
        { label: 'Created By', texts: [taskDetail.createBy] },
        {
          label: 'Created Date Time',
          texts: [
            taskDetail.createTime && moment(taskDetail.createTime).format(DATE_FORMAT_WITH_TIME),
          ],
        },
        { label: 'Last Modified By', texts: [taskDetail.updateBy] },
        {
          label: 'Modified Date Time',
          texts: [
            taskDetail.updateTime && moment(taskDetail.updateTime).format(DATE_FORMAT_WITH_TIME),
          ],
        },
        {
          label: 'Scheduled Date Time',
          texts: [
            taskDetail.expectTime && moment(taskDetail.expectTime).format(DATE_FORMAT_WITH_TIME),
          ],
        },
        {
          label: 'Generated Date Time',
          texts: [
            taskDetail.executeTime && moment(taskDetail.executeTime).format(DATE_FORMAT_WITH_TIME),
          ],
        }
      );

      return {
        ...state,
        taskDetail,
        detailFormItems,
      };
    },

    saveDictInfoList(state, { payload }) {
      const { dictInfoList = [] } = payload;
      const dictInfoMap = new Map();
      dictInfoList.forEach(item => {
        const arr = dictInfoMap.get(item.dictSubTypeName);
        if (!arr) {
          dictInfoMap.set(item.dictSubTypeName, [
            {
              value: item.dictId,
              text: item.dictDesc,
            },
          ]);
        } else {
          arr.push({
            value: item.dictId,
            text: item.dictDesc,
          });
        }
      });

      const reportTypeOptions = (dictInfoMap.get('report type') || []).filter(({ text }) =>
        hasAllPrivilege([REPORT_TYPE_MAP2[text]])
      );

      return {
        ...state,
        reportTypeOptions,
        cronTypeOptions:
          Array.isArray(dictInfoList) &&
          dictInfoList.filter(i => i.dictSubTypeName === 'report frequency'),
        statusOptions:
          Array.isArray(dictInfoList) && dictInfoList.filter(i => i.dictSubTypeName === 'status'),
      };
    },

    cleanState(state) {
      const { reportTypeOptions, cronTypeOptions, statusOptions, filterList, detailList } = state;
      return {
        ...defaultState,
        reportTypeOptions,
        cronTypeOptions,
        statusOptions,
        filterList,
        detailList,
      };
    },
  },

  subscriptions: {
    setup(props) {
      const { history, dispatch } = props;
      return history.listen(({ pathname }) => {
        const paths = [PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK];
        if (paths.includes(pathname)) {
          dispatch({ type: 'cleanState' });
          dispatch({
            type: 'fetchDictionary',
          }).then(() =>
            dispatch({
              type: 'fetchScheduleTaskLogList',
            })
          );
        }
      });
    },
  },
};
