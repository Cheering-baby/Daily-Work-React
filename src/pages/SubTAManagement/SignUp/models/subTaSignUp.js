export default {
  namespace: 'subTaSignUp',
  state: {
    currentStep: '0',
    isShowDetail: false,
  },
  effects: {
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
      yield put({ type: 'subTaMgr/clean', payload });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clean(state, { payload }) {
      return {
        ...state,
        ...{
          currentStep: '0',
          isShowDetail: false,
        },
        ...payload,
      };
    },
  },
};
