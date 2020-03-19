import {message} from 'antd';
import {queryAllCompanyConfig, queryNotificationsType} from '../services/notification';
import {isNvl} from '@/utils/utils';

export default {
  namespace: 'notificationSearchForm',

  state: {
    notificationTypeList: [],
    targetTypeList: [],
    statusList: [],
    targetTreeData: [],
  },

  effects: {
    *queryNotificationTypeList(_, { call, put }) {
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryNotificationsType, 2);
      if (resultCode === '0' || resultCode === 0) {
        const {dictionaryInfos} = result;
        yield put({
          type: 'save',
          payload: {
            notificationTypeList: dictionaryInfos,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryTargetTypeList(_, { call, put }) {
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryNotificationsType, 3);
      if (resultCode === '0' || resultCode === 0) {
        const {dictionaryInfos} = result;
        yield put({
          type: 'save',
          payload: {
            targetTypeList: dictionaryInfos,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    * queryStatusList(_, {call, put}) {
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryNotificationsType, 4);
      if (resultCode === '0' || resultCode === 0) {
        const {dictionaryInfos} = result;
        yield put({
          type: 'save',
          payload: {
            statusList: dictionaryInfos,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    * queryAllCompanyConfig(_, {call, put}) {
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryAllCompanyConfig);
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          const marketTreeMap = new Map();
          const customerGroupTreeMap = new Map();
          result.forEach(n => {
            const {params = {}} = n;
            let marketTreeInfo = {
              title: !isNvl(params.marketName) ? `${params.marketName}` : `${params.market}`,
              value: `market${params.market}`,
              key: `market${params.market}`,
              children: [
                {
                  title: n.value,
                  value: `market${n.key}`,
                  key: `market${n.key}`,
                },
              ],
            };
            if (marketTreeMap.has(String(params.market))) {
              marketTreeInfo = marketTreeMap.get(String(params.market));
              marketTreeInfo.children.push({
                title: n.value,
                value: `market${n.key}`,
                key: `market${n.key}`,
              });
            }
            marketTreeMap.set(String(params.market), marketTreeInfo);
            let customerGroupTreeInfo = {
              title: !isNvl(params.customerGroupName)
                ? `${params.customerGroupName}`
                : `${params.customerGroup}`,
              value: `customerGroup${params.customerGroup}`,
              key: `customerGroup${params.customerGroup}`,
              children: [
                {
                  title: n.value,
                  value: `customerGroup${n.key}`,
                  key: `customerGroup${n.key}`,
                },
              ],
            };
            if (customerGroupTreeMap.has(String(params.customerGroup))) {
              customerGroupTreeInfo = customerGroupTreeMap.get(String(params.customerGroup));
              customerGroupTreeInfo.children.push({
                title: n.value,
                value: `customerGroup${n.key}`,
                key: `customerGroup${n.key}`,
              });
            }
            customerGroupTreeMap.set(String(params.customerGroup), customerGroupTreeInfo);
          });
          yield put({
            type: 'save',
            payload: {
              targetTreeData: [
                {
                  title: 'Market',
                  value: 'market',
                  key: 'market',
                  children: [...marketTreeMap.values()],
                },
                {
                  title: 'Customer Group',
                  value: 'customerGroup',
                  key: 'customerGroup',
                  children: [...customerGroupTreeMap.values()],
                },
              ],
            },
          });
        }
      } else message.warn(resultMsg, 10);
    },
    * saveData({payload}, {put}) {
      yield put({
        type: 'save',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        notificationTypeList: [],
        targetTypeList: [],
        statusList: [],
        targetTreeData: [],
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (!location.pathname.startsWith('/Notifications')) {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
