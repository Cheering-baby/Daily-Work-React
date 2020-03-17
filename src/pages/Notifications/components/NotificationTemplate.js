import React, { PureComponent } from 'react';
import { Icon, Table, Form, Popover } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

@Form.create()
@connect(({ notification, loading }) => ({
  notification,
  queryLoading: loading.effects['notification/queryNotificationTemplateList'],
}))
class NotificationTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.column = [
      {
        title: this.showTableTitle(formatMessage({ id: 'NO' })),
        render: (text, record, index) => `${index + 1}`,
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
        title: this.showTableTitle(formatMessage({ id: 'TITLE' })),
        dataIndex: 'title',
        key: 'title',
        width: '30%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'OPERATION' })),
        width: '20%',
        render: (text, record) => (
          <div>
            <Popover
              content={<p>{record.content}</p>}
              placement="bottomRight"
              trigger="click"
              style={{ width: '400px !important' }}
              onVisibleChange={this.handleNotificationVisibleChange}
              title={record.title}
            >
              <a>View</a>
            </Popover>
          </div>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/queryTemplateList',
    });
  }

  showTableTitle = value => <span>{value}</span>;

  showTotalRender = total => (
    <div>
      <span>Total {total} items</span>
    </div>
  );

  onTableChange = page => {
    const { dispatch, pagination } = this.props;

    if (page.current !== pagination.currentPage || page.pageSize !== pagination.pageSize) {
      pagination.currentPage = page.current;
      pagination.pageSize = page.pageSize;
      dispatch({
        type: 'notification/change',
        payload: {
          pagination,
        },
      });
    }
  };

  render() {
    const {
      notification: {
        templateList,
        pagination: { currentPage, pageSize, totalSize },
      },
      queryLoading,
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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // todo save notificaton info
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    return (
      <Table
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        rowKey="index"
        bordered={false}
        dataSource={templateList}
        pagination={paginationConfig}
        columns={this.column}
        onChange={(pagination, filters, sorter, extra) => {
          this.onChangeEvent(pagination, filters, sorter, extra);
        }}
        loading={queryLoading}
      />
    );
  }
}

export default NotificationTemplate;
