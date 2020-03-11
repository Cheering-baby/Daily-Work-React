import { message } from 'antd';
import { createBooking, queryBookingStatus } from '@/pages/TicketManagement/services/bookingAndPay';

export default {
  namespace: 'ticketBookingAndPayMgr',

  state: {
    bookingOrderData: [],
    packageOrderData: [],
    generalTicketOrderData: [],
    onceAPirateOrderData: [],
  },

  effects: {
    *orderCheckOut({ payload }, { call, put }) {},

    *orderBooking({ payload }, { call, put }) {
      const patronInfo = {
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        nationality: '',
        phoneNo: '',
      };

      const param = {
        customerId: '',
        commonOffers: [],
        patronInfo,
        totalPrice: 0,
        identificationNo: null,
        identificationType: null,
        voucherNos: [],
      };

      const manageParam = list => {
        for (let i = 0; i < list.length; i += 1) {
          const { offerList } = list[i];
          for (let j = 0; j < offerList.length; j += 1) {
            const {
              offerNo,
              selectedRuleId,
              // hotel param
              arrivalTime,
              departureTime,
              checkInDate,
              checkOutDate,
              numOfAdult,
              numOfChild,
              withBreakfast,
              special = [],
              // attraction
              visitDate,
              products = [],
            } = offerList[j];
            const submitCommonOffer = {
              offerNo,
              priceRuleId: selectedRuleId,
              offerCount: 1,
              hotelProducts: [],
              attractionProducts: [],
              totalPrice: '',
              voucherNos: [],
              patronInfo,
            };
            for (let k = 0; k < products.length; k += 1) {
              const { productNo, productType, quantity } = products[k];
              if (productType === 'Hotel') {
                const submitHotelProduct = {
                  productNo,
                  numOfRoom: quantity,
                  numOfAdult,
                  numOfChild,
                  checkInDate: moment(checkInDate).format('YYYY-MM-DD'),
                  checkOutDate: moment(checkOutDate).format('YYYY-MM-DD'),
                  arrivalTime,
                  departTime: departureTime,
                  withBreakfast,
                  itemNos: special.map(({ serviceCode }) => serviceCode),
                  patronInfo,
                };
                submitCommonOffer.hotelProducts.push(submitHotelProduct);
              }
              if (productType === 'Attraction') {
                const submitAttractionProduct = {
                  productNo,
                  numOfAttraction: quantity,
                  visitDate: moment(visitDate).format('YYYY-MM-DD'),
                  patronInfo,
                };
                submitCommonOffer.attractionProducts.push(submitAttractionProduct);
              }
            }
            param.commonOffers.push(submitCommonOffer);
          }
        }
      };

      const { data } = yield call(createBooking, param);
      if (data) {
        const { resultCode, resultMsg, result = {} } = data;
        if (resultCode !== '0') {
          yield put({
            type: 'save',
            payload: { payLoading: false },
          });
          return { type: 'CreateErrors', resultMsg };
        }
        // query status
        const { bookingNo } = result;
        let status = 'Creating';
        let statusResult = {};
        while (status === 'Creating') {
          try {
            const { data: statusData = {} } = yield call(queryBookingStatus, { bookingNo });
            const { resultCode: statusResultCode, result: newResult = {} } = statusData;
            if (statusResultCode === '0') {
              const { transStatus } = newResult;
              status = transStatus;
              statusResult = newResult;
            }
          } catch (e) {}
        }
        // status: WaitingForPaying
        if (status === 'WaitingForPaying') {
        }
        // status: Failed
        if (status === 'Failed') {
          const { failedReason } = statusResult;
          yield put({
            type: 'save',
            payload: { payLoading: false },
          });
          return { type: 'BookingFailed', resultMsg: failedReason };
        }
      } else {
        yield put({
          type: 'save',
          payload: { payLoading: false },
        });
        return { type: 'Error' };
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
