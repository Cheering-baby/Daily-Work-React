import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col } from 'antd';
import WrapperNotificationSearchForm from '../components/NotificationSearchForm';
import NotificationMgr from '@/pages/Notifications/components/NotificationMgr';

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
    const { dispatch } = this.props;
    Object.keys(param).map(key => {
      if (param[key] === undefined) param[key] = '';
      return key;
    });
    dispatch({
      type: 'systemNotification/change',
      payload: {
        filter: { ...param },
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

  render() {
    const {
      pagination: { currentPage, pageSize, totalSize },
      notificationList,
      notificationListLoading,
    } = this.props;
    const notificationSearchParam = {
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
      onTableChange: pagination => this.onTableChange(pagination),
    };

    return (
      <Col lg={24} md={24} id="">
        <WrapperNotificationSearchForm {...notificationSearchParam} />
        <NotificationMgr {...notificationMgrParam} />
      </Col>
    );
  }
}

export default SystemNotification;
