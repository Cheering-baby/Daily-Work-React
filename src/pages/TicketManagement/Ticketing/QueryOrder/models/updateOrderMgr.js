export default {
  namespace: 'updateOrderMgr',
  state: {
    updateVisible: false,
    updateType: 'Revalidation',
    galaxyOrderNo: null,
    refundSelected: 'Complete',
    rejectReason: null,
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
        updateVisible: false,
        updateType: 'Revalidation',
        galaxyOrderNo: null,
        refundSelected: 'Complete',
        rejectReason: null,
      };
    },
  },

  subscriptions: {},
};
