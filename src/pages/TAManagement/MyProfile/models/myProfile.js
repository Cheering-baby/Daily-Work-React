export default {
  namespace: 'myProfile',
  state: {
    isBilCheckBox: false,
    isRwsRoom: null,
    isRwsAttraction: null,
    isAllInformationToRws: false,
    currentStep: 0,
    viewId: 'profileEditView',
  },
  effects: {
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
      yield put({ type: 'taCommon/clean', payload });
      yield put({ type: 'taMgr/clean', payload });
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
          isBilCheckBox: false,
          isRwsRoom: null,
          isRwsAttraction: null,
          isAllInformationToRws: false,
          currentStep: 0,
          viewId: 'profileEditView',
        },
        ...payload,
      };
    },
  },
};
