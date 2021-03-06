import { isEmpty } from 'lodash';
import * as service from '../services/dailyAndMonthlyReport';
import { privilege, REPORT_TYPE_MAP2 } from '../../ScheduleTask/consts/authority';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

export default {
  namespace: 'dailyAndMonthlyReport',
  state: {
    filter: {},
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    reportList: [],
    reportTypeList: [],
    reportFrequencyList: [],
    dataList: [],
    // reportTypeOptions: [],
    cronTypeOptions: [],
    sortOptions: {},
    cronTypeList: ['01', '02'],
    isExecute: '1',
    loadingStatus: false,
    reportNameOptions: [],
    scheduledReportName: [],
    reportName: '',
    reportTypes: [],
    taskName: '',
  },
  effects: {
    *fetch({ payload = {} }, { call, put, select }) {
      const { filter, pagination, cronTypeList, isExecute } = yield select(
        state => state.dailyAndMonthlyReport
      );
      const { likeParam } = filter;
      const { sortOptions, reportTypes } = payload;

      const sortMap = {
        taskName: 'task_name',
        cronType: 'report_frequency',
        status: 'status',
        expectTime: 'expect_time',
        createBy: 'create_by',
        reportName: 'schedule_desc',
      };

      const sortValueMap = {
        ascend: 'ASC',
        descend: 'DESC',
      };

      if (sortOptions && sortOptions.length > 0) {
        sortOptions.map(v => {
          const fieldName2 = sortMap[v.fieldName];
          const orderBy2 = sortValueMap[v.orderBy];

          Object.assign(v, {
            fieldName: fieldName2,
            orderBy: orderBy2,
          });
          return v;
        });
      }
      let reqParams = {
        pageInfo: {
          ...pagination,
        },
        cronTypeList,
        sortOptions,
        isExecute,
        reportTypes,
      };

      if (!isEmpty(likeParam)) {
        reqParams = {
          pageInfo: {
            ...pagination,
          },
          cronTypeList,
          ...likeParam,
          sortOptions,
          isExecute,
        };
      }

      Object.entries(reqParams).map(([key, value]) => {
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            if (value.length === 0) {
              delete reqParams[key];
            }
          } else if (isEmpty(value)) {
            delete reqParams[key];
          }
        } else if (value === '' || value === null || value === undefined) {
          delete reqParams[key];
        }
        return { key, value };
      });

      const response = yield call(service.page, reqParams);
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0' || resultCode === 0) {
        const {
          pageInfo: { currentPage, pageSize, totalSize },
          dataList,
        } = result;
        const arr = privilege.filter(item => hasAllPrivilege([REPORT_TYPE_MAP2[item.dictDesc]]));
        const privileges = arr && arr.length > 0 ? arr.map(i => i.dictDesc) : [];
        const list = dataList.filter(ii => privileges.includes(ii.reportType));
        if (list && list.length > 0) {
          list.map((v, index) => {
            Object.assign(v, {
              key: v.reportType,
              no: (currentPage - 1) * pageSize + index + 1,
            });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            currentPage,
            pageSize,
            totalSize,
            dataList: list,
          },
        });
      } else throw resultMsg;
    },
    *fetchReportNameListData({ payload }, { call, put }) {
      const response = yield call(service.searchReportName, { ...payload });
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            reportNameOptions: result,
          },
        });
      } else throw resultMsg;
    },
    *reportTypeSelect(_, { call, put }) {
      const response = yield call(service.queryDict, { dictType: 12 });
      if (!response || !response.data || response.data.resultCode !== '0') return false;
      const {
        data: { result: dictInfoList },
      } = response;
      // const { userAuthorities } = yield select(({ user }) => user);
      yield put({ type: 'saveDictInfoList', payload: { dictInfoList } });
      return true;
    },
    *fetchScheduledReportNameListData({ payload }, { call, put }) {
      const response = yield call(service.searchReportName, payload);
      if (!response || !response.data || response.data.resultCode !== '0') return false;
      const {
        data: { result = [] },
      } = response;
      yield put({
        type: 'save',
        payload: {
          scheduledReportName: result.map(item => ({
            value: item.value,
            text: item.value,
          })),
        },
      });
      return true;
    },
    *search({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetch',
      });
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetch',
        payload,
      });
    },
    *tableChanged({ payload }, { put }) {
      const { reportTypes } = payload;
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetch',
        payload: {
          reportTypes,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
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
      // const reportTypeOptions = dictInfoMap.get('report type') || [];
      const reportTypeOptions = (dictInfoMap.get('report type') || []).filter(({ text }) =>
        hasAllPrivilege([REPORT_TYPE_MAP2[text]])
      );

      return {
        ...state,
        reportTypeOptions,
        cronTypeOptions:
          Array.isArray(dictInfoList) &&
          dictInfoList.filter(i => i.dictSubTypeName === 'report frequency'),
      };
    },
    clear(state) {
      return {
        ...state,
        filter: {},
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        dataList: [],
        loadingStatus: false,
        reportNameOptions: [],
        scheduledReportName: [],
        taskName: '',
        // reportFrequencyList: [],
        // reportTypeOptions: [],
        // cronTypeOptions: []
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ReportsCenter/GeneratedReports/DailyAndMonthlyReport') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
