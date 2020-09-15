export default {
  namespace: 'signUp',
  state: {
    isBilCheckBox: true,
    isRwsRoom: 'Y',
    isRwsAttraction: 'Y',
    isAllInformationToRws: false,
    currentStep: 2,
    isShowDetail: false,
    viewId: 'signUpView',
    taFileCheck: {},
    arAccountFileCheck: {},
  },
  effects: {
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
      yield put({ type: 'taCommon/clean', payload });
      yield put({ type: 'taMgr/clean', payload });
    },
    *doCleanSignUpData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
      yield put({ type: 'taMgr/save', payload });
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
          currentStep: 2,
          isShowDetail: false,
          viewId: 'signUpView',
          taFileCheck: {},
          arAccountFileCheck: {},
        },
        ...payload,
      };
    },
  },
};
