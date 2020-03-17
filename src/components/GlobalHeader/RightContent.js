import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Avatar, Badge, Col, Divider, Icon, Popover, Row, Spin } from 'antd';
import { abbreviateName } from '@/utils/utils';
import styles from './index.less';
import UserNotificationView from './UserNotificationView';

const downImg = require('../../assets/image/icon-pull-down.svg');

@connect(({ notificationMgr }) => ({
  notificationMgr,
}))
class GlobalHeaderRight extends PureComponent {
  handleNotificationIconClick = () => {
    const {
      dispatch,
      // notificationMgr: { visibleFlag },
    } = this.props;
    dispatch({
      type: 'notificationMgr/querySystemList',
    });
    dispatch({
      type: 'notificationMgr/saveData',
      payload: {
        visibleFlag: true,
      },
    });
  };

  handleNotificationVisibleChange = visible => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notificationMgr/saveData',
      payload: {
        visibleFlag: visible,
      },
    });
    dispatch({
      type: 'notificationMgr/fetchSystemList',
      payload: {},
    });
  };

  render() {
    const {
      currentUser = {},
      onMenuClick,
      theme,
      currentUserRole,
      popoverVisible,
      onHandleVisibleChange,
      notificationMgr: { systemList, systemCount },
    } = this.props;
    const { userName } = currentUser;
    const menu = (
      <div className={styles.menu}>
        <div className={styles.avatarCard}>
          <Avatar alt="avatar">{abbreviateName(userName)}</Avatar>
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
        <Row type="flex" justify="space-around">
          <Col span={10}>
            <div className={styles.logout} onClick={() => onMenuClick({ key: 'logout' })}>
              <Icon type="export" />
              <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
            </div>
          </Col>
          <Col span={14}>
            <div className={styles.logout} onClick={() => onMenuClick({ key: 'changePassword' })}>
              <Icon type="lock" />
              <FormattedMessage id="menu.account.changePassword" defaultMessage="Change Password" />
            </div>
          </Col>
        </Row>
      </div>
    );

    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <Popover
          content={
            <UserNotificationView
              handleClick={this.handleClick}
              {...this.props}
              systemList={systemList}
              systemCount={systemCount}
            />
          }
          placement="bottomRight"
          trigger="click"
          style={{ width: '400px !important' }}
          onVisibleChange={this.handleNotificationVisibleChange}
          // visible={visibleFlag}
        >
          <Badge count={0} style={{ marginRight: '22px' }}>
            <Icon
              type="bell"
              style={{ marginRight: '12px', cursor: 'pointer', fontSize: '22px' }}
              onClick={this.handleNotificationIconClick}
            />
          </Badge>
        </Popover>
        {currentUser ? (
          <Popover
            content={menu}
            placement="bottomRight"
            trigger="click"
            visible={popoverVisible}
            popupClassName={styles.popover}
            onVisibleChange={onHandleVisibleChange}
          >
            <span className={styles.account}>
              <Avatar className={styles.avatar} alt="avatar">
                {abbreviateName(userName)}
              </Avatar>
              <img src={downImg} alt="down" className={styles.arrow} />
            </span>
          </Popover>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
export default GlobalHeaderRight;
