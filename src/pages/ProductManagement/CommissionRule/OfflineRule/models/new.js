import * as service from '../services/offline';
import { objDeepCopy } from '@/pages/ProductManagement/utils/tools';

export default {
  namespace: 'offlineNew',
  state: {
    commissionScheme: 'Amount',
    commissionAmountValue: null,
    commissionPercentageValue: null,

    offlineSearchCondition: {
      bindingId: null,
      bindingType: 'Commission',
      usageScope: 'Offline',
      commonSearchText: null,
      themeParkCode: null,
      currentPage: 1,
      pageSize: 10,
    },
    addOfflinePLUTotalSize: 0,
    PLUList: [],
    checkedList: [],
    displayOfflineList: [],
    offlinePLUPagination: {
      currentPage: 1,
      pageSize: 10,
    },
    themeParkList: [],

    value: '',
    tieredCommissionRuleList: [],
    commission: [[]],
    addPLUModal: false,
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    selectedRowKeys: [],
  },
  effects: {
    *queryThemeParks(_, { call, put }) {
      const response = yield call(service.queryPluAttribute, { status: 'Active' });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { themeParkList: result.offerBookingCategoryList } });
      } else throw resultMsg;
    },
    *fetchPLUList({ payload }, { call, put, select }) {
      const { offlineSearchCondition, checkedList } = yield select(state => state.offlineNew);
      const params = { ...offlineSearchCondition, ...payload, commissionType: 'Fixed' };
      yield put({
        type: 'save',
        payload: {
          offlineSearchCondition: params,
        },
      });
      const paramsList = {
        ...params,
        bindingType: params.bindingId !== null ? 'Commission' : null,
      };
      const res = yield call(service.commodityList, paramsList);
      if (!res) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        const {
          page: { totalSize },
          commodityList,
        } = result;
        for (let i = 0; i < commodityList.length; i += 1) {
          commodityList[i].isSelected = false;
          for (let j = 0; j < commodityList[i].subCommodityList.length; j += 1) {
            commodityList[i].subCommodityList[j].isSelected = false;
          }
        }
        for (let i = 0; i < commodityList.length; i += 1) {
          let checkedCommodity = [];
          for (let j = 0; j < checkedList.length; j += 1) {
            if (checkedList[j].commoditySpecId === commodityList[i].commoditySpecId) {
              commodityList[i].isSelected = true;
              checkedCommodity = objDeepCopy(checkedList[j].subCommodityList);
            }
          }
          if (checkedCommodity.length > 0) {
            for (let j = 0; j < commodityList[i].subCommodityList.length; j += 1) {
              for (let k = 0; k < checkedCommodity.length; k += 1) {
                if (
                  checkedCommodity[k].commoditySpecId ===
                  commodityList[i].subCommodityList[j].commoditySpecId
                ) {
                  commodityList[i].subCommodityList[j].isSelected = true;
                }
              }
            }
          }
        }
        yield put({
          type: 'save',
          payload: {
            addOfflinePLUTotalSize: totalSize,
            PLUList: commodityList || [],
          },
        });
      } else throw resultMsg;
    },
    *add({ payload }, { call }) {
      const {
        commissionType,
        commissionScheme,
        commissionValue,
        commodityList,
        usageScope,
      } = payload;
      for (let i = 0; i < commodityList.length; i += 1) {
        const { subCommodityList } = commodityList[i];
        if (subCommodityList.length === 0) {
          commodityList[i].commissionList = {
            Fixed: {
              commissionType,
              usageScope,
              commissionScheme,
              commissionValue,
            },
          };
        } else {
          commodityList[i].commissionList = null;
          for (let j = 0; j < subCommodityList.length; j += 1) {
            subCommodityList[j].commissionList = {
              Fixed: {
                commissionType,
                usageScope,
                commissionScheme,
                commissionValue,
              },
            };
          }
        }
      }
      const res = yield call(service.add, { commodityList });
      if (!res) return false;
      const {
        data: { resultCode, resultMsg },
      } = res;
      if (resultCode !== '0') {
        throw resultMsg;
      }
      return resultCode;
    },
    *searchPLU({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetchPLUList',
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
    saveSelectPLU(state, { payload }) {
      const { selectedRowKeys, PLUList } = payload;
      for (let i = 0; i < PLUList.length; i += 1) {
        let flag = true;
        for (let j = 0; j < selectedRowKeys.length; j += 1) {
          if (selectedRowKeys[j] === PLUList[i].commoditySpecId) {
            PLUList[i].isSelected = true;
            flag = false;
            let unSelected = true;
            for (let k = 0; k < PLUList[i].subCommodityList.length; k += 1) {
              if (PLUList[i].subCommodityList[k].isSelected === true) {
                unSelected = false;
              }
            }
            if (unSelected) {
              PLUList[i].subCommodityList.map(e => {
                if (e.bindingOtherFlg !== 'Y') {
                  Object.assign(e, {
                    isSelected: true,
                  });
                }
                return e;
              });
            }
          }
        }
        if (flag) {
          PLUList[i].isSelected = false;
          for (let k = 0; k < PLUList[i].subCommodityList.length; k += 1) {
            PLUList[i].subCommodityList[k].isSelected = false;
          }
        }
      }
      return {
        ...state,
        PLUList,
      };
    },
    saveSubSelectPLU(state, { payload }) {
      const { subSelectedRowKeys, commoditySpecId, PLUList } = payload;
      for (let i = 0; i < PLUList.length; i += 1) {
        if (commoditySpecId === PLUList[i].commoditySpecId) {
          for (let j = 0; j < PLUList[i].subCommodityList.length; j += 1) {
            PLUList[i].subCommodityList[j].isSelected = false;
            for (let k = 0; k < subSelectedRowKeys.length; k += 1) {
              if (PLUList[i].subCommodityList[j].commoditySpecId === subSelectedRowKeys[k]) {
                if (PLUList[i].subCommodityList[j].bindingOtherFlg !== 'Y') {
                  PLUList[i].subCommodityList[j].isSelected = true;
                }
              }
            }
          }
          if (subSelectedRowKeys.length === 0) {
            PLUList[i].isSelected = false;
          } else {
            PLUList[i].isSelected = true;
          }
        }
      }
      return {
        ...state,
        PLUList,
      };
    },
    changeOfflinePage(state, { payload }) {
      const {
        offlinePLUPagination: { currentPage, pageSize },
      } = state;
      const { checkedList } = payload;
      const displayOfflineList = [];
      if (currentPage * pageSize < checkedList.length) {
        for (let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i += 1) {
          displayOfflineList.push(checkedList[i]);
        }
      } else {
        for (let i = (currentPage - 1) * pageSize; i < checkedList.length; i += 1) {
          displayOfflineList.push(checkedList[i]);
        }
      }

      return {
        ...state,
        displayOfflineList,
        checkedList,
      };
    },
    resetAddOfflinePLUData(state) {
      return {
        ...state,
        addPLUModal: false,
        offlineSearchCondition: {
          bindingId: null,
          bindingType: 'Commission',
          usageScope: 'Offline',
          commonSearchText: null,
          themeParkCode: null,
          currentPage: 1,
          pageSize: 10,
        },
        addOfflinePLUTotalSize: 0,
        PLUList: [],
      };
    },
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
        value: 'tiered',
        tieredCommissionRuleList: [],
        commission: [[]],
        checkedList: [],
        selectedRowKeys: [],
        // addPLUModal: false,
      };
    },
    resetData(state) {
      return {
        ...state,
        commissionScheme: 'Amount',
        commissionAmountValue: null,
        commissionPercentageValue: null,

        offlineSearchCondition: {
          bindingId: null,
          bindingType: 'Commission',
          usageScope: 'Offline',
          commonSearchText: null,
          themeParkCode: null,
          currentPage: 1,
          pageSize: 10,
        },
        addOfflinePLUTotalSize: 0,
        PLUList: [],
        checkedList: [],
        displayOfflineList: [],
        offlinePLUPagination: {
          currentPage: 1,
          pageSize: 10,
        },
        themeParkList: [],

        value: '',
        tieredCommissionRuleList: [],
        commission: [[]],
        addPLUModal: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        selectedRowKeys: [],
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRuleSetup/New') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
