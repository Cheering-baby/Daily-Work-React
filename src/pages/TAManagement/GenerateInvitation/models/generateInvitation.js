import { message } from 'antd';
import * as service from '../services/generateInvitation';
import { queryDictionary } from '../../services/taCommon';

export default {
  namespace: 'generateInvitation',
  state: {
    taId: null,
    companyName: null,
    searchForm: {
      email: null,
      invitationStartDate: null,
      invitationEndDate: null,
      status: null,
    },
    searchList: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    invitationList: [],
    qryInvitationTableLoading: false,
    statusList: [],
    emailList: [],
    invitationVisible: false,
    sendInvitationLoading: false,
    viewId: 'invitationView',
  },
  effects: {
    *fetchQryInvitationRecordList({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.generateInvitation);
      const reqParam = {
        pageInfo: {
          ...searchList,
        },
        ...payload,
      };
      yield put({ type: 'save', payload: { qryInvitationTableLoading: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryInvitationRecordList, { ...reqParam });
      yield put({ type: 'save', payload: { qryInvitationTableLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        const { pageInfo, invitationList } = result;
        yield put({
          type: 'save',
          payload: {
            invitationList: invitationList || [],
            searchList: {
              total: Number(pageInfo.totalSize || '0'),
              currentPage: Number(pageInfo.currentPage || '1'),
              pageSize: Number(pageInfo.pageSize || '10'),
            },
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchQueryStatusList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1007',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { statusList: result || [] } });
      } else message.warn(resultMsg, 10);
    },
    *fetchSendInvitation(_, { call, put, select }) {
      const { taId, companyName, searchForm, searchList, emailList } = yield select(
        state => state.generateInvitation
      );
      const reqParam = {
        taId,
        companyName,
        emailList,
      };
      yield put({ type: 'save', payload: { sendInvitationLoading: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.sendInvitation, { ...reqParam });
      yield put({ type: 'save', payload: { sendInvitationLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            emailList: [],
            invitationVisible: false,
          },
        });
        yield put({
          type: 'fetchQryInvitationRecordList',
          payload: {
            taId,
            email: searchForm.email || null,
            invitationStartDate: searchForm.invitationStartDate || null,
            invitationEndDate: searchForm.invitationEndDate || null,
            status: searchForm.status || null,
            currentPage: searchList.currentPage || '1',
            pageSize: searchList.pageSize || '10',
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *doSaveData({ payload }, { put }) {
      yield put({ type: 'save', payload });
    },
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clean(state, { payload }) {
      return {
        ...state,
        ...{
          taId: null,
          companyName: null,
          searchForm: {
            email: null,
            invitationStartDate: null,
            invitationEndDate: null,
            status: null,
          },
          searchList: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
          },
          invitationList: [],
          qryInvitationTableLoading: false,
          statusList: [],
          emailList: [],
          invitationVisible: false,
          sendInvitationLoading: false,
          viewId: 'invitationView',
        },
        ...payload,
      };
    },
  },
};
