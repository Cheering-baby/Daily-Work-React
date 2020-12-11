import UAAService from '@/uaa-npm';

export const LOGOUT_TIME = 5000;

// resolve: the data of local storage can not be new in IE.
export const refreshFc = () => {
  localStorage.setItem('refresh', null);
};

(win => {
  win.onbeforeunload = () => {
    localStorage.setItem('state', 'onbeforeunload');
    localStorage.setItem('unloadTime', `${new Date().getTime()}`);
    refreshFc();
  };
  win.onunload = () => {
    localStorage.setItem('state', 'onunload');
    localStorage.setItem('unloadTime', `${new Date().getTime()}`);
    refreshFc();
  };
  win.onload = () => {
    localStorage.setItem('state', 'onload');
    refreshFc();
  };

  let logoutTimeout;
  win.addEventListener('storage', () => {
    const state = localStorage.getItem('state');
    if (state === 'onunload') {
      if (logoutTimeout) {
        clearTimeout(logoutTimeout);
        logoutTimeout = null;
      }
      logoutTimeout = setTimeout(() => {
        UAAService.logout();
      }, LOGOUT_TIME);
    }
    if (state === 'onload' && !!logoutTimeout) {
      clearTimeout(logoutTimeout);
      logoutTimeout = null;
    }
  });
})(window);
