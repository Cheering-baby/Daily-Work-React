import {message} from 'antd';
import moment from 'moment';
import {queryCountry, queryOfferDetail, queryOfferList} from '../services/ticketCommon';

import {getSessionTimeList} from '../utils/ticketOfferInfoUtil';

const takeLatest = { type: 'takeLatest' };
export default {
  namespace: 'ticketMgr',

  state: {
    offerType: '',
    themeParkTipType: 'NoTip',
    activeDataPanel: undefined,
    activeGroup: 0,
    showToCart: false,
    tipVisible: true,
    themeParkList: [
      {
        group: 1,
        value: 'USS',
        label: 'Universal Studios Singapore',
        disabled: false,
      },
      {
        group: 1,
        value: 'ACW',
        label: 'Adventure Cove water Park',
        disabled: false,
      },
      {
        group: 1,
        value: 'SEA',
        label: 'S.E.A Aquarium',
        disabled: false,
      },
      {
        group: 1,
        value: 'MEM',
        label: 'Maritime Experiential Museum',
        disabled: false,
      },
      {
        group: 1,
        value: 'Voucher',
        label: 'Voucher',
        disabled: false,
      },
      {
        group: 1,
        value: 'RE',
        label: 'Resort Events',
        disabled: false,
      },
      {
        group: 1,
        value: 'HHN',
        label: 'Halloween Horror Nights',
        disabled: false,
      },
      {
        group: 2,
        value: 'DOL',
        label: 'Dolphin Island',
        disabled: false,
      },
      {
        group: 3,
        value: 'OAP',
        label: 'Once A Pirate',
        disabled: false,
      },
    ],
    themeParkChooseList: [],
    dateOfVisit: null,
    sessionTimeList: [],
    activeGroupSelectData: {
      themeParkCode: undefined,
      visitOfDate: undefined,
      sessionTime: undefined,
      numOfGuests: undefined,
      accessibleSeat: undefined,
    },
    numOfGuests: undefined,
    selectOfferData: [],
    orderIndex: null,
    onceAPirateOrder: null,
    searchPanelActive: false,
    mainPageLoading: false,
    onceAPirateLoading: false,
  },

  effects: {
    *changeOfferType({ payload }, { put }) {
      const { offerType } = payload;
      yield put({
        type: 'save',
        payload: { offerType },
      });
    },
    *changeTipVisible({ payload }, { put }) {
      const { tipVisible } = payload;
      yield put({
        type: 'save',
        payload: { tipVisible },
      });
    },
    *resetEditOnceAPirateOrder(_, { put, select }) {
      const { themeParkList } = yield select(state => state.ticketMgr);
      const newThemeParkList = themeParkList.map(themePark => {
        const newData = Object.assign(
          {},
          {
            ...themePark,
            disabled: themePark.value !== 'OAP',
          }
        );
        return newData;
      });
      yield put({
        type: 'save',
        payload: {
          orderIndex: null,
          onceAPirateOrder: null,
          themeParkList: newThemeParkList,
          searchPanelActive: false,
        },
      });
    },
    *initEditOnceAPirateOrder(_, { put, select, take }) {
      const { onceAPirateOrder, themeParkList } = yield select(state => state.ticketMgr);
      const newThemeParkList = themeParkList.map(themePark => {
        const newData = Object.assign(
          {},
          {
            ...themePark,
            disabled: true,
          }
        );
        return newData;
      });
      const sessionTimeList = [onceAPirateOrder.queryInfo.sessionTime];
      yield put({
        type: 'save',
        payload: {
          activeDataPanel: 1,
          activeGroup: 3,
          themeParkTipType: '1',
          activeGroupSelectData: onceAPirateOrder.queryInfo,
          dateOfVisit: onceAPirateOrder.queryInfo.dateOfVisit,
          themeParkList: newThemeParkList,
          searchPanelActive: true,
          mainPageLoading: true,
          sessionTimeList,
          themeParkChooseList: ['OAP'],
        },
      });
      yield put({
        type: 'querySessionTime',
        payload: {
          dateOfVisit: onceAPirateOrder.queryInfo.dateOfVisit,
        },
      });
      yield take('querySessionTime/@@end'); // go on after waiting querySessionTime finish.
      yield put({
        type: 'queryOAPOfferList',
        payload: {
          formData: onceAPirateOrder.queryInfo,
        },
      });
      yield take('queryOAPOfferList/@@end'); // go on after waiting queryOAPOfferList finish.
      yield put({
        type: 'save',
        payload: {
          mainPageLoading: false,
        },
      });
    },
    *querySessionTime(_, { call, put, select }) {
      const { dateOfVisit, themeParkChooseList = [] } = yield select(state => state.ticketMgr);
      let sessionTimeList = [];

      const requestParams = themeParkChooseList.map(() => ({
        paramCode: 'BookingCategory',
        paramValue: 'OAP',
      }));
      const requestParam = {
        pageSize: 100,
        currentPage: 1,
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
        requestParams,
      };
      const response = yield call(queryOfferList, requestParam);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { offerList = [] } = result;
        for (let i = 0; i < offerList.length; i += 1) {
          const queryOfferDetailReqParam = {
            offerNo: offerList[i].offerNo,
            validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
          };
          const responseDetail = yield call(queryOfferDetail, queryOfferDetailReqParam);
          if (responseDetail && responseDetail.success) {
            const {
              data: {resultCode: queryOfferDetailResultCode, resultMsg: queryOfferDetailResultMsg},
            } = responseDetail;
            if (queryOfferDetailResultCode !== '0') {
              message.error(queryOfferDetailResultMsg);
            } else {
              const {
                data: {
                  result: { offerProfile },
                },
              } = responseDetail;
              offerList[i].offerProfile = offerProfile;
              sessionTimeList = getSessionTimeList(offerProfile, requestParam.validTimeFrom);
            }
          } else {
            message.error(responseDetail.errorMsg);
          }
        }
        sessionTimeList.sort();
        yield put({
          type: 'save',
          payload: {
            selectOfferData: offerList,
            sessionTimeList,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *queryOAPOfferList({ payload }, { call, put, select }) {
      const {
        orderIndex,
        onceAPirateOrder,
        dateOfVisit,
        themeParkChooseList = [],
      } = yield select(state => state.ticketMgr);

      yield put({
        type: 'save',
        payload: {
          onceAPirateLoading: true,
          activeDataPanel: 1,
          activeGroupSelectData: {
            themeParkCode: 'OAP',
            themeParkChooseList,
            ...payload.formData,
          },
        },
      });

      const requestParams = [
        {
          paramCode: 'BookingCategory',
          paramValue: 'OAP',
        },
      ];

      const requestParam = {
        pageSize: 100,
        currentPage: 1,
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
        requestParams,
      };

      const response = yield call(queryOfferList, requestParam);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { offerList = [] } = result;
        for (let i = 0; i < offerList.length; i += 1) {
          const queryOfferDetailReqParam = {
            offerNo: offerList[i].offerNo,
            validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
          };
          const responseDetail = yield call(queryOfferDetail, queryOfferDetailReqParam);
          if (responseDetail && responseDetail.success) {
            const {
              data: {resultCode: queryOfferDetailResultCode, resultMsg: queryOfferDetailResultMsg},
            } = responseDetail;
            if (queryOfferDetailResultCode !== '0') {
              message.error(queryOfferDetailResultMsg);
            } else {
              const {
                data: {
                  result: { offerProfile },
                },
              } = responseDetail;
              offerList[i].offerProfile = offerProfile;
            }
          } else {
            message.error(responseDetail.errorMsg);
          }
        }
        yield put({
          type: 'save',
          payload: {
            selectOfferData: offerList,
            onceAPirateLoading: false,
          },
        });

        yield put({
          type: 'onceAPirateTicketMgr/saveOfferData',
          payload: {
            orderIndex,
            onceAPirateOrder,
            offerList,
            requestParam,
            activeGroupSelectData: {
              ...payload.formData,
            },
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            onceAPirateLoading: false,
          },
        });
        message.error(resultMsg);
      }
    },
    queryOfferList: [
      // eslint-disable-next-line func-names
      function*({ payload }, { select, put, call }) {
        const response = yield call(queryOfferList, payload);
        const {
          themeParkList: attractionList = [],
          themeParkChooseList = [],
          dateOfVisit,
          numOfGuests,
        } = yield select(({ ticketMgr }) => ticketMgr);
        if (!response) return false;
        const {
          data: { resultCode, resultMsg, result },
        } = response;
        if (resultCode === '0') {
          const themeParkList = [];
          const tags = ['Admission', 'VIP Tour', 'Express', 'Promo', 'Group'];
          const categories = tags.map(item => ({ tag: item, products: [], bundleNames: [] }));
          themeParkChooseList.forEach(item => {
            attractionList.forEach(item2 => {
              if (item2.value === item) {
                themeParkList.push({
                  themeparkCode: item,
                  themeparkName: item2.label,
                  offerNos: [],
                  products: [],
                  categories,
                });
              }
            });
          });
          const { offerList = [] } = result;
          for (let i = 0; i < offerList.length; i += 1) {
            const { offerNo } = offerList[i];
            const params = {
              offerNo,
              validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
            };
            const responseDetail = yield call(queryOfferDetail, params);
            if (!responseDetail) return false;
            const {
              data: { result: resultDetail },
            } = responseDetail;
            const {
              data: {resultCode: queryOfferDetailResultCode, resultMsg: queryOfferDetailResultMsg},
            } = responseDetail;
            if (queryOfferDetailResultCode !== '0') {
              message.error(queryOfferDetailResultMsg);
              // eslint-disable-next-line no-continue
              continue;
            }
            let attractionProduct;
            let noMatchPriceRule = false;
            let priceRuleId;
            // const {
            // offerProfile: { inventories = [] },
            // } = resultDetail;
            // eslint-disable-next-line no-loop-func
            resultDetail.offerProfile.productGroup.forEach(item => {
              const { productType } = item;
              if (productType === 'Attraction') {
                item.productGroup.forEach(item2 => {
                  if (item2.groupName === 'Attraction') {
                    attractionProduct = item2.products;
                    if (attractionProduct[0].priceRule.length <= 1) {
                      noMatchPriceRule = true;
                    } else {
                      // eslint-disable-next-line prefer-destructuring
                      priceRuleId = attractionProduct[0].priceRule[1].priceRuleId;
                    }
                    if (noMatchPriceRule) return false;
                    let allProductInventory = 0;
                    attractionProduct.forEach(item3 => {
                      const { priceRule, needChoiceCount } = item3;
                      priceRule.forEach(item4 => {
                        const { priceRuleName, productPrice = [] } = item4;
                        if (priceRuleName === 'DefaultPrice') {
                          // eslint-disable-next-line no-unused-vars
                          const maxProductInventory1 =
                            productPrice[0].productInventory === -1
                              ? 100000000 / needChoiceCount
                              : productPrice[0].productInventory / needChoiceCount;
                          // const maxProductInventory2 = inventories[0].available === -1 ? 100000000 / needChoiceCount : inventories[0].available / needChoiceCount;
                          allProductInventory += maxProductInventory1;
                        }
                      });
                    });
                    if (allProductInventory >= numOfGuests) {
                      attractionProduct.forEach((item3, index3) => {
                        themeParkList.forEach((item4, index4) => {
                          if (
                            item4.themeparkCode === item3.attractionProduct.themePark &&
                            item4.offerNos.indexOf(offerNo) === -1
                          ) {
                            const data = {};
                            data.attractionProduct = attractionProduct;
                            data.detail = resultDetail.offerProfile;
                            data.detail.priceRuleId = priceRuleId;
                            data.detail.offerPrice = offerList[i].offerPrice;
                            data.detail.dateOfVisit = dateOfVisit;
                            data.detail.numOfGuests = numOfGuests;
                            themeParkList[index4].products.push(data);
                            themeParkList[index4].offerNos.push(offerNo);
                          }
                        });
                        attractionProduct[index3].selected = true;
                      });
                    }
                  }
                });
              }
            });
          }

          themeParkList.forEach((item, index) => {
            const { categories: categoriesItem = [], products = [] } = item;
            categoriesItem.forEach((item2, index2) => {
              const { tag } = item2;
              products.forEach(item3 => {
                const {
                  detail: { offerTagList = [], offerNo, offerBundle = [] },
                } = item3;
                offerTagList.forEach(item4 => {
                  const { tagName } = item4;
                  if (tag === tagName) {
                    item3.id = offerNo;
                    if (offerBundle.length > 0) {
                      const { bundleName, bundleLabel } = offerBundle[0];
                      if (
                        themeParkList[index].categories[index2].bundleNames.indexOf(bundleName) ===
                        -1
                      ) {
                        themeParkList[index].categories[index2].bundleNames.push(bundleName);
                        themeParkList[index].categories[index2].products.push({
                          bundleName,
                          bundleLabel,
                          offers: [item3],
                          ...item3,
                        });
                      } else {
                        themeParkList[index].categories[index2].products.forEach(
                          (item5, index5) => {
                            if (item5.bundleName === bundleName) {
                              themeParkList[index].categories[index2].products[index5] = {
                                ...item5,
                                offers: item5.offers.concat([item3]),
                              };
                            }
                          }
                        );
                      }
                    } else {
                      themeParkList[index].categories[index2].products.push(item3);
                    }
                  }
                });
              });
            });
          });
          yield put({
            type: 'save',
            payload: {
              themeParkListByCode: themeParkList,
            },
          });
        } else {
          message.error(resultMsg);
        }
      },
      takeLatest,
    ],

    queryDolphinIsland: [
      // eslint-disable-next-line func-names
      function*({ payload }, { call, put, select }) {
        const response = yield call(queryOfferList, payload);
        const { dateOfVisit, numOfGuests } = yield select(({ ticketMgr }) => ticketMgr);
        if (!response) return false;
        const {
          data: { result },
        } = response;
        const { offerList = [] } = result;
        const dolphinIslandOfferList = [];
        const tags = ['DIA', 'DID', 'DIE', 'DIO', 'DIT'];
        tags.forEach(item => {
          dolphinIslandOfferList.push({
            tag: item,
            offer: [],
          });
        });
        for (let i = 0; i < offerList.length; i += 1) {
          const { offerNo } = offerList[i];
          const params = {
            offerNo,
            validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
          };
          const responseDetail = yield call(queryOfferDetail, params);
          if (!responseDetail) return false;
          const {
            data: { result: resultDetail },
          } = responseDetail;
          const {
            data: { resultCode, resultMsg },
          } = responseDetail;
          if (resultCode !== '0') {
            message.error(resultMsg);
            // eslint-disable-next-line no-continue
            continue;
          }
          // eslint-disable-next-line no-loop-func
          resultDetail.offerProfile.productGroup.forEach(item => {
            const { productType } = item;
            const sessions = [];
            let attractionProduct;
            if (productType === 'Attraction') {
              item.productGroup.forEach(item2 => {
                if (item2.groupName === 'Attraction') {
                  const { priceRule } = item2.products[0];
                  // eslint-disable-next-line prefer-destructuring
                  attractionProduct = item2.products;
                  let allProductInventory = 0;
                  priceRule.forEach(item4 => {
                    const { priceRuleName, productPrice = [] } = item4;
                    if (priceRuleName === 'DefaultPrice') {
                      const maxProductInventory =
                        productPrice[0].productInventory === -1
                          ? 100000000
                          : productPrice[0].productInventory;
                      allProductInventory += maxProductInventory;
                    }
                  });
                  if (allProductInventory >= numOfGuests) {
                    priceRule.forEach(itemPrice => {
                      if (itemPrice.priceRuleName === 'DefaultPrice') {
                        const { productPrice } = itemPrice;
                        productPrice.forEach(itemProductPrice => {
                          const sessionsExist = [];
                          sessions.forEach(itemSessions => [
                            sessionsExist.push(itemSessions.priceTimeFrom),
                          ]);
                          const { priceTimeFrom } = itemProductPrice;
                          if (sessionsExist.indexOf(priceTimeFrom) === -1) {
                            sessions.push(itemProductPrice);
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
            resultDetail.offerProfile.dateOfVisit = dateOfVisit;
            resultDetail.offerProfile.numOfGuests = numOfGuests;
            dolphinIslandOfferList.forEach((item2, index) => {
              const { tag } = item2;
              resultDetail.offerProfile.offerTagList.forEach(item3 => {
                const { tagName } = item3;
                if (tag === tagName) {
                  sessions.forEach(sessionItem => {
                    const len = dolphinIslandOfferList[index].offer.length;
                    dolphinIslandOfferList[index].offer.push({
                      detail: resultDetail.offerProfile,
                      session: sessionItem,
                      attractionProduct,
                      id: len,
                    });
                  });
                }
              });
            });
          });
        }
        yield put({
          type: 'save',
          payload: {
            dolphinIslandOfferList,
          },
        });
      },
      takeLatest,
    ],

    *queryCountry(_, { call, put }) {
      const param = { tableName: 'CUST_PROFILE', columnName: 'NOTIONALITY' };
      const response = yield call(queryCountry, param);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { resultList = [] } = result;
        yield put({
          type: 'save',
          payload: {
            countrys: resultList,
          },
        });
      } else {
        message.error(resultMsg);
      }
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
    resetData() {
      return {
        offerType: '',
        themeParkTipType: 'NoTip',
        activeDataPanel: undefined,
        activeGroup: 0,
        showToCart: false,
        tipVisible: true,
        themeParkList: [
          {
            group: 1,
            value: 'USS',
            label: 'Universal Studios Singapore',
            disabled: false,
          },
          {
            group: 1,
            value: 'ACW',
            label: 'Adventure Cove water Park',
            disabled: false,
          },
          {
            group: 1,
            value: 'SEA',
            label: 'S.E.A Aquarium',
            disabled: false,
          },
          {
            group: 1,
            value: 'MEM',
            label: 'Maritime Experiential Museum',
            disabled: false,
          },
          {
            group: 1,
            value: 'Voucher',
            label: 'Voucher',
            disabled: false,
          },
          {
            group: 1,
            value: 'RE',
            label: 'Resort Events',
            disabled: false,
          },
          {
            group: 1,
            value: 'HHN',
            label: 'Halloween Horror Nights',
            disabled: false,
          },
          {
            group: 2,
            value: 'DOL',
            label: 'Dolphin Island',
            disabled: false,
          },
          {
            group: 3,
            value: 'OAP',
            label: 'Once A Pirate',
            disabled: false,
          },
        ],
        themeParkChooseList: [],
        dateOfVisit: null,
        sessionTimeList: [],
        activeGroupSelectData: {
          themeParkCode: undefined,
          visitOfDate: undefined,
          sessionTime: undefined,
          numOfGuests: undefined,
          accessibleSeat: undefined,
        },
        numOfGuests: undefined,
        selectOfferData: [],
        orderIndex: null,
        onceAPirateOrder: null,
        searchPanelActive: false,
        mainPageLoading: false,
        onceAPirateLoading: false,
      };
    },
  },

  subscriptions: {},
};
