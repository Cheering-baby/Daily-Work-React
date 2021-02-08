import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { router } from 'umi';
import moment from 'moment';
import * as service from '../services/commissionRuleSetup';
import { objDeepCopy, setSelected, checkSelectDisable } from '../../../utils/tools';

export default {
  namespace: 'commissionNew',
  state: {
    value: 'tiered',
    tieredCommissionRuleList: [],
    commission: [[]],
    addBindingModal: false,
    addPLUModal: false,
    addCommissionSchema: false,
    type: '',

    onlineSearchCondition: {
      bindingId: null,
      bindingType: 'Commission',
      usageScope: 'Online',
      commonSearchText: null,
      themeParkCode: null,
      currentPage: 1,
      pageSize: 10,
    },
    addOnlinePLUTotalSize: 0,
    offerList: [],
    checkedOnlineList: [],
    displayOnlineList: [],
    themeParkList: [],

    onlineOfferPagination: {
      currentPage: 1,
      pageSize: 10,
    },

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

    pagination2: {
      currentPage: 1,
      pageSize: 10,
    },
    filter: {},
    ifEdit: false,
    ifAdd: false,

    selectedRowKeys2: [],

    commissionTplList: [],
    expandedRowKeys: [],
    index: undefined,
    offerExistedDisales: [],
    PLUSelected: [],
    PLUSelectItem: [],
    activityId: undefined,
    PLURelationList: [],
    commoditySpecId: null,

    excludedTA: {
      showAddTA: false,
      showGrantedOffer: false,
      agentIdOrCompanyName: null,
      selectedTAId: [],
      excludedTAList: [],
      grantOfferList: [],
      grantOfferListFilter: [],
      grantOfferSearch: false,
      grantOfferSearchOfferKey: '',
      addTAPagination: {
        pageSize: 10,
        currentPage: 1,
      },
      excludedTAPagination: {
        pageSize: 10,
        currentPage: 1,
      },
      grantOfferListPagination: {
        pageSize: 10,
        currentPage: 1,
      },
    },
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
    *queryBindingDetailList({ payload }, { call, put }) {
      const { usageScope } = payload;
      const res = yield call(service.queryCommissionBindingList, payload);
      if (!res) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        const { commodityList } = result;
        if (usageScope === 'Online') {
          for (let i = 0; i < commodityList.length; i += 1) {
            commodityList[i].selectedType = 'offerPLU';
            for (let j = 0; j < commodityList[i].subCommodityList.length; j += 1) {
              commodityList[i].subCommodityList[j].selectedType = 'subPLU';
              commodityList[i].subCommodityList[j].proCommoditySpecId =
                commodityList[i].commoditySpecId;
              for (
                let k = 0;
                k < commodityList[i].subCommodityList[j].subCommodityList.length;
                k += 1
              ) {
                commodityList[i].subCommodityList[j].selectedType = 'packagePLU';
                commodityList[i].subCommodityList[j].subCommodityList[k].selectedType = 'subPLU';
                commodityList[i].subCommodityList[j].subCommodityList[k].proCommoditySpecId =
                  commodityList[i].subCommodityList[j].commoditySpecId;
                commodityList[i].subCommodityList[j].subCommodityList[k].proProCommoditySpecId =
                  commodityList[i].commoditySpecId;
              }
              if (!commodityList[i].subCommodityList[j].subCommodityList.length) {
                commodityList[i].subCommodityList[j].subCommodityListNull = true;
              }
            }
            if (!commodityList[i].subCommodityList.length) {
              commodityList[i].subCommodityListNull = true;
            }
          }
          yield put({
            type: 'changeOnlinePage',
            payload: {
              checkedOnlineList: commodityList || [],
            },
          });
        } else if (usageScope === 'Offline') {
          for (let i = 0; i < commodityList.length; i += 1) {
            commodityList[i].selectedType = 'subPLU';
            for (let j = 0; j < commodityList[i].subCommodityList.length; j += 1) {
              commodityList[i].selectedType = 'packagePLU';
              commodityList[i].subCommodityList[j].proCommoditySpecId =
                commodityList[i].commoditySpecId;
              commodityList[i].subCommodityList[j].selectedType = 'subPLU';
            }
          }
          yield put({
            type: 'changeOfflinePage',
            payload: {
              checkedList: commodityList || [],
            },
          });
        }
      } else throw resultMsg;
    },
    *fetchOfferList({ payload }, { call, put, select }) {
      const { onlineSearchCondition, checkedOnlineList } = yield select(
        state => state.commissionNew
      );
      const { effectiveStartDate, effectiveEndDate, commissionType } = yield select(
        state => state.detail
      );
      const effectiveDate = effectiveStartDate && moment(effectiveStartDate).format('YYYY-MM-DD');
      const expiryDate = effectiveEndDate && moment(effectiveEndDate).format('YYYY-MM-DD');

      const params = {
        ...onlineSearchCondition,
        ...payload,
        effectiveDate,
        expiryDate,
        commissionType,
      };
      yield put({
        type: 'save',
        payload: {
          onlineSearchCondition: params,
        },
      });
      const paramsList = {
        ...params,
        bindingType: params.bindingId !== null ? 'Commission' : null,
      };
      const res = yield call(service.offerList, paramsList);
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
        setSelected(commodityList, checkedOnlineList);
        yield put({
          type: 'save',
          payload: {
            addOnlinePLUTotalSize: totalSize,
            offerList: commodityList || [],
            selectedRowKeys: [],
            selectedOffer: [],
          },
        });
      } else throw resultMsg;
    },
    *fetchPLUList({ payload }, { call, put, select }) {
      const { offlineSearchCondition, checkedList } = yield select(state => state.commissionNew);
      const { effectiveStartDate, effectiveEndDate, commissionType } = yield select(
        state => state.detail
      );
      const effectiveDate = effectiveStartDate && moment(effectiveStartDate).format('YYYY-MM-DD');
      const expiryDate = effectiveEndDate && moment(effectiveEndDate).format('YYYY-MM-DD');

      const params = {
        ...offlineSearchCondition,
        ...payload,
        effectiveDate,
        expiryDate,
        commissionType,
      };
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
      const res = yield call(service.offerList, paramsList);
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
    *queryAgentOfferBindingList({ payload }, { call, put, select }) {
      const {
        checkedOnlineList,
        excludedTA: {
          excludedTAList,
          agentIdOrCompanyName,
          addTAPagination: { pageSize, currentPage },
        },
      } = yield select(state => state.commissionNew);
      const params = {
        offerNos: checkedOnlineList.map(i => i.commodityCode),
        pageBean: {
          currentPage,
          pageSize,
        },
        filter: agentIdOrCompanyName,
        ...payload,
      };
      const res = yield call(service.queryAgentOfferBindingList, params);
      if (!res) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        const { taInfoList: taAddInfoList, pageBean } = result;
        yield put({
          type: 'saveExcludedTA',
          payload: {
            taAddInfoList,
            selectedTAId: excludedTAList.map(i => i.taId),
            addTAPagination: {
              totalSize: pageBean.totalRecord,
              pageSize: pageBean.pageSize,
              currentPage: pageBean.currentPage,
            },
          },
        });
        return taAddInfoList;
      }
      throw resultMsg;
    },
    *add({ payload }, { call, put }) {
      const { params, tieredList, commodityList, usageScope } = payload;
      const reqParams = {
        ...params,
        tieredList,
        commodityList,
        usageScope,
      };
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.add, reqParams);
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'commissionRuleSetup/fetchCommissionRuleSetupList',
        });
        router.push({
          pathname: '/ProductManagement/CommissionRule/OnlineRule',
        });
      } else {
        if (params.commissionScheme === 'Percentage') {
          if (tieredList && tieredList.length > 0) {
            tieredList.map(v => {
              Object.assign(v, {
                commissionValue: parseFloat(v.commissionValue * 100).toFixed(),
              });
              return v;
            });
          }
        }
        message.error(resultMsg);
      }
    },
    *edit({ payload }, { call }) {
      const {
        params,
        tieredList,
        commodityList,
        tplId,
        usageScope,
        tplVersion,
        taFilterList,
      } = payload;
      const reqParams = {
        ...params,
        tieredList,
        commodityList,
        tplId,
        usageScope,
        tplVersion,
        taFilterList,
      };
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.add, reqParams);
      if (resultCode !== '0') {
        if (params.commissionScheme === 'Percentage') {
          if (tieredList && tieredList.length > 0) {
            tieredList.map(v => {
              Object.assign(v, {
                commissionValue: parseFloat(v.commissionValue * 100).toFixed(),
              });
              return v;
            });
          }
        }
        message.error(resultMsg);
      }
      return resultCode;
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
        type: 'fetchOfferList',
        payload,
      });
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
        payload,
      });
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchOfferList',
        payload,
      });
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
        type: 'fetchPLUList',
      });
    },
    *resetPLU({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchPLUList',
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
        type: 'fetchPLUList',
      });
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
    clean(state) {
      return {
        ...state,
        value: 'tiered',
        tieredCommissionRuleList: [],
        commission: [[]],
        addBindingModal: false,
        addPLUModal: false,
        addCommissionSchema: false,
        type: '',

        onlineSearchCondition: {
          bindingId: null,
          bindingType: 'Commission',
          usageScope: 'Online',
          commonSearchText: null,
          themeParkCode: null,
          currentPage: 1,
          pageSize: 10,
        },
        addOnlinePLUTotalSize: 0,
        offerList: [],
        checkedOnlineList: [],
        displayOnlineList: [],
        themeParkList: [],

        onlineOfferPagination: {
          currentPage: 1,
          pageSize: 10,
        },

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

        pagination2: {
          currentPage: 1,
          pageSize: 10,
        },
        filter: {},
        ifEdit: false,
        ifAdd: false,

        selectedRowKeys2: [],

        commissionTplList: [],
        expandedRowKeys: [],
        index: undefined,
        offerExistedDisales: [],
        PLUSelected: [],
        PLUSelectItem: [],
        activityId: undefined,
        PLURelationList: [],
        commoditySpecId: null,
      };
    },
    saveSelectOffer(state, { payload }) {
      const { selectedRowKeys, offerList } = payload;
      for (let i = 0; i < offerList.length; i += 1) {
        let flag = true;
        for (let j = 0; j < selectedRowKeys.length; j += 1) {
          if (selectedRowKeys[j] === offerList[i].commoditySpecId) {
            offerList[i].isSelected = true;
            flag = false;
            if (
              offerList[i].subCommodityList.filter(item => item.isSelected === true).length === 0
            ) {
              offerList[i].subCommodityList.forEach(item => {
                const { bindingOtherFlg, subCommodityList = [] } = item;
                if (bindingOtherFlg !== 'Y' && !checkSelectDisable(subCommodityList)) {
                  item.isSelected = true;
                }
                for (let l = 0; l < item.subCommodityList.length; l += 1) {
                  if (item.subCommodityList[l].bindingOtherFlg !== 'Y') {
                    item.subCommodityList[l].isSelected = true;
                  }
                }
              });
            }
          }
        }
        if (flag) {
          offerList[i].isSelected = false;
          for (let k = 0; k < offerList[i].subCommodityList.length; k += 1) {
            offerList[i].subCommodityList[k].isSelected = false;
            for (let j = 0; j < offerList[i].subCommodityList[k].subCommodityList.length; j += 1) {
              offerList[i].subCommodityList[k].subCommodityList[j].isSelected = false;
            }
          }
        }
      }
      return {
        ...state,
        offerList,
      };
    },
    saveSubSelectOffer(state, { payload }) {
      const { subSelectedRowKeys, commoditySpecId, offerList } = payload;
      for (let i = 0; i < offerList.length; i += 1) {
        if (commoditySpecId === offerList[i].commoditySpecId) {
          for (let j = 0; j < offerList[i].subCommodityList.length; j += 1) {
            offerList[i].subCommodityList[j].isSelected = false;
            let flag = true;
            for (let k = 0; k < subSelectedRowKeys.length; k += 1) {
              if (offerList[i].subCommodityList[j].commoditySpecId === subSelectedRowKeys[k]) {
                flag = false;
                if (offerList[i].subCommodityList[j].bindingOtherFlg !== 'Y') {
                  offerList[i].subCommodityList[j].isSelected = true;
                }

                let unSelected = true;
                for (
                  let l = 0;
                  l < offerList[i].subCommodityList[j].subCommodityList.length;
                  l += 1
                ) {
                  if (offerList[i].subCommodityList[j].subCommodityList[l].isSelected) {
                    unSelected = false;
                  }
                }
                if (unSelected) {
                  for (
                    let l = 0;
                    l < offerList[i].subCommodityList[j].subCommodityList.length;
                    l += 1
                  ) {
                    if (
                      offerList[i].subCommodityList[j].subCommodityList[l].bindingOtherFlg !== 'Y'
                    ) {
                      offerList[i].subCommodityList[j].subCommodityList[l].isSelected = true;
                    }
                  }
                }
              }
            }
            if (flag) {
              for (
                let k = 0;
                k < offerList[i].subCommodityList[j].subCommodityList.length;
                k += 1
              ) {
                offerList[i].subCommodityList[j].subCommodityList[k].isSelected = false;
              }
            }
          }
          if (subSelectedRowKeys.length === 0) {
            offerList[i].isSelected = false;
          } else {
            offerList[i].isSelected = true;
          }
        }
      }
      return {
        ...state,
        offerList,
      };
    },
    saveSubSubSelectOffer(state, { payload }) {
      const { subSubSelectedRowKeys, commoditySpecId, subCommoditySpecId, offerList } = payload;
      for (let i = 0; i < offerList.length; i += 1) {
        if (commoditySpecId === offerList[i].commoditySpecId) {
          for (let j = 0; j < offerList[i].subCommodityList.length; j += 1) {
            if (offerList[i].subCommodityList[j].commoditySpecId === subCommoditySpecId) {
              if (subSubSelectedRowKeys.length === 0) {
                offerList[i].subCommodityList[j].isSelected = false;
                offerList[i].isSelected = false;
                for (let k = 0; k < offerList[i].subCommodityList.length; k += 1) {
                  if (offerList[i].subCommodityList[k].isSelected) {
                    offerList[i].isSelected = true;
                  }
                }
              } else {
                offerList[i].subCommodityList[j].isSelected = true;
                offerList[i].isSelected = true;
              }
              for (
                let k = 0;
                k < offerList[i].subCommodityList[j].subCommodityList.length;
                k += 1
              ) {
                offerList[i].subCommodityList[j].subCommodityList[k].isSelected = false;
                for (let l = 0; l < subSubSelectedRowKeys.length; l += 1) {
                  if (
                    offerList[i].subCommodityList[j].subCommodityList[k].commoditySpecId ===
                    subSubSelectedRowKeys[l]
                  ) {
                    offerList[i].subCommodityList[j].subCommodityList[k].isSelected = true;
                  }
                }
              }
            }
          }
        }
      }
      return {
        ...state,
        offerList,
      };
    },
    changeOnlinePage(state, { payload }) {
      const {
        onlineOfferPagination: { currentPage, pageSize },
      } = state;
      const { checkedOnlineList } = payload;
      const displayOnlineList = [];
      if (currentPage * pageSize < checkedOnlineList.length) {
        for (let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i += 1) {
          displayOnlineList.push(checkedOnlineList[i]);
        }
      } else {
        for (let i = (currentPage - 1) * pageSize; i < checkedOnlineList.length; i += 1) {
          displayOnlineList.push(checkedOnlineList[i]);
        }
      }

      return {
        ...state,
        displayOnlineList,
        checkedOnlineList,
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
                PLUList[i].subCommodityList[j].isSelected = true;
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
    resetAddOnlinePLUData(state) {
      return {
        ...state,
        addBindingModal: false,
        onlineSearchCondition: {
          bindingId: null,
          bindingType: 'Commission',
          usageScope: 'Online',
          commonSearchText: null,
          themeParkCode: null,
          currentPage: 1,
          pageSize: 10,
        },
        addOnlinePLUTotalSize: 0,
        offerList: [],
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
    saveExcludedTA(state, { payload }) {
      return {
        ...state,
        excludedTA: {
          ...state.excludedTA,
          ...payload,
        },
      };
    },
    clear(state) {
      return {
        ...state,
        value: 'tiered',
        tieredCommissionRuleList: [],
        commission: [[]],
        addBindingModal: false,
        addPLUModal: false,
        addCommissionSchema: false,
        type: '',

        onlineSearchCondition: {
          bindingId: null,
          bindingType: 'Commission',
          usageScope: 'Online',
          commonSearchText: null,
          themeParkCode: null,
          currentPage: 1,
          pageSize: 10,
        },
        addOnlinePLUTotalSize: 0,
        offerList: [],
        checkedOnlineList: [],
        displayOnlineList: [],
        themeParkList: [],

        onlineOfferPagination: {
          currentPage: 1,
          pageSize: 10,
        },

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

        pagination2: {
          currentPage: 1,
          pageSize: 10,
        },
        filter: {},
        ifEdit: false,
        ifAdd: false,

        selectedRowKeys2: [],

        commissionTplList: [],
        expandedRowKeys: [],
        index: undefined,
        offerExistedDisales: [],
        PLUSelected: [],
        PLUSelectItem: [],
        activityId: undefined,
        PLURelationList: [],
        commoditySpecId: null,

        excludedTA: {
          showAddTA: false,
          showGrantedOffer: false,
          agentIdOrCompanyName: null,
          selectedTAId: [],
          excludedTAList: [],
          grantOfferList: [],
          grantOfferListFilter: [],
          grantOfferSearch: false,
          grantOfferSearchOfferKey: '',
          addTAPagination: {
            pageSize: 10,
            currentPage: 1,
          },
          excludedTAPagination: {
            pageSize: 10,
            currentPage: 1,
          },
          grantOfferListPagination: {
            pageSize: 10,
            currentPage: 1,
          },
        },
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRule/OnlineRule') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
