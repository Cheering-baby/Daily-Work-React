export default {
  namespace: 'offlineNew',
  state: {
    value: '',
    tieredCommissionRuleList: [],
    commission: [[]],
  },
  effects: {},
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
        value: 'tiered',
        tieredCommissionRuleList: [],
        commission: [[]],
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRuleSetup/New') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
