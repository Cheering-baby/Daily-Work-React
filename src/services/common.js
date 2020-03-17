import { Base64 } from 'js-base64';
import UAAService from '@/uaa-npm';

/**
 * 查询当前系统语言
 * @returns {Promise<void>}
 */
export async function getLocale() {
  return UAAService.request('/common/getLocale', {});
}

/**
 * 查询当前系统可用的语言
 * @returns {Promise<Object>}
 */
export async function getSupportLanguage() {
  return UAAService.request('/common/getSupportLanguage', {});
}

/**
 * 修改用户密码
 * @returns {Promise<Object>}
 * @param userCode
 * @param oldPwd
 * @param newPwd
 */
export async function changePassword(userCode, oldPwd, newPwd) {
  return UAAService.request('/proxy/ali/b2b/user/v1/user/changePassword', {
    method: 'POST',
    body: {
      oldPassword: Base64.encode(oldPwd),
      newPassword: Base64.encode(newPwd),
      confirmPassword: Base64.encode(newPwd),
    },
  });
}

/**
 * 查询当前用户角色
 * @returns {Promise<Object>}
 */
export async function queryCurrentUserRoles() {
  return UAAService.request(`/user/roles`, {});
}

export function queryOrgListByUser(userCode) {
  return UAAService.request(`/proxy/ali/b2b/profile/getSuperTaList?userCode=${userCode}`, {
    method: 'GET',
  });
}
