import { message } from 'antd';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
import {
  queryAttributeList,
  queryOfferList,
  queryOfferDetail,
  queryCountry,
} from '../services/ticketCommon';

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
        label: 'Adventure Cove Water Park',
        disabled: false,
      },
      {
        group: 1,
        value: 'SEA',
        label: 'S.E.A Aquarium',
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
    selectOfferData: [],
    orderIndex: null,
    onceAPirateOrder: null,
    searchPanelActive: false,
    mainPageLoading: false,
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
    *resetEditOnceAPirateOrder({ payload }, { put, select, take }) {
      const { themeParkList, } = yield select(state => state.ticketMgr);
      const newThemeParkList = themeParkList.map(themePark => {
        const newData = Object.assign(
          {},
          {
            ...themePark,
            disabled: themePark.value!=='OAP',
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
    *initEditOnceAPirateOrder({ payload }, { put, select, take }) {
      const { onceAPirateOrder, themeParkList, } = yield select(state => state.ticketMgr);
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
      yield take('querySessionTime/@@end'); //go on after waiting querySessionTime finish.
      yield put({
        type: 'queryOAPOfferList',
        payload: {
          formData: onceAPirateOrder.queryInfo,
        },
      });
      yield take('queryOAPOfferList/@@end'); //go on after waiting queryOAPOfferList finish.
      yield put({
        type: 'save',
        payload: {
          mainPageLoading: false,
        },
      });
    },
    *querySessionTime({ payload }, { call, put, select }) {
      const { dateOfVisit, themeParkChooseList = [] } = yield select(state => state.ticketMgr);
      const sessionTimeList = [];

      const attractionParams = themeParkChooseList.map(() => ({
        paramCode: 'ThemeParkCode',
        paramValue: 'USS',
      }));
      const requestParam = {
        pageSize: 100,
        currentPage: 1,
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
        attractionParams,
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
              data: { resultCode, resultMsg },
            } = responseDetail;
            if (resultCode !== '0') {
              message.error(resultMsg);
              continue;
            }
            const {
              data: {
                result: { offerProfile },
              },
            } = responseDetail;
            offerList[i].offerProfile = offerProfile;
            if (offerProfile && offerProfile.productGroup) {
              offerProfile.productGroup.forEach(productGroupInfo => {
                if (productGroupInfo && productGroupInfo.productType === 'Attraction') {
                  productGroupInfo.productGroup.forEach(productList => {
                    if (productList.products) {
                      productList.products.forEach(product => {
                        if (product.priceRule) {
                          product.priceRule.forEach(rule => {
                            if (rule.priceRuleName === 'DefaultPrice' && rule.productPrice) {
                              rule.productPrice.forEach(productPrice => {
                                if (productPrice.priceDate === requestParam.validTimeFrom) {
                                  const { priceTimeFrom } = productPrice;
                                  const existSession = sessionTimeList.find(
                                    item => item.value === priceTimeFrom
                                  );
                                  if (priceTimeFrom && !existSession) {
                                    sessionTimeList.push({
                                      value: priceTimeFrom,
                                      label: priceTimeFrom,
                                    });
                                  }
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          } else {
            message.error(responseDetail.errorMsg);
          }
        }
        if (sessionTimeList.length === 0) {
          sessionTimeList.push({
            value: '12:30:00',
            label: '12:30:00',
          });
        }
        yield put({
          type: 'save',
          payload: {
            selectOfferData: offerList,
            sessionTimeList,
          },
        });
      } else throw resultMsg;
    },

    *queryOAPOfferList({ payload }, { call, put, select }) {
      const { selectOfferData, orderIndex, onceAPirateOrder, dateOfVisit, themeParkChooseList = [] } = yield select(
        state => state.ticketMgr
      );

      yield put({
        type: 'save',
        payload: {
          activeDataPanel: 1,
          activeGroupSelectData: {
            themeParkCode: 'OAP',
            themeParkChooseList,
            ...payload.formData,
          },
        },
      });

      const attractionParams = themeParkChooseList.map(() => ({
        paramCode: 'ThemeParkCode',
        paramValue: 'USS',
      }));
      const requestParam = {
        pageSize: 100,
        currentPage: 1,
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
        attractionParams,
      };

      yield put({
        type: 'onceAPirateTicketMgr/saveOfferData',
        payload: {
          orderIndex,
          onceAPirateOrder,
          offerList: selectOfferData,
          requestParam,
          activeGroupSelectData: {
            ...payload.formData,
          },
        },
      });
    },

    *queryAttributeList(_, { put, call }) {
      const response = yield call(queryAttributeList, {
        attributeType: 'Attraction',
        attributeCode: 'THEME_PARK',
      });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { attributeList = [] } = result;
        yield put({
          type: 'save',
          payload: {
            themeParkList2: attributeList,
          },
        });
      } else throw resultMsg;
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
          const categories = tags.map(item => ({ tag: item, products: [] }));
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
              data: { resultCode, resultMsg },
            } = responseDetail;
            if (resultCode !== '0') {
              message.error(resultMsg);
              continue;
            }
            let attractionProduct;
            const prices = [];
            // eslint-disable-next-line no-loop-func
            resultDetail.offerProfile.productGroup.forEach(item => {
              const { productType } = item;
              if (productType === 'Attraction') {
                item.productGroup.forEach(item2 => {
                  if (item2.groupName === 'Attraction') {
                    attractionProduct = item2.products;
                    attractionProduct[0].priceRule.forEach(item3 => {
                      if (item3.priceRuleName === 'DefaultPrice') {
                        prices.push(item3);
                      }
                    });
                    let allProductInventory = 0;
                    attractionProduct.forEach(item3 => {
                      const { priceRule } = item3;
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
                            data.detail.prices = prices;
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
                  detail: { offerTagList = [], offerNo },
                } = item3;
                offerTagList.forEach(item4 => {
                  const { tagName } = item4;
                  if (tag === tagName) {
                    item3.id = offerNo;
                    themeParkList[index].categories[index2].products.push(item3);
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
        } else throw resultMsg;
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

    *queryCountry({ payload }, { call, put }) {
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
            label: 'Adventure Cove Water Park',
            disabled: false,
          },
          {
            group: 1,
            value: 'SEA',
            label: 'S.E.A Aquarium',
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
        selectOfferData: [],
        numOfGuests: undefined,
        deliverInfomation: {},
        orderIndex: null,
        onceAPirateOrder: null,
        searchPanelActive: false,
        mainPageLoading: false,
      };
    },
  },

  subscriptions: {},
};
