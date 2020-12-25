import { message } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { isNullOrUndefined } from 'util';
import {
  queryAgentOpt,
  queryCountry,
  queryOfferBookingCategory,
  queryOfferDetail,
  queryOfferList,
  queryPluAttribute,
} from '../services/ticketCommon';
import {
  changeVoucherToAttraction,
  getOfferCategory,
  getSessionTimeList,
} from '../utils/ticketOfferInfoUtil';
import {
  checkInventory,
  checkNumOfGuestsAvailable,
  findArrSame,
  multiplePromise,
  isSessionProduct,
  filterSessionByLanguage,
  filterProductByLanguage,
  filterBundleSessionByLanguage,
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
    themeParkList: [],
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
    ticketConfig: [],
  },

  effects: {
    // eslint-disable-next-line require-yield
    *backRouterEventOnMobile() {
      router.push(`/TicketManagement/Ticketing/CreateOrder`);
    },
    *queryLanguageEnum(_, { call, put }) {
      const response = yield call(queryPluAttribute, { attributeItem: 'TICKET_STOCK_LANGUAGE' });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { languageEnum: result.items } });
      } else {
        message.error(resultMsg);
      }
    },
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
          countryArray.sort((a, b) => {
            const val1 = a.lookupName.toLowerCase();
            const val2 = b.lookupName.toLowerCase();
            if (val1 < val2) {
              return -1;
            }
            if (val1 > val2) {
              return 1;
            }
            return 0;
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
              if (!responseDetail || !responseDetail.success) {
                message.error(`The offer ${offerNo} query detail failed.`);
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
              } else {
                offerDetailList.push(Object.assign({}, resultDetail));
              }
            });
          };
          requestPromiseList.push(requestFn);
        }

        if (offerList && offerList.length > 0) {
          const queryOfferDetailPromise = new Promise(resolve => {
            multiplePromise(requestPromiseList, 20, () => {
              resolve();
            });
          });
          //  wait for query offer detail
          yield call(() => queryOfferDetailPromise);
        }

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
              if (!responseDetail || !responseDetail.success) {
                message.error(`The offer ${offerNo} query detail failed.`);
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
              } else {
                offerDetailList.push(Object.assign({}, resultDetail));
              }
            });
          };
          requestPromiseList.push(requestFn);
        }

        if (offerList && offerList.length > 0) {
          const queryOfferDetailPromise = new Promise(resolve => {
            multiplePromise(requestPromiseList, 20, () => {
              resolve();
            });
          });
          //  wait for query offer detail
          yield call(() => queryOfferDetailPromise);
        }

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
                  categories: getOfferCategory(item),
                });
              }
            });
          });
          const { offerList = [] } = result;

          const requestPromiseList = [];
          const offerDetailList = offerList.map(item => ({ ...item, offerProfile: {} }));
          for (let i = 0; i < offerList.length; i += 1) {
            const { offerNo } = offerList[i];
            const params = {
              offerNo,
              validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
            };
            const requestFn = () => {
              return queryOfferDetail(params).then(responseDetail => {
                if (!responseDetail || !responseDetail.success) {
                  message.error(`The offer ${offerNo} query detail failed.`);
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
                } else {
                  offerDetailList[i] = Object.assign({}, resultDetail);
                }
              });
            };
            requestPromiseList.push(requestFn);
          }

          if (offerList && offerList.length > 0) {
            const queryOfferDetailPromise = new Promise(resolve => {
              multiplePromise(requestPromiseList, 20, () => {
                resolve();
              });
            });
            //  wait for query offer detail
            yield call(() => queryOfferDetailPromise);
          }

          for (let i = 0; i < offerDetailList.length; i += 1) {
            const resultDetail = offerDetailList[i];
            let attractionProduct;
            let noMatchPriceRule = false;
            let priceRuleId;
            resultDetail.offerProfile = changeVoucherToAttraction(resultDetail.offerProfile);
            // resultDetail.offerProfile = sortAttractionByAgeGroup(resultDetail.offerProfile);
            const {
              offerProfile: { bookingCategory = [], offerBundle = [{}], offerNo },
            } = resultDetail;
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

                    // filter product has not enough inventory(multiple or single) fixed has filter in checkNumOfGuestsAvailable
                    attractionProduct = attractionProduct.filter(itemProduct => {
                      let enough = true;
                      const { needChoiceCount, priceRule = [] } = itemProduct;
                      const { productPrice } = priceRule[1];
                      let inventory = 0;
                      if (isSessionProduct(priceRuleId, itemProduct)) {
                        const productInventoryItems = productPrice.map(
                          ({ productInventory }) => productInventory
                        );
                        productInventoryItems.forEach(
                          // eslint-disable-next-line no-return-assign
                          itemInventory =>
                            (inventory =
                              itemInventory > inventory || itemInventory === -1
                                ? itemInventory
                                : inventory)
                        );
                      } else {
                        inventory = productPrice[0].productInventory;
                      }
                      if (inventory !== -1 && inventory / needChoiceCount < numOfGuests) {
                        enough = false;
                      }
                      return enough;
                    });

                    // get session and language
                    let productLanguage = [];
                    let isIncludeLanguage = false;
                    const productSessions = [];
                    attractionProduct.forEach(itemProduct => {
                      const { priceRule } = itemProduct;
                      const sessions = [];
                      const includeSessions = [];
                      const currentProductLanguage = [];
                      priceRule[0].productPrice.forEach(
                        ({ priceTimeFrom, inventoryLanguageGroups }) => {
                          if (!isIncludeLanguage) {
                            isIncludeLanguage =
                              inventoryLanguageGroups &&
                              inventoryLanguageGroups.find(({ language }) => !!language);
                          }

                          if (sessions.indexOf(priceTimeFrom) === -1 && priceTimeFrom !== null) {
                            sessions.push(priceTimeFrom);
                          }

                          if (includeSessions.indexOf(priceTimeFrom) === -1) {
                            includeSessions.push(priceTimeFrom);
                          }

                          // Language
                          if (
                            (item2.choiceConstrain === 'Fixed' || offerBundle[0].bundleName) &&
                            inventoryLanguageGroups
                          ) {
                            inventoryLanguageGroups.forEach(({ language }) => {
                              if (language && !currentProductLanguage.includes(language)) {
                                currentProductLanguage.push(language);
                              }
                            });
                          } else if (item2.choiceConstrain !== 'Fixed' && inventoryLanguageGroups) {
                            inventoryLanguageGroups.forEach(({ language }) => {
                              if (language && !productLanguage.includes(language)) {
                                productLanguage.push(language);
                              }
                            });
                          }
                        }
                      );

                      if (
                        item2.choiceConstrain === 'Fixed' &&
                        isIncludeLanguage &&
                        currentProductLanguage.length > 0
                      ) {
                        productLanguage.push(currentProductLanguage);
                      }

                      sessions.sort((a, b) => moment(a, 'HH:mm:ss') - moment(b, 'HH:mm:ss'));
                      includeSessions.sort((a, b) => moment(a, 'HH:mm:ss') - moment(b, 'HH:mm:ss'));
                      itemProduct.sessionOptions = sessions;
                      if (sessions.includes('03:00:00')) {
                        itemProduct.sessionTime = '03:00:00';
                      }
                      productSessions.push(includeSessions);
                    });

                    // Fixed, if there is not some language in product, it will not show
                    if (
                      (item2.choiceConstrain === 'Fixed' || offerBundle[0].bundleName) &&
                      isIncludeLanguage
                    ) {
                      productLanguage = findArrSame(productLanguage);
                      if (productLanguage.length === 0) {
                        return false;
                      }
                    }

                    let offerSessions = [];
                    if (offerBundle[0].bundleName) {
                      const existProductSession = [];
                      productSessions.forEach(itemProductSession => {
                        if (itemProductSession.indexOf(null) === -1) {
                          existProductSession.push(itemProductSession);
                        }
                      });
                      if (existProductSession.length > 0) {
                        offerSessions = findArrSame(existProductSession);
                      } else {
                        offerSessions = findArrSame(productSessions);
                      }
                    }
                    offerSessions.sort((a, b) => moment(a, 'HH:mm:ss') - moment(b, 'HH:mm:ss'));

                    // When offer is bundle, if no session, offerSessions will be [null];
                    if (
                      noMatchPriceRule ||
                      (offerBundle[0].bundleName && offerSessions.length === 0)
                    ) {
                      return false;
                    }

                    // eslint-disable-next-line no-inner-declarations
                    function dealData(products, otherInfo) {
                      const data = {};
                      data.detail = resultDetail.offerProfile;
                      data.detail.priceRuleId = priceRuleId;
                      data.detail.offerPrice = offerList[i].offerPrice;
                      data.detail.dateOfVisit = dateOfVisit;
                      data.detail.numOfGuests = numOfGuests;
                      data.attractionProduct = products;

                      if (otherInfo) {
                        Object.assign(data.detail, otherInfo);
                      }

                      if (offerBundle[0].bundleName) {
                        data.offerSessions = offerSessions;
                        data.offerLanguages = productLanguage;
                        // If session include 03:00:00， page will show it default.
                        if (offerSessions.includes('03:00:00')) {
                          data.sessionTime = '03:00:00';
                        }
                      }
                      return JSON.parse(JSON.stringify(data));
                    }

                    bookingCategory.forEach(item3 => {
                      themeParkList.forEach((item4, index4) => {
                        if (
                          item4.themeparkCode === item3 &&
                          item4.offerNos.indexOf(offerNo) === -1
                        ) {
                          themeParkList[index4].offerNos.push(offerNo);
                          if (isIncludeLanguage && !offerBundle[0].bundleName) {
                            productLanguage.forEach(language => {
                              const attractionProductFilter = attractionProduct.filter(
                                itemProduct =>
                                  filterProductByLanguage(itemProduct, language, numOfGuests)
                              );                            

                              if (
                                item2.choiceConstrain === 'Fixed' &&
                                attractionProductFilter.length !== attractionProduct.length
                              ) {
                                return false;
                              }

                              if (attractionProductFilter.length > 0) {
                                const attractionProductDealByLanguage = attractionProductFilter.map(
                                  itemProduct => {
                                    const sessionOptions = filterSessionByLanguage(
                                      itemProduct,
                                      language,
                                      itemProduct.sessionOptions,
                                      numOfGuests
                                    );
                                    return {
                                      ...itemProduct,
                                      sessionOptions,
                                      sessionTime: sessionOptions.includes('03:00:00')
                                        ? '03:00:00'
                                        : undefined,
                                    };
                                  }
                                );
                                themeParkList[index4].products.push(
                                  dealData(attractionProductDealByLanguage, {
                                    language,
                                    isIncludeLanguage: true,
                                  })
                                );
                              }
                            });
                          } else {
                            themeParkList[index4].products.push(dealData(attractionProduct));
                          }
                        }
                      });
                    });
                  }
                });
              }
            });
          }

          // Classify offer
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
              products.forEach((item3, productIndex) => {
                const {
                  detail: { offerTagList = [], offerNo, offerBundle = [] },
                } = item3;
                const offerBundleFilter = offerBundle.filter(
                  offerBundleItem => !isNullOrUndefined(offerBundleItem.bundleName)
                );
                offerTagList.forEach(item4 => {
                  const { tagName } = item4;
                  if (tag === tagName) {
                    item3.id = offerNo + productIndex;
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
                          tag,
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
                                tag,
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
                        tag,
                      });
                    }
                  }
                });
              });
            });
          });

          // filter categories no product
          themeParkList2.forEach((itemThemePark, index) => {
            themeParkList2[index].categories = itemThemePark.categories.filter(
              ({ products }) => products.length > 0
            );
          });

          const themeParkList3 = JSON.parse(JSON.stringify(themeParkList2));

          // spread out bundle include language
          themeParkList2.forEach((itemThemePark, index) => {
            itemThemePark.categories.forEach((category, categoryIndex) => {
              if (category.products) {
                category.products.forEach(product => {
                  const { bundleName, offers } = product;
                  const languages = [];

                  if (bundleName) {
                    offers.forEach(itemOffer => {
                      itemOffer.offerLanguages.forEach(itemLanguage => {
                        if (!languages.includes(itemLanguage)) {
                          languages.push(itemLanguage);
                        }
                      });
                    });

                    const findIndex = themeParkList3[index].categories[
                      categoryIndex
                    ].products.findIndex(i => i.bundleName === bundleName);

                    if (languages.length > 0) {
                      languages.forEach((language, languageIndex) => {
                        const filterOffers = product.offers
                          .filter(
                            i =>
                              i.offerLanguages.includes(language) &&
                              filterBundleSessionByLanguage(
                                i,
                                language,
                                numOfGuests,
                                i.offerSessions
                              ).length > 0
                          )
                          .map(j => ({
                            ...j,
                            offerSessions: filterBundleSessionByLanguage(
                              j,
                              language,
                              numOfGuests,
                              j.offerSessions
                            ),
                          }));

                        if (languageIndex === 0) {
                          if (filterOffers.length === 0) {
                            themeParkList3[index].categories[categoryIndex].products.splice(
                              findIndex,
                              1
                            );
                          } else {
                            themeParkList3[index].categories[categoryIndex].products[
                              findIndex
                            ].language = language;
                            themeParkList3[index].categories[categoryIndex].products[
                              findIndex
                            ].offers = filterOffers;
                          }
                        } else if (filterOffers.length > 0) {
                          themeParkList3[index].categories[categoryIndex].products.splice(
                            findIndex,
                            0,
                            {
                              ...product,
                              language,
                              offers: filterOffers,
                            }
                          );
                        }
                      });
                    }
                  }
                });
              }
            });
          });

          // sort bundle offer
          themeParkList3.forEach((itemThemePark, index) => {
            themeParkList3[index].categories = itemThemePark.categories.filter(
              ({ products }) => products.length > 0
            );
            itemThemePark.categories.forEach(category => {
              if (category.products) {
                category.products.forEach((product, productIndex) => {
                  if (product.bundleName) {
                    product.offers.sort((a, b) => {
                      const aName = a.detail.offerBundle[0].bundleLabel || '';
                      const bName = b.detail.offerBundle[0].bundleLabel || '';
                      return aName.charCodeAt(0) - bName.charCodeAt(0);
                    });
                  }
                  product.index = productIndex;
                });
              }
            });
          });

          yield put({
            type: 'save',
            payload: {
              themeParkListByCode: themeParkList3,
            },
          });
        } else {
          message.error(resultMsg);
        }
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
        return checkInventory(changeVoucherToAttraction(offerProfile), orderProducts);
      }
      message.error(resultMsg);
      return false;
    },

    *queryTicketTypesEnums(_, { call, put }) {
      const response = yield call(queryPluAttribute, { attributeItem: 'TICKET_TYPE' });
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

    *queryTicketConfig(_, { call, put }) {
      const response = yield call(queryPluAttribute, { attributeItem: 'TICKET_BOOKING_CONFIG' });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { ticketConfig: result.items } });
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
    *queryOfferBookingCategory(_, { call, put }) {
      const param = {};
      const response = yield call(queryOfferBookingCategory, param);
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0' || resultCode === 0) {
        const themeParkList = [];
        const { bookingCategories = [] } = result;
        const bookingCategoryList = bookingCategories.filter(
          ({ code }) => code !== 'OAP' && code !== 'DOL'
        );
        if (bookingCategories.find(({ code }) => code === 'DOL')) {
          bookingCategoryList.push(bookingCategories.filter(({ code }) => code === 'DOL')[0]);
        }
        if (bookingCategories.find(({ code }) => code === 'OAP')) {
          bookingCategoryList.push(bookingCategories.filter(({ code }) => code === 'OAP')[0]);
        }
        bookingCategoryList.forEach(item => {
          const newItem = Object.assign({
            value: item.code,
            label: item.name,
            disabled: false,
            group: 1,
          });
          if (item.code === 'OAP') {
            newItem.group = 3;
          } else if (item.code === 'DOL') {
            newItem.group = 2;
          }
          themeParkList.push({
            ...newItem,
          });
        });

        yield put({
          type: 'save',
          payload: {
            themeParkList,
          },
        });
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
    resetData(_, { payload }) {
      return {
        offerType: '',
        themeParkTipType: 'NoTip',
        activeDataPanel: null,
        activeGroup: 0,
        showToCart: false,
        tipVisible: true,
        deliverInformation: {},
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
        ticketConfig: [],
        ...payload,
      };
    },
  },

  subscriptions: {},
};
