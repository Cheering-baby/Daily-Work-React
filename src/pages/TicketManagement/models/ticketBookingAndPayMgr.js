import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import {
  createBooking,
  queryBookingStatus,
  paymentOrder,
  ticketDownload,
  accountTopUp,
  sendTransactionPaymentOrder,
} from '@/pages/TicketManagement/services/bookingAndPay';

import {
  queryAccountInfo,
  queryInfoWithNoId,
  queryAccount,
  queryTaInfo,
} from '@/pages/TicketManagement/services/taMgrService';

export default {
  namespace: 'ticketBookingAndPayMgr',

  state: {
    payPageLoading: false,
    deliveryMode: undefined,
    payModeList: [
      {
        value: 1,
        label: 'eWallet',
        key: 'E_WALLET',
        check: true,
      },
      {
        value: 2,
        label: 'Credit Card',
        key: 'CREDIT_CARD',
        check: false,
      },
      {
        value: 3,
        label: 'AR',
        key: 'AR_CREDIT',
        check: false,
      },
    ],
    collectionDate: null,
    ticketAmount: 0,
    bocaFeePax: 2.0,
    bookingOrderData: [],
    packageOrderData: [],
    generalTicketOrderData: [],
    onceAPirateOrderData: [],
    payModelShow: false,
    bookingNo: null,
    taDetailInfo: null,
    accountInfo: null,
    bookDetail: {
      totalPrice: 20000.0,
    },
    downloadFileLoading: false,
  },

  effects: {
    *initPage({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });

      yield put({
        type: 'fetchAccountDetail',
        payload: {},
      });

      yield put({
        type: 'fetchQueryTaDetail',
        payload: {},
      });
    },

    *fetchAccountTopUp({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const params = { topupAmount: payload.topupAmount };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(accountTopUp, params);
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        return result;
      } 
        message.error(resultMsg);
      
    },

    *fetchTicketDownload(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: true,
        },
      });
      const { bookingNo } = yield select(state => state.ticketBookingAndPayMgr);
      const params = {
        forderNo: bookingNo,
      };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(ticketDownload, params);
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: false,
        },
      });
      if (resultCode === '0') {
        return result;
      } 
        message.error(resultMsg);
      
    },

    *fetchAccountDetail(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { taId: companyId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(queryAccount, params);
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        if (!result.accountProfileBean) return;
        const bean = cloneDeep(result.accountProfileBean);
        bean.accountBookBeanList.forEach(item => {
          if (item.accountBookType === 'E_WALLET') {
            bean.eWallet = cloneDeep(item);
          }
          if (item.accountBookType === 'AR_CREDIT') {
            bean.ar = cloneDeep(item);
          }
          if (item.accountBookType === 'CREDIT_CARD') {
            bean.cc = cloneDeep(item);
          }
        });
        yield put({
          type: 'save',
          payload: {
            accountInfo: bean,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *fetchQueryTaDetail(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { taId: companyId };
      const queryTaInfoResponse = yield call(queryTaInfo, params);
      console.log(queryTaInfoResponse);
      if (!queryTaInfoResponse || !queryTaInfoResponse.data) {
        message.error('Query ta info service error!');
        return;
      }
      const {
        data: { resultCode, resultMsg, result = {} },
      } = queryTaInfoResponse;
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            taDetailInfo: result,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *sendTransactionPaymentOrder(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const { bookingNo, taDetailInfo } = yield select(state => state.ticketBookingAndPayMgr);

      let emailNo = '';
      if (taDetailInfo && taDetailInfo.otherInfo && taDetailInfo.otherInfo.billingInfo) {
        emailNo = taDetailInfo.otherInfo.billingInfo.email;
      }
      const params = {
        orderNo: bookingNo,
        emailNo,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(sendTransactionPaymentOrder, params);
      yield put({
        type: 'queryBookingStatus',
        payload: {},
      });
      if (resultCode === '0') {
        return result;
        message.success('Confirm successfully!');
      } 
        message.error(resultMsg);
      
    },

    *confirmEvent(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const {
        userCompanyInfo: { companyId = '', companyType },
      } = yield select(state => state.global);
      const { bookingNo, payModeList } = yield select(state => state.ticketBookingAndPayMgr);

      const payMode = payModeList.filter(payMode => payMode.check);
      const params = {
        orderNo: bookingNo,
        paymentMode: payMode[0].key,
      };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(paymentOrder, params);
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        if (companyType === '02') {
          message.success('Confirm successfully!');
        } else {
          yield put({
            type: 'queryBookingStatus',
            payload: {},
          });
        }
      } else {
        message.error(resultMsg);
      }
    },

    *queryBookingStatus({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });

      const { bookingNo } = yield select(state => state.ticketBookingAndPayMgr);
      let status = 'WaitingForPaying';
      let statusResult = {};
      while (status === 'WaitingForPaying' || status === 'Archiving') {
        const { data: statusData = {} } = yield call(queryBookingStatus, { bookingNo });
        const { resultCode: statusResultCode, result: newResult = {} } = statusData;
        if (statusResultCode === '0') {
          const { transStatus } = newResult;
          status = transStatus;
          statusResult = newResult;
        } else {
          status = 'Failed';
        }
      }
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (status === 'Complete') {
        yield put({
          type: 'save',
          payload: {
            payPageLoading: false,
            payModelShow: true,
          },
        });
      } else {
        const { failedReason } = statusResult;
        message.error(failedReason);
      }
    },

    *queryTaDetailInfo({ payload }, { call, put }) {
      const response = yield call(queryInfoWithNoId);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        console.log(result);
        yield put({
          type: 'save',
          payload: {
            taDetailInfo: result,
          },
        });
        yield put({
          type: 'queryAccountInfo',
          payload: {
            taId: result.taId,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *queryAccountInfo({ payload }, { call, put }) {
      const param = { taId: payload.taId };
      const response = yield call(queryAccountInfo, param);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        console.log(result);
        yield put({
          type: 'save',
          payload: {
            taAccountInfo: result,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *orderCheckOut({ payload }, { call, put }) {
      const {
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = payload;

      yield put({
        type: 'save',
        payload: {
          packageOrderData,
          generalTicketOrderData,
          onceAPirateOrderData,
        },
      });
    },

    *orderCreate({ payload }, { call, put }) {
      const {
        deliveryMode,
        collectionDate,
        ticketAmount,
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = payload;

      const bookingParam = {
        customerId: '',
        commonOffers: [],
        patronInfo: null,
        totalPrice: 0,
        identificationNo: null,
        identificationType: null,
        voucherNos: [],
      };

      const ticketOrderData = [...packageOrderData, ...generalTicketOrderData];
      ticketOrderData.forEach(orderData => {
        orderData.orderOfferList.forEach(orderOffer => {
          const { queryInfo, offerInfo, orderInfo, deliveryInfo } = orderOffer;
          let totalPrice = 0;
          const attractionProducts = [];
          orderInfo.forEach(orderInfo => {
            totalPrice += orderInfo.pricePax * orderInfo.quantity;
            const { productInfo } = orderInfo;
            const attractionProduct = {
              productNo: productInfo.productNo,
              numOfAttraction: orderInfo.quantity,
              visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
            };
            attractionProducts.push(attractionProduct);
          });
          const submitCommonOffer = {
            offerNo: offerInfo.offerNo,
            priceRuleId: null,
            offerCount: 1,
            attractionProducts,
            totalPrice,
            patronInfo: null,
            deliveryInfo: {
              referenceNo: deliveryInfo.taNo,
              contactNo: deliveryInfo.customerContactNo,
              lastName: deliveryInfo.guestLastName,
              firstName: deliveryInfo.guestFirstName,
              country: deliveryInfo.country,
              collectionDate,
              deliveryMode: deliveryMode ? moment(deliveryMode, 'x').format('YYYY-MM-DD') : null,
            },
          };
          bookingParam.commonOffers.push(submitCommonOffer);
          bookingParam.totalPrice += totalPrice;
        });
      });

      onceAPirateOrderData.forEach(orderData => {
        const { queryInfo } = orderData;
        orderData.orderOfferList.forEach(orderOffer => {
          const { offerInfo, orderInfo } = orderOffer;
          let totalPrice = orderInfo.offerSumPrice * orderInfo.orderQuantity;
          let mealsProductList = [];
          if (orderInfo.voucherType === '1') {
            mealsProductList = orderInfo.groupSettingList;
          } else {
            mealsProductList = orderInfo.individualSettingList;
          }
          const attractionProducts = [];
          mealsProductList.forEach(mealsProduct => {
            const attractionProduct = {
              productNo: mealsProduct.meals,
              numOfAttraction: mealsProduct.number,
              visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
              comment: mealsProduct.remarks.join(','),
              accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
            };
            attractionProducts.push(attractionProduct);
            offerInfo.voucherProductList.map(voucherProduct => {
              if (voucherProduct.productNo === mealsProduct.meals) {
                voucherProduct.priceRule.forEach(rule => {
                  if (rule.priceRuleName === 'DefaultPrice' && rule.productPrice) {
                    rule.productPrice.forEach(productPrice => {
                      if (productPrice.priceDate === requestParam.validTimeFrom) {
                        const { discountUnitPrice } = productPrice;
                        totalPrice += voucherProduct.needChoiceCount * discountUnitPrice;
                      }
                    });
                  }
                });
              }
            });
          });
          if (orderOffer.offerProfile && orderOffer.offerProfile.productGroup) {
            orderOffer.offerProfile.productGroup.forEach(productGroupInfo => {
              if (productGroupInfo && productGroupInfo.productType === 'Attraction') {
                productGroupInfo.productGroup.forEach(productList => {
                  if (productList.products) {
                    productList.products.forEach(product => {
                      const attractionProduct = {
                        productNo: product.productNo,
                        numOfAttraction: 1,
                        visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
                        accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
                      };
                      attractionProducts.push(attractionProduct);
                    });
                  }
                });
              }
            });
          }
          const submitCommonOffer = {
            offerNo: offerInfo.offerNo,
            priceRuleId: null,
            offerCount: orderInfo.orderQuantity,
            attractionProducts,
            totalPrice,
            patronInfo: null,
            deliveryInfo: {
              referenceNo: null,
              contactNo: null,
              lastName: null,
              firstName: null,
              country: null,
              collectionDate,
              deliveryMode: deliveryMode ? moment(deliveryMode, 'x').format('YYYY-MM-DD') : null,
            },
          };
          bookingParam.commonOffers.push(submitCommonOffer);
          bookingParam.totalPrice += totalPrice;
        });
      });

      bookingParam.totalPrice = parseFloat(bookingParam.totalPrice);
      console.log(bookingParam);

      yield put({
        type: 'save',
        payload: {
          deliveryMode,
          collectionDate,
          ticketAmount,
          packageOrderData,
          generalTicketOrderData,
          onceAPirateOrderData,
        },
      });

      // router.push(`/TicketManagement/Ticketing/OrderCart/OrderPay`);

      const { data } = yield call(createBooking, bookingParam);
      if (data) {
        const { resultCode, resultMsg, result = {} } = data;
        if (resultCode !== '0') {
          yield put({
            type: 'ticketOrderCartMgr/save',
            payload: {
              type: 'CreateErrors',
              resultMsg,
            },
          });
        }
        // query status
        const { bookingNo } = result;
        let status = 'Creating';
        let statusResult = {};
        while (status === 'Creating') {
          const { data: statusData = {} } = yield call(queryBookingStatus, { bookingNo });
          const { resultCode: statusResultCode, result: newResult = {} } = statusData;
          if (statusResultCode === '0') {
            const { transStatus } = newResult;
            status = transStatus;
            statusResult = newResult;
          } else {
            status = 'Failed';
          }
        }
        // status: WaitingForPaying
        if (status === 'WaitingForPaying') {
          yield put({
            type: 'save',
            payload: {
              bookingNo,
            },
          });
          router.push(`/TicketManagement/Ticketing/OrderCart/OrderPay`);
        }
        // status: Failed
        if (status === 'Failed') {
          const { failedReason } = statusResult;
          yield put({
            type: 'ticketOrderCartMgr/save',
            payload: {
              checkOutLoading: false,
              type: 'BookingFailed',
              resultMsg: failedReason,
            },
          });
        }
      } else {
        yield put({
          type: 'ticketOrderCartMgr/save',
          payload: {
            checkOutLoading: false,
            type: 'Error',
            resultMsg: '',
          },
        });
      }
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
        offerOrderData: [],
      };
    },
  },

  subscriptions: {},
};
