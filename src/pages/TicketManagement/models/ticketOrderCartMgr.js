import { message, Modal } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { queryAgentOpt, queryCountry } from '@/pages/TicketManagement/services/ticketCommon';
import {
  addToShoppingCart,
  calculateOrderOfferPrice,
  createShoppingCart,
  queryPluAttribute,
  queryPluListByCondition,
  queryShoppingCart,
  removeShoppingCart,
} from '@/pages/TicketManagement/services/orderCart';
import { createBooking, queryBookingStatus } from '@/pages/TicketManagement/services/bookingAndPay';
import {
  createOrderItemId,
  demolitionBundleOrder,
  demolitionOrder,
  getCheckOapOrderData,
  getCheckPackageOrderData,
  getCheckTicketAmount,
  getOapOrderProductList,
  transBookingCommonOffers,
  transBookingToPayTotalPrice,
  transGetOrderList,
  transOapCommonOffers,
  transOrderToOfferInfos,
  transPackageCommonOffers,
} from '@/pages/TicketManagement/utils/orderCartUtil';
import { getAttractionProductList, getVoucherProductList } from '../utils/ticketOfferInfoUtil';
import { querySubTaInfo, queryTaInfo } from '@/pages/TicketManagement/services/taMgrService';
import { isNvl } from '@/utils/utils';

