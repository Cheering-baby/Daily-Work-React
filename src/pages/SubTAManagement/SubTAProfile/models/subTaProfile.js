export default {
  namespace: 'subTaProfile',
  state: {
    editVisible: false,
  },
  effects: {
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'subTaMgr/clean', payload });
      yield put({ type: 'clean', payload });
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
          editVisible: false,
        },
        ...payload,
      };
    },
  },
};
