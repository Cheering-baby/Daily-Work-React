import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { Effect, Reducer, Subscription, responseType } from '@/types/model';
import * as service from '../services/peakPeriod';

export type opType = 'A' | 'U' | 'D' | undefined;

export interface LegendConfig {
  legendId: number;
  legendName: string;
  legendType: number;
  legendStatus: number;
  attractionValue: string;
  createBy: string;
}

export interface legendColor {
  itemId: string;
  itemName: string;
  itemValue: string;
}

export interface peakPeriodConfig {
  opType: opType;
  peakPeriodId?: number | string;
  legendId?: number | string;
  legendName?: string;
  startDate?: string | null;
  endDate?: string | null;
  remarks?: string;
}

export interface themeParkPeriod {
  showDetail: boolean;
  themeParkCode: string;
  themeParkName: string;
  peakPeriodShow: 0 | 1;
  peakPeriodConfigs: peakPeriodConfig[];
  deletePeakPeriods?: peakPeriodConfig[];
}

const getInitialState = () => {
  return {
    legendConfigs: [] as LegendConfig[],
    legendColors: [] as legendColor[],
    displayName: null as null | string,
    displayColor: null as null | string,
    addLegendConfigFlag: false as boolean,
    editLegendConfigFlay: false as boolean,
    deleteLegendConfigFlay: false as boolean,
    editLegendConfigIndex: null as null | number,
    themeParkPeriods: [] as themeParkPeriod[],
  };
};

export type PeakPeriodStateType = ReturnType<typeof getInitialState>;

export type CommissionLogType = {
  namespace: string;
  state: PeakPeriodStateType;
  effects: {
    queryLegendColor: Effect;
    queryLegendConfigList: Effect;
    settingLegendConfigs: Effect;
    deleteLegendConfigs: Effect;
    queryPeakDateList: Effect;
    settingPeakPeriods: Effect;
  };
  reducers: {
    save: Reducer<PeakPeriodStateType>;
    reset: Reducer<PeakPeriodStateType>;
  };
  subscriptions: {
    setup: Subscription;
  };
};

const takeLatest = { type: 'takeLatest' };

const Model: CommissionLogType = {
  namespace: 'peakPeriod',

  state: getInitialState(),

  effects: {
    *queryLegendColor(_, { call, put }) {
      const response = yield call(service.queryLegendColor, {
        attributeItem: 'LEGEND_COLOR_CONFIG',
      });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { legendColors: result.items } });
      } else throw resultMsg;
    },
    *queryLegendConfigList(_, { call, put }) {
      const response: responseType<any> = yield call(service.queryLegendConfigList, {
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
    *settingLegendConfigs({ payload }, { call, put, select }) {
      const peakPeriod: PeakPeriodStateType = yield select(({ peakPeriod }) => peakPeriod);
      const { addLegendConfigFlag, editLegendConfigFlay, displayName, displayColor } = peakPeriod;
      const params = {
        legendConfigs: [
          {
            ...payload,
            legendType: 0,
            legendStatus: 0,
            legendName: displayName.trim(),
            attractionValue: displayColor,
            opType: addLegendConfigFlag ? 'A' : 'U',
          },
        ],
      };
      const response: responseType<any> = yield call(service.settingLegendConfigs, params);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg },
      } = response;
      if (resultCode === '0') {
        if (addLegendConfigFlag) {
          message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));
        } else {
          message.success(formatMessage({ id: 'COMMON_MODIFY_SUCCESSFULLY' }));
        }

        yield put({
          type: 'save',
          payload: { addLegendConfigFlag: false, editLegendConfigIndex: null },
        });

        yield put({ type: 'queryLegendConfigList' });
        yield put({ type: 'queryPeakDateList' });
      } else throw resultMsg;
    },
    *deleteLegendConfigs({ payload }, { call, put, select }) {
      const response: responseType<any> = yield call(service.settingLegendConfigs, payload);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg },
      } = response;
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'COMMON_DELETED_SUCCESSFULLY' }));

        yield put({
          type: 'save',
          payload: { addLegendConfigFlag: false, editLegendConfigIndex: null },
        });
        yield put({ type: 'queryLegendConfigList' });
        yield put({ type: 'queryPeakDateList' });
      } else throw resultMsg;
    },
    *queryPeakDateList(_, { call, put }) {
      const response: responseType<any> = yield call(service.queryPeakDateList, {
        showListFlag: true,
      });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            themeParkPeriods: result.themeParkPeriods.map(item => ({
              ...item,
              peakPeriodConfigs: item.peakPeriodConfigs.map(peakPeriodConfig => ({
                ...peakPeriodConfig,
                opType: 'U',
              })),
              deletePeakPeriods: [],
            })),
          },
        });
      } else throw resultMsg;
    },
    *settingPeakPeriods(_, { call, put, select }) {
      const peakPeriod: PeakPeriodStateType = yield select(({ peakPeriod }) => peakPeriod);
      const { themeParkPeriods } = peakPeriod;

      const themeParkPeriodsCopy: themeParkPeriod[] = JSON.parse(JSON.stringify(themeParkPeriods));

      themeParkPeriodsCopy.forEach(item => {
        item.peakPeriodConfigs = item.peakPeriodConfigs.concat(item.deletePeakPeriods);
      });

      const response: responseType<any> = yield call(service.settingPeakPeriods, {
        themeParkPeriods: themeParkPeriodsCopy,
      });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg },
      } = response;
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'COMMON_MODIFY_SUCCESSFULLY' }));
        yield put({ type: 'queryPeakDateList' });
      } else throw resultMsg;
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset() {
      return getInitialState();
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(location => {
        const { pathname } = location;
        if (pathname === '/SystemManagement/SeasonalityCalendarConfiguration') {
          dispatch({
            type: 'queryLegendColor',
          });
          dispatch({
            type: 'queryLegendConfigList',
          });
          dispatch({
            type: 'queryPeakDateList',
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

export default Model;