export default {
  namespace: 'ticketOrderCartMgr',

  state: {
    bookingNo: undefined,
    deliveryMode: undefined,
    collectionDate: null,
    bocaFeePax: 0.0,
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
    deliverInformation: {},
    countrys: [],
    checkOutLoading: false,
    cartId: null,
    taDetailInfo: null,
    subTaDetailInfo: null,
    showBundleToCart: false,
    bundleOfferDetail: null,
    orderIndex: null,
    offerIndex: null,
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
      }
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
      }
    },

    *calculateOrderOfferPrice({ payload }, { call }) {
      const { queryInfo, orderOffer, callbackFn } = payload;

      const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
      const attractionProductList = getAttractionProductList(
        orderOffer.offerInfo.offerProfile,
        validTimeFrom
      );
      const voucherProductList = getVoucherProductList(
        orderOffer.offerInfo.offerProfile,
        validTimeFrom
      );
      const orderProductList = getOapOrderProductList(
        queryInfo,
        orderOffer,
        attractionProductList,
        voucherProductList,
        validTimeFrom
      );

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
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(calculateOrderOfferPrice, params);
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }

      if (callbackFn) {
        callbackFn.setFnCode(resultCode);
        callbackFn.setOrderOfferSumPrice(result.prePayPrice + result.postPayPrice);
      }
    },

    *createShoppingCart(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: true,
        },
      });
      const { currentUser } = yield select(state => state.global);
      const params = {
        customerType: 'TA',
        customerId: currentUser.userCode,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(createShoppingCart, params);
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

    *queryShoppingCart(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: true,
        },
      });
      const { currentUser } = yield select(state => state.global);
      const params = {
        customerType: 'TA',
        customerId: currentUser.userCode,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryShoppingCart, params);
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
      const { orderType, offerNo, themeParkCode, themeParkName, orderData, callbackFn } = payload;

      const { cartId } = yield select(state => state.ticketOrderCartMgr);
      const params = {
        cartId,
        offerInfos: transOrderToOfferInfos(
          orderType,
          offerNo,
          themeParkCode,
          themeParkName,
          orderData
        ),
      };
      const {
        data: { resultCode, resultMsg },
      } = yield call(addToShoppingCart, params);
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
      const { offerInstances, callbackFn } = payload;
      const { cartId } = yield select(state => state.ticketOrderCartMgr);
      const params = {
        cartId,
        offerInstances,
      };
      const {
        data: { resultCode, resultMsg },
      } = yield call(removeShoppingCart, params);
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

    *checkShoppingCart(_, { put, select }) {
      const { generalTicketOrderData = [] } = yield select(state => state.ticketOrderCartMgr);

      const offerInstances = [];
      generalTicketOrderData.forEach(generalTicketOrderGroup => {
        generalTicketOrderGroup.orderOfferList.forEach(orderData => {
          if (orderData.orderType === 'offerBundle') {
            let isEmptyOrder = true;
            orderData.orderInfo.forEach(orderInfoItem => {
              if (orderInfoItem.quantity > 0) {
                isEmptyOrder = false;
              }
            });
            if (isEmptyOrder) {
              orderData.orderInfo.forEach(orderInfoItem => {
                offerInstances.push({
                  offerNo: orderInfoItem.offerInfo.offerNo,
                  offerInstanceId: orderInfoItem.offerInstanceId,
                });
              });
            }
          }
        });
      });

      if (offerInstances.length > 0) {
        yield put({
          type: 'removeShoppingCart',
          payload: {
            offerInstances,
            callbackFn: null,
          },
        });
      }
    },

    *queryPluAttribute({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: true,
        },
      });
      const params = {
        attributeItem: payload.attributeItem,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryPluAttribute, params);
      yield put({ type: 'save', payload: { checkOutLoading: false } });
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }
      if (!result.items || result.items.length === 0) {
        // eslint-disable-next-line no-throw-literal
        message.warn(`${payload.attributeItem} config is null`);
        return;
      }
      let queryPluKey = 0;
      result.items.forEach(item => {
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
        queryPluKey: payload.queryPluKey,
        activeStatus: '0',
        pageSize: 10,
        currentPage: 1,
        totalSize: 1,
        programId: 'id',
        salesProgramIdType: 'id',
        selectCondition: { pluCode: payload.queryPluKey, activeStatus: '0' },
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryPluListByCondition, params);
      yield put({ type: 'save', payload: { checkOutLoading: false } });
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

    *orderCheckOut(_, { put, select }) {
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
      const ticketAmount = getCheckTicketAmount(
        packageOrderData,
        generalTicketOrderData,
        onceAPirateOrderData
      );

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

      const { cartId, taDetailInfo, subTaDetailInfo, countrys } = yield select(
        state => state.ticketOrderCartMgr
      );

      const {
        userCompanyInfo: { companyType },
      } = yield select(state => state.global);

      let patronInfo = null;

      if (companyType === '02') {
        if (subTaDetailInfo) {
          patronInfo = {
            firstName: subTaDetailInfo.fullName,
            lastName: null,
            phoneNo: null,
            email: subTaDetailInfo.email,
            countryCode: subTaDetailInfo.country,
          };
        }
      } else if (
        taDetailInfo &&
        taDetailInfo.customerInfo &&
        taDetailInfo.customerInfo.companyInfo
      ) {
        const { contactInfo, companyInfo } = taDetailInfo.customerInfo;
        patronInfo = {
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          phoneNo: contactInfo.phone,
          email: contactInfo.email,
          countryCode: companyInfo.country,
        };
      }

      const countryInfo = countrys.find(
        countryItem => countryItem.dictId === patronInfo.countryCode
      );
      if (countryInfo) {
        patronInfo.countryCode = countryInfo.dictName;
      } else {
        patronInfo.countryCode = 'Singapore';
      }

      const bookingParam = {
        customerId: '',
        commonOffers: [],
        patronInfo,
        totalPrice: 0,
        identificationNo: null,
        identificationType: null,
        voucherNos: [],
        cartId,
      };

      const packageCommonOffers = transPackageCommonOffers(
        packageOrderData,
        collectionDate,
        deliveryMode
      );
      const bookingCommonOffers = transBookingCommonOffers(
        generalTicketOrderData,
        collectionDate,
        deliveryMode
      );
      const oapCommonOffers = transOapCommonOffers(
        onceAPirateOrderData,
        collectionDate,
        deliveryMode,
        patronInfo
      );
      bookingParam.commonOffers = [
        ...packageCommonOffers,
        ...bookingCommonOffers,
        ...oapCommonOffers,
      ];
      if (deliveryMode && deliveryMode === 'BOCA') {
        bookingParam.totalPrice += ticketAmount * bocaFeePax;
        bookingParam.totalPrice = transBookingToPayTotalPrice(
          packageOrderData,
          generalTicketOrderData,
          onceAPirateOrderData,
          bocaFeePax
        );
      } else {
        bookingParam.totalPrice = transBookingToPayTotalPrice(
          packageOrderData,
          generalTicketOrderData,
          onceAPirateOrderData,
          null
        );
      }
      // console.log(bookingParam);

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
              resultMsg,
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
            resultMsg: '',
          },
        });
        message.error('createBooking error');
      }
    },

    *queryBookingStatus({ payload }, { call, put, select }) {
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
      yield put({
        type: 'save',
        payload: {
          bookingNo,
        },
      });
      while (status === 'Creating') {
        const { data: statusData = {} } = yield call(queryBookingStatus, { bookingNo });
        const { bookingNo: bookingNoNew } = yield select(state => state.ticketOrderCartMgr);
        if (!bookingNoNew || bookingNo !== bookingNoNew) {
          return;
        }
        const { resultCode: statusResultCode, result: newResult = {} } = statusData;
        if (statusResultCode === '0') {
          const { transStatus } = newResult;
          status = transStatus;
          statusResult = newResult;
        } else {
          status = 'Failed';
        }
        if (status === 'Creating') {
          // if status is still Creating, suspend 5 second.
          yield call(
            () =>
              new Promise(resolve => {
                setTimeout(() => resolve(), 5000);
              })
          );
        }
      }
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: false,
        },
      });
      // status: WaitingForPaying
      if (status === 'WaitingForPaying' || status === 'PendingApproval' || status === 'Paying') {
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
            },
          },
        });
        message.success('Checked out successfully.');
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
            resultMsg: failedReason,
          },
        });
        Modal.error({
          title: 'Failed to check out.',
          content: failedReason,
        });
      } else {
        message.error('Check out error!');
      }
    },

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
      } else throw resultMsg;
    },

    *settingPackAgeTicketOrderData({ payload }, { put }) {
      const { orderData } = payload;
      console.log(orderData);
      if (orderData.orderType === 'offerBundle') {
        yield put({
          type: 'settingBundleTicketOrderData',
          payload,
        });
      } else {
        yield put({
          type: 'settingGeneralTicketOrderData',
          payload,
        });
      }
    },

    *settingBundleTicketOrderData({ payload }, { put, take, select }) {
      const { orderIndex, offerIndex, orderData } = payload;
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
        const { generalTicketOrderData = [] } = yield select(state => state.ticketOrderCartMgr);
        const oldOrderData = generalTicketOrderData[orderIndex].orderOfferList[offerIndex];
        for (const orderInfo of oldOrderData.orderInfo) {
          const removeShoppingFn = {
            callbackFnCode: 1,
            setFnCode(callbackCode) {
              this.callbackFnCode = callbackCode;
            },
          };
          yield put({
            type: 'removeShoppingCart',
            payload: {
              offerInstances: [
                {
                  offerNo: orderInfo.offerInfo.offerNo,
                  offerInstanceId: orderInfo.offerInstanceId,
                },
              ],
              callbackFn: removeShoppingFn,
            },
          });
          yield take('removeShoppingCart/@@end');
          if (removeShoppingFn.callbackFnCode !== 0 && removeShoppingFn.callbackFnCode !== '0') {
            return;
          }
        }
      }

      let batchPullResult = 'done';
      const orderItemId = createOrderItemId(newOrderItem);
      for (const orderInfo of newOrderItem.orderInfo) {
        const callbackFn = {
          callbackFnCode: 1,
          setFnCode(callbackCode) {
            this.callbackFnCode = callbackCode;
          },
        };
        yield put({
          type: 'addToShoppingCart',
          payload: {
            orderType: 'offerBundle',
            offerNo: orderInfo.offerInfo.offerNo,
            themeParkCode,
            themeParkName,
            orderData: demolitionBundleOrder(orderItemId, newOrderItem, orderInfo),
            callbackFn,
          },
        });
        yield take('addToShoppingCart/@@end');

        if (callbackFn.callbackFnCode !== '0') {
          batchPullResult = 'fail';
          return;
        }
      }

      if (batchPullResult === 'done') {
        message.success('Order successfully.');
      }
    },

    *settingGeneralTicketOrderData({ payload }, { put, take, select }) {
      const { orderIndex, offerIndex, orderData } = payload;
      const { themeParkCode, themeParkName } = orderData;
      const newOrderInfo = orderData.orderInfo.map(orderInfo => {
        return {
          orderCheck: true,
          ...orderInfo,
        };
      });
      const packageId = createOrderItemId();
      const newOrderItem = Object.assign(
        {},
        {
          packageId,
          orderAll: true,
          indeterminate: false,
          ...orderData,
          orderInfo: newOrderInfo,
        }
      );
      if (!isNvl(orderIndex) && orderIndex > -1) {
        const { generalTicketOrderData = [] } = yield select(state => state.ticketOrderCartMgr);
        const oldOrderData = generalTicketOrderData[orderIndex].orderOfferList[offerIndex];
        const removeShoppingFn = {
          callbackFnCode: 1,
          setFnCode(callbackCode) {
            this.callbackFnCode = callbackCode;
          },
        };
        yield put({
          type: 'removeShoppingCart',
          payload: {
            offerInstances: [
              {
                offerNo: newOrderItem.offerInfo.offerNo,
                offerInstanceId: oldOrderData.offerInstanceId,
              },
            ],
            callbackFn: removeShoppingFn,
          },
        });
        yield take('removeShoppingCart/@@end');
        if (removeShoppingFn.callbackFnCode !== 0 && removeShoppingFn.callbackFnCode !== '0') {
          return;
        }
      }

      const callbackFn = {
        callbackFnCode: 1,
        setFnCode(callbackCode) {
          this.callbackFnCode = callbackCode;
        },
      };
      yield put({
        type: 'addToShoppingCart',
        payload: {
          orderType: 'offer',
          offerNo: newOrderItem.offerInfo.offerNo,
          themeParkCode,
          themeParkName,
          orderData: newOrderItem,
          callbackFn,
        },
      });
      yield take('addToShoppingCart/@@end');

      if (callbackFn.callbackFnCode === '0') {
        message.success('Order successfully.');
      }
    },

    *settingOnceAPirateOrderData({ payload }, { put, select, take }) {
      const { orderIndex, orderData, settingOnceAPirateOrderDataCallbackFn } = payload;

      const { onceAPirateOrderData = [] } = yield select(state => state.ticketOrderCartMgr);

      // delete old data
      if (!isNvl(orderIndex) && orderIndex > -1) {
        const deleteOrderItem = onceAPirateOrderData[orderIndex];
        const removeOfferInstanceList = [];
        for (
          let orderOfferIndex = 0;
          orderOfferIndex < deleteOrderItem.orderOfferList.length;
          orderOfferIndex += 1
        ) {
          const offerDetail = deleteOrderItem.orderOfferList[orderOfferIndex];
          removeOfferInstanceList.push({
            offerNo: offerDetail.offerInfo.offerNo,
            offerInstanceId: offerDetail.offerInstanceId,
          });
        }
        const removeShoppingFn = {
          callbackFnCode: 1,
          setFnCode(callbackCode) {
            this.callbackFnCode = callbackCode;
          },
        };
        yield put({
          type: 'removeShoppingCart',
          payload: {
            offerInstances: removeOfferInstanceList,
            callbackFn: removeShoppingFn,
          },
        });
        yield take('removeShoppingCart/@@end');
        if (removeShoppingFn.callbackFnCode !== 0 && removeShoppingFn.callbackFnCode !== '0') {
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
      const addOrderItem = Object.assign(
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
      for (
        let orderOfferIndex = 0;
        orderOfferIndex < addOrderItem.orderOfferList.length;
        orderOfferIndex += 1
      ) {
        const offerDetail = addOrderItem.orderOfferList[orderOfferIndex];
        offerDetail.orderInfo = Object.assign(
          {},
          {
            ...offerDetail.orderInfo,
          }
        );
        const callbackFn = {
          callbackFnCode: 1,
          setFnCode(callbackCode) {
            this.callbackFnCode = callbackCode;
          },
        };
        yield put({
          type: 'addToShoppingCart',
          payload: {
            orderType: 'offerPackage',
            offerNo: offerDetail.offerInfo.offerNo,
            themeParkCode: 'OAP',
            themeParkName: 'Once A Pirate',
            orderData: demolitionOrder(orderItemId, addOrderItem, offerDetail),
            callbackFn,
          },
        });
        yield take('addToShoppingCart/@@end');
        if (callbackFn.callbackFnCode !== 0 && callbackFn.callbackFnCode !== '0') {
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
    countTicketOrderAmount(state) {
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
      const { generalTicketOrderData = [], onceAPirateOrderData = [] } = state;
      const newPackageOrderData = [];
      const newGeneralTicketOrderData = [];
      const newOnceAPirateOrderData = [];

      generalTicketOrderData.forEach(orderData => {
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
                orderCheck: orderOffer.orderDisabled ? false : selectAllOrder,
              }
            );
          });
          return Object.assign(
            {},
            {
              ...orderOffer,
              orderInfo: newOrderInfo,
              orderAll: orderOffer.orderDisabled ? false : selectAllOrder,
              indeterminate: selectAllIndeterminate,
            }
          );
        });
        newGeneralTicketOrderData.push(newOrderData);
      });

      onceAPirateOrderData.forEach(orderInfo => {
        if (!orderInfo.orderDisabled) {
          const newOrderInfo = Object.assign(
            {},
            {
              ...orderInfo,
              orderAll: selectAllOrder,
              indeterminate: selectAllIndeterminate,
            }
          );
          newOrderInfo.orderOfferList = orderInfo.orderOfferList.map(offerInfo => {
            return Object.assign(
              {},
              {
                ...offerInfo,
                orderCheck: selectAllOrder,
              }
            );
          });
          newOnceAPirateOrderData.push(newOrderInfo);
        } else {
          newOnceAPirateOrderData.push({ ...orderInfo });
        }
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
        bookingNo: undefined,
        deliveryMode: undefined,
        collectionDate: null,
        bocaFeePax: 0.0,
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
        showBundleToCart: false,
        bundleOfferDetail: null,
        orderIndex: null,
        offerIndex: null,
        functionActive: true,
      };
    },
  },

  subscriptions: {},
};
