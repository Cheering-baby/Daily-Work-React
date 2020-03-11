import React, { PureComponent } from 'react';
import { Card, Icon, Tooltip, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../index.less';

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
        dataIndex: 'targetObject',
        key: 'targetObject',
        width: '15%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'FILE' })),
        dataIndex: 'file',
        key: 'file',
        width: '10%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'TYPE' })),
        dataIndex: 'type',
        key: 'type',
        width: '10%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'STATUS' })),
        dataIndex: 'status',
        key: 'status',
        width: '15%',
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

  render() {
    const {
      currentPage,
      pageSize,
      totalSize,
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
