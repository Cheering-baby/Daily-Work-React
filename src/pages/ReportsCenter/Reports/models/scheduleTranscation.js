import { message } from 'antd';
import { queryDisplay, queryFilter, queryDict } from '../services/report';

export default {
  namespace: 'scheduleTransaction',
  state: {
    fieldList: [],
    filterList: [],
    cronTypeList: [],
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    previewModal: false,
  },
  effects: {
    *fetchDisplay({ payload }, { call, put }) {
      const { reportType } = payload;
      const res = yield call(queryDisplay, reportType);
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          result.map((v, index) => {
            Object.assign(v, {
              key: v.columnName,
              no: index + 1,
            });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            fieldList: result,
          },
        });
      } else throw resultMsg;
    },
    *fetchReportFilterList({ payload = {} }, { call, put }) {
      const { reportType } = payload;
      const response = yield call(queryFilter, reportType);
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (+resultCode === 0) {
        const list = result;
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          if (element.filterType === 'SELECT') {
            const params = {
              dictType: element.dictType,
              dictSubType: element.dictSubType,
              dictName: element.dictDbName,
            };
            const res = yield call(queryDict, params);
            const {
              data: { resultCode, resultMsg, result },
            } = res;
            if (+resultCode === 0) {
              if (result && result.length > 0) {
                list.map((v, index) => {
                  Object.assign(v, {
                    key: v.filterKey,
                    options: v.filterType === 'SELECT' ? result : null,
                    mulOptions: v.filterType === 'MULTIPLE_SELECT' ? result : null,
                  });
                  return v;
                });
              }
            } else {
              throw element;
            }
          }
        }
        yield put({ type: 'save', payload: { filterList: list } });
      } else throw resultMsg;
    },
    *queryCronType(_, { call, put }) {
      const params = {
        dictType: '17',
        dictSubType: '1705',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDict, params);
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { cronTypeList: result } });
      } else message.warn(resultMsg, 10);
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        // fieldList,
        // filterList: [],
        addPLUModal: false,
      };
    },
    saveFilterList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        filterList: list,
      };
    },
    saveModify(state, { payload }) {
      const { fieldList } = payload;
      // make sure the room type what is first or final
      fieldList.map(e => {
        const { no } = e;
        Object.assign(e, {
          key: e.columnName,
          firstObject: no === 1,
          finalObject: no === fieldList.length,
        });
        return e;
      });
      // sort the room type
      fieldList.sort((a, b) => {
        const aSeqOrder = a.no;
        const bSeqOrder = b.no;
        return aSeqOrder - bSeqOrder;
      });
      return {
        ...state,
        ...payload,
        fieldList,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ReportsCenter/Reports/Schedule') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
