module.exports = {
  appName: 'PAMS',
  appCode: 'PAMS',
  uaaPath:
    process.env.NODE_ENV === 'development'
      ? 'http://10.25.159.217:18091'
      : window.location.origin,
  publicPath: '',
  backendContextPath: '/pams',
  refreshTokenPath: '/refreshToken',
  logoutPath: '/v1/logout',
  loginPath: '/v1/login',
  loginPage: '',
  // 是否支持可跨域设置cookie
  withCredentials: true,
  doSessionTimeout() {
    window.g_app._store.dispatch({
      type: 'login/logout',
      payload: {
        noCallLogout: true,
      },
    });
  },
};
