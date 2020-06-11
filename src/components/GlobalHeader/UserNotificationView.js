import React, { PureComponent } from 'react';
import moment from 'moment';
import { List, Spin, Tabs, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import {  hasAnyPrivilege } from '@/utils/PrivilegeUtil';

const { TabPane } = Tabs;

class UserNotificationView extends PureComponent {
  render() {
    const {
      notificationMgr: {
        systemNotificationList,
        systemNotificationCount,
        pendingActivityList,
        pendingActivityCount,
        bulletinList,
        bulletinCount,
        circularList,
        circularCount,
        bellNotificationLoading,
      },
      isMobile,
      routerTo,
    } = this.props;
    return (
      <Tabs className={styles.userNotificationStyle} style={{ width: isMobile ? 'auto' : '430px' }}>
        <TabPane
          tab={`${formatMessage({ id: 'NOTICE_SYSTEM' })} (${systemNotificationCount})`}
          key="1"
        >
          <Spin spinning={bellNotificationLoading}>
            <List
              itemLayout="horizontal"
              dataSource={systemNotificationList}
              size="small"
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Tooltip title={item.title}>{item.title}</Tooltip>}
                    description={moment(item.createTime).format('DD-MMM-YYYY HH:mm:ss')}
                  />
                </List.Item>
              )}
            />
            {systemNotificationCount >= 5 ? (
              <div className={styles.moreStyle}>
                <span onClick={() => routerTo('1')}>{formatMessage({ id: 'NOTICE_MORE' })}</span>
              </div>
            ) : null}
          </Spin>
        </TabPane>
        <TabPane
          tab={`${formatMessage({ id: 'NOTICE_PENDING_APPROVAL' })} (${pendingActivityCount})`}
          key="2"
        >
          <Spin spinning={bellNotificationLoading}>
            <List
              itemLayout="horizontal"
              dataSource={pendingActivityList}
              size="small"
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Tooltip title={item.title}>{item.title}</Tooltip>}
                    description={moment(item.createTime).format('DD-MMM-YYYY HH:mm:ss')}
                  />
                </List.Item>
              )}
            />
            {pendingActivityCount >= 5 ? (
              <div className={styles.moreStyle}>
                <span onClick={() => routerTo('2')}>{formatMessage({ id: 'NOTICE_MORE' })}</span>
              </div>
            ) : null}
          </Spin>
        </TabPane>
        {hasAnyPrivilege(["NOTIFICATION_BELL_BULLETIN_PRIVILEGE"]) && (
          <TabPane tab={`${formatMessage({ id: 'NOTICE_BULLETIN' })} (${bulletinCount})`} key="3">
            <Spin spinning={bellNotificationLoading}>
              <List
                itemLayout="horizontal"
                dataSource={bulletinList}
                size="small"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Tooltip title={item.title}>{item.title}</Tooltip>}
                      description={moment(item.createTime).format('DD-MMM-YYYY HH:mm:ss')}
                    />
                  </List.Item>
                )}
              />
              {bulletinCount >= 5 ? (
                <div className={styles.moreStyle}>
                  <span onClick={() => routerTo('3')}>{formatMessage({ id: 'NOTICE_MORE' })}</span>
                </div>
              ) : null}
            </Spin>
          </TabPane>
        )}
        {hasAnyPrivilege(["NOTIFICATION_BELL_CIRCULAR_PRIVILEGE"]) && (
          <TabPane tab={`${formatMessage({ id: 'NOTICE_CIRCULAR' })} (${circularCount})`} key="4">
            <Spin spinning={bellNotificationLoading}>
              <List
                itemLayout="horizontal"
                dataSource={circularList}
                size="small"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Tooltip title={item.title}>{item.title}</Tooltip>}
                      description={moment(item.createTime).format('DD-MMM-YYYY HH:mm:ss')}
                    />
                  </List.Item>
                )}
              />
              {circularCount >= 5 ? (
                <div className={styles.moreStyle}>
                  <span onClick={() => routerTo('4')}>{formatMessage({ id: 'NOTICE_MORE' })}</span>
                </div>
              ) : null}
            </Spin>
          </TabPane>
        )}
      </Tabs>
    );
  }
}

export default UserNotificationView;
