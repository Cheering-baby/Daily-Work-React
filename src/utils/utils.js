import moment from 'moment';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import { parse, stringify } from 'qs';
import UAAService from '@/uaa-npm';
import loginSession from './loginSession';
import 'isomorphic-fetch';
import defaultSettings from '@/defaultSettings';
import { globalConst } from '@/uaa-npm/constant';

export const colLayOut = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 8,
  xxl: 8,
  style: {
    height: '75px',
  },
};

export const rowLayOut = {
  type: 'flex',
  gutter: 15,
};

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'lastWeek') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const endTime = now.getTime() - (day * oneDay + 1000);
    return [moment(endTime - (7 * oneDay - 1000)), moment(endTime)];
  }

  if (type === 'lastMonth') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDate = moment(now).subtract(1, 'months');
    const lastYear = lastDate.year();
    const LastMonth = lastDate.month();
    return [
      moment(`${lastYear}-${fixedZero(LastMonth + 1)}-01 00:00:00`),
      moment(moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

export function menuAdapter(srcData) {
  if (!srcData) return [];

  srcData.forEach(item => {
    let { landingPage } = item;
    if (!landingPage) {
      landingPage = { pageUrl: '' };
    }
    item.key = item.menuCode;
    item.name = item.menuName;
    item.path = item.menuType === '01' ? `path_${item.menuCode}` : landingPage.pageUrl;
    if (item.subMenus && item.subMenus.length > 0) {
      item.children = item.subMenus;
    }
    menuAdapter(item.subMenus);
  });
  return srcData;
}

export function checkWeakPwd(pwd, userCode) {
  if (userCode) {
    pwd = pwd.toLowerCase();
    userCode = userCode.toLowerCase();
    const reversedUc = userCode
      .split('')
      .reverse()
      .join('');
    if (!(pwd === userCode || pwd === reversedUc)) {
      return true;
    }
    return false;
  }
  return true;
}

/**
 * 密码规则校验
 * @param {string} password
 * @param {object} composition 校验规则
 * @param {string} userCode 不可与用户名正反重复
 */
export function isMatchPwdRule(password, composition, userCode) {
  const userPwdMaxLength = 30;
  let msg = true;
  if (!password) {
    return formatMessage({ id: 'PWD_REQUIRED' });
  }
  if (/(.)\1{2}/.test(password)) {
    return formatMessage({ id: 'PWD_CONTINUOUS_CHAR_NUM' }).replace('{0}', 2);
  }
  if (!checkWeakPwd(password, userCode)) {
    return formatMessage({ id: 'PWD_NOT_USER_CODE' });
  }
  if (password.length < composition.userPwdMinLength || password.length > userPwdMaxLength) {
    msg = formatMessage({ id: 'PWD_LENGTH' });
    msg = msg.replace('{1}', composition.userPwdMinLength);
    msg = msg.replace('{2}', userPwdMaxLength);
    return msg;
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[@#$%!&*]/.test(password);
  const hasDigitsChar = /[0-9]/.test(password);
  let checkNum = 0;
  if (hasUpperCase) checkNum += 1;
  if (hasLowerCase) checkNum += 1;
  if (hasSpecialChar) checkNum += 1;
  if (hasDigitsChar) checkNum += 1;
  switch (composition.pwdComposition) {
    case '1':
      if (checkNum < 1) {
        return formatMessage({ id: 'PWD_COMPOTION_1' });
      }
      break;
    case '2':
      if (checkNum < 2) {
        return formatMessage({ id: 'PWD_COMPOTION_2' });
      }
      break;
    case '3':
      if (checkNum < 3) {
        return formatMessage({ id: 'PWD_COMPOTION_3' });
      }
      break;
    case '4':
      if (checkNum < 4) {
        return formatMessage({ id: 'PWD_COMPOTION_4' });
      }
      break;
    default:
      break;
  }
  return true;
}

/**
 * Abbreviate Name
 *
 * @param  {string}    full name
 * @return {string}    abbreviate name
 */
export function abbreviateName(name) {
  if (name) {
    const regEn = /.*[A-Za-z]+.*$/;
    const regCh = /.*[\u4e00-\u9fa5]+.*$/;
    /* eslint-disable */
    const regSpecial = /.*[\s*\.*/g]+.*$/;
    const interceptName = (names, regs, language) => {
      const letterArr = names.split('');
      let firstPosition = null;
      let lastPosition = null;
      letterArr.map((item, index) => {
        if (regs.test(item) && !(!firstPosition >= 0)) {
          firstPosition = index;
        }
        if (
          (firstPosition === '0' || firstPosition) &&
          !regs.test(item) &&
          !regSpecial.test(item)
        ) {
          lastPosition = index;
        }
        return item;
      });
      let newArr = null;
      if (language === 'en')
        newArr = lastPosition
          ? names.substring(firstPosition, lastPosition).split(' ')
          : names.substring(firstPosition, names.length).split(' ');
      if (language === 'ch')
        newArr = lastPosition
          ? names.substring(firstPosition, lastPosition)
          : names.substring(firstPosition, names.length);
      return newArr;
    };
    if (regEn.test(name)) {
      // 取英文
      let enArr = interceptName(name, regEn, 'en');
      let newEnName = [];
      if (enArr.length > 2) {
        enArr = [enArr[0], enArr[enArr.length - 1]];
      }
      enArr.map(item => newEnName.push(item.substr(0, 1).toUpperCase()));
      newEnName = newEnName.join('');
      return newEnName;
    }
    if (!regEn.test(name) && regCh.test(name)) {
      // 取中文
      const chArr = interceptName(name, regCh, 'ch');
      if (chArr.length > 2) return chArr.substring(1, 3);
      if (chArr.length < 3) return chArr;
    }
  }
}

export function setCookie(name, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  const expire = expiredays == null ? '' : `;expires=${exdate.toGMTString()}`;
  document.cookie = `${name}=${escape(value)}${expire}`;
}

/**
 * 导出为excel
 *
 * @param  {obj}
 */
export function exportData(param) {
  const dlform = document.createElement('form');
  dlform.style = 'display:none;';
  dlform.method = 'post';
  dlform.action = param.url;
  dlform.target = 'id_iframe';
  const hdnFilePath = document.createElement('input');
  hdnFilePath.type = 'hidden';
  hdnFilePath.name = 'ftfexpformat';
  hdnFilePath.value = 'xlsx';
  dlform.appendChild(hdnFilePath);

  const hdnftfexpcfg = document.createElement('input');
  hdnftfexpcfg.type = 'hidden';
  hdnftfexpcfg.name = 'ftfexpcfg';
  hdnftfexpcfg.value = param.configstr;
  dlform.appendChild(hdnftfexpcfg);

  const hdnparam = document.createElement('input');
  hdnparam.type = 'hidden';
  hdnparam.name = 'param';
  hdnparam.value = param.data;
  dlform.appendChild(hdnparam);

  const token = loginSession.getToken();
  const currentUser = loginSession.getUser() || {};
  const { _csrf = {} } = currentUser;
  const csrfParameterName = _csrf.parameterName;
  if (csrfParameterName) {
    const tokenParam = document.createElement('input');
    tokenParam.type = 'hidden';
    tokenParam.name = csrfParameterName;
    tokenParam.value = token;
    dlform.appendChild(tokenParam);
  }

  document.body.appendChild(dlform);
  dlform.acceptCharset = 'UTF-8';
  dlform.submit();
  document.body.removeChild(dlform);
}

export function exportTable(param) {
  param.asyn = true;
  const { fileName, colModel } = param;
  param.configstr = JSON.stringify({ fileName, columns: colModel });
  param.data = JSON.stringify(param.serviceParam || {});
  exportData(param);
}

// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
// eslint-disable-next-line import/prefer-default-export
export function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}

export function transformFormat(format) {
  format = format.toUpperCase();
  format = format.replace('II', 'mm');
  format = format.replace('SS', 'ss');
  return format;
}

// 提供collapseMenu菜单方法给业务侧
export function collapseMenu() {
  const currentMenu = {
    url: window.location.hash.split('#')[1],
  };
  const mainMenu = {
    url: window.portal.defaultUrl,
  };
  return { mainMenu, currentMenu };
}

export function openMenu(url) {
  /* eslint-disable no-underscore-dangle */
  window.g_app._store.dispatch(routerRedux.push(url));
}

// Jump to Home Page
export function loginRedirect() {
  const payload = window.g_app.login_payload || {};
  const data = window.g_app.login_data || {};

  if (
    payload.redirect && // Need to jump
    payload.redirect[0] !== '/' // Non'/'Beginning
  ) {
    if (payload.redirect.includes('?')) {
      // Jump band parameters
      window.location.href = `${payload.redirect}`;
    } else {
      // Jump without parameters
      window.location.href = `${payload.redirect}`;
    }
  }

  if (data.redirect && data.redirect === true && data.redirectUrl) {
    window.location.href = data.redirectUrl;
  }
}

export function getServicePath() {
  const backendContextPath = `${UAAService.defaults.backendContextPath}`;
  if (backendContextPath.startsWith('/')) {
    return `${UAAService.defaults.uaaPath}${backendContextPath}`;
  }
  return `${UAAService.defaults.uaaPath}/${backendContextPath}`;
}

export const isString = obj => Object.prototype.toString.call(obj) === '[object String]';

/**
 * @param obj
 * @returns {Boolean}
 */
export function isNvl(obj) {
  if (obj === null || obj === '' || obj === undefined) return true;
  return false;
}

/**
 * @param inputStr
 * @returns
 */
export function isNumber(inputStr) {
  if (!isNvl(inputStr)) {
    return !isNaN(parseFloat(inputStr));
  }
  return false;
}

export function handleDownFile(apiUrl, reqParamJson, defaultFileName, beforeDown, afterDown) {
  if (beforeDown) {
    beforeDown();
  }
  fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(reqParamJson),
    credentials: 'include',
    headers: new Headers({
      Accept: 'application/json',
      [globalConst.HEADER_AUTHORIZATION]: globalConst.TOKEN_PREFIX + UAAService.axiosConfig.RT,
      'Content-Type': 'application/json',
      'App-Code': 'PAMS',
    }),
  })
    .then(response => {
      response.blob().then(blob => {
        if (afterDown) {
          afterDown();
        }
        if (response.status !== 200) {
          message.warn(
            formatMessage({ id: 'EXPORT_FILE_STATUS' })
              .replace('XXX', response.status)
              .replace('YYY', response.status)
          );
          return;
        }
        let fileName = response.headers.get('Content-Disposition');
        console.log(response.headers.get('Set-Cookie'))
        fileName = !isNvl(fileName) ? fileName : defaultFileName;
        fileName = fileName.replace('attachment;filename=', '');
        console.log(fileName)
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const blobUrl = window.URL.createObjectURL(blob);
          const aElement = document.createElement('a');
          document.body.appendChild(aElement);
          aElement.style.display = 'none';
          aElement.href = blobUrl;
          aElement.download = !isNvl(fileName) ? fileName : 'test.xlsx';
          aElement.click();
          document.body.removeChild(aElement);
        }
      });
    })
    .catch(error => {
      message.warn(String(error), 10);
      if (afterDown) {
        afterDown();
      }
    });
}

