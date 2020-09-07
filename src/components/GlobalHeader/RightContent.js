import React, { PureComponent } from 'react';
import { Avatar, Badge, Col, Divider, Icon, Popover, Row, Spin } from 'antd';
import { FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import UserNotificationView from './UserNotificationView';
import { abbreviateName } from '@/utils/utils';
import styles from './index.less';
import { hasAnyPrivilege } from '@/utils/PrivilegeUtil';

const downImg = require('../../assets/image/icon-pull-down.svg');

const mapStateToProps = store => {
  const { notificationMgr } = store;
  return {
    notificationMgr,
  };
};

@connect(mapStateToProps)
class GlobalHeaderRight extends PureComponent {
  state = {
    pageInfo: {
      currentPage: 1,
      pageSize: 5,
    },
  };

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      notificationMgr: { nextQueryTime },
    } = this.props;
    const { notificationMgr } = prevProps;
    const { pageInfo } = this.state;
    if (nextQueryTime && nextQueryTime !== notificationMgr.nextQueryTime) {
      clearInterval(window.notificationInterval);
      window.notificationInterval = setInterval(() => {
        dispatch({
          type: 'notificationMgr/fetchBellNotification',
          payload: { pageInfo },
        });
      }, nextQueryTime * 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(window.notificationInterval);
  }

  handleNotificationIconClick = () => {
    const { dispatch } = this.props;
    const { pageInfo } = this.state;
    dispatch({
      type: 'notificationMgr/fetchBellNotification',
      payload: { pageInfo },
    });
    dispatch({
      type: 'notificationMgr/saveData',
      payload: {
        notificationVisibleFlag: true,
      },
    });
  };

  handleNotificationVisibleChange = visible => {
    const { dispatch } = this.props;
    const { pageInfo } = this.state;
    dispatch({
      type: 'notificationMgr/saveData',
      payload: {
        notificationVisibleFlag: visible,
      },
    });
    dispatch({
      type: 'notificationMgr/fetchBellNotification',
      payload: { pageInfo },
    });
  };

  routerTo = activeKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notificationMgr/saveData',
      payload: {
        notificationVisibleFlag: false,
      },
    }).then(() => {
      if (activeKey === '1') {
        router.push('/Notifications/SystemNotification');
      } else if (activeKey === '2') {
        router.push('/MyActivity');
      } else if (activeKey === '3') {
        router.push('/Notifications/Bulletin');
      } else if (activeKey === '4') {
        router.push('/Notifications/Circular');
      }
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
      notificationMgr: {
        systemNotificationCount,
        pendingActivityCount,
        bulletinCount,
        circularCount,
        notificationVisibleFlag,
      },
    } = this.props;
    const { userName, userType, companyInfo: { companyType, mainTAInfo } = {} } = currentUser;
    const menu = (
      <div className={styles.menu}>
        <div className={styles.avatarCard}>
          <Avatar alt="avatar">{abbreviateName(userName)}</Avatar>
          <div className={styles.avatarInfo} id="currentUser">
            {companyType === '02' ? (
              <React.Fragment>
                <h4>{`Main TA: "${mainTAInfo.companyName}"`}</h4>
                <h4>{userName}</h4>
              </React.Fragment>
            ) : (
              <h4>{userName}</h4>
            )}
            <div>
              {currentUserRole &&
                currentUserRole.map(item => (
                  <span key={`key_${item.roleName}`}>{item.roleName}</span>
                ))}
            </div>
          </div>
        </div>
        <Divider style={{ margin: 0 }} />
        {String(userType) === '01' ? (
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <div className={styles.logout} onClick={() => onMenuClick({ key: 'logout' })}>
                <Icon type="export" />
                <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
              </div>
            </Col>
          </Row>
        ) : (
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
                <FormattedMessage
                  id="menu.account.changePassword"
                  defaultMessage="Change Password"
                />
              </div>
            </Col>
          </Row>
        )}
      </div>
    );

    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    let notificationCount = 0;
    if (systemNotificationCount) notificationCount += Number(systemNotificationCount);
    if (pendingActivityCount) notificationCount += Number(pendingActivityCount);
    if (hasAnyPrivilege(['NOTIFICATION_BELL_BULLETIN_PRIVILEGE']) && bulletinCount)
      notificationCount += Number(bulletinCount);
    if (hasAnyPrivilege(['NOTIFICATION_BELL_CIRCULAR_PRIVILEGE']) && circularCount) {
      notificationCount += Number(circularCount);
    }
    return (
      <div className={className}>
        <Popover
          content={
            <UserNotificationView
              // handleClick={this.handleClick}
              routerTo={this.routerTo}
              {...this.props}
            />
          }
          placement="bottomRight"
          trigger="click"
          popupClassName={styles.userNotificationPopover}
          onVisibleChange={this.handleNotificationVisibleChange}
          visible={notificationVisibleFlag}
        >
          <Badge count={notificationCount} style={{ marginRight: '22px' }}>
            <Icon
              type="bell"
              style={{ marginRight: '22px', cursor: 'pointer', fontSize: '22px' }}
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
