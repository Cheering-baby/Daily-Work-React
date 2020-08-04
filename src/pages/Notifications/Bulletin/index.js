import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import MediaQuery from 'react-responsive';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import WrapperNotificationSearchForm from '../components/NotificationSearchForm';
import NotificationMgr from '../components/NotificationMgr';
import SCREEN from '@/utils/screen';
import styles from '../index.less';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const { loading, bulletin } = store;
  return {
    notificationListLoading: loading.effects['bulletin/queryNotificationList'],
    ...bulletin,
  };
};

@connect(mapStateToProps)
class bulletin extends PureComponent {
  componentDidMount() {
    this.onSearch({});
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bulletin/clear',
      payload: {},
    });
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
    const isAdminRoleFlag = hasAllPrivilege(['NOTIFICATION_BULLETIN_MANAGE_PRIVILEGE']);
    if (!isAdminRoleFlag) {
      reqParams.queryType = '02';
    } else {
      reqParams.queryType = null;
    }
    dispatch({
      type: 'bulletin/search',
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
        type: 'bulletin/change',
        payload: {
          pagination,
        },
      });
    }
  };

  onTableAddChange = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/saveData',
      payload: {
        notificationInfo: {},
      },
    }).then(() => {
      router.push({ pathname: `/Notifications/Bulletin/New` });
    });
  };

  onTableEditChange = notificationInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/saveData',
      payload: {
        notificationInfo,
      },
    }).then(() => {
      router.push({ pathname: `/Notifications/Bulletin/Edit/${notificationInfo.id}` });
    });
  };

  onTableDetailChange = notificationInfo => {
    const { dispatch } = this.props;
    const isAdminRoleFlag = hasAllPrivilege(['NOTIFICATION_BULLETIN_MANAGE_PRIVILEGE']);
    dispatch({
      type: 'notification/saveData',
      payload: {
        notificationInfo,
        isAdminRoleFlag,
      },
    }).then(() => {
      router.push({ pathname: `/Notifications/Bulletin/Detail/${notificationInfo.id}` });
    });
  };

  onTableDelChange = notificationInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/fetchDeleteNotification',
      payload: {
        notificationId: notificationInfo.id,
      },
    }).then(flag => {
      if (flag) {
        this.onSearch({});
      }
    });
  };

  batchRead = notificationIdList => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/batchUpdateNotificationStatus',
      payload: {
        notificationIdList,
      },
    }).then(() => {
      this.onSearch({});
    });
  };

  render() {
    const {
      pagination: { currentPage, pageSize, totalSize },
      notificationList,
      notificationListLoading,
    } = this.props;
    const notificationSearchParam = {
      isAdminRoleFlag: hasAllPrivilege(['NOTIFICATION_BULLETIN_MANAGE_PRIVILEGE']),
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
      isAdminRoleFlag: hasAllPrivilege(['NOTIFICATION_BULLETIN_MANAGE_PRIVILEGE']),
      onTableChange: pagination => this.onTableChange(pagination),
      onTableAddChange: () => this.onTableAddChange(),
      onTableEditChange: notificationInfo => this.onTableEditChange(notificationInfo),
      onTableDetailChange: notificationInfo => this.onTableDetailChange(notificationInfo),
      onTableDelChange: notificationInfo => this.onTableDelChange(notificationInfo),
      onBatchRead: notificationIdList => this.batchRead(notificationIdList),
    };
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_NOTIFICATIONS' }),
        url: '/Notifications/Bulletin',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_BULLETIN' }),
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

export default bulletin;
