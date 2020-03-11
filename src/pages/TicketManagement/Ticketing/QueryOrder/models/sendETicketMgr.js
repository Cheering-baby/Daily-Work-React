export default {
  namespace: 'sendETicketMgr',
  state: {
    sendETicketVisible: false,
    email: null,
  },

  effects: {},

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    resetData(state) {
      return {
        ...state,
        sendETicketVisible: false,
        email: null,
      };
    },
  },

  subscriptions: {},
};
