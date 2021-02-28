import { queryPeakDateList, queryLegendConfigList } from '../services/ticketCommon';

const takeLatest = { type: 'takeLatest' };
export default {
  namespace: 'seasonalityCalendarMgr',

  state: {
    validThemeParkCodes: [],
    legendConfigs: [],
    peakPeriodConfigs: [],
  },

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
          const { themeParkPeriods } = result;
          yield put({
            type: 'save',
            payload: {
              showYear: year,
              peakPeriodConfigs:
                Array.isArray(themeParkPeriods) && themeParkPeriods.length === 1
                  ? themeParkPeriods[0].peakPeriodConfigs || []
                  : [],
            },
          });
        } else throw resultMsg;
      },
      takeLatest,
    ],

    *queryPeakDateValidCode(_, { call, put, select }) {
      const response = yield call(queryPeakDateList, { periodStatus: 0 });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            validThemeParkCodes: result.themeParkPeriods,
          },
        });
      } else throw resultMsg;
    },

    *queryLegendConfigList(_, { call, put }) {
      const response = yield call(queryLegendConfigList, {
        legendStatus: 0,
      });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { legendConfigs: result.legendConfigs } });
      } else throw resultMsg;
    },

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
    reset(state) {
      return {
        ...state,
        showYear: false,
        year: undefined,
        themeParkCode: undefined,
        validThemeParkCodes: [],
        legendConfigs: [],
        peakPeriodConfigs: [],
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(location => {
        const { pathname } = location;
        if (pathname === '/TicketManagement/Ticketing/SeasonalityCalendar') {
          dispatch({
            type: 'queryLegendConfigList',
          });
          dispatch({
            type: 'queryPeakDateValidCode',
          });
        } else {
          dispatch({
            type: 'reset',
          });
        }
      });
    },
  },
};
