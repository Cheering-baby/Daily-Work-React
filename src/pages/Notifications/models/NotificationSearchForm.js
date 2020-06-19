import { message } from 'antd';
import { queryAllCompanyConfig, queryNotificationsType, queryUserByRoles } from '../services/notification';
import { isNvl } from '@/utils/utils';
import {queryUserRolesByCondition} from "@/pages/SystemManagement/RoleManagement/service/roleService";
import {queryUsersByCondition} from "@/pages/SystemManagement/UserManagement/service/userService";

function companyString(a, b) {
  return String(a.title).toUpperCase() > String(b.title).toUpperCase() ? 1 : -1;
}

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
    *queryRoleByUsers( { payload }, {call, put}) {
      const { targetList } = payload;
      const roleList = [];
      const queryParam = {};
      queryParam.pageSize = 1000;
      queryParam.currentPage = 1;

      for(let item of targetList) {
        queryParam.userCode = item.targetObj;
        const {
          data: {resultCode, resultMsg, resultData},
        } = yield call(queryUsersByCondition, queryParam);
        if (resultCode !== '0') {
          message.warn(resultMsg, 10);
        }
        const { userProfiles = [] } = resultData;
        if(userProfiles.length > 0) {
          const { userRoles = [] } = userProfiles[0];
          if(userRoles.length > 0) {
            const { roleCode } = userRoles[0];
            roleList.push(roleCode);
          }
        }
      }
      for(let roleCode of roleList) {
        yield put({
          type: 'queryAllUserByRole',
          payload: {
            roleCode: roleCode,
          },
        });
      }
    },
    *queryAllUserByRole( { payload }, {call, select, put}) {
      const { roleCode } = payload;
      const queryParam = {};
      queryParam.pageSize = 1000;
      queryParam.currentPage = 1;
      queryParam.roleCodes = new Array(roleCode);
      const {
        data: {resultCode, resultMsg, resultData},
      } = yield call(queryUserByRoles, queryParam);
      if (resultCode !== '0') {
        message.warn(resultMsg, 10);
      }
      const { userProfiles = [] } = resultData;
      const userTreeMap = new Map();
      userProfiles.forEach(user => {
        let userTreeInfo = {
          title: user.userCode,
          value: `&{${roleCode}}&.${user.userCode}`,
          key: `&{${roleCode}}&.${user.userCode}`,
          isLeaf: true
        };
        userTreeMap.set(String(user.userCode), userTreeInfo);
      });
      const userTreeList = [...userTreeMap.values()];
      userTreeList.sort(companyString);
      const { targetTreeData } = yield select(state => state.notificationSearchForm);
      if(targetTreeData && targetTreeData.length > 0) {
        const marketTree = targetTreeData.find(n => String(n.key) === 'market') || {};
        const customerGroupTree = targetTreeData.find(n => String(n.key) === 'customerGroup') || {};
        const roleTree = targetTreeData.find(n => String(n.key) === 'RWS') || {};
        if (roleTree && roleTree.children && roleTree.children.length > 0) {
          roleTree.children.forEach(item => {
            if (roleCode === String(item.key.replace('role', ''))) {
              item.children = userTreeList;
            }
          });
        }
        const newTreeData = [];
        newTreeData.push(marketTree);
        newTreeData.push(customerGroupTree);
        newTreeData.push(roleTree);
        yield put({
          type: 'save',
          payload: {
            targetTreeData: newTreeData,
          },
        });
      }
      return userTreeMap;
    },
    *queryAllRole(_, {call, select, put}) {
      const queryPageParam = {};
      queryPageParam.pageSize = 1000;
      queryPageParam.currentPage = 1;
      queryPageParam.roleType = '01';
      const {
        data: {resultCode, resultMsg, resultData},
      } = yield call(queryUserRolesByCondition, queryPageParam);
      if (resultCode !== '0') {
        message.warn(resultMsg, 10);
      }

      const {userRoles = []} = resultData;
      if (userRoles.length > 0) {
        const roleTreeMap = new Map();
        userRoles.forEach(role => {
          let roleTreeInfo = {
            title: role.roleCode,
            value: `role${role.roleCode}`,
            key: `role${role.roleCode}`,
          };
          roleTreeMap.set(String(role.roleCode), roleTreeInfo);
        });
        const roleTreeList = [...roleTreeMap.values()];
        roleTreeList.sort(companyString);
        const { targetTreeData } = yield select(state => state.notificationSearchForm);
        yield put({
          type: 'save',
          payload: {
            targetTreeData: [
              ...targetTreeData,
              {
                title: 'RWS',
                value: 'RWS',
                key: 'RWS',
                children: roleTreeList,
              }
            ],
          },
        });
      }
    },
    *queryAllCompanyConfig(_, { call, put }) {
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryAllCompanyConfig);
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          // market:[{"group1":[{company1},{company2}...]},{"group2":[{company3},{company4}...]}...]
          const marketTreeMap = new Map();
          // customerGroup:[{"group1":[{company1},{company3}...]},{"group2":[{company4},{company5}...]}...]
          const customerGroupTreeMap = new Map();
          result.forEach(n => {
            const {params = {}} = n;
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
                    isLeaf: true
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
                  isLeaf: true
                });
              }
              if(marketTreeInfo.children && marketTreeInfo.children.length > 0) {
                marketTreeInfo.children.sort(companyString);
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
                    isLeaf: true
                  },
                ],
              };
              if (customerGroupTreeMap.has(String(params.customerGroup))) {
                customerGroupTreeInfo = customerGroupTreeMap.get(String(params.customerGroup));
                customerGroupTreeInfo.children.push({
                  title: n.value,
                  value: `customerGroup${n.key}`,
                  key: `customerGroup${n.key}`,
                  isLeaf: true
                });
              }
              if(customerGroupTreeInfo.children && customerGroupTreeInfo.children.length > 0) {
                customerGroupTreeInfo.children.sort(companyString);
              }
              customerGroupTreeMap.set(String(params.customerGroup), customerGroupTreeInfo);
            }
          });
          // sort
          const marketTreeList = [...marketTreeMap.values()];
          const customerGroupList = [...customerGroupTreeMap.values()];
          marketTreeList.sort(companyString);
          customerGroupList.sort(companyString);
          yield put({
            type: 'save',
            payload: {
              targetTreeData: [
                {
                  title: 'Market',
                  value: 'market',
                  key: 'market',
                  children: marketTreeList,
                },
                {
                  title: 'Customer Group',
                  value: 'customerGroup',
                  key: 'customerGroup',
                  children: customerGroupList,
                },
              ],
            },
          });
        }
      } else message.warn(resultMsg, 10);
      yield put({
        type: 'queryAllRole',
      })
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
