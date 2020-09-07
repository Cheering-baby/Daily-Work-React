import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import router from 'umi/router';
import {
  queryDisplay,
  queryFilter,
  queryDict,
  addReports,
  editReports,
  queryScheduleTaskDetail,
  queryPluAttribute,
  queryAgentDict,
  queryAgeGroup,
  queryUserRolesByCondition,
  querySalePersons,
} from '../services/reportCenter';
import { REPORT_TYPE_MAP2 } from '../GeneratedReports/ScheduleTask/consts/authority';
import * as service from '../GeneratedReports/DailyAndMonthlyReport/services/dailyAndMonthlyReport';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

export default {
  namespace: 'reportCenter',
  state: {
    fieldList: [],
    filterList: [],
    executeOnceTime: null,
    startDate: '',
    endDate: '',
    reportFrequency: '',
    reportName: '',
    selectList: [],
    selectedField: [],
    filterItem: {},
    reportTypeList: [],
    reportName2: '',
    executeOnce: null,
    detailList: [],
    page: '',
    themeValue: '',
    selectDate: '',
    cronTypeValue: '',
    openThemePark: false,
    openChannel: false,
    openCustomerGroup: false,
    openUserRoleForCreated: false,
    openAccountManager: false,
    checkedAllthemePark: [],
    themeParkValue: [],
    checkThemeParkValue: [],
    checkChannelValue: [],
    checkCustomerGroupValue: [],
    checkAccountManager: [],
    checkUserRoleValue: [],
    checkChannelValueInit: false,
    selectPark: [],
    categoryTypeList: [],
    checkAgeGroup: [],
    openAgeGroup: false,
  },
  effects: {
    *fetchDisplay({ payload }, { call, put }) {
      const { reportType } = payload;
      const res = yield call(queryDisplay, reportType);
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          result.map((v, index) => {
            Object.assign(v, {
              i: index,
              key: v.columnName,
              no: index + 1,
              isChecked: '0',
            });
            return v;
          });
        }

        yield put({
          type: 'save',
          payload: {
            fieldList: result,
          },
        });
      } else throw resultMsg;
    },
    *fetchReportFilterList({ payload = {} }, { call, put, select }) {
      const { reportType } = payload;
      const response = yield call(queryFilter, reportType);
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      const {
        currentUser: { userType },
      } = yield select(({ global }) => global);

      if (+resultCode !== 0) {
        message.warn(`Failed to queryReportFilterList.`);
        return;
      }
      if (+resultCode === 0) {
        const mergeArr = [];
        const mulArr = [];
        let list = result;
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          if (element.filterKey === 'themeParkCode') {
            // const params = {attributeType: "Attraction",attributeCode:"THEME_PARK"}
            const res = yield call(queryPluAttribute, { status: 'Active' });
            const {
              data: {
                resultCode: themeParkCode,
                resultMsg: themeParkResMsg,
                result: themeParkEleRes,
              },
            } = res;
            const { offerBookingCategoryList } = themeParkEleRes;
            if (+themeParkCode === 0) {
              if (offerBookingCategoryList && offerBookingCategoryList.length > 0) {
                offerBookingCategoryList.sort((a, b) => {
                  if (a && b && a.bookingCategoryName && b.bookingCategoryName) {
                    return a.bookingCategoryName.localeCompare(b.bookingCategoryName);
                  }
                  return 0;
                });
                offerBookingCategoryList.forEach(v => {
                  v.key = `report_${v.id}`;
                  v.isSelected = false;
                });
                list.map(v => {
                  Object.assign(v, {
                    themeParkOptions:
                      v.filterKey === 'themeParkCode' ? offerBookingCategoryList : null,
                    options: null,
                  });
                  return v;
                });
              }
            } else {
              throw themeParkResMsg;
            }
          }
          if (element.dictType && element.dictSubType && element.filterType === 'MULTIPLE_SELECT') {
            const params = { dictType: element.dictType, dictSubType: element.dictSubType };
            const res = yield call(queryDict, params);
            const {
              data: { resultCode: code, resultMsg: resMsg, result: eleRes },
            } = res;
            if (+code === 0) {
              eleRes.forEach(k => {
                list.forEach(v => {
                  if (v.dictSubType === k.dictSubType) {
                    Object.assign(v, {
                      key: v.filterKey,
                      // options: v.filterType === 'SELECT' ? eleRes : null,
                      mulOptions: v.filterType === 'MULTIPLE_SELECT' ? eleRes : null,
                    });
                    mulArr.push([index, k]);
                  }
                });
              });
            } else {
              throw resMsg;
            }
          }
          if (
            element.dictDbName === 'AGENT' &&
            element.dictType &&
            element.dictSubType &&
            element.filterType === 'SELECT'
          ) {
            const params = { dictType: element.dictType, dictSubType: element.dictSubType };
            const res = yield call(queryAgentDict, params);
            const {
              data: { resultCode: code, resultMsg: resMsg, result: eleRes },
            } = res;
            if (+code === 0) {
              eleRes.forEach(k => {
                list.forEach(v => {
                  if (v.dictSubType === k.dictSubType) {
                    Object.assign(v, {
                      key: v.filterKey,
                      options: v.filterType === 'SELECT' ? eleRes : null,
                      // mulOptions: v.filterType === 'MULTIPLE_SELECT' ? eleRes : null,
                    });
                    mergeArr.push([index, k]);
                  }
                });
              });
              yield put({
                type: 'save',
                payload: {
                  categoryTypeList: eleRes,
                },
              });
            } else {
              throw resMsg;
            }
          }
          if (element.filterKey === 'customerGroup') {
            const params = { dictType: element.dictType };
            const res = yield call(queryAgentDict, params);
            const {
              data: { resultCode: code, resultMsg: resMsg, result: eleRes },
            } = res;
            if (+code === 0) {
              list.forEach(v => {
                Object.assign(v, {
                  key: v.filterKey,
                  customerGroupOptions: v.filterKey === 'customerGroup' ? eleRes : null,
                });
              });
            } else {
              throw resMsg;
            }
          }
          if (element.filterKey === 'taMarket') {
            const params = { dictType: element.dictType, dictSubType: element.dictSubType };
            const res = yield call(queryAgentDict, params);
            const {
              data: { resultCode: code, resultMsg: resMsg, result: eleRes },
            } = res;
            if (+code === 0) {
              list.forEach(v => {
                Object.assign(v, {
                  key: v.filterKey,
                  taMarketOptions: v.filterKey === 'taMarket' ? eleRes : null,
                });
              });
            } else {
              throw resMsg;
            }
          }
          if (element.filterKey === 'ageGroup') {
            const params = { type: 'ageGroup' };
            const res = yield call(queryAgeGroup, params);
            const {
              data: { resultCode: code, resultMsg: resMsg, result: eleRes },
            } = res;
            if (+code === 0) {
              const { dictionaries } = eleRes;
              list.forEach(v => {
                Object.assign(v, {
                  key: v.filterKey,
                  ageGroupOptions: v.filterKey === 'ageGroup' ? dictionaries : null,
                });
              });
            } else {
              throw resMsg;
            }
          }
          if (element.filterKey === 'userRoleForCreated') {
            let params = {};
            if (userType === '01') {
              params = { roleType: '02' };
            }
            const res = yield call(queryUserRolesByCondition, params);
            const {
              data: { resultCode: code, resultMsg: resMsg, resultData: eleRes },
            } = res;
            const { userRoles } = eleRes;
            if (+code === 0) {
              list.forEach(v => {
                Object.assign(v, {
                  key: v.filterKey,
                  userRoleOptions: v.filterKey === 'userRoleForCreated' ? userRoles : null,
                });
              });
            } else {
              throw resMsg;
            }
          }
          if (element.filterKey === 'accountManager') {
            const res = yield call(querySalePersons);
            const {
              data: { resultCode: code, resultMsg: resMsg, resultData: eleRes },
            } = res;
            const { userProfiles } = eleRes;
            if (+code === 0) {
              list.forEach(v => {
                Object.assign(v, {
                  key: v.filterKey,
                  accountManagerOptions: v.filterKey === 'accountManager' ? userProfiles : null,
                });
              });
            } else {
              throw resMsg;
            }
          }
          if (
            element.dictType &&
            element.dictSubType &&
            element.filterType === 'SELECT' &&
            element.dictDbName !== 'AGENT'
          ) {
            const params = { dictType: element.dictType, dictSubType: element.dictSubType };
            const res = yield call(queryDict, params);
            const {
              data: { resultCode: code, resultMsg: resMsg, result: eleRes },
            } = res;
            if (+code === 0) {
              eleRes.forEach(k => {
                list.forEach(v => {
                  if (v.dictSubType === k.dictSubType) {
                    Object.assign(v, {
                      key: v.filterKey,
                      options: v.filterType === 'SELECT' ? eleRes : null,
                    });
                    mergeArr.push([index, k]);
                  }
                });
              });
            } else {
              throw resMsg;
            }
          }
        }
        list = list.map((item, idx) => {
          const tmp = mergeArr.filter(([index, _]) => index === idx);
          const arr = [];
          tmp.forEach(i => {
            arr.push(i[1]);
          });
          return tmp ? { ...item, options: arr } : item;
        });
        list = list.map((item, idx) => {
          const tmp = mulArr.filter(([index, _]) => index === idx);
          const arr2 = [];
          tmp.forEach(i => {
            arr2.push(i[1]);
          });
          return tmp ? { ...item, mulOptions: arr2 } : item;
        });
        yield put({ type: 'save', payload: { filterList: list } });
      } else throw resultMsg;
    },
    *modifySorting({ payload }, { put, select }) {
      const { fieldList } = yield select(state => state.reportCenter);
      const { type, orderNumber } = payload;
      // move the target
      let moveStep = 0;
      if (type === 'UP') {
        moveStep = -1;
      } else if (type === 'DOWN') {
        moveStep = 1;
      }
      fieldList.map(e => {
        const { no } = e;
        if (no === orderNumber + moveStep) {
          Object.assign(e, { no: orderNumber });
        } else if (no === orderNumber) {
          Object.assign(e, { no: orderNumber + moveStep });
        }
        return e;
      });

      yield put({
        type: 'saveModify',
        payload: {
          fieldList,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const {
        sortList,
        reportName,
        reportType,
        cronType,
        filterList,
        createBy,
        displayColumnList,
        executeOnceTime,
        sourcePage,
        scheduleDesc,
        monthlyExecuteDay,
      } = payload;
      let reqParams = [];
      if (
        reportType === 'ARAccountBalanceSummaryReport' ||
        reportType === 'E-WalletBalanceSummaryReport'
      ) {
        reqParams = {
          sortList,
          reportName,
          reportType,
          cronType,
          filterList,
          createBy,
          displayColumnList,
          executeOnceTime,
          scheduleDesc,
          monthlyExecuteDay,
        };
      } else {
        reqParams = {
          reportName,
          reportType,
          cronType,
          filterList,
          createBy,
          displayColumnList,
          executeOnceTime,
          scheduleDesc,
          monthlyExecuteDay,
        };
      }

      const {
        data: { resultCode, resultMsg },
      } = yield call(addReports, reqParams);
      if (resultCode === '0' || resultCode === 0) {
        if (sourcePage === 'reports') {
          router.push({
            pathname: '/ReportsCenter/Reports',
          });
        } else {
          router.push({
            pathname: '/ReportsCenter/GeneratedReports/ScheduleTask',
          });
        }
        message.success(formatMessage({ id: 'ADD_SUCCESS' }));
        // fresh list data
        yield put({
          type: 'scheduleTask/fetchScheduleTaskLogList',
        });
      } else {
        message.error(resultMsg);
      }
    },
    *edit({ payload }, { call, put }) {
      const {
        sortList,
        reportName,
        reportType,
        cronType,
        filterList,
        updateBy,
        displayColumnList,
        executeOnceTime,
        jobCode,
        scheduleDesc,
        monthlyExecuteDay,
      } = payload;

      let reqParams = [];
      if (
        reportType === 'ARAccountBalanceSummaryReport' ||
        reportType === 'E-WalletBalanceSummaryReport'
      ) {
        reqParams = {
          jobCode,
          reportName,
          reportType,
          cronType,
          filterList,
          updateBy,
          displayColumnList,
          executeOnceTime,
          scheduleDesc,
          monthlyExecuteDay,
          sortList: [
            { key: 'customerName', value: 'ASC' },
            { key: 'transactionDate', value: 'DESC' },
          ],
        };
      } else {
        reqParams = {
          jobCode,
          reportName,
          reportType,
          cronType,
          filterList,
          updateBy,
          displayColumnList,
          executeOnceTime,
          scheduleDesc,
          monthlyExecuteDay,
        };
      }
      // const reqParams = {
      //   jobCode,
      //   reportName,
      //   reportType,
      //   cronType,
      //   filterList,
      //   updateBy,
      //   displayColumnList,
      //   executeOnceTime,
      //   scheduleDesc,
      //   monthlyExecuteDay,
      // };
      const {
        data: { resultCode, resultMsg },
      } = yield call(editReports, reqParams);
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'UPDATE_SUCCESS' }));
        router.push({
          pathname: '/ReportsCenter/GeneratedReports/ScheduleTask',
        });
        // fresh list data
        yield put({
          type: 'scheduleTask/fetchScheduleTaskLogList',
        });
      } else {
        message.error(resultMsg);
      }
    },
    *queryReportType(_, { call, put, select }) {
      const response = yield call(service.queryDict, { dictType: 12 });
      if (!response || !response.data || response.data.resultCode !== '0') return false;
      const {
        data: { result: dictInfoList },
      } = response;
      const { userAuthorities } = yield select(({ user }) => user);
      yield put({ type: 'saveDictInfoList', payload: { dictInfoList, userAuthorities } });
      return true;
    },

    *fetchReportDetail({ payload: { jobCode } = {} }, { call, put }) {
      const response = yield call(queryScheduleTaskDetail, { jobCode });
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: { result: taskDetail },
      } = response;
      const { displayColumnList } = taskDetail;
      if (displayColumnList && displayColumnList.length > 0) {
        displayColumnList.map((v, index) => {
          Object.assign(v, {
            no: index + 1,
          });
          return v;
        });
      }
      yield put({
        type: 'save',
        payload: {
          fieldList: displayColumnList,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveDictInfoList(state, { payload }) {
      const { dictInfoList = [] } = payload;
      const dictInfoMap = new Map();
      dictInfoList.forEach(item => {
        const arr = dictInfoMap.get(item.dictSubTypeName);
        if (!arr) {
          dictInfoMap.set(item.dictSubTypeName, [
            {
              value: item.dictName,
              text: item.dictDesc,
            },
          ]);
        } else {
          arr.push({
            value: item.dictName,
            text: item.dictDesc,
          });
        }
      });

      const reportTypeList = (dictInfoMap.get('report type') || []).filter(({ text }) =>
        hasAllPrivilege([REPORT_TYPE_MAP2[text]])
      );

      return {
        ...state,
        reportTypeList,
      };
    },
    clear(state) {
      return {
        ...state,
        fieldList: [],
        filterList: [],
        addPLUModal: false,
        executeOnceTime: null,
        startDate: '',
        endDate: '',
        reportFrequency: '',
        reportName: '',
        selectList: [],
        selectedField: [],
        reportTypeList: [],
        reportName2: '',
        executeOnce: null,
        detailList: [],
        page: '',
        selectDate: '',
        cronTypeValue: '',
        openThemePark: false,
        openChannel: false,
        openCustomerGroup: false,
        openUserRoleForCreated: false,
        penAccountManager: false,
        checkedAllthemePark: [],
        themeParkValue: [],
        checkThemeParkValue: [],
        checkChannelValue: [],
        checkUserRoleValue: [],
        checkCustomerGroupValue: [],
        checkAccountManager: [],
        checkChannelValueInit: false,
        selectPark: [],
        categoryTypeList: [],
        checkAgeGroup: [],
        openAgeGroup: false,
      };
    },
    saveFilterList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        filterList: list,
      };
    },
    saveModify(state, { payload }) {
      const { fieldList } = payload;
      // make sure the room type what is first or final
      fieldList.map(e => {
        const { no, columnName } = e;
        Object.assign(e, {
          key: columnName,
          firstObject: no === 1,
          finalObject: no === fieldList.length,
        });
        return e;
      });
      // sort the room type
      fieldList.sort((a, b) => {
        const aSeqOrder = a.no;
        const bSeqOrder = b.no;
        return aSeqOrder - bSeqOrder;
      });
      return {
        ...state,
        ...payload,
        fieldList,
      };
    },
    saveSelectList(state, { payload }) {
      const { selectedRowKeys, fieldList } = payload;
      for (let i = 0; i < fieldList.length; i += 1) {
        let flag = true;
        for (let j = 0; j < selectedRowKeys.length; j += 1) {
          if (fieldList[i].columnName === selectedRowKeys[j]) {
            fieldList[i].isChecked = '1';
            flag = false;
          }
        }
        if (flag) {
          fieldList[i].isChecked = '0';
        }
      }
      return {
        ...state,
        fieldList,
      };
    },
    saveSelectThmepark(state, { payload }) {
      const { themeParkChange, themeParkOptions } = payload;
      for (let i = 0; i < themeParkOptions.length; i += 1) {
        for (let j = 0; j < themeParkChange.length; j += 1) {
          if (themeParkChange[j] === themeParkOptions[i].bookingCategoryCode) {
            themeParkOptions[i].isSelected = true;
          }
        }
      }
      return {
        ...state,
        themeParkOptions,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ReportsCenter/Reports') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
