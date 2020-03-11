import { isEmpty } from 'lodash';
import { page, queryLogType, search } from '../services/logService';

export default {
  namespace: 'logMgr',
  state: {
    values: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    list: [],
    startValue: null,
    endValue: null,
    endOpen: false,
    queryLogTypeList: [],
  },

  effects: {
    *fetch(_, { call, select, put }) {
      const { pagination, values } = yield select(state => state.logMgr);
      let result;
      if (isEmpty(values)) {
        result = yield call(page, pagination);
      } else {
        result = yield call(search, values, pagination);
      }
      const { success, errorMsg, data } = result;
      if (success) {
        const { list, pageSize, total, pageNum } = data;

        if (list && list.length > 0) {
          list.map(v => {
            Object.assign(v, { key: `logList_${v.id}` });
            return v;
          });
        }

        yield put({
          type: 'save',
          payload: {
            list,
            pagination: {
              ...pagination,
              current: pageNum,
              pageSize,
              total,
            },
          },
        });
      } else {
        yield put({
          type: 'tableClear',
        });
        throw errorMsg;
      }
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetch',
      });
    },
    *search({ payload }, { put }) {
      yield put({
        type: 'tableClear',
      });

      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetch',
      });
    },
    *queryLogType(_, { call, put }) {
      const { success, errorMsg, data } = yield call(queryLogType);

      if (success) {
        data.forEach(item => {
          Object.assign(item, { key: `${item.paramCode}` });
        });

        yield put({
          type: 'save',
          payload: {
            queryLogTypeList: data,
          },
        });
      } else throw errorMsg;
    },
  },
  reducers: {
    clear(state) {
      return {
        ...state,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        list: [],
        startValue: null,
        endValue: null,
        endOpen: false,
        queryLogTypeList: [],
      };
    },
    tableClear(state) {
      return {
        ...state,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        list: [],
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/logMgr') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
