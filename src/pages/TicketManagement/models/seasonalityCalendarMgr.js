import { queryPeakDateList } from '../services/ticketCommon';

const takeLatest = { type: 'takeLatest' };
export default {
  namespace: 'seasonalityCalendarMgr',

  state: {},

  effects: {
    queryPeakDateList: [
      function* queryPeakDateListFunction({ payload }, { call, put, select }) {
        const { year } = yield select(state => state.seasonalityCalendarMgr);
        const response = yield call(queryPeakDateList, payload);
        if (!response) return false;
        const {
          data: { resultCode, resultMsg, result },
        } = response;
        if (resultCode === '0') {
          const { peakPeriods = [] } = result;
          yield put({
            type: 'save',
            payload: {
              peakPeriods,
              showYear: year,
            },
          });
        } else throw resultMsg;
      },
      takeLatest,
    ],
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
        showYear: false,
        year: undefined,
        themeParkCode: undefined,
        ...payload,
      };
    },
  },
};
