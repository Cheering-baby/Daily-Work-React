import { message } from 'antd';
import router from 'umi/router';
import { queryCountry } from '@/pages/TicketManagement/services/ticketCommon';

export default {
  namespace: 'ticketOrderCartMgr',

  state: {
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
  },

  effects: {
    *orderCheckOut({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: false,
        },
      });

      const {
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = yield select(state => state.ticketOrderCartMgr);

      const orderArray = [packageOrderData, generalTicketOrderData, onceAPirateOrderData];
      const newOrderArray = [
        [...packageOrderData],
        [...generalTicketOrderData],
        [...onceAPirateOrderData],
      ];
      orderArray.forEach((orderList, listIndex) => {
        orderList.forEach((orderData, orderIndex) => {
          const newOrderOfferList = [];
          orderData.orderOfferList.forEach(orderOffer => {
            if (listIndex < 2 && orderOffer.orderInfo) {
              let orderCheckExist = false;
              const orderInfo = [];
              orderOffer.orderInfo.forEach(info => {
                if (info.orderCheck) {
                  orderCheckExist = true;
                  orderInfo.push(
                    Object.assign(
                      {},
                      {
                        ...info,
                      }
                    )
                  );
                }
              });
              if (orderCheckExist) {
                newOrderOfferList.push(
                  Object.assign(
                    {},
                    {
                      ...orderOffer,
                      orderInfo,
                    }
                  )
                );
              }
            } else if (listIndex === 2) {
              if (orderOffer.orderCheck) {
                newOrderOfferList.push(
                  Object.assign(
                    {},
                    {
                      ...orderOffer,
                    }
                  )
                );
              }
            }
          });
          if (newOrderOfferList.length > 0) {
            newOrderArray[listIndex][orderIndex].orderOfferList = newOrderOfferList;
          } else {
            newOrderArray[listIndex].splice(orderIndex, 1);
          }
        });
      });
      console.log(newOrderArray);
      yield put({
        type: 'save',
        payload: {
          checkOutLoading: false,
        },
      });
      // router.push(`/TicketManagement/Ticketing/OrderCart/OrderPay`);
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

    *settingPackAgeTicketOrderData({ payload }, { call, put, select }) {
      console.log(payload);
      const { orderIndex, orderData } = payload;
      const { packageOrderData = [] } = yield select(state => state.ticketOrderCartMgr);
      const newOrderData = [...packageOrderData];
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
      if (orderIndex !== null && orderIndex > -1) {
        newOrderData[0].orderOfferList[orderIndex] = Object.assign({}, newOrderItem);
      } else if (newOrderData.length === 0) {
        newOrderData.push({
          themeParkCode: 'package',
          themeParkName: 'Attraction Package',
          orderOfferList: [newOrderItem],
        });
      } else {
        newOrderData[0].orderOfferList.push(newOrderItem);
      }
      yield put({
        type: 'save',
        payload: {
          packageOrderData: newOrderData,
        },
      });
      yield put({
        type: 'countTicketOrderAmount',
        payload: {},
      });
      message.success('Order successfully!');
    },

    *settingGeneralTicketOrderData({ payload }, { put, select }) {
      console.log(payload);
      const { orderIndex, orderData } = payload;
      const { generalTicketOrderData = [] } = yield select(state => state.ticketOrderCartMgr);
      const newOrderData = [...generalTicketOrderData];
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
      if (orderIndex !== null && orderIndex > -1) {
        generalTicketOrderData.forEach((orderDataItem, index) => {
          if (themeParkCode === orderDataItem.themeParkCode) {
            newOrderData[index].orderOfferList[orderIndex] = Object.assign({}, newOrderItem);
          }
        });
      } else {
        let isNewOrder = true;
        newOrderData.forEach(orderDataItem => {
          if (themeParkCode === orderDataItem.themeParkCode) {
            orderDataItem.orderOfferList.push(newOrderItem);
            isNewOrder = false;
          }
        });
        if (isNewOrder) {
          newOrderData.push({
            themeParkCode,
            themeParkName,
            orderOfferList: [newOrderItem],
          });
        }
      }
      yield put({
        type: 'save',
        payload: {
          generalTicketOrderData: newOrderData,
        },
      });
      yield put({
        type: 'countTicketOrderAmount',
        payload: {},
      });
      message.success('Order successfully!');
    },

    *settingOnceAPirateOrderData({ payload }, { put, select }) {
      const { onceAPirateOrderData = [] } = yield select(state => state.ticketOrderCartMgr);
      const { orderIndex, orderData } = payload;
      const newOrderData = [...onceAPirateOrderData];
      if (orderIndex && orderIndex > -1) {
        newOrderData[orderIndex] = Object.assign({}, orderData);
      } else {
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
        newOrderData.push(
          Object.assign(
            {},
            {
              orderAll: true,
              indeterminate: false,
              voucherType: orderData.voucherType,
              ...orderData,
              orderOfferList,
            }
          )
        );
      }

      yield put({
        type: 'save',
        payload: {
          onceAPirateOrderData: newOrderData,
        },
      });

      yield put({
        type: 'countTicketOrderAmount',
        payload: {},
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
    countTicketOrderAmount(state, { payload }) {
      const {
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = state;
      let orderCartDataAmount = 0;
      const orderList = [generalTicketOrderData, packageOrderData, onceAPirateOrderData];
      orderList.forEach(orderItem => {
        orderItem.forEach(orderData => {
          orderCartDataAmount += orderData.orderOfferList.length;
        });
      });
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
        newOrderInfo.orderOfferList = orderInfo.orderOfferList.map((offerInfo, offerInfoIndex) => {
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
