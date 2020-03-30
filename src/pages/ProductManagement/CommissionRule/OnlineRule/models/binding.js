export default {
  namespace: 'binding',
  state: {
    value: 'tiered',
    tieredCommissionRuleList: [],
    commission: [[]],
    addBindingModal: false,
    addPLUModal: false,
    tags: [
      {
        id: undefined,
        segments: [],
      },
    ],
    type: '',
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
        addBindingModal: false,
        addPLUModal: false,
        tags: [
          {
            id: undefined,
            segments: [],
          },
        ],
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRuleSetup') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
