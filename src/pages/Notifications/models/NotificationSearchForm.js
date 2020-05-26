import { message } from 'antd';
import { queryAllCompanyConfig, queryNotificationsType } from '../services/notification';
import { isNvl } from '@/utils/utils';

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
        data: { resultCode, resultMsg, result },
      } = yield call(queryNotificationsType, 2);
      if (resultCode === '0' || resultCode === 0) {
        const { dictionaryInfos } = result;
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
        data: { resultCode, resultMsg, result },
      } = yield call(queryNotificationsType, 3);
      if (resultCode === '0' || resultCode === 0) {
        const { dictionaryInfos } = result;
        yield put({
          type: 'save',
          payload: {
            targetTypeList: dictionaryInfos,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryStatusList(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryNotificationsType, 4);
      if (resultCode === '0' || resultCode === 0) {
        const { dictionaryInfos } = result;
        yield put({
          type: 'save',
          payload: {
            statusList: dictionaryInfos,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryAllCompanyConfig(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryAllCompanyConfig);
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          // market:[{"group1":[{company1},{company2}...]},{"group2":[{company3},{company4}...]}...]
          const marketTreeMap = new Map();
          // customerGroup:[{"group1":[{company1},{company3}...]},{"group2":[{company4},{company5}...]}...]
          const customerGroupTreeMap = new Map();
          result.forEach(n => {
            const { params = {} } = n;
            // make node in format: 'market1:[{companyInfo}]'
            // market1: {title:"", value:"", key:""}
            // companyInfo: {title:"", value:"", key:""}
            if (!isNvl(params.market)) {
              let marketTreeInfo = {
                title: !isNvl(params.marketName) ? `${params.marketName}` : `${params.market}`,
                value: `mk${params.market}`,
                key: `mk${params.market}`,
                children: [
                  {
                    title: n.value,
                    value: `market${n.key}`,
                    key: `market${n.key}`,
                  },
                ],
              };
              // check if exist same group, exist: only add company node, not exist: add group node
              if (marketTreeMap.has(String(params.market))) {
                // exist
                marketTreeInfo = marketTreeMap.get(String(params.market));
                marketTreeInfo.children.push({
                  title: n.value,
                  value: `market${n.key}`,
                  key: `market${n.key}`,
                });
              }
              // not exist
              marketTreeMap.set(String(params.market), marketTreeInfo);
            }
            // same logic with market
            if (!isNvl(params.customerGroup)) {
              let customerGroupTreeInfo = {
                title: !isNvl(params.customerGroupName)
                  ? `${params.customerGroupName}`
                  : `${params.customerGroup}`,
                value: `cG${params.customerGroup}`,
                key: `cG${params.customerGroup}`,
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
            }
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
    *saveData({ payload }, { put }) {
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
