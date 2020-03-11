export default {
  namespace: 'seasonalityCalendarMgr',

  state: {},

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    resetData(state, { payload }) {
      return {
        ...state,
        yearPaneOpen: false,
        year: undefined,
        themeParkCode: undefined,
        ...payload,
      };
    },
  },
};
