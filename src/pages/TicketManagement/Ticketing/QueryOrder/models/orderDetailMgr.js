import moment from 'moment';
import serialize from '../utils/utils';
import {
  queryBookingDetail,
  queryOfferBookingCategory,
  queryRevalidationVids,
} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';
import { getNumOfPaxInPackage } from '@/pages/TicketManagement/Ticketing/QueryOrder/utils/utils';

export default {
  namespace: 'orderDetailMgr',
  state: {
    orderDetailVisible: false,
    detailType: 'Revalidation',
    searchList: {
      bookingNo: null,
      isSubOrder: null,
    },
    detailList: [],
    vidResultList: [],
    patronInfo: {},
    themeParkList: [],
    netAmt: 0,
    refundSuccessFlag: false,
    status: null,
    revalidationVidListVisible: false,
    revalidationVidList: [],
    bookingDetail: null,
    orderQuantityList: [],
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *queryVid({ payload }, { call, put }) {
      const response = yield call(queryRevalidationVids, serialize(payload));
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { vidInfos } = result;
        if (vidInfos) {
          for (let i = 0; i < vidInfos.length; i += 1) {
            vidInfos[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
          }
          yield put({
            type: 'save',
            payload: {
              revalidationVidList: vidInfos,
            },
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              revalidationVidList: [],
            },
          });
        }
      } else throw resultMsg;
    },
    *queryOrderDetail({ payload }, { call, put, select }) {
      const { searchList, themeParkList } = yield select(state => state.orderDetailMgr);
      const params = { ...searchList, ...payload };
      yield put({
        type: 'save',
        payload: {
          searchList: params,
        },
      });
      const paramList = serialize(params);
      const response = yield call(queryBookingDetail, paramList);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { bookingDetail } = result;
        yield put({
          type: 'saveOrderDetail',
          payload: {
            bookingDetail,
          },
        });
        yield put({
          type: 'saveOrderQuantity',
          payload: {
            bookingDetail,
            themeParkList,
          },
        });
      } else throw resultMsg;
    },
    *queryThemePark(_, { call, put }) {
      const response = yield call(queryOfferBookingCategory, {});
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { themeParkList: result.offerBookingCategoryList } });
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
    saveOrderQuantity(state, { payload }) {
      const { bookingDetail = {}, themeParkList = [] } = payload;
      const { offers = [] } = bookingDetail;
      const offerGroupList = [];
      offers.forEach(offerInfo => {
        const offerGroupInfo = offerGroupList.find(
          offerGroupItem => offerInfo.offerGroup === offerGroupItem.offerGroup
        );
        if (!offerGroupInfo) {
          offerGroupList.push({
            offerGroup: offerInfo.offerGroup,
            offerList: [
              {
                ...offerInfo,
              },
            ],
          });
        } else {
          offerGroupInfo.offerList.push({
            ...offerInfo,
          });
        }
      });
      const orderQuantityList = [];

      offerGroupList.forEach(offerGroupItem => {
        const offerOrderQuantityItem = {
          offerGroup: offerGroupItem.offerGroup,
          itemList: [],
          quantityTotal: 0,
        };
        offerGroupItem.offerList.forEach(offerItem => {
          if (offerItem.bundleName) {
            let netAmt = 0;
            const findQuantityItem = offerOrderQuantityItem.itemList.find(
              itemInfo => itemInfo.itemName === offerItem.bundleLabel
            );
            if (findQuantityItem) {
              findQuantityItem.itemQuantity += 1;
            } else {
              let session = null;
              if (offerItem.attraction) {
                offerItem.attraction.forEach(attractionItem => {
                  netAmt += attractionItem.netAmt;
                  session =
                    attractionItem.validTimes && attractionItem.validTimes.length > 0
                      ? attractionItem.validTimes[0].validTimeFrom
                      : null;
                });
              }
              offerOrderQuantityItem.itemList.push({
                attractionGroupType: 'Bundle',
                itemName: offerItem.bundleLabel,
                itemQuantity: 1,
                configQuantity: 1,
                numOfPax: null,
                session,
                netAmt,
              });
            }
          } else {
            const { attraction = [], attractionGroupType, voucherOnly } = offerItem;
            if (attractionGroupType === 'Fixed' && attraction.length !== 1) {
              if (offerOrderQuantityItem.itemList.length > 0) {
                offerOrderQuantityItem.itemList[0].itemQuantity += 1;
              } else {
                const showName = [];
                const productNoList = [];
                const session = [];
                const ticketTypeShow = [];
                let netAmt = 0;

                attraction.forEach(attractionItem => {
                  netAmt += attractionItem.netAmt;
                  if (!attractionItem.voucherQtyType || voucherOnly === 'Yes') {
                    const productNoFind = productNoList.find(
                      productNoItem => productNoItem === attractionItem.prodNo
                    );
                    if (!productNoFind) {
                      const ticketGroupShow = attractionItem.ticketGroup || 'General';
                      productNoList.push(attractionItem.prodNo);
                      showName.push(ticketGroupShow);
                      ticketTypeShow.push(`${ticketGroupShow} * ${attractionItem.configQuantity}`);
                      session.push({
                        ticketGroup: ticketGroupShow,
                        session:
                          attractionItem.validTimes && attractionItem.validTimes.length > 0
                            ? attractionItem.validTimes[0].validTimeFrom
                            : null,
                      });
                    }
                  }
                });
                showName.sort((a, b) => {
                  if (a < b) {
                    return -1;
                  }
                  return a > b ? 1 : 0;
                });
                session.sort((a, b) => {
                  if (a.ticketGroup < b.ticketGroup) {
                    return -1;
                  }
                  return a.ticketGroup > b.ticketGroup ? 1 : 0;
                });
                ticketTypeShow.sort((a, b) => {
                  if (a < b) {
                    return -1;
                  }
                  return a > b ? 1 : 0;
                });
                offerOrderQuantityItem.itemList.push({
                  voucherOnly,
                  attractionGroupType,
                  ticketTypeShow,
                  itemName: showName,
                  itemQuantity: 1,
                  configQuantity: 1,
                  numOfPax: null,
                  session,
                  netAmt,
                });
              }
            } else {
              const ticketTypeShow =
                attractionGroupType === 'Fixed' && attraction.length === 1
                  ? [`${attraction[0].ticketGroup || 'General'} * ${attraction[0].configQuantity}`]
                  : [];

              const voucherProduct = attraction.filter(
                attractionItem2 => attractionItem2.voucherQtyType
              );
              const voucherProductFilter = [];
              voucherProduct.forEach(attractionItem3 => {
                if (
                  !voucherProductFilter.find(
                    voucherItem => voucherItem.prodNo === attractionItem3.prodNo
                  )
                ) {
                  voucherProductFilter.push({ ...attractionItem3 });
                }
              });

              attraction.forEach(attractionItem => {
                if (voucherOnly === 'Yes') {
                  const themeParkObj = themeParkList.find(
                    themeParkInfo =>
                      themeParkInfo.bookingCategoryCode === attractionItem.themeParks[0]
                  );
                  let showName = 'General';
                  if (themeParkObj) {
                    showName = themeParkObj.bookingCategoryName;
                  }
                  const itemInfoFind = offerOrderQuantityItem.itemList.find(
                    itemInfo => itemInfo.prodNo === attractionItem.prodNo
                  );
                  if (itemInfoFind) {
                    itemInfoFind.itemQuantity += 1;
                  } else {
                    offerOrderQuantityItem.itemList.push({
                      voucherOnly,
                      attractionGroupType,
                      ticketTypeShow,
                      itemName: showName,
                      itemQuantity: 1,
                      configQuantity: attractionItem.configQuantity,
                      prodNo: attractionItem.prodNo,
                      numOfPax: attractionItem.numOfPax,
                      netAmt: attractionItem.numOfPax
                        ? attractionItem.netAmt / attractionItem.numOfPax
                        : attractionItem.netAmt,
                      session:
                        attractionItem.validTimes && attractionItem.validTimes.length > 0
                          ? attractionItem.validTimes[0].validTimeFrom
                          : null,
                    });
                  }
                } else if (!attractionItem.voucherQtyType && voucherOnly !== 'Yes') {
                  const itemInfoFind = offerOrderQuantityItem.itemList.find(
                    itemInfo => itemInfo.prodNo === attractionItem.prodNo
                  );

                  const netAmt = attractionItem.numOfPax
                    ? attractionItem.netAmt / attractionItem.numOfPax
                    : attractionItem.netAmt;

                  if (itemInfoFind) {
                    itemInfoFind.itemQuantity += 1;
                  } else {
                    offerOrderQuantityItem.itemList.push({
                      voucherOnly,
                      attractionGroupType,
                      ticketTypeShow,
                      itemName: attractionItem.ticketGroup || 'General',
                      itemQuantity: 1,
                      configQuantity: attractionItem.configQuantity,
                      prodNo: attractionItem.prodNo,
                      numOfPax: attractionItem.numOfPax,
                      netAmt:
                        netAmt +
                        voucherProductFilter.reduce(
                          (total, item) => total + item.netAmt * item.configQuantity,
                          0
                        ),
                      session:
                        attractionItem.validTimes && attractionItem.validTimes.length > 0
                          ? attractionItem.validTimes[0].validTimeFrom
                          : null,
                    });
                  }
                }
              });
            }
          }
        });
        offerOrderQuantityItem.itemList.forEach(itemInfo => {
          if (itemInfo.numOfPax) {
            itemInfo.itemQuantity = itemInfo.numOfPax;
          } else {
            itemInfo.itemQuantity /= itemInfo.configQuantity || 1;
          }
        });
        offerOrderQuantityItem.itemList.forEach(itemInfo => {
          offerOrderQuantityItem.quantityTotal += itemInfo.itemQuantity;
        });
        orderQuantityList.push(offerOrderQuantityItem);
      });
      return {
        ...state,
        orderQuantityList,
      };
    },
    saveOrderDetail(state, { payload }) {
      const { bookingDetail = {} } = payload;
      const detailList = [];
      const vidResultList = [];
      const {
        offers = [],
        patronInfo = {},
        netAmt,
        refundSuccessFlag = false,
        status,
        totalPrice,
      } = bookingDetail;

      let bocaFeeConfigure = true;
      let totalOfferPriceBeforeGst = 0;
      let totalBocaFeeBeforeGst = 0;

      for (let i = 0; i < offers.length; i += 1) {
        const vidList = [];

        const {
          attraction = [],
          deliveryInfo: { deliveryMode, deliveryNum, deliveryPrice, gst },
        } = offers[i];

        if (deliveryMode === 'BOCA') {
          let sourceBocaPrice = deliveryPrice / (gst / 100 + 1);
          sourceBocaPrice = Number(sourceBocaPrice).toFixed(2);
          totalBocaFeeBeforeGst += sourceBocaPrice * deliveryNum;
          bocaFeeConfigure = !!deliveryPrice || deliveryPrice === 0;
        }

        if (attraction) {
          for (let j = 0; j < attraction.length; j += 1) {
            const netAmtReal = attraction[j].numOfPax
              ? attraction[j].netAmt / attraction[j].numOfPax
              : attraction[j].netAmt;

            if (attraction[j].numOfPax) {
              totalOfferPriceBeforeGst +=
                Number((netAmtReal / (1 + attraction[j].gst / 100)).toFixed(2)) *
                attraction[j].numOfPax;
            } else {
              totalOfferPriceBeforeGst += Number(
                (attraction[j].netAmt / (1 + attraction[j].gst / 100)).toFixed(2)
              );
            }

            let isPackage = false;
            if (attraction[j].packageSpec) {
              isPackage = true;
            }
            let vidGroup = null;
            if (attraction[j].vidGroup !== undefined) {
              // eslint-disable-next-line prefer-destructuring
              vidGroup = attraction[j].vidGroup;
            }
            if (isPackage) {
              const packageSpecObj = JSON.parse(attraction[j].packageSpec);

              const itemPluList = packageSpecObj.packageSpecAttributes || [];
              if (attraction[j].ticketType === 'MPP') {
                vidList.push({
                  vidNo: null,
                  vidCode: attraction[j].visualID,
                  themePark: attraction[j].themePark,
                  themeParks: attraction[j].themeParks,
                  pluName: attraction[j].pluName,
                  ticketGroup: attraction[j].ticketGroup,
                  ticketType: attraction[j].ticketType,
                  validDayTo: attraction[j].validDayTo,
                  numOfPax: getNumOfPaxInPackage(attraction[j]),
                  vidGroup,
                });
                vidResultList.push({
                  vidNo: null,
                  vidCode: attraction[j].visualID,
                  themePark: attraction[j].themePark,
                  themeParks: attraction[j].themeParks,
                  pluName: attraction[j].pluName,
                  offerName: offers[i].offerName,
                  ticketGroup: attraction[j].ticketGroup,
                  ticketType: attraction[j].ticketType,
                  validDayTo: attraction[j].validDayTo,
                  numOfPax: getNumOfPaxInPackage(attraction[j]),
                  vidGroup,
                });
                itemPluList.forEach(itemPlu => {
                  if (itemPlu.ticketType === 'Voucher') {
                    vidList.push({
                      vidNo: null,
                      vidCode: itemPlu.visualId,
                      themePark: itemPlu.themeParkCode,
                      themeParks: itemPlu.themeParks ? itemPlu.themeParks.split(',') : [],
                      pluName: itemPlu.pluName,
                      ticketGroup: '',
                      ticketType: itemPlu.ticketType,
                      validDayTo: itemPlu.endDate
                        ? moment(itemPlu.endDate, 'x').format('DD-MMM-YYYY')
                        : itemPlu.endDate,
                      numOfPax: getNumOfPaxInPackage(attraction[j]),
                      vidGroup,
                    });
                    vidResultList.push({
                      vidNo: null,
                      vidCode: itemPlu.visualId,
                      offerName: offers[i].offerName,
                      themePark: itemPlu.themeParkCode,
                      themeParks: itemPlu.themeParks ? itemPlu.themeParks.split(',') : [],
                      pluName: itemPlu.pluName,
                      ticketGroup: '',
                      ticketType: itemPlu.ticketType,
                      validDayTo: itemPlu.endDate
                        ? moment(itemPlu.endDate, 'x').format('DD-MMM-YYYY')
                        : itemPlu.endDate,
                      numOfPax: getNumOfPaxInPackage(attraction[j]),
                      vidGroup,
                    });
                  }
                });
              } else {
                itemPluList.forEach(itemPlu => {
                  vidList.push({
                    vidNo: null,
                    vidCode: itemPlu.visualId,
                    themePark: itemPlu.themeParkCode,
                    themeParks: itemPlu.themeParks ? itemPlu.themeParks.split(',') : [],
                    pluName: itemPlu.pluName,
                    ticketGroup: itemPlu.ageGroup,
                    ticketType: itemPlu.ticketType,
                    validDayTo: itemPlu.endDate
                      ? moment(itemPlu.endDate, 'x').format('DD-MMM-YYYY')
                      : itemPlu.endDate,
                    numOfPax: getNumOfPaxInPackage(attraction[j]),
                    vidGroup,
                  });
                  vidResultList.push({
                    vidNo: null,
                    vidCode: itemPlu.visualId,
                    offerName: offers[i].offerName,
                    themePark: itemPlu.themeParkCode,
                    themeParks: itemPlu.themeParks ? itemPlu.themeParks.split(',') : [],
                    pluName: itemPlu.pluName,
                    ticketGroup: itemPlu.ageGroup,
                    ticketType: itemPlu.ticketType,
                    validDayTo: itemPlu.endDate
                      ? moment(itemPlu.endDate, 'x').format('DD-MMM-YYYY')
                      : itemPlu.endDate,
                    numOfPax: getNumOfPaxInPackage(attraction[j]),
                    vidGroup,
                  });
                });
              }
            } else {
              vidList.push({
                vidNo: null,
                vidCode: attraction[j].visualID,
                themePark: attraction[j].themePark,
                themeParks: attraction[j].themeParks,
                pluName: attraction[j].pluName,
                ticketGroup: attraction[j].ticketGroup,
                ticketType: attraction[j].ticketType,
                validDayTo: attraction[j].validDayTo,
                numOfPax: getNumOfPaxInPackage(attraction[j]),
                vidGroup,
              });
              vidResultList.push({
                vidNo: null,
                vidCode: attraction[j].visualID,
                themePark: attraction[j].themePark,
                themeParks: attraction[j].themeParks,
                pluName: attraction[j].pluName,
                offerName: offers[i].offerName,
                ticketGroup: attraction[j].ticketGroup,
                ticketType: attraction[j].ticketType,
                validDayTo: attraction[j].validDayTo,
                numOfPax: getNumOfPaxInPackage(attraction[j]),
                vidGroup,
              });
            }
          }
        }
        vidList.sort((a, b) => {
          if (a.vidGroup) {
            return a.vidGroup - b.vidGroup;
          }
        });
        detailList.push({
          offerName: offers[i].offerName,
          bundleName: offers[i].bundleName,
          visitDate: offers[i].visitDate,
          vidList,
          delivery: offers[i].deliveryInfo,
          offerGroup: offers[i].offerGroup,
          attraction: offers[i].attraction,
        });
      }

      bookingDetail.bocaFeeConfigure = bocaFeeConfigure;
      bookingDetail.totalOfferPriceBeforeGst = totalOfferPriceBeforeGst.toFixed(2);
      bookingDetail.totalBocaFeeBeforeGst = totalBocaFeeBeforeGst.toFixed(2);
      bookingDetail.totalServiceTax = (
        totalPrice -
        bookingDetail.totalOfferPriceBeforeGst -
        bookingDetail.totalBocaFeeBeforeGst
      ).toFixed(2);

      for (let i = 0; i < vidResultList.length; i += 1) {
        vidResultList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
      }
      vidResultList.sort((a, b) => {
        if (a.vidGroup) {
          return a.vidGroup - b.vidGroup;
        }
      });
      return {
        ...state,
        detailList,
        vidResultList,
        patronInfo,
        netAmt,
        refundSuccessFlag,
        status,
        bookingDetail,
      };
    },
    resetData(state) {
      return {
        ...state,
        orderDetailVisible: false,
        detailType: 'Revalidation',
        searchList: {
          bookingNo: null,
          isSubOrder: null,
        },
        detailList: [],
        vidResultList: [],
        patronInfo: {},
        themeParkList: [],
        netAmt: 0,
        refundSuccessFlag: false,
        status: null,
        revalidationVidListVisible: false,
        revalidationVidList: [],
        bookingDetail: null,
        orderQuantityList: [],
      };
    },
  },

  subscriptions: {},
};
