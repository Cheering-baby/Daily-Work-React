import { message } from 'antd';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
import {
  queryAgentOpt,
  queryCountry,
  queryOfferDetail,
  queryOfferList,
  queryPluAttribute,
} from '../services/ticketCommon';
import {
  changeVoucherToAttraction,
  getSessionTimeList,
  sortAttractionByAgeGroup,
} from '../utils/ticketOfferInfoUtil';
import {
  checkInventory,
  checkNumOfGuestsAvailable,
  checkSessionProductInventory,
  multiplePromise,
} from '../utils/utils';

const takeLatest = { type: 'takeLatest' };
export default {
  namespace: 'ticketMgr',

  state: {
    offerType: '',
    themeParkTipType: 'NoTip',
    activeDataPanel: null,
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
        value: 'VOUCHER',
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
    functionActive: true,
  },

  effects: {
    *fetchQueryAgentOpt(_, { call, put }) {
      const param = { queryType: 'signUp' };
      const response = yield call(queryAgentOpt, param);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        if (result && result.length > 0) {
          const countryList =
            (
              result.find(n => String(n.subDictType) === '1002' && String(n.dictType) === '10') ||
              {}
            ).dictionaryList || [];
          const countryArray = [];
          countryList.forEach(countryItem => {
            countryArray.push(
              Object.assign(
                {},
                {
                  ...countryItem,
                  value: countryItem.dictName,
                  lookupName: countryItem.dictName,
                }
              )
            );
          });
          yield put({
            type: 'save',
            payload: {
              countrys: countryArray,
            },
          });
        }
      } else {
        message.error(resultMsg);
      }
    },
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
      const sessionTimeList = [];

      const requestParams = themeParkChooseList.map(() => ({
        paramCode: 'BookingCategory',
        paramValue: 'OAP',
      }));
      const requestParam = {
        pageSize: 1000,
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
        const requestPromiseList = [];
        const offerDetailList = [];
        for (let i = 0; i < offerList.length; i += 1) {
          const { offerNo } = offerList[i];
          const params = {
            offerNo,
            validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
          };
          const requestFn = () => {
            return queryOfferDetail(params).then(responseDetail => {
              if (!responseDetail) {
                return;
              }
              const {
                data: {
                  resultCode: queryOfferDetailResultCode,
                  resultMsg: queryOfferDetailResultMsg,
                  result: resultDetail,
                },
              } = responseDetail;
              if (queryOfferDetailResultCode !== '0') {
                message.error(queryOfferDetailResultMsg);
              }
              offerDetailList.push(Object.assign({}, resultDetail));
            });
          };
          requestPromiseList.push(requestFn);
        }

        const queryOfferDetailPromise = new Promise(resolve => {
          multiplePromise(requestPromiseList, 20, () => {
            resolve();
          });
        });
        //  wait for query offer detail
        yield call(() => queryOfferDetailPromise);

        for (let i = 0; i < offerDetailList.length; i += 1) {
          const resultDetail = offerDetailList[i];
          const { offerProfile } = resultDetail;
          const { offerNo } = offerProfile;
          const findIndex = offerList.findIndex(item => item.offerNo === offerNo);
          offerList[findIndex].offerProfile = offerProfile;
          const sessionTimeListNew = getSessionTimeList(offerProfile, requestParam.validTimeFrom);
          if (sessionTimeListNew && sessionTimeListNew.length > 0) {
            sessionTimeListNew.forEach(sessionTimeItem => {
              const existSession = sessionTimeList.find(
                item => item.value === sessionTimeItem.value
              );
              if (!existSession) {
                sessionTimeList.push(
                  Object.assign(
                    {},
                    {
                      ...sessionTimeItem,
                    }
                  )
                );
              }
            });
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
      const { orderIndex, onceAPirateOrder, dateOfVisit, themeParkChooseList = [] } = yield select(
        state => state.ticketMgr
      );

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
        pageSize: 1000,
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

        const requestPromiseList = [];
        const offerDetailList = [];
        for (let i = 0; i < offerList.length; i += 1) {
          const { offerNo } = offerList[i];
          const params = {
            offerNo,
            validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
          };
          const requestFn = () => {
            return queryOfferDetail(params).then(responseDetail => {
              if (!responseDetail) {
                return;
              }
              const {
                data: {
                  resultCode: queryOfferDetailResultCode,
                  resultMsg: queryOfferDetailResultMsg,
                  result: resultDetail,
                },
              } = responseDetail;
              if (queryOfferDetailResultCode !== '0') {
                message.error(queryOfferDetailResultMsg);
              }
              offerDetailList.push(Object.assign({}, resultDetail));
            });
          };
          requestPromiseList.push(requestFn);
        }

        const queryOfferDetailPromise = new Promise(resolve => {
          multiplePromise(requestPromiseList, 20, () => {
            resolve();
          });
        });
        //  wait for query offer detail
        yield call(() => queryOfferDetailPromise);

        for (let i = 0; i < offerDetailList.length; i += 1) {
          const resultDetail = offerDetailList[i];
          const { offerProfile } = resultDetail;
          const { offerNo } = offerProfile;
          const findIndex = offerList.findIndex(item => item.offerNo === offerNo);
          offerList[findIndex].offerProfile = offerProfile;
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
      function* queryOfferListFunction({ payload }, { select, put, call }) {
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
          const categories = tags.map(item => ({
            tag: item,
            products: [],
            bundleNames: [],
            showDetail: true,
          }));
          const themeParkChooseListCodes = [];
          attractionList.forEach(item => {
            if (themeParkChooseList.indexOf(item.value) !== -1) {
              themeParkChooseListCodes.push(item.value);
            }
          });
          themeParkChooseListCodes.forEach(item => {
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

          const requestPromiseList = [];
          const offerDetailList = [];
          for (let i = 0; i < offerList.length; i += 1) {
            const { offerNo } = offerList[i];
            const params = {
              offerNo,
              validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
            };
            const requestFn = () => {
              return queryOfferDetail(params).then(responseDetail => {
                if (!responseDetail) {
                  return;
                }
                const {
                  data: {
                    resultCode: queryOfferDetailResultCode,
                    resultMsg: queryOfferDetailResultMsg,
                    result: resultDetail,
                  },
                } = responseDetail;
                if (queryOfferDetailResultCode !== '0') {
                  message.error(queryOfferDetailResultMsg);
                }
                offerDetailList.push(Object.assign({}, resultDetail));
              });
            };
            requestPromiseList.push(requestFn);
          }

          const queryOfferDetailPromise = new Promise(resolve => {
            multiplePromise(requestPromiseList, 20, () => {
              resolve();
            });
          });
          //  wait for query offer detail
          yield call(() => queryOfferDetailPromise);

          for (let i = 0; i < offerDetailList.length; i += 1) {
            const resultDetail = offerDetailList[i];
            const { offerNo } = resultDetail.offerProfile;
            let attractionProduct;
            let noMatchPriceRule = false;
            let priceRuleId;
            const {
              offerProfile: { bookingCategory = [] },
            } = resultDetail;
            resultDetail.offerProfile = changeVoucherToAttraction(resultDetail.offerProfile);
            resultDetail.offerProfile = sortAttractionByAgeGroup(resultDetail.offerProfile);
            if (!checkNumOfGuestsAvailable(numOfGuests, resultDetail.offerProfile)) {
              // eslint-disable-next-line no-continue
              continue;
            }
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
                    bookingCategory.forEach(item3 => {
                      themeParkList.forEach((item4, index4) => {
                        if (
                          item4.themeparkCode === item3 &&
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
                    });
                  }
                });
              }
            });
          }

          const themeParkList2 = JSON.parse(JSON.stringify(themeParkList));
          themeParkList.forEach((item, index) => {
            const {
              categories: categoriesItem = [],
              products = [],
              themeparkCode: themeParkCode,
              themeparkName: themeParkName,
            } = item;
            categoriesItem.forEach((item2, index2) => {
              const { tag } = item2;
              products.forEach(item3 => {
                const {
                  detail: { offerTagList = [], offerNo, offerBundle = [] },
                } = item3;
                const offerBundleFilter = offerBundle.filter(
                  offerBundleItem => !isNullOrUndefined(offerBundleItem.bundleName)
                );
                offerTagList.forEach(item4 => {
                  const { tagName } = item4;
                  if (tag === tagName) {
                    item3.id = offerNo;
                    if (offerBundleFilter.length > 0) {
                      const { bundleName, bundleLabel } = offerBundleFilter[0];
                      if (
                        themeParkList2[index].categories[index2].bundleNames.indexOf(bundleName) ===
                        -1
                      ) {
                        themeParkList2[index].categories[index2].bundleNames.push(bundleName);
                        themeParkList2[index].categories[index2].products.push({
                          bundleName,
                          bundleLabel,
                          offers: [item3],
                          ...item3,
                          themeParkCode,
                          themeParkName,
                        });
                      } else {
                        themeParkList2[index].categories[index2].products.forEach(
                          (item5, index5) => {
                            if (item5.bundleName === bundleName) {
                              themeParkList2[index].categories[index2].products[index5] = {
                                ...item5,
                                offers: item5.offers.concat([item3]),
                                themeParkCode,
                                themeParkName,
                              };
                            }
                          }
                        );
                      }
                    } else {
                      themeParkList2[index].categories[index2].products.push({
                        ...item3,
                        themeParkCode,
                        themeParkName,
                      });
                    }
                  }
                });
              });
            });
          });
          themeParkList2.forEach((itemThemePark, index) => {
            themeParkList2[index].categories = itemThemePark.categories.filter(
              ({ products }) => products.length > 0
            );
          });
          yield put({
            type: 'save',
            payload: {
              themeParkListByCode: themeParkList2,
            },
          });
        } else {
          message.error(resultMsg);
        }
      },
      takeLatest,
    ],

    queryDolphinIsland: [
      function* queryDolphinIslandFunction({ payload }, { call, put, select }) {
        const response = yield call(queryOfferList, payload);
        const { dateOfVisit, numOfGuests } = yield select(({ ticketMgr }) => ticketMgr);
        if (!response) return false;
        const {
          data: { result },
        } = response;
        const { offerList = [] } = result;
        const dolphinIslandOfferList = [];
        const tags = ['DIA', 'DID', 'DIE', 'DIO', 'DIV'];
        tags.forEach(item => {
          dolphinIslandOfferList.push({
            tag: item,
            offer: [],
            showDetail: true,
          });
        });

        const requestPromiseList = [];
        const offerDetailList = [];
        for (let i = 0; i < offerList.length; i += 1) {
          const { offerNo } = offerList[i];
          const params = {
            offerNo,
            validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
          };
          const requestFn = () => {
            return queryOfferDetail(params).then(responseDetail => {
              if (!responseDetail) {
                return;
              }
              const {
                data: {
                  resultCode: queryOfferDetailResultCode,
                  resultMsg: queryOfferDetailResultMsg,
                  result: resultDetail,
                },
              } = responseDetail;
              if (queryOfferDetailResultCode !== '0') {
                message.error(queryOfferDetailResultMsg);
              }
              offerDetailList.push(Object.assign({}, resultDetail));
            });
          };
          requestPromiseList.push(requestFn);
        }

        const queryOfferDetailPromise = new Promise(resolve => {
          multiplePromise(requestPromiseList, 20, () => {
            resolve();
          });
        });
        //  wait for query offer detail
        yield call(() => queryOfferDetailPromise);

        for (let i = 0; i < offerDetailList.length; i += 1) {
          const resultDetail = offerDetailList[i];
          resultDetail.offerProfile = changeVoucherToAttraction(resultDetail.offerProfile);
          resultDetail.offerProfile = sortAttractionByAgeGroup(resultDetail.offerProfile);
          if (!checkNumOfGuestsAvailable(numOfGuests, resultDetail.offerProfile)) {
            // eslint-disable-next-line no-continue
            continue;
          }
          resultDetail.offerProfile.productGroup.forEach(item => {
            const { productType } = item;
            const sessions = [];
            let attractionProduct;
            let priceRuleId;
            if (productType === 'Attraction') {
              item.productGroup.forEach(item2 => {
                if (item2.groupName === 'Attraction') {
                  attractionProduct = item2.products;
                  // eslint-disable-next-line prefer-destructuring
                  priceRuleId = attractionProduct[0].priceRule[1].priceRuleId;
                  attractionProduct.forEach(itemProduct => {
                    const { priceRule = [] } = itemProduct;
                    priceRule.forEach((itemPrice, itemPriceIndex) => {
                      if (itemPriceIndex === 1) {
                        const { productPrice } = itemPrice;
                        productPrice.forEach(itemProductPrice => {
                          const sessionsExist = [];
                          sessions.forEach(itemSessions => [
                            sessionsExist.push(itemSessions.priceTimeFrom),
                          ]);
                          const { priceTimeFrom } = itemProductPrice;
                          if (
                            priceTimeFrom &&
                            sessionsExist.indexOf(priceTimeFrom) === -1 &&
                            checkSessionProductInventory(numOfGuests, priceTimeFrom, itemProduct)
                          ) {
                            sessions.push(itemProductPrice);
                          }
                        });
                      }
                    });
                  });
                }
              });
            }
            resultDetail.offerProfile.dateOfVisit = dateOfVisit;
            resultDetail.offerProfile.priceRuleId = priceRuleId;
            resultDetail.offerProfile.selectRuleId = priceRuleId;
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
        const dolphinIslandOfferListFilter = dolphinIslandOfferList.filter(
          ({ offer }) => offer.length > 0
        );
        yield put({
          type: 'save',
          payload: {
            dolphinIslandOfferList: dolphinIslandOfferListFilter,
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

    *checkInventory({ payload }, { call }) {
      const { dateOfVisit, offerNo, orderProducts = [] } = payload;
      const response = yield call(queryOfferDetail, {
        offerNo,
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
      });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { offerProfile } = result;
        return checkInventory(offerProfile, orderProducts);
      }
      message.error(resultMsg);
      return false;
    },

    *queryPluAttribute({ payload }, { call, put }) {
      const response = yield call(queryPluAttribute, payload);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { items } = result;
        yield put({
          type: 'save',
          payload: {
            ticketTypesEnums: items,
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
        activeDataPanel: null,
        activeGroup: 0,
        showToCart: false,
        tipVisible: true,
        deliverInformation: {},
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
            value: 'VOUCHER',
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
        functionActive: true,
      };
    },
  },

  subscriptions: {},
};
