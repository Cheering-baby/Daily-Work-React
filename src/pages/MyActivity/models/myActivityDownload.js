import { routerRedux } from 'dva/router';
import { message } from 'antd';
import * as service from '../services/myActivity';

export default {
  namespace: 'myActivityDownload',
  state: {
    isMyActivityPage: false,
    fileList: [],
  },
  effects: {
    *setIsMyActivityPageToFalse(_, { put }) {
      yield put(routerRedux.push(`/TaManagement/MyActivity/showDownload/`));
    },
    *taInfo({ payload }, { call, put }) {
      const { taId } = payload;
      const res = yield call(service.taInfo, taId);
      const { resultCode, resultMsg, result } = res.data;
      const {
        customerInfo: {
          companyInfo: { fileList },
        },
      } = result;
      if (resultCode === '0' || resultCode === 0) {
        if (fileList && fileList.length > 0) {
          fileList.map(v => {
            Object.assign(v, { key: `fileList${v.field}` });
            return v;
          });
        }

        yield put({
          type: 'save',
          payload: {
            fileList,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *downloadFile({ payload }, { call }) {
      yield call(service.downloadFile, { ...payload });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    resetModel(state, { payload }) {
      const isMyActivityPage = true;
      return {
        ...payload,
        ...state,
        isMyActivityPage,
      };
    },
    clear(state) {
      return {
        ...state,
        fileList: [],
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/MyActivity') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
