import { isEmpty } from 'lodash';
import * as service from '../services/report';
import { REPORT_TYPE_MAP2, privilege } from '../../GeneratedReports/ScheduleTask/consts/authority';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

export default {
  namespace: 'report',
  state: {
    filter: {},
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    dataList: [],
    filterList: [],
    cronTypeList: ['01', '02', '03'],
    reportTypeOptions: [],
    sortOptions: {},
    dictType: 19,
  },
  effects: {
    *fetch(_, { call, put, select }) {
      const { filter, pagination, dictType } = yield select(state => state.report);
      const arr = privilege.filter(item => hasAllPrivilege([REPORT_TYPE_MAP2[item.dictDesc]]));
      const privileges = arr && arr.length > 0 ? arr.map(i => i.code) : [];
      const { likeParam } = filter;
      let reqParams = {
        pageInfo: {
          ...pagination,
        },
        dictType,
        privileges,
      };
      if (!isEmpty(likeParam)) {
        reqParams = {
          pageInfo: {
            ...pagination,
          },
          ...likeParam,
          dictType,
          privileges,
        };
      }
      const response = yield call(service.queryDictPage, reqParams);
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0' || resultCode === 0) {
        const {
          pageInfo: { currentPage, pageSize, totalSize },
          reportDictionaryResultList,
        } = result;

        if (reportDictionaryResultList && reportDictionaryResultList.length > 0) {
          reportDictionaryResultList.map(v => {
            Object.assign(v, {
              key: v.jobCode,
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
            dataList: reportDictionaryResultList,
          },
        });
      } else throw resultMsg;
    },

    *fetchDictionary(_, { call, put, select }) {
      const response = yield call(service.queryDict, { dictType: 17 });
      if (!response || !response.data || response.data.resultCode !== '0') return false;
      const {
        data: { result: dictInfoList },
      } = response;
      const { userAuthorities } = yield select(({ user }) => user);
      yield put({ type: 'saveDictInfoList', payload: { dictInfoList, userAuthorities } });
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
    *reset(_, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetch',
      });
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchCommissionRuleSetupList',
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
              text: item.dictName,
            },
          ]);
        } else {
          arr.push({
            value: item.dictId,
            text: item.dictName,
          });
        }
      });
      const reportTypeOptions = (dictInfoMap.get('report type') || []).filter(({ text }) =>
        hasAllPrivilege([REPORT_TYPE_MAP2[text]])
      );

      return {
        ...state,
        reportTypeOptions,
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
        // filterList: []
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ReportsCenter/Reports') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
