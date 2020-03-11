export default {
  namespace: 'signUp',
  state: {
    isBilCheckBox: true,
    isRwsRoom: 'Y',
    isRwsAttraction: 'Y',
    isAllInformationToRws: false,
    currentStep: 0,
    isShowDetail: false,
    viewId: 'signUpView',
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
          isBilCheckBox: true,
          isRwsRoom: 'Y',
          isRwsAttraction: 'Y',
          isAllInformationToRws: false,
          currentStep: 0,
          isShowDetail: false,
          viewId: 'signUpView',
        },
        ...payload,
      };
    },
  },
};
