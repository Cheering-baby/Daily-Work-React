module.exports = {
  appName: 'PAMS',
  appCode: 'PAMS',
  uaaPath:
    process.env.NODE_ENV === 'development'
      ? 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com'
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
