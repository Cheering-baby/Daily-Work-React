import React, { PureComponent } from 'react';
import { Badge, Icon } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import UserNotificationView from '../GlobalHeader/UserNotificationView';
import MobileModal from '../MobileModal';

const mapStateToProps = store => {
  const { notificationMgr } = store;
  return {
    notificationMgr,
  };
};

@connect(mapStateToProps)
class Notification extends PureComponent {
  state = {
    pageInfo: {
      currentPage: 1,
      pageSize: 10,
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

  handleModal = flag => {
    const { dispatch } = this.props;
    const { pageInfo } = this.state;
    dispatch({
      type: 'notificationMgr/saveData',
      payload: {
        notificationVisibleFlag: flag,
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
      isPageHeader,
      notificationMgr: {
        systemNotificationCount,
        pendingActivityCount,
        bulletinCount,
        circularCount,
        notificationVisibleFlag,
      },
    } = this.props;
    const { userType } = currentUser;
    let notificationCount = 0;
    if (systemNotificationCount) notificationCount += Number(systemNotificationCount);
    if (pendingActivityCount) notificationCount += Number(pendingActivityCount);
    if (bulletinCount) notificationCount += Number(bulletinCount);
    if (String(userType) !== '03' && circularCount) {
      notificationCount += Number(circularCount);
    }
    const modalOpts = {
      title: formatMessage({ id: 'COMMON_NOTIFICATION' }),
      footer: null,
      onCancel: () => {
        this.handleModal(false);
      },
    };
    return (
      <div style={{ marginTop: isPageHeader ? '5px' : '15px' }}>
        <Badge
          count={notificationCount}
          style={{ marginRight: '22px' }}
          onClick={() => this.handleModal(true)}
        >
          <Icon type="bell" style={{ marginRight: '25px', cursor: 'pointer', fontSize: '22px' }} />
        </Badge>
        {notificationVisibleFlag ? (
          <MobileModal modalOpts={modalOpts}>
            <UserNotificationView {...this.props} routerTo={this.routerTo} isMobile />
          </MobileModal>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default Notification;
