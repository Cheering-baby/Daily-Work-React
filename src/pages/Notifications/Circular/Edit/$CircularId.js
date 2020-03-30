import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import NotificationEdit from '@/pages/Notifications/components/NotificationEdit';
import styles from './index.less';

const mapStateToProps = store => {
  const { notificationInfo } = store.notification;
  const { pagePrivileges = [] } = store.global;
  return {
    pagePrivileges,
    notificationInfo,
  };
};

@connect(mapStateToProps)
class CircularEdit extends PureComponent {
  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_NOTIFICATIONS' }),
        url: '/Notifications/Circular',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_CIRCULAR' }),
        url: '/Notifications/Circular',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_EDIT' }),
        url: null,
      },
    ];
    const { notificationInfo } = this.props;
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
          <NotificationEdit
            type="EDIT"
            notificationType="02"
            notificationId={notificationInfo.id}
          />
        </Col>
      </Row>
    );
  }
}

export default CircularEdit;
