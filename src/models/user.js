export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    menu: [],
    rawMenu: [],
    menuLoaded: false,
  },

  effects: {},

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
