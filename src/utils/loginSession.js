/**
 * 登录信息/登出 会话管理
 * */
export default {
  getToken() {
    return localStorage.getItem('X-CSRF-TOKEN');
  },

  getUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || {};
  },

  getLanguage() {
    return localStorage.getItem('umi_locale');
  },

  getData(key) {
    const item = localStorage.getItem(key);
    return item && item !== 'undefined' ? JSON.parse(localStorage.getItem(key)) : item;
  },

  saveData(key, data) {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  },

  signOut() {
    localStorage.removeItem('X-CSRF-TOKEN');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMenu');
  },
};
