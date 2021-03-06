import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Avatar, Button, Col, Divider, Icon, Popover, Row } from 'antd';
import BaseMenu, { getMenuMatches } from '../SiderMenu/BaseMenu';
import Notification from '../Notification';
import { abbreviateName, isNvl, urlToList } from '@/utils/utils';
import styles from './index.less';
import PageHeader from '@/components/MobileHeader/PageHeader';

/**
 * 获得菜单子节点
 * @memberof Menu
 */
const getDefaultCollapsedSubMenus = (props, flatMenuKeys) => {
  const {
    location: { pathname },
  } = props;
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};
/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

export const getRelativePages = menuData => {
  let keys = [];
  menuData.forEach(({ children, menuName, menuCode, relativePages }) => {
    if (children) {
      keys = keys.concat(getRelativePages(children));
    }
    if (relativePages instanceof Array && relativePages.length > 0) {
      relativePages.forEach(item => {
        keys.push({ ...item, menuName, menuCode });
      });
    }
  });
  return keys;
};

export const getRelativePage = (menuData, menuPath) => {
  const relativePages = getRelativePages(menuData);
  const comparePath = (pathname, pageUrl) => {
    const pathNames = pathname.split('/');
    const pageUrls = pageUrl.split('/');
    if (pathNames.length !== pageUrls.length) {
      return false;
    }
    for (let i = 0; i < pathNames.length; i += 1) {
      if (!(pageUrls[i] === '*' || pathNames[i].toLowerCase() === pageUrls[i].toLowerCase())) {
        return false;
      }
    }
    return true;
  };
  return relativePages.find(item => comparePath(menuPath, item.pageUrl));
};

class MobileHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props, this.flatMenuKeys),
      visibleLeft: false,
    };
  }

  getAvatar = (userName, userType) => {
    const { onMenuClick, currentUserRole } = this.props;
    return (
      <div className={styles.avatarContent}>
        <div className={styles.avatarCard}>
          <Avatar alt="avatar" className={styles.avatar}>
            {abbreviateName(userName)}
          </Avatar>
          <div className={styles.avatarInfo} id="currentUser">
            <h4>{userName}</h4>
            <div>
              {currentUserRole &&
                currentUserRole.map(item => (
                  <span key={`key_${item.roleName}`}>{item.roleName}</span>
                ))}
            </div>
          </div>
        </div>
        <Divider style={{ margin: 0 }} />
        <div className={styles.logout} onClick={() => onMenuClick({ key: 'logout' })}>
          <Icon type="export" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </div>
        {String(userType) !== '01' && (
          <div className={styles.logout} onClick={() => onMenuClick({ key: 'changePassword' })}>
            <Icon type="lock" />
            <FormattedMessage id="menu.account.changePassword" defaultMessage="Change Password" />
          </div>
        )}
      </div>
    );
  };

  getMenu = () => {
    const { openKeys } = this.state;
    return (
      <div style={{ height: 'calc(100vh - 110px)' }}>
        <BaseMenu
          {...this.props}
          mode="inline"
          theme="light"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          onHandleVisibleLeftMenuChange={this.handleVisibleLeftChange}
          style={{
            border: 'none',
            padding: '16px 0',
            width: '200px',
            overflow: 'hidden auto',
            height: '300px',
          }}
          isMobile
          {...{ openKeys }}
        />
      </div>
    );
  };

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  handleVisibleLeftChange = visible => {
    this.setState({
      visibleLeft: visible,
    });
  };

  render() {
    const {
      dispatch,
      currentUser = {},
      menuData = [],
      location: { pathname },
      leafMenuSpecialGroup,
    } = this.props;
    const { visibleLeft } = this.state;
    const { userName, userType } = currentUser;
    const avatar = this.getAvatar(userName, userType);
    const menu = this.getMenu();
    const relativePage = getRelativePage(menuData, pathname);

    if (!isNvl(relativePage)) {
      const { menuName = '', menuCode = '' } = relativePage;
      if (leafMenuSpecialGroup && leafMenuSpecialGroup.has(menuCode)) {
        const leafMenuSpecialInfo = leafMenuSpecialGroup.get(menuCode);
        return (
          <PageHeader
            noShowLeft={leafMenuSpecialInfo.noShowLeft}
            onLeftClick={
              leafMenuSpecialInfo.onLeftClick
                ? () => {
                    dispatch({ type: `${leafMenuSpecialInfo.onLeftClick}` });
                  }
                : null
            }
            rightContent={leafMenuSpecialInfo.rightContent}
          >
            {menuName.toUpperCase()}
          </PageHeader>
        );
      }
      return <PageHeader rightContent={null}>{menuName.toUpperCase()}</PageHeader>;
    }
    return (
      <Row type="flex" justify="space-around" className={styles.header}>
        <Col span={6}>
          <Popover
            placement="bottomLeft"
            content={menu}
            trigger="click"
            overlayClassName={styles.menuPopover}
            arrowPointAtCenter
            visible={visibleLeft}
            onVisibleChange={this.handleVisibleLeftChange}
          >
            <div className={styles.btnOne}>
              <Button type="primary" size="small" className={styles.menuBtn} htmlType="button">
                <Icon type="menu" />
              </Button>
            </div>
          </Popover>
        </Col>
        <Col span={12}>
          <div className={styles.logoStyle}>
            <FormattedMessage id="COMMON_PAMS" defaultMessage="PAMS" />
          </div>
        </Col>
        <Col span={3}>
          <Notification {...this.props} />
        </Col>
        <Col span={3}>
          <Popover
            placement="bottomRight"
            content={avatar}
            trigger="click"
            overlayClassName={styles.avatarPopover}
            arrowPointAtCenter
          >
            <div className={styles.avatarDiv}>
              <div className={styles.btnOneRight}>
                <Avatar alt="avatar" className={styles.avatar}>
                  {abbreviateName(userName)}
                </Avatar>
              </div>
            </div>
          </Popover>
        </Col>
      </Row>
    );
  }
}

export default MobileHeader;
