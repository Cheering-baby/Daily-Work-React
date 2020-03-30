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
import { isNvl } from '@/utils/utils';

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
    this.onSearch({});
  }

  onSearch = param => {
    const { dispatch, filter } = this.props;
    if (param) {
      Object.keys(param).map(key => {
        if (isNvl(param[key])) param[key] = null;
        return key;
      });
    }
    const reqParams = { ...filter, ...param };
    const isAdminRoleFlag = false;
    if (!isAdminRoleFlag) {
      reqParams.queryType = '02';
    } else {
      reqParams.queryType = '01';
    }
    dispatch({
      type: 'systemNotification/change',
      payload: {
        filter: { ...reqParams },
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
      router.push({
        pathname: `/Notifications/SystemNotification/Detail/${notificationInfo.id}`,
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
      isAdminRoleFlag: false,
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
