import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col } from 'antd';
import WrapperNotificationSearchForm from '../components/NotificationSearchForm';
import NotificationMgr from '@/pages/Notifications/components/NotificationMgr';

const mapStateToProps = store => {
  const { loading, bulletin } = store;
  return {
    notificationListLoading: loading.effects['bulletin/queryNotifications'],
    ...bulletin,
  };
};

@connect(mapStateToProps)
class bulletin extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bulletin/queryNotifications',
    });
    dispatch({
      type: 'bulletin/queryNotificationTypeList',
    });
    dispatch({
      type: 'bulletin/queryTargetTypeList',
    });
    dispatch({
      type: 'bulletin/queryStatusList',
    });
  }

  onSearch = param => {
    const { dispatch } = this.props;
    console.log(param);
    Object.keys(param).map(key => {
      if (param[key] === undefined) param[key] = '';
    });
    dispatch({
      type: 'bulletin/saveData',
      payload: {
        queryParams: { ...param },
        currentPage: 1,
        pageSize: 5,
      },
    });
    dispatch({
      type: 'bulletin/queryNotifications',
    });
  };

  onTableChange = pagination => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    dispatch({
      type: 'bulletin/save',
      payload: {
        currentPage: current,
        pageSize,
      },
    });
    dispatch({
      type: 'bulletin/queryNotifications',
    });
  };

  render() {
    const {
      currentPage,
      pageSize,
      totalSize,
      notificationList,
      notificationListLoading,
      notificationTypeList,
      targetTypeList,
      statusList,
    } = this.props;
    console.log(notificationTypeList);
    const notificationSearchParam = {
      types: notificationTypeList,
      targetTypes: targetTypeList,
      status: statusList,
      onSearch: param => this.onSearch(param),
    };

    const notificationMgrParam = {
      currentPage,
      pageSize,
      totalSize,
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

export default bulletin;
