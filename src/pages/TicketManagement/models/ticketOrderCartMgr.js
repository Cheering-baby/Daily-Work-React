import { message } from 'antd';
import router from 'umi/router';
import moment from "moment";
import { queryCountry } from '@/pages/TicketManagement/services/ticketCommon';
import {
  queryPluAttribute,
  queryPluListByCondition,
  createShoppingCart,
  queryShoppingCart,
  addToShoppingCart,
  removeShoppingCart,
  calculateOrderOfferPrice,
} from '@/pages/TicketManagement/services/orderCart';
import {
  createBooking,
  queryBookingStatus,
} from "@/pages/TicketManagement/services/bookingAndPay";
import {
  transOrderToOfferInfos,
  transGetOrderList,
  createOrderItemId,
  demolitionOrder,
  getOapOrderProductList,
  getCheckPackageOrderData,
  getCheckOapOrderData,
  getCheckTicketAmount,
  transBookingCommonOffers,
  transOapCommonOffers,
  transBookingOffersTotalPrice,
} from "@/pages/TicketManagement/utils/orderCartUtil";
import {
  getAttractionProductList,
  getVoucherProductList
} from '../utils/ticketOfferInfoUtil';
import {
  queryTaInfo,
  querySubTaInfo
} from '@/pages/TicketManagement/services/taMgrService';
import {isNvl} from "@/utils/utils";

