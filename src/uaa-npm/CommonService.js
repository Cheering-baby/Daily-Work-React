const axios = require('axios');
const { codeMessage, promptMessage, globalConst } = require('./constant');
const { parseURL } = require('./utils');

/**
 * CommonService ,定义请求的公共方法
 */
class CommonService {
  constructor(instanceConfig) {
    const { appCode } = instanceConfig;
    if (!appCode) {
      throw new Error('appCode must not null!');
    }

    this.defaults = instanceConfig;

    this.axiosConfig = {
      AT: '',
      RT: '',
      csrfToken: '',
      refreshTokenLoading: false,
      refreshTokenPromise: null,
      appCode,
    };

    /* 创建一个新的 AXIOS 对象，确保原有的对象不变 */
    const axiosWrap = axios.create();

    /* 过滤请求 */
    axiosWrap.interceptors.request.use(config => {
      const ret = config;

      const url = parseURL(config.url);
      if (this.axiosConfig.AT) {
        ret.headers[globalConst.HEADER_AUTHORIZATION] =
          globalConst.TOKEN_PREFIX + this.axiosConfig.AT;
      }
      // 注意 logout 和  refreshToken 接口 Authorization: Bearer RT， 放RT
      if (
        this.axiosConfig.RT &&
        url &&
        (this.defaults.backendContextPath + this.defaults.refreshTokenPath === url.pathname ||
          this.defaults.backendContextPath + this.defaults.logoutPath === url.pathname)
      ) {
        ret.headers[globalConst.HEADER_AUTHORIZATION] =
          globalConst.TOKEN_PREFIX + this.axiosConfig.RT;
      }

      if (this.axiosConfig.appCode) {
        ret.headers[globalConst.APP_CODE] = this.axiosConfig.appCode;
      }

      if (this.axiosConfig.csrfToken) {
        ret.headers[globalConst.HEADER_CSRF_TOKEN] = this.axiosConfig.csrfToken;
      }

      return ret;
    });

    // 过滤响应
    axiosWrap.interceptors.response.use(undefined, error => {
      const { response, config } = error;
      const { data } = response;
      const url = parseURL(config.url);

      // 如果是refreshToken 接口报错，则 还原refreshTokenLoading
      if (
        url &&
        (url.pathname === this.defaults.refreshTokenPath ||
          url.pathname === this.defaults.logoutPath ||
          url.pathname === this.defaults.loginPath)
      ) {
        this.axiosConfig.refreshTokenLoading = false;
        error.response.data.errCode = 'SESSION_TIMEOUT';
        error.response.data.message = promptMessage.COMMON_SESSION_TIMEOUT;
        return Promise.reject(error);
      }

      // RT校验失败
      if (data.code && data.code === globalConst.ERROR_RT_VERIFICATION_FAILED) {
        this.axiosConfig.refreshTokenLoading = false;
        error.response.data.errCode = 'SESSION_TIMEOUT';
        error.response.data.message = promptMessage.COMMON_SESSION_TIMEOUT;
        return Promise.reject(error);
      }

      if (data.code && data.code === globalConst.ERROR_UNAUTHORIZED) {
        // 把当前请求插入到重试队列理等待重试
        // 如果还没调用refreshtoken接口，则调用后再重新
        if (!this.axiosConfig.refreshTokenLoading) {
          this.axiosConfig.refreshTokenLoading = true;

          this.axiosConfig.refreshTokenPromise = new Promise((resolve, reject) => {
            // 调用refresh接口
            const refreshConfig = {};
            refreshConfig.url =
              this.defaults.uaaPath +
              this.defaults.backendContextPath +
              this.defaults.refreshTokenPath;
            refreshConfig.headers = {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Accept: 'application/json',
            };
            refreshConfig.method = 'POST';
            refreshConfig.withCredentials = this.defaults.withCredentials;

            axiosWrap(refreshConfig)
              .then(refreshResponse => {
                this.axiosConfig.refreshTokenLoading = false;
                const { data: tokenDto } = refreshResponse;
                this.axiosConfig.AT = tokenDto.accessToken;
                this.axiosConfig.RT = tokenDto.refreshToken;
                resolve(tokenDto);
              })
              .catch(() => {
                this.axiosConfig.refreshTokenLoading = false;
                error.response.data.errCode = 'SESSION_TIMEOUT';
                error.response.data.message = promptMessage.COMMON_SESSION_TIMEOUT;
                reject(error);
              });
          });
        }

        return this.axiosConfig.refreshTokenPromise.then(tokenDto => {
          this.axiosConfig.AT = tokenDto.accessToken;
          this.axiosConfig.RT = tokenDto.refreshToken;
          return axiosWrap(config);
        });
      }

      return Promise.reject(error);
    });
    this.axios = axiosWrap;

    this.getWebRoot = this.getWebRoot.bind(this);
    this.request = this.request.bind(this);
  }

  getWebRoot() {
    return this.defaults.uaaPath + this.defaults.backendContextPath;
  }

  /**
   * 请求接口
   * Requests a URL, returning a promise.
   *
   * @param  {string} url       The URL we want to request
   * @param  {{}} option The options we want to pass to "fetch"
   * @return {object}   { success: boolean, data: object,errorMsg: string}
   *
   */
  request(url, option) {
    const options = {
      ...option,
    };

    const defaultOptions = {
      credentials: 'include',
    };

    const newOptions = { ...defaultOptions, ...options };
    let urlN = url.indexOf('http') > -1 ? url : this.getWebRoot() + url;
    if (
      newOptions.method === 'POST' ||
      newOptions.method === 'PUT' ||
      newOptions.method === 'PATCH' ||
      newOptions.method === 'DELETE'
    ) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
        ...newOptions.headers,
      };
      if (typeof newOptions.body !== 'string') {
        newOptions.body = JSON.stringify(newOptions.body);
      }
      newOptions.data = newOptions.body;
      delete newOptions.body;
    } else {
      newOptions.headers = {
        'X-Requested-With': 'XMLHttpRequest',
        ...newOptions.headers,
      };
      const symbol = urlN.indexOf('?') > -1 ? '&' : '?';
      urlN += `${symbol}_=${Math.random()}`;
    }

    // 由这里传入一个刷新token的操作
    const config = {
      url: urlN,
      ...newOptions,
    };

    return this.axios
      .request(config)
      .then(response => {
        const { data } = response;
        if (Object.is('blob', response.config.responseType)) {
          const filename = response.headers['content-disposition'] || '';
          return {
            success: true,
            filename,
            file: data,
          };
        }
        return {
          success: true,
          data: response.data,
          errorMsg: undefined,
        };
      })
      .catch(error => {
        if (error.response) {
          const result = {
            success: false,
            data: null,
            errorMsg: undefined,
          };
          let message;
          const { data } = error.response;

          message = data.message || codeMessage[data.status];

          if (message === undefined) {
            message = error.message || error;
          }

          if (data.errCode && data.errCode === 'SESSION_TIMEOUT') {
            this.axiosConfig.AT = '';
            this.axiosConfig.RT = '';
            this.defaults.doSessionTimeout();
          }

          result.errorMsg = message;
          result.data = data;
          data.resultCode = data.code;
          data.resultMsg = message;
          return result;
        }
      });
  }
}

module.exports = CommonService;
