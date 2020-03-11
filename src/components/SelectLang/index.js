import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale } from 'umi/locale';
import { Dropdown, Icon, Menu } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default class SelectLang extends PureComponent {
  changLang = ({ key }) => {
    setLocale(key);
    const portalLocalKey = key === 'en-US' ? 'en' : 'zh';
    this.setCookie('PORTAL_LOCALE', portalLocalKey, 30);
    window.location.reload();
  };

  setCookie = (name, value, expiredays) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    const expire = expiredays == null ? '' : `;expires=${exdate.toGMTString()}`;
    document.cookie = `${name}=${escape(value)}${expire}`;
  };

  render() {
    const { className, items = [], selectedItem = '' } = this.props;
    const langMenu = (
      <Menu className={styles.menu} onClick={this.changLang}>
        {items.map(v =>
          v.key === 'en' ? (
            <Menu.Item key="en-US">{v.showValue}</Menu.Item>
          ) : (
            <Menu.Item key="zh-CN">{v.showValue}</Menu.Item>
          )
        )}
      </Menu>
    );

    return (
      <Dropdown overlay={langMenu}>
        <span className={classNames(styles.dropDown, className)}>
          {!selectedItem ? <FormattedMessage id="navBar.lang" /> : selectedItem.showValue}
          <Icon type="down" />
        </span>
      </Dropdown>
    );
  }
}
