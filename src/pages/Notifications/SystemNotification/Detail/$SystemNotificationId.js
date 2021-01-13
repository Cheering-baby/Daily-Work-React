import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import NotificationDetail from '../../components/NotificationDetail';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const { notificationInfo, filter } = store.notification;
  const { pagePrivileges = [] } = store.global;
  return {
    pagePrivileges,
    notificationInfo,
    filter,
  };
};

@connect(mapStateToProps)
class SystemNotificationDetail extends PureComponent {
  
  componentDidMount() {
    this.fetchNotificationDetail();
  }

  componentWillUnmount() {
    const { dispatch, filter } = this.props;
    dispatch({
      type: 'systemNotification/save',
      payload: {
        filter: {
          ...filter,
          notificationId: undefined,
        },
      },
    });
  }

  async fetchNotificationDetail() {
    const {
      dispatch,
      filter,
      location: { pathname },
    } = this.props;
    const notificationId = pathname ? pathname.match(/\d+/g) : null;

    if (Array.isArray(notificationId) && notificationId.length > 0) {
      dispatch({
        type: 'systemNotification/save',
        payload: {
          filter: {
            ...filter,
            notificationId: notificationId[0],
          },
        },
      });

      const notificationList = await dispatch({
        type: 'systemNotification/queryNotificationList',
      });
      if (Array.isArray(notificationList) && notificationList.length > 0) {
        const matchNotificationInfo = notificationList.find(
          i => i.id.toString() === notificationId[0]
        );
        await dispatch({
          type: 'notification/save',
          payload: { notificationInfo: matchNotificationInfo || {} },
        });

        if (
          !isNvl(matchNotificationInfo) &&
          !isNvl(matchNotificationInfo.currentReceiver) &&
          String(matchNotificationInfo.currentReceiver.status) === '02'
        ) {
          dispatch({
            type: 'notification/fetchUpdateNotificationStatus',
            payload: {
              notificationId: matchNotificationInfo.id,
              status: '01',
            },
          });
        }
      }
    }
  }

  render() {
    const { notificationInfo } = this.props;
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_NOTIFICATIONS' }),
        url: '/Notifications/SystemNotification',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_SYSTEM_NOTIFICATIONS' }),
        url: '/Notifications/SystemNotification',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_DETAIL' }),
        url: null,
      },
    ];

    return (
      <Row type="flex" justify="space-around">
        <Col span={24} className={styles.pageHeaderTitle}>
          <MediaQuery
            maxWidth={SCREEN.screenMdMax}
            minWidth={SCREEN.screenSmMin}
            minHeight={SCREEN.screenSmMin}
          >
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
          <MediaQuery minWidth={SCREEN.screenLgMin}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
        </Col>
        <Col span={24}>
          <NotificationDetail notificationInfo={notificationInfo} />
        </Col>
      </Row>
    );
  }
}

export default SystemNotificationDetail;
