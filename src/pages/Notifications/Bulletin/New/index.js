import React from 'react';
import {Col, Row} from 'antd';
import {connect} from 'dva';
import MediaQuery from 'react-responsive';
import {formatMessage} from 'umi/locale';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import NotificationEdit from '../../components/NotificationEdit';
import 'react-quill/dist/quill.snow.css';
import styles from './index.less';

const mapStateToProps = store => {
  const {notificationInfo} = store.notification;
  const {pagePrivileges = []} = store.global;
  return {
    pagePrivileges,
    notificationInfo,
  };
};

@connect(mapStateToProps)
class BulletinNew extends React.PureComponent {
  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({id: 'MENU_NOTIFICATIONS'}),
        url: '/Notifications/Bulletin',
      },
      {
        breadcrumbName: formatMessage({id: 'MENU_BULLETIN'}),
        url: '/Notifications/Bulletin',
      },
      {
        breadcrumbName: formatMessage({id: 'MENU_NEW'}),
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
            <BreadcrumbComp breadcrumbArr={breadcrumbArr}/>
          </MediaQuery>
          <MediaQuery minWidth={SCREEN.screenLgMin}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr}/>
          </MediaQuery>
        </Col>
        <Col span={24}>
          <NotificationEdit type="NEW" notificationType="01"/>
        </Col>
      </Row>
    );
  }
}

export default BulletinNew;
