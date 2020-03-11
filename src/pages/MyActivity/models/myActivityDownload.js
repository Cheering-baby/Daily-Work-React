/* eslint-disable */
import { routerRedux } from 'dva/router';
export default {
  namespace: 'myActivityDownload',
  state: {
    isMyActivityPage: false,
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
  effects: {
    *setIsMyActivityPageToFalse({ payload }, { call, put }) {
      // const { groupId } = payload;
      // yield put({
      //   type:'queryEventDetail',
      //   payload:{
      //     groupId,
      //   },
      // });
      // yield take('queryEventDetail/@@end');
      yield put(routerRedux.push(`/TaManagement/MyActivity/showDownload/`));
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    resetModel(state, { payload }) {
      let isMyActivityPage = true;
      return {
        ...state,
        isMyActivityPage,
      };
    },
  },
};
