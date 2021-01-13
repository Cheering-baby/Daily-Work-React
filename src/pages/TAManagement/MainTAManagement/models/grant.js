import { isEmpty } from 'lodash';
import * as service from '../services/mainTAManagement';
import { setSelected } from '../../../ProductManagement/utils/tools';

export default {
  namespace: 'grant',
  state: {
    addOfferModal: false,
    searchCondition: {
      commonSearchText: null,
      bindingId: null,
      bindingType: 'Agent',
      usageScope: 'Online',
      currentPage: 1,
      pageSize: 10,
    },
    addOfferList: [],
    searchOfferTotalSize: 0,
    checkedList: [],
    displayGrantOfferList: [],
    grantPagination: {
      currentPage: 1,
      pageSize: 10,
    },
    checkedOnlineList: [],
    subPLUList: [],
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    pagination2: {
      currentPage: 1,
      pageSize: 10,
    },
    bindingList: [],
    expandedRowKeys: [],
    selectedRowKeys: [],
    filter: {
      likeParam: {},
    },
    grantOfferList: [],
    checkedListLength: '',
    searchType: false,
    searchCheckList: [],
    searchVal: undefined,
  },
  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *fetch({ payload }, { call, put, select }) {
      const { agentId } = payload;
      const { filter } = yield select(state => state.grant);
      const { likeParam } = filter;
      let requestData = {
        agentId,
        bindingType: 'Offer',
      };

      if (!isEmpty(likeParam)) {
        requestData = {
          agentId,
          bindingType: 'Offer',
          commonSearchText: likeParam,
        };
      }
      const res = yield call(service.queryAgentBindingList, requestData);
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        const { bindingList } = result;
        yield put({
          type: 'changePage',
          payload: {
            checkedList: bindingList,
          },
        });
      } else throw resultMsg;
    },
    *fetch2({ payload }, { call, put }) {
      const { agentId } = payload;
      const request = {
        agentId,
        bindingType: 'Offer',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryAgentBindingList, request);
      if (resultCode === '0' || resultCode === 0) {
        const { bindingList } = result;
        yield put({
          type: 'save',
          payload: {
            checkedListLength: bindingList,
          },
        });
      } else throw resultMsg;
    },
    *fetchGrantOffer({ payload }, { call, put, select }) {
      const { checkedList } = yield select(state => state.grant);
      const { agentId } = payload;
      const requestData = {
        agentId,
        bindingType: 'Offer',
      };
      const res = yield call(service.queryGrantOffer, requestData);
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        const {
          page: { currentPage, pageSize },
          queryOfferList,
        } = result;

        const grantOfferList = [];
        if (currentPage * pageSize < queryOfferList.length) {
          for (let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i += 1) {
            grantOfferList.push(queryOfferList[i]);
          }
        } else {
          for (let i = (currentPage - 1) * pageSize; i < checkedList.length; i += 1) {
            grantOfferList.push(queryOfferList[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            grantOfferList,
          },
        });
      } else throw resultMsg;
    },
    *fetchCommodityList({ payload }, { call, put, select }) {
      const { searchCondition, checkedList } = yield select(state => state.grant);
      const params = { ...searchCondition, ...payload };
      yield put({
        type: 'save',
        payload: {
          searchCondition: params,
        },
      });
      const res = yield call(service.queryCommodityList, params);
      if (!res) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === 0 || resultCode === '0') {
        const { page, commodityList } = result;
        const { totalSize } = page;
        for (let i = 0; i < commodityList.length; i += 1) {
          commodityList[i].isSelected = false;
          if (commodityList[i].subCommodityList === null) {
            commodityList[i].subCommodityList = [];
          }
          for (let j = 0; j < commodityList[i].subCommodityList.length; j += 1) {
            commodityList[i].subCommodityList[j].isSelected = false;
            if (commodityList[i].subCommodityList[j].subCommodityList === null) {
              commodityList[i].subCommodityList[j].subCommodityList = [];
            }
            const { subCommodityList } = commodityList[i].subCommodityList[j];
            for (let k = 0; k < subCommodityList.length; k += 1) {
              if (subCommodityList[k].subCommodityList === null) {
                subCommodityList[k].subCommodityList = [];
              }
              subCommodityList[k].isSelected = false;
            }
          }
        }
        setSelected(commodityList, checkedList);
        yield put({
          type: 'save',
          payload: {
            searchOfferTotalSize: totalSize,
            addOfferList: commodityList || [],
          },
        });
      } else throw resultMsg;
    },
    *add({ payload }, { call }) {
      const { checkedList, agentList, bindingType } = payload;
      const subBindingList = [];
      for (let i = 0; i < checkedList.length; i += 1) {
        subBindingList.push({
          bindingId: checkedList[i].bindingId,
          bindingType: 'Offer',
          operationType: 'A',
        });
      }
      const reqParams = {
        agentList,
        bindingList: subBindingList,
        bindingType,
      };
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.add, reqParams);
      if (resultCode !== '0') {
        throw resultMsg;
      }
      return resultCode;
    },
    *queryCommodityBindingList({ payload }, { call, put, select }) {
      const { subPLUList } = yield select(state => state.grant);
      const { commoditySpecId } = payload;
      const params = {
        commoditySpecId,
        commoditySpecType: 'Offer',
      };
      const res = yield call(service.queryCommodityBindingList, params);
      if (!res) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === 0 || resultCode === '0') {
        const { subCommodityList } = result;
        subPLUList.push({
          commoditySpecId,
          subCommodityList,
        });
        yield put({
          type: 'save',
          payload: {
            subPLUList,
          },
        });
      } else throw resultMsg;
    },
    *search({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetchCommodityList',
        payload,
      });
    },
    *searchOffer({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetch',
        payload,
      });
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchCommodityList',
        payload,
      });
    },
    *saveData({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchCommodityList',
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
    saveSelectOffer(state, { payload }) {
      const { selectedRowKeys, addOfferList } = payload;
      for (let i = 0; i < addOfferList.length; i += 1) {
        let flag = true;
        for (let j = 0; j < selectedRowKeys.length; j += 1) {
          if (selectedRowKeys[j] === addOfferList[i].commoditySpecId) {
            addOfferList[i].isSelected = true;
            flag = false;
            let unSelected = true;
            for (let k = 0; k < addOfferList[i].subCommodityList.length; k += 1) {
              if (addOfferList[i].subCommodityList[k].isSelected === true) {
                unSelected = false;
              }
            }
            if (unSelected) {
              for (let k = 0; k < addOfferList[i].subCommodityList.length; k += 1) {
                addOfferList[i].subCommodityList[k].isSelected = true;
                for (
                  let l = 0;
                  l < addOfferList[i].subCommodityList[k].subCommodityList.length;
                  l += 1
                ) {
                  addOfferList[i].subCommodityList[k].subCommodityList[l].isSelected = true;
                }
              }
              addOfferList[i].subCommodityList.map(e => {
                Object.assign(e, {
                  isSelected: true,
                });
                return e;
              });
            }
          }
        }
        if (flag) {
          addOfferList[i].isSelected = false;
          for (let k = 0; k < addOfferList[i].subCommodityList.length; k += 1) {
            addOfferList[i].subCommodityList[k].isSelected = false;
            for (
              let j = 0;
              j < addOfferList[i].subCommodityList[k].subCommodityList.length;
              j += 1
            ) {
              addOfferList[i].subCommodityList[k].subCommodityList[j].isSelected = false;
            }
          }
        }
      }
      return {
        ...state,
        addOfferList,
      };
    },
    saveSubSelectOffer(state, { payload }) {
      const { subSelectedRowKeys, commoditySpecId, addOfferList } = payload;
      for (let i = 0; i < addOfferList.length; i += 1) {
        if (commoditySpecId === addOfferList[i].commoditySpecId) {
          for (let j = 0; j < addOfferList[i].subCommodityList.length; j += 1) {
            addOfferList[i].subCommodityList[j].isSelected = false;
            let flag = true;
            for (let k = 0; k < subSelectedRowKeys.length; k += 1) {
              if (addOfferList[i].subCommodityList[j].commoditySpecId === subSelectedRowKeys[k]) {
                flag = false;
                addOfferList[i].subCommodityList[j].isSelected = true;
                let unSelected = true;
                for (
                  let l = 0;
                  l < addOfferList[i].subCommodityList[j].subCommodityList.length;
                  l += 1
                ) {
                  if (addOfferList[i].subCommodityList[j].subCommodityList[l].isSelected) {
                    unSelected = false;
                  }
                }
                if (unSelected) {
                  for (
                    let l = 0;
                    l < addOfferList[i].subCommodityList[j].subCommodityList.length;
                    l += 1
                  ) {
                    addOfferList[i].subCommodityList[j].subCommodityList[l].isSelected = true;
                  }
                }
              }
            }
            if (flag) {
              for (
                let k = 0;
                k < addOfferList[i].subCommodityList[j].subCommodityList.length;
                k += 1
              ) {
                addOfferList[i].subCommodityList[j].subCommodityList[k].isSelected = false;
              }
            }
          }
          if (subSelectedRowKeys.length === 0) {
            addOfferList[i].isSelected = false;
          } else {
            addOfferList[i].isSelected = true;
          }
        }
      }
      return {
        ...state,
        addOfferList,
      };
    },
    changePage(state, { payload }) {
      const {
        searchType,
        grantPagination: { currentPage, pageSize },
      } = state;
      const { checkedList, searchCheckList = [] } = payload;
      const displayGrantOfferList = [];
      const targetList = searchType ? searchCheckList : checkedList;
      if (currentPage * pageSize < targetList.length) {
        for (let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i += 1) {
          displayGrantOfferList.push(targetList[i]);
        }
      } else {
        for (let i = (currentPage - 1) * pageSize; i < targetList.length; i += 1) {
          displayGrantOfferList.push(targetList[i]);
        }
      }
      return {
        ...state,
        displayGrantOfferList,
        checkedList,
        searchCheckList,
        expandedRowKeys: [],
      };
    },
    resetAddOffer(state) {
      return {
        ...state,
        addOfferModal: false,
        searchCondition: {
          commonSearchText: null,
          bindingId: null,
          bindingType: 'Agent',
          usageScope: 'Online',
          currentPage: 1,
          pageSize: 10,
        },
        addOfferList: [],
        searchOfferTotalSize: 0,
      };
    },
    clear(state) {
      return {
        ...state,
        addOfferModal: false,
        searchCondition: {
          commonSearchText: null,
          bindingId: null,
          bindingType: 'Agent',
          usageScope: 'Online',
          currentPage: 1,
          pageSize: 10,
        },
        addOfferList: [],
        searchOfferTotalSize: 0,
        checkedList: [],
        displayGrantOfferList: [],

        grantPagination: {
          currentPage: 1,
          pageSize: 10,
        },

        subPLUList: [],

        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        pagination2: {
          currentPage: 1,
          pageSize: 10,
        },
        bindingList: [],
        expandedRowKeys: [],

        selectedRowKeys: [],
        filter: {},
        grantOfferList: [],
        searchType: false,
        searchCheckList: [],
        searchVal: undefined,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, query: { taIdList } } = location;
        if (pathname !== '/TAManagement/MainTAManagement/Grant') {
          dispatch({ type: 'clear' });
        } else if(pathname === '/TAManagement/MainTAManagement/Grant') {
          const newTaIdList = taIdList.split(',');
          if (newTaIdList.length === 1) {
            dispatch({
              type: 'grant/fetch',
              payload: {
                agentId: newTaIdList[0],
              },
            });
            dispatch({
              type: 'grant/fetch2',
              payload: {
                agentId: newTaIdList[0],
              },
            });
          }
        }
      });
    },
  },
};
