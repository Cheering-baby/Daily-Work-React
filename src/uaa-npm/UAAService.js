const { stringify } = require('qs');
const { Base64 } = require('js-base64');
const CommonService = require('./CommonService');

class UAAService extends CommonService {
  constructor(instanceConfig) {
    super(instanceConfig);

    this.login = this.login.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.menus = this.menus.bind(this);
    this.privileges = this.privileges.bind(this);
  }

  /**
   * login
   * @param userCode
   * @param password
   * @param appCode
   * @returns {Promise<{redirect: boolean, redirectUrl: string, success: boolean, accessToken: string, userGivenName: string, refreshToken: string, username: string, userSurname: string}>}
   */
  async login(userCode, password, appCode, loginType, agentId) {
    let result = {
      success: false,
      accessToken: '',
      refreshToken: '',
      redirect: false,
      redirectUrl: '',
      username: '',
      userGivenName: '',
      userSurname: '',
    };

    const { success, errorMsg, data } = await this.request('/v1/login', {
      method: 'POST',
      body: stringify({
        username: userCode,
        password: Base64.encode(password),
        appcode: appCode,
        appCode,
        loginType,
        agentId,
      }),
      withCredentials: this.defaults.withCredentials,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    });

    if (success) {
      this.axiosConfig.AT = data.accessToken;
      this.axiosConfig.RT = data.refreshToken;
      result = { ...result, ...data };
    } else throw errorMsg;

    return result;
  }

  /**
   * Determine whether the user has logged in
   * @returns {Promise<void>}
   */
  async postLogin() {
    let result = {};

    const { success, errorMsg, data } = await this.request('/v1/postLogin', {
      withCredentials: this.defaults.withCredentials,
    });

    if (success) {
      const { accessToken, refreshToken } = data;
      if (accessToken) {
        this.axiosConfig.AT = accessToken;
      }

      if (refreshToken) {
        this.axiosConfig.RT = refreshToken;
      }

      result = { ...result, ...data };
    } else throw errorMsg;

    return result;
  }

  /**
   * logout
   * @returns {Promise<void>}
   */
  async logout() {
    let result = await this.request('/v1/logout', {
      withCredentials: this.defaults.withCredentials,
    });

    result = result || {};

    const { success = true, errorMsg, data } = result;

    if (success) {
      this.axiosConfig.AT = '';
      this.axiosConfig.RT = '';
    } else throw errorMsg;

    return data;
  }

  /**
   * get user menus
   * @returns {Promise<void>}
   */
  async menus() {
    const { success, errorMsg, data } = await this.request(`/v1/current/menus`, {});
    if (!success) {
      throw errorMsg;
    }
    return data;
  }

  /**
   * Get user permissions on the current page
   * @param pageCode
   * @param pageUrl
   * @returns {Promise<void>}
   */
  async privileges(pageCode, pageUrl) {
    const param = {
      pageCode,
      pageUrl,
    };
    const { success, errorMsg, data } = await this.requestByRT(
      `/v1/current/page/privileges?${stringify(param)}`,
      {}
    );
    if (!success) {
      throw errorMsg;
    }
    return data;
  }
}

module.exports = UAAService;