export default {
  namespace: 'ticketOrderCartMgr',

  state: {
    deliveryMode: undefined,
    collectionDate: null,
    bocaFeePax: 2.00,
    offerOrderData: [],
    selectAllOrder: true,
    selectAllIndeterminate: false,
    orderCartDataAmount: 0,
    packageOrderData: [],
    generalTicketOrderData: [],
    onceAPirateOrderData: [],
    showToCartModalType: 0,
    showToCartModal: false,
    editOrderOffer: null,
    attractionProduct: [],
    deliverInfomation: {},
    countrys: [],
    checkOutLoading: false,
    cartId: null,
    taDetailInfo: null,
    subTaDetailInfo: null,
  },

  effects: {

    *fetchQueryTaDetail(_, { call, put, select }) {
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { taId: companyId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(queryTaInfo, params);
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            taDetailInfo: result,
          },
        });
      } else {
        message.error(resultMsg);
      };
    },

    *fetchQuerySubTaDetail(_, { call, put, select }) {
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { subTaId: companyId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(querySubTaInfo, params);
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            subTaDetailInfo: result,
          },
        });
      } else {
        message.error(resultMsg);
      };
    },

    *calculateOrderOfferPrice({ payload }, { call }) {

      const {
        queryInfo,
        orderOffer,
        callbackFn
      } = payload;

      const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
      const attractionProductList = getAttractionProductList(orderOffer.offerInfo.offerProfile,validTimeFrom);
      const voucherProductList = getVoucherProductList(orderOffer.offerInfo.offerProfile,validTimeFrom);
      const orderProductList = getOapOrderProductList(queryInfo,orderOffer,attractionProductList,voucherProductList,validTimeFrom);

      const commonOffers = [];
      const calculateCommonOffer = {
        offerNo: orderOffer.offerInfo.offerNo,
        offerCount: orderOffer.orderInfo.orderQuantity,
        priceRuleId: null,
        attractionProducts: orderProductList,
      };
      commonOffers.push(calculateCommonOffer);

      const params = {
        commonOffers,
        voucherNos: [],
      };
      const { data: { resultCode, resultMsg, result } } = yield call(calculateOrderOfferPrice, params);
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }

      if (callbackFn) {
        callbackFn.setFnCode(resultCode);
        callbackFn.setOrderOfferSumPrice(result.prePayPrice+result.postPayPrice);
      }

    },

    *createShoppingCart({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: true,
        },
      });
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = {
        "customerType": "TA",
        "customerId": companyId,
      };
      const { data: { resultCode, resultMsg, result } } = yield call(createShoppingCart, params);
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: false,
        },
      });
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          cartId: result.cartId,
        },
      });
    },

    *queryShoppingCart({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: true,
        },
      });
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = {
        "customerType": "TA",
        "customerId": companyId,
      };
      const { data: { resultCode, resultMsg, result } } = yield call(queryShoppingCart, params);
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: false,
        },
      });
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }
      if (result && result.offerInstances) {
        const orderDataList = transGetOrderList(result.offerInstances);
        yield put({
          type: 'save',
          payload: {
            packageOrderData: orderDataList.packageOrderData,
            generalTicketOrderData: orderDataList.generalTicketOrderData,
            onceAPirateOrderData: orderDataList.onceAPirateOrderData,
          },
        });
      }
      yield put({
        type: 'countTicketOrderAmount',
        payload: {},
      });

    },

    *addToShoppingCart({ payload }, { call, put, select }) {

      const {
        offerNo,
        themeParkCode,
        themeParkName,
        orderData,
        callbackFn,
      } = payload;

      const {
        cartId,
      } = yield select(state => state.ticketOrderCartMgr);
      const params = {
        "cartId": cartId,
        "offerInfos": transOrderToOfferInfos(offerNo,themeParkCode,themeParkName,orderData),
      };
      const { data: { resultCode, resultMsg } } = yield call(addToShoppingCart, params);
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }
      if (callbackFn) {
        callbackFn.setFnCode(resultCode);
      }
      yield put({
        type: 'queryShoppingCart',
        payload: {},
      });

    },

    *removeShoppingCart({ payload }, { call, put, select }) {
      const {
        offerInstances,
        callbackFn,
      } = payload;
      const {
        cartId,
      } = yield select(state => state.ticketOrderCartMgr);
      const params = {
        "cartId": cartId,
        "offerInstances": offerInstances,
      };
      const { data: { resultCode, resultMsg } } = yield call(removeShoppingCart, params);
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }
      if (callbackFn) {
        callbackFn.setFnCode(resultCode);
      }
      yield put({
        type: 'queryShoppingCart',
        payload: {},
      });
      return resultCode;
    },

    *queryPluAttribute({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: true,
        },
      });
      const params = {
        "attributeItem":payload.attributeItem,
      };
      const { data: { resultCode, resultMsg, result } } = yield call(queryPluAttribute, params);
      yield put({ type: 'save', payload: {checkOutLoading: false}, });
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }
      if (!result.items || result.items.length===0) {
        // eslint-disable-next-line no-throw-literal
        message.warn(`${payload.attributeItem} config is null`);
        return;
      }
      let queryPluKey = 0;
      result.items.map(item=>{
        if (item.item === 'DeliveryPLU') {
          queryPluKey = item.itemValue;
        }
      });
      yield put({
        type: 'queryPluListByCondition',
        payload: {
          queryPluKey,
        },
      });
    },

    *queryPluListByCondition({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: true,
        },
      });
      const params = {
        "queryPluKey":payload.queryPluKey,
      };
      const { data: { resultCode, resultMsg, result } } = yield call(queryPluListByCondition, params);
      yield put({ type: 'save', payload: {checkOutLoading: false}, });
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }
      let bocaFeePax = 0;
      for (const pluObj of result.pluInfos) {
        bocaFeePax = pluObj.unitPrice;
      }
      yield put({
        type: 'save',
        payload: {
          bocaFeePax,
        },
      });
    },

    *orderCheckOut({ payload }, { put, select }) {

      yield put({
        type: 'save',
        payload: {
          checkOutLoading: true,
        },
      });

      const {
        bocaFeePax,
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
        deliveryMode,
        collectionDate,
      } = yield select(state => state.ticketOrderCartMgr);

      const packageOrderDataNew = getCheckPackageOrderData(packageOrderData);
      const generalTicketOrderDataNew = getCheckPackageOrderData(generalTicketOrderData);
      const onceAPirateOrderDataNew = getCheckOapOrderData(onceAPirateOrderData);
      const ticketAmount = getCheckTicketAmount(packageOrderData,generalTicketOrderData,onceAPirateOrderData);

      yield put({
        type: 'orderBooking',
        payload: {
          deliveryMode,
          collectionDate,
          ticketAmount,
          bocaFeePax,
          packageOrderData: packageOrderDataNew,
          generalTicketOrderData: generalTicketOrderDataNew,
          onceAPirateOrderData: onceAPirateOrderDataNew,
        },
      });
    },

    *orderBooking({ payload }, { call, put, select }) {

      const {
        deliveryMode,
        collectionDate,
        ticketAmount,
        bocaFeePax,
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = payload;

      const {
        cartId, taDetailInfo, subTaDetailInfo
      } = yield select(state => state.ticketOrderCartMgr);

      const {
        userCompanyInfo: { companyType },
      } = yield select(state => state.global);

      let patronInfo = null;

      if (companyType==='02') {
        if (subTaDetailInfo) {
          patronInfo = {
            email: subTaDetailInfo.email,
            country: subTaDetailInfo.country,
          };
        }
      } else {
        if (taDetailInfo && taDetailInfo.customerInfo && taDetailInfo.customerInfo.contactInfo) {
          const contactInfo = taDetailInfo.customerInfo.contactInfo;
          patronInfo = {
            firstName: contactInfo.firstName,
            lastName: contactInfo.lastName,
            phoneNo: contactInfo.phone,
            email: contactInfo.email,
            country: contactInfo.country,
          };
        }
      }

      let bookingParam = {
        customerId: '',
        commonOffers: [],
        patronInfo,
        totalPrice: 0,
        identificationNo: null,
        identificationType: null,
        voucherNos: [],
        cardId: cartId,
      };

      const ticketOrderData = [...packageOrderData,...generalTicketOrderData];
      const bookingCommonOffers = transBookingCommonOffers(ticketOrderData,collectionDate,deliveryMode);
      const oapCommonOffers = transOapCommonOffers(onceAPirateOrderData,collectionDate,deliveryMode);
      bookingParam.commonOffers = [...bookingCommonOffers,...oapCommonOffers];
      bookingParam.totalPrice = transBookingOffersTotalPrice(ticketOrderData,onceAPirateOrderData);
      if (deliveryMode && deliveryMode === 'BOCA') {
        bookingParam.totalPrice += ticketAmount * bocaFeePax;
      }
      bookingParam.totalPrice = parseFloat(bookingParam.totalPrice);

      console.log(bookingParam);

      const { data } = yield call(createBooking, bookingParam);
      if (data) {
        const { resultCode, resultMsg, result = {} } = data;
        if (resultCode === '0') {
          const { bookingNo } = result;
          yield put({
            type: 'queryBookingStatus',
            payload: {
              bookingNo,
              deliveryMode,
              collectionDate,
              ticketAmount,
              bocaFeePax,
              generalTicketOrderData,
              packageOrderData,
              onceAPirateOrderData,
              totalPrice: bookingParam.totalPrice,
            },
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              checkOutLoading: false,
              type: 'Error',
              resultMsg: resultMsg
            },
          });
          message.error(resultMsg);
        }
      } else {
        yield put({
          type: 'save',
          payload: {
            checkOutLoading: false,
            type: 'Error',
            resultMsg: ''
          },
        });
        message.error('createBooking error');
      }
    },

    *queryBookingStatus({ payload }, { call, put }) {

      const {
        bookingNo,
        deliveryMode,
        collectionDate,
        ticketAmount,
        bocaFeePax,
        generalTicketOrderData,
        packageOrderData,
        onceAPirateOrderData,
        totalPrice,
      } = payload;

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
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: false,
        },
      });
      // status: WaitingForPaying
      if (status === 'WaitingForPaying' || status === 'PendingApproval') {
        yield put({
          type: 'ticketBookingAndPayMgr/save',
          payload: {
            bookingNo,
            deliveryMode,
            collectionDate,
            ticketAmount,
            bocaFeePax,
            generalTicketOrderData,
            packageOrderData,
            onceAPirateOrderData,
            bookDetail: {
              transStatus: status,
              totalPrice,
            }
          },
        });
        message.success('Check out successfully!');
        router.push(`/TicketManagement/Ticketing/OrderCart/OrderPay`);
        return;
      }
      // status: Failed
      if (status === 'Failed') {
        const { failedReason } = statusResult;
        yield put({
          type: 'save',
          payload: {
            checkOutLoading: false,
            type: 'BookingFailed',
            resultMsg: failedReason
          },
        });
        message.error(failedReason);
      } else {
        message.error("Check out error!");
      }

    },

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

    *settingPackAgeTicketOrderData({ payload }, { put, take }) {
      const { orderIndex, orderData } = payload;
      const newOrderInfo = orderData.orderInfo.map(orderInfo => {
        return {
          orderCheck: true,
          ...orderInfo,
        };
      });
      const newOrderItem = Object.assign(
        {},
        {
          orderAll: true,
          indeterminate: false,
          ...orderData,
          orderInfo: newOrderInfo,
        }
      );
      const themeParkCode = 'package';
      const themeParkName = 'Attraction Package';
      if (!isNvl(orderIndex) && orderIndex > -1) {
        const removeShoppingFn = {
          callbackFnCode: 1,
          setFnCode: function (callbackCode) {
            this.callbackFnCode = callbackCode;
          }
        };
        yield put({
          type: 'removeShoppingCart',
          payload: {
            offerInstances: [{
              offerNo: newOrderItem.offerInfo.offerNo,
              offerInstanceId: newOrderItem.offerInstanceId,
            }],
            callbackFn: removeShoppingFn,
          },
        });
        yield take('removeShoppingCart/@@end');
        if (removeShoppingFn.callbackFnCode!==0 && removeShoppingFn.callbackFnCode!=="0") {
          return;
        }
      }

      const callbackFn = {
        callbackFnCode: 1,
        setFnCode: function (callbackCode) {
          this.callbackFnCode = callbackCode;
        }
      };
      yield put({
        type: 'addToShoppingCart',
        payload: {
          offerNo: newOrderItem.offerInfo.offerNo,
          themeParkCode: themeParkCode,
          themeParkName: themeParkName,
          orderData: newOrderItem,
          callbackFn,
        },
      });
      yield take('addToShoppingCart/@@end');

      if (callbackFn.callbackFnCode==='0') {
        message.success('Order successfully!');
      }

    },

    *settingGeneralTicketOrderData({ payload }, { put, take }) {
      const { orderIndex, orderData } = payload;
      const { themeParkCode, themeParkName } = orderData;
      const newOrderInfo = orderData.orderInfo.map(orderInfo => {
        return {
          orderCheck: true,
          ...orderInfo,
        };
      });
      const newOrderItem = Object.assign(
        {},
        {
          orderAll: true,
          indeterminate: false,
          ...orderData,
          orderInfo: newOrderInfo,
        }
      );
      if (!isNvl(orderIndex) && orderIndex > -1) {
        const removeShoppingFn = {
          callbackFnCode: 1,
          setFnCode: function (callbackCode) {
            this.callbackFnCode = callbackCode;
          }
        };
        yield put({
          type: 'removeShoppingCart',
          payload: {
            offerInstances: [{
              offerNo: newOrderItem.offerInfo.offerNo,
              offerInstanceId: newOrderItem.offerInstanceId,
            }],
            callbackFn: removeShoppingFn,
          },
        });
        yield take('removeShoppingCart/@@end');
        if (removeShoppingFn.callbackFnCode!==0 && removeShoppingFn.callbackFnCode!=="0") {
          return;
        }
      }

      const callbackFn = {
        callbackFnCode: 1,
        setFnCode: function (callbackCode) {
          this.callbackFnCode = callbackCode;
        }
      };
      yield put({
        type: 'addToShoppingCart',
        payload: {
          offerNo: newOrderItem.offerInfo.offerNo,
          themeParkCode: themeParkCode,
          themeParkName: themeParkName,
          orderData: newOrderItem,
          callbackFn,
        },
      });
      yield take('addToShoppingCart/@@end');

      if (callbackFn.callbackFnCode==='0') {
        message.success('Order successfully!');
      }

    },

    *settingOnceAPirateOrderData({ payload }, { put, take }) {

      const {
        orderIndex,
        orderData,
        settingOnceAPirateOrderDataCallbackFn
      } = payload;

      let addOrderItem = null;
      // delete old data
      if (!isNvl(orderIndex) && orderIndex > -1) {
        addOrderItem = {...orderData};
        const removeOfferInstanceList = [];
        for (let orderOfferIndex=0;orderOfferIndex<addOrderItem.orderOfferList.length;orderOfferIndex++) {
          const offerDetail = addOrderItem.orderOfferList[orderOfferIndex];
          removeOfferInstanceList.push({
            offerNo: offerDetail.offerInfo.offerNo,
            offerInstanceId: offerDetail.offerInstanceId,
          })
        }
        const removeShoppingFn = {
          callbackFnCode: 1,
          setFnCode: function (callbackCode) {
            this.callbackFnCode = callbackCode;
          }
        };
        yield put({
          type: 'removeShoppingCart',
          payload: {
            offerInstances: removeOfferInstanceList,
            callbackFn: removeShoppingFn,
          },
        });
        yield take('removeShoppingCart/@@end');
        if (removeShoppingFn.callbackFnCode!==0 && removeShoppingFn.callbackFnCode!=="0") {
          return;
        }
      }
      // new data setting
      const orderOfferList = orderData.orderOfferList.map(orderOffer => {
        return {
          orderCheck: true,
          ...orderOffer,
          orderInfo: {
            ...orderOffer.orderInfo,
            voucherType: orderData.voucherType,
          },
        };
      });
      addOrderItem = Object.assign(
        {},
        {
          orderAll: true,
          indeterminate: false,
          voucherType: orderData.voucherType,
          ...orderData,
          orderOfferList,
        }
      );
      // add shopping cart
      let batchPullResult = 'done';
      const orderItemId = createOrderItemId(addOrderItem);
      for (let orderOfferIndex=0;orderOfferIndex<addOrderItem.orderOfferList.length;orderOfferIndex++) {

        const offerDetail = addOrderItem.orderOfferList[orderOfferIndex];

        const calculateOrderOfferPriceCallbackFn = {
          callbackFnCode: 1,
          orderOfferSumPrice: 0,
          setFnCode: function (callbackCode) {
            this.callbackFnCode = callbackCode;
          },
          setOrderOfferSumPrice: function (sumPrice) {
            this.orderOfferSumPrice = sumPrice;
          }
        };
        yield put({
          type: 'calculateOrderOfferPrice',
          payload: {
            queryInfo: addOrderItem.queryInfo,
            orderOffer: offerDetail,
            callbackFn: calculateOrderOfferPriceCallbackFn,
          },
        });
        yield take('calculateOrderOfferPrice/@@end');
        if (calculateOrderOfferPriceCallbackFn.callbackFnCode!==0 && calculateOrderOfferPriceCallbackFn.callbackFnCode!=="0") {
          batchPullResult = 'fail';
          break;
        }

        const orderOfferSumPrice = calculateOrderOfferPriceCallbackFn.orderOfferSumPrice;
        offerDetail.orderInfo = Object.assign({},{
          ...offerDetail.orderInfo,
          offerSumPrice: orderOfferSumPrice
        });
        const callbackFn = {
          callbackFnCode: 1,
          setFnCode: function (callbackCode) {
            this.callbackFnCode = callbackCode;
          }
        };
        yield put({
          type: 'addToShoppingCart',
          payload: {
            offerNo: offerDetail.offerInfo.offerNo,
            themeParkCode: "OAP",
            themeParkName: "ONCE A PIRATE",
            orderData: demolitionOrder(orderItemId,addOrderItem,offerDetail),
            callbackFn,
          },
        });
        yield take('addToShoppingCart/@@end');
        if (callbackFn.callbackFnCode!==0 && callbackFn.callbackFnCode!=="0") {
          batchPullResult = 'fail';
          break;
        }

      }
      if (settingOnceAPirateOrderDataCallbackFn) {
        settingOnceAPirateOrderDataCallbackFn.setFnCode(batchPullResult);
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
    countTicketOrderAmount(state, _) {
      const {
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = state;
      let orderCartDataAmount = 0;
      const orderList = [generalTicketOrderData, packageOrderData];
      orderList.forEach(orderItem => {
        orderItem.forEach(orderData => {
          orderCartDataAmount += orderData.orderOfferList.length;
        });
      });
      orderCartDataAmount += onceAPirateOrderData.length;
      return {
        ...state,
        orderCartDataAmount,
      };
    },
    ticketOrderCheckSave(state, { payload }) {
      const {
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = state;
      let selectAllOrder = true;
      let selectAllIndeterminate = false;
      const orderArray = [packageOrderData, generalTicketOrderData, onceAPirateOrderData];
      let existOneChecked = false;
      let existOneNoChecked = false;
      orderArray.forEach((orderList, listIndex) => {
        orderList.forEach(orderData => {
          orderData.orderOfferList.forEach(orderOffer => {
            if (listIndex < 2 && orderOffer.orderInfo) {
              orderOffer.orderInfo.forEach(info => {
                if (info.orderCheck) {
                  existOneChecked = true;
                } else {
                  existOneNoChecked = true;
                }
              });
            } else if (listIndex === 2) {
              if (orderOffer.orderCheck) {
                existOneChecked = true;
              } else {
                existOneNoChecked = true;
              }
            }
          });
        });
      });
      if (existOneChecked && existOneNoChecked) {
        selectAllOrder = true;
        selectAllIndeterminate = true;
      } else if (existOneChecked && !existOneNoChecked) {
        selectAllOrder = true;
        selectAllIndeterminate = false;
      } else if (!existOneChecked) {
        selectAllOrder = false;
        selectAllIndeterminate = false;
      }
      return {
        ...state,
        selectAllOrder,
        selectAllIndeterminate,
        ...payload,
      };
    },
    changeSelectAllOrder(state, { payload }) {
      const { selectAllOrder, selectAllIndeterminate } = payload;
      const {
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = state;
      const newPackageOrderData = [];
      const newGeneralTicketOrderData = [];
      const newOnceAPirateOrderData = [];
      const orderArray = [packageOrderData, generalTicketOrderData];
      orderArray.forEach((orderList, listIndex) => {
        orderList.forEach(orderData => {
          const newOrderData = Object.assign(
            {},
            {
              ...orderData,
              orderAll: selectAllOrder,
              indeterminate: selectAllIndeterminate,
            }
          );
          newOrderData.orderOfferList = orderData.orderOfferList.map(orderOffer => {
            const newOrderInfo = orderOffer.orderInfo.map(orderInfo => {
              return Object.assign(
                {},
                {
                  ...orderInfo,
                  orderCheck: selectAllOrder,
                }
              );
            });
            return Object.assign(
              {},
              {
                ...orderOffer,
                orderInfo: newOrderInfo,
                orderAll: selectAllOrder,
                indeterminate: selectAllIndeterminate,
              }
            );
          });
          if (listIndex === 0) {
            newPackageOrderData.push(newOrderData);
          } else {
            newGeneralTicketOrderData.push(newOrderData);
          }
        });
      });
      onceAPirateOrderData.forEach(orderInfo => {
        const newOrderInfo = Object.assign(
          {},
          {
            ...orderInfo,
            orderAll: selectAllOrder,
            indeterminate: selectAllIndeterminate,
          }
        );
        newOrderInfo.orderOfferList = orderInfo.orderOfferList.map((offerInfo) => {
          return Object.assign(
            {},
            {
              ...offerInfo,
              orderCheck: selectAllOrder,
            }
          );
        });
        newOnceAPirateOrderData.push(newOrderInfo);
      });
      return {
        ...state,
        selectAllOrder,
        selectAllIndeterminate,
        generalTicketOrderData: newGeneralTicketOrderData,
        packageOrderData: newPackageOrderData,
        onceAPirateOrderData: newOnceAPirateOrderData,
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
