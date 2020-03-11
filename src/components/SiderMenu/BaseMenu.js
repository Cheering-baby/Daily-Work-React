import React, { PureComponent } from 'react';
import { Icon, Menu } from 'antd';
import Link from 'umi/link';
import { forEach, isArray, isEqual } from 'lodash';
import memoizeOne from 'memoize-one';
import { formatMessage } from 'umi/locale';
import pathToRegexp from 'path-to-regexp';
import styles from './index.less';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') return <Icon type={icon} style={{ fontSize: '20px' }} />;
  return icon;
};

export const getMenuMatches = memoizeOne(
  (flatMenuKeys, path) => flatMenuKeys.filter(item => item && pathToRegexp(item).test(path)),
  isEqual
);

export const getItemPath = (path, menuData) => {
  if (!path) return;
  const pathArr = [];
  let flag = false;
  const getPath = (arr, o) => {
    let findit = false;
    if (o.path) arr.push(o.path);
    if (!isArray(o)) o = o.children;
    forEach(o, v => {
      if (flag) return false;
      if (v.children) {
        getPath(arr, v);
      } else if (v.path === path || path.startsWith(v.path)) {
        flag = true;
        findit = true;
        arr.push(v.path);
        return false;
      }
    });
    if (!flag && !findit) arr.pop();
  };
  getPath(pathArr, menuData);
  return pathArr;
};

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.getSelectedMenuKeys = memoizeOne(this.getSelectedMenuKeys, isEqual);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { menuData } = this.props;
    // let keys = this.getFlatMenuKeys(menuData);
    // let selectedKey = urlToList(pathname).map(itemPath => getMenuMatches(keys, itemPath).pop()).filter(item => item);
    return getItemPath(pathname, menuData) || [];
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const name = item.locale ? formatMessage({ id: item.locale }) : item.name;
      let { iconUrl } = item;
      if (!iconUrl) iconUrl = 'iconfont icon-list';
      const icon = getIcon(iconUrl);
      return (
        <SubMenu
          title={
            <span>
              {getIcon(icon)}
              <span>{name}</span>
            </span>
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const name = item.locale ? formatMessage({ id: item.locale }) : item.name;
    const itemPath = this.conversionPath(item.path);
    let { iconUrl } = item;
    if (!iconUrl) iconUrl = 'iconfont icon-asterisk';
    const icon = getIcon(iconUrl);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        /* eslint-disable */
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      mode,
      theme,
      location: { pathname },
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, menuData } = this.props;
    return (
      <Menu
        key="Menu"
        mode={mode}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        theme={theme === 'light' ? theme : 'dark'}
        className={mode === 'horizontal' ? 'top-nav-menu' : ''}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
