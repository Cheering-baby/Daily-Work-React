/* eslint-disable */
import { isNvl } from '@/utils/utils';

export function menuAdapter(parentMenu, srcData) {
  if (!srcData) return [];
  if (srcData && srcData.length > 0) {
    srcData.forEach((item, index) => {
      let { landingPage } = item;
      if (!landingPage) {
        landingPage = { pageUrl: '' };
      }
      if (parentMenu) {
        item.parentMenuCode = parentMenu.menuCode;
        item.parentMenuName = parentMenu.menuName;
      }
      item.isTopMenu = false;
      item.isBottomMenu = false;
      if (index === 0) {
        item.isTopMenu = true;
        item.isBottomMenu = false;
      }
      if (index === srcData.length - 1) {
        item.isTopMenu = false;
        item.isBottomMenu = true;
      }
      item.key = item.menuCode;
      item.menuUrl = item.menuType === '01' ? null : landingPage.pageUrl;
      if (item && item.subMenus && item.subMenus.length > 0) {
        item.children = item.subMenus;
      }
      menuAdapter(item, item.subMenus);
    });
  }
  return srcData;
}

export function getDefaultExpandedRowKeys(srcData, keys = []) {
  if (!srcData) return [];
  if (srcData && srcData.length > 0) {
    const item = srcData[0];
    keys.push(item.menuCode);
    if (item && item.children && item.children.length > 0) {
      getDefaultExpandedRowKeys(item.children, keys);
    }
  }
  return keys;
}

export function getKeyValue(keyValue) {
  let noVal = '';
  if (!isNvl(keyValue)) {
    noVal = String(keyValue);
    noVal = noVal.replace(/\n/g, '\\n');
    noVal = noVal.replace(/\r/g, '\\r');
    noVal = noVal.replace(/(^[ \f\t\v]*)|([ \f\t\v]*$)/g, '');
  }
  return noVal;
}

export function getMenuTypeStr(menuTypeList, menuType) {
  let menuTypeStr = '';
  if (menuType && menuTypeList && menuTypeList.length > 0) {
    const typeInfo = menuTypeList.find(n => String(n.dicValue) === String(menuType)) || {};
    menuTypeStr += typeInfo.dicName;
  }
  return !isNvl(menuTypeStr) ? menuTypeStr : '-';
}
