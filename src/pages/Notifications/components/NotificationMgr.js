import React, { PureComponent } from 'react';
import { Card, Icon, Tooltip, Table, Col, Button, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import styles from '../index.less';

const colProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

class NotificationMgr extends PureComponent {
  state = {
    currentIndex: 1,
  };

  static defaultProps = {
    onTableChange: () => {},
  };

  constructor(props) {
    super(props);
    this.column = [
      {
        title: this.showTableTitle(formatMessage({ id: 'NO' })),
        render: (text, record, index) => {
          // eslint-disable-next-line react/destructuring-assignment
          return <span>{(this.state.currentIndex - 1) * 10 + (index + 1)}</span>;
        },
        key: 'index',
        width: '10%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'TITLE' })),
        dataIndex: 'title',
        key: 'title',
        width: '30%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'TARGET_OBJECT' })),
        dataIndex: 'targetList',
        key: 'targetList',
        width: '15%',
        render: targetList => {
          let text = '';
          targetList.map(target => {
            text += target.targetObj;
            return target;
          });
          return text;
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'FILE' })),
        dataIndex: 'fileList',
        key: 'fileList',
        width: '10%',
        render: fileList => {
          let text = '';
          fileList.map(file => {
            text += file.fileName;
            return file;
          });
          return text;
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'TYPE' })),
        dataIndex: 'type',
        key: 'type',
        width: '10%',
        render: type => {
          if (type === '01') {
            return 'Bulletin';
          }

          if (type === '02') {
            return 'Circular';
          }

          if (type === '03') {
            return 'Activity';
          }

          if (type === '04') {
            return 'System Notification';
          }
          return type;
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'STATUS' })),
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: text => {
          let flagClass = '';
          let statusName = '';
          if (text === '01' || text === '03') {
            flagClass = styles.flagStyle1;
            statusName = 'draft';
          }
          if (text === '02') {
            flagClass = styles.flagStyle2;
            statusName = 'publish';
          }
          if (text === '03') {
            flagClass = styles.flagStyle3;
            statusName = 'pending';
          }
          return (
            <div>
              <span className={flagClass} />
              {statusName}
            </div>
          );
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'OPERATION' })),
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip title="detail">
              <Icon
                type="eye"
                className={styles.iconClass}
                onClick={event => {
                  this.handleIconClick('detail', record, event, 'CXM');
                }}
              />
            </Tooltip>
            {record.subType === '01' ? (
              <Tooltip title="edit">
                <Icon
                  type="edit"
                  className={styles.iconClass}
                  onClick={event => {
                    this.handleIconClick('detail', record, event, 'CXM');
                  }}
                />
              </Tooltip>
            ) : null}
            {record.subType === '01' ? (
              <Tooltip title="delete">
                <Icon
                  type="delete"
                  className={styles.iconClass}
                  onClick={event => {
                    this.handleIconClick('detail', record, event, 'CXM');
                  }}
                />
              </Tooltip>
            ) : null}
          </div>
        ),
      },
    ];
  }

  onChangeEvent = pagination => {
    const { onTableChange } = this.props;
    onTableChange(pagination);
  };

  showTableTitle = value => <span>{value}</span>;

  showTotalRender = total => (
    <div>
      <span>Total {total} items</span>
    </div>
  );

  add = e => {
    e.preventDefault();
    router.push({
      pathname: `/Notifications/Bulletin/New`,
    });
  };

  render() {
    const {
      pagination: { currentPage, pageSize, totalSize },
      notificationList,
      notificationListLoading,
    } = this.props;

    const paginationConfig = {
      current: currentPage,
      pageSize,
      total: totalSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['5', '10', '15', '20'],
      showTotal: total => this.showTotalRender(total),
    };
    return (
      <Card className="as-shadow no-border">
        <Row gutter={24}>
          <Col {...colProps} style={{ padding: '12px' }}>
            <Button type="primary" onClick={e => this.add(e)}>
              {formatMessage({ id: 'COMMON_NEW' })}
            </Button>
          </Col>
        </Row>
        <Table
          rowKey="index"
          bordered={false}
          dataSource={notificationList}
          pagination={paginationConfig}
          columns={this.column}
          onChange={(pagination, filters, sorter, extra) => {
            this.onChangeEvent(pagination, filters, sorter, extra);
          }}
          loading={notificationListLoading}
        />
      </Card>
    );
  }
}

export default NotificationMgr;
