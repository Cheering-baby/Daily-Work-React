import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import MediaQuery from 'react-responsive';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import WrapperNotificationSearchForm from '../components/NotificationSearchForm';
import NotificationMgr from '../components/NotificationMgr';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import SCREEN from '@/utils/screen';
import styles from '../index.less';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

const mapStateToProps = store => {
  const { loading, systemNotification } = store;
  return {
    notificationListLoading: loading.effects['systemNotification/queryNotificationList'],
    ...systemNotification,
  };
};

@connect(mapStateToProps)
class SystemNotification extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemNotification/queryNotificationList',
    });
  }

  onSearch = param => {
    const { dispatch, filter } = this.props;
    Object.keys(param).map(key => {
      if (param[key] === undefined) param[key] = '';
      return key;
    });
    dispatch({
      type: 'systemNotification/change',
      payload: {
        filter: { ...filter, ...param },
      },
    });
  };

  onTableChange = page => {
    const { dispatch, pagination } = this.props;
    if (page.current !== pagination.currentPage || page.pageSize !== pagination.pageSize) {
      pagination.currentPage = page.current;
      pagination.pageSize = page.pageSize;
      dispatch({
        type: 'systemNotification/change',
        payload: {
          pagination,
        },
      });
    }
  };

  onTableDetailChange = notificationInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/saveData',
      payload: {
        notificationInfo,
      },
    }).then(() => {
      dispatch({
        type: 'notification/fetchUpdateNotificationStatus',
        payload: {
          notificationId: notificationInfo.id,
          status: '01',
        },
      }).then(flag => {
        if (flag) {
          router.push({
            pathname: `/Notifications/SystemNotification/Detail/${notificationInfo.id}`,
          });
        }
      });
    });
  };

  render() {
    const {
      pagination: { currentPage, pageSize, totalSize },
      notificationList,
      notificationListLoading,
    } = this.props;
    const notificationSearchParam = {
      isAdminRoleFlag: hasAllPrivilege([
        'NOTIFICATION_SYSTEM_NOTIFICATION_LANDING_ADMIN_PRIVILEGE',
      ]),
      onSearch: param => this.onSearch(param),
    };

    const notificationMgrParam = {
      pagination: {
        currentPage,
        pageSize,
        totalSize,
      },
      notificationList,
      notificationListLoading,
      isAdminRoleFlag: false,
      onTableChange: pagination => this.onTableChange(pagination),
      onTableEditChange: () => {},
      onTableDetailChange: notificationInfo => this.onTableDetailChange(notificationInfo),
      onTableDelChange: () => {},
    };

    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_NOTIFICATIONS' }),
        url: '/Notifications/SystemNotification',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_SYSTEM_NOTIFICATIONS' }),
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
          <WrapperNotificationSearchForm {...notificationSearchParam} />
          <NotificationMgr {...notificationMgrParam} />
        </Col>
      </Row>
    );
  }
}

export default SystemNotification;
