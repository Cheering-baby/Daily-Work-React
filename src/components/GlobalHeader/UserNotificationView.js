import React, { PureComponent } from 'react';
import moment from 'moment';
import { Tabs, List } from 'antd';
import Spin from 'antd/es/spin';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ notificationMgr, system }) => ({
  notificationMgr,
  system,
}))
class UserNotificationView extends PureComponent {
  callback = key => {
    const { dispatch } = this.props;

    dispatch({
      type: 'notificationMgr/saveData',
      payload: {
        activeKey: key,
      },
    });
    if (key === '2') {
      dispatch({
        type: 'notificationMgr/querySystemList',
      });
    } else if (key === '3') {
      dispatch({
        type: 'notificationMgr/querybulletinList',
      });
    }
  };

  routerTo = () => {
    const {
      notificationMgr: { activeKey },
    } = this.props;
    if (activeKey === '1') {
      router.push('/Notifications/SystemNotification');
    } else if (activeKey === '2') {
      router.push('/Notifications/Bulletin');
    } else {
      router.push('/MyActivity');
    }
  };

  render() {
    const {
      systemList,
      systemCount,
      notificationMgr: { systemLoading, activeKey, bulletinList, bulletinLoading, bulletinCount },
    } = this.props;
    let system = systemList;

    if (systemList && systemList.length > 5) {
      system = systemList.slice(0, 5);
    }
    let count = 0;
    if (systemCount > 99) {
      count = `${99}+`;
    } else {
      count = systemCount;
    }

    let bulletin = bulletinList;
    if (bulletinList && bulletinList.length > 5) {
      bulletin = bulletinList.slice(0, 5);
    }
    let bcount = 0;
    if (bulletinCount > 99) {
      bcount = `${99}+`;
    } else {
      bcount = bulletinCount;
    }
    return (
      <Tabs activeKey={activeKey} onChange={this.callback} className={styles.userNotificationStyle}>
        <TabPane tab={`SYSTEM (${count})`} key="1">
          <Spin spinning={systemLoading}>
            <List
              itemLayout="horizontal"
              dataSource={system}
              size="small"
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={moment(item.createTime).format('DD-MMM-YYYY HH:mm:ss')}
                  />
                </List.Item>
              )}
            />
            {system && system.length >= 5 ? (
              <div className={styles.moreStyle}>
                <span onClick={this.routerTo}>More</span>
              </div>
            ) : null}
          </Spin>
        </TabPane>
        <TabPane tab={`PENDING APPROVAL (${count})`} key="2">
          <Spin spinning={systemLoading}>
            <List
              itemLayout="horizontal"
              dataSource={system}
              size="small"
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={moment(item.createTime).format('DD-MMM-YYYY HH:mm:ss')}
                  />
                </List.Item>
              )}
            />
            {system && system.length >= 5 ? (
              <div className={styles.moreStyle}>
                <span onClick={this.routerTo}>More</span>
              </div>
            ) : null}
          </Spin>
        </TabPane>
        <TabPane tab={`BULLETIN (${bcount})`} key="3">
          <Spin spinning={bulletinLoading}>
            <List
              itemLayout="horizontal"
              dataSource={bulletin}
              size="small"
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={moment(item.createTime).format('DD-MMM-YYYY HH:mm:ss')}
                  />
                </List.Item>
              )}
            />
            {bulletin && bulletin.length >= 5 ? (
              <div className={styles.moreStyle}>
                <span onClick={this.routerTo}>More</span>
              </div>
            ) : null}
          </Spin>
        </TabPane>
      </Tabs>
    );
  }
}

export default UserNotificationView;
