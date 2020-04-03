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
  const { notificationInfo } = store.notification;
  const { pagePrivileges = [] } = store.global;
  return {
    pagePrivileges,
    notificationInfo,
  };
};

@connect(mapStateToProps)
class SystemNotificationDetail extends PureComponent {
  componentDidMount() {
    const { dispatch, notificationInfo } = this.props;
    if (
      !isNvl(notificationInfo) &&
      !isNvl(notificationInfo.currentReceiver) &&
      String(notificationInfo.currentReceiver.status) === '02'
    ) {
      dispatch({
        type: 'notification/fetchUpdateNotificationStatus',
        payload: {
          notificationId: notificationInfo.id,
          status: '01',
        },
      });
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