export function getUrl() {
  const backendContextPath = `${UAAService.defaults.backendContextPath}`;
  if (backendContextPath.startsWith('/')) {
    return `${UAAService.defaults.uaaPath}${UAAService.defaults.backendContextPath}`;
  }
  return `${UAAService.defaults.uaaPath}/${UAAService.defaults.backendContextPath}`;
  //return `http://10.25.159.206:18091/pams`;
}

export function getLocalUrl() {
  return `${window.location.protocol}//${window.location.host}${defaultSettings.publicPath}`;
  // return 'http://localhost:8000';
}

export function reBytesStr(str, L) {
  if (isNvl(str)) {
    return '';
  }
  let result = '';
  const strlen = str.length;
  const chrlen = str.replace(/[^\x00-\xff]/g, '**').length;

  if (chrlen <= L) {
    return str;
  }

  for (let i = 0, j = 0; i < strlen; i += 1) {
    const chr = str.charAt(i);
    if (/[\x00-\xff]/.test(chr)) {
      j += 1;
    } else {
      j += 2;
    }
    if (j <= L) {
      result += chr;
    } else {
      return result;
    }
  }
}

export function toThousands(s) {
  if (s < 0 && s > -1000) {
    return s;
  } else {
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(2) + '';
    var l = s
        .split('.')[0]
        .split('')
        .reverse(),
      r = s.split('.')[1];
    let t = '';
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
    }
    return (
      t
        .split('')
        .reverse()
        .join('') +
      '.' +
      r
    );
  }
}
