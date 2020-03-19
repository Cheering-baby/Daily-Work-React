import React, {PureComponent} from 'react';
import {Col, Form, Input, Popover, Row, Table} from 'antd';
import {connect} from 'dva';
import {formatMessage} from 'umi/locale';
import PaginationComp from './PaginationComp';
import {showTableTitle} from '../utils/pubUtils';
import styles from '../index.less';
import NotificationDetail from '@/pages/Notifications/components/NotificationDetail';

@Form.create()
@connect(({notification, loading}) => ({
  notification,
  queryLoading: loading.effects['notification/queryNotificationTemplateList'],
}))
class NotificationTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.column = [
      {
        title: showTableTitle(formatMessage({id: 'NO'})),
        key: 'id',
        dataIndex: 'id',
        width: '10%',
      },
      {
        title: showTableTitle(formatMessage({id: 'TITLE'})),
        dataIndex: 'title',
        key: 'title',
        width: '50%',
      },
      {
        title: showTableTitle(formatMessage({id: 'CATEGORISED'})),
        dataIndex: 'Categorised',
        key: 'View',
        width: '25%',
      },
      {
        title: showTableTitle(formatMessage({id: 'OPERATION'})),
        width: '15%',
        render: (text, record) => {
          const {
            notification: {templateViewVisible = false, templateId = null},
          } = this.props;
          return (
            <div>
              <Popover
                content={this.getTemplateContent(record)}
                placement="bottomRight"
                trigger="click"
                visible={templateViewVisible && String(templateId) === String(record.id)}
                style={{width: '400px !important'}}
                onVisibleChange={visible => this.handleTemplateVisibleChange(visible, record.id)}
                overlayClassName={styles.templatePopover}
              >
                <a>{formatMessage({id: 'VIEW'})}</a>
              </Popover>
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'notification/queryNotificationTemplateList',
    });
  }

  getTemplateContent = notificationInfo => {
    return <NotificationDetail notificationInfo={notificationInfo}/>;
  };

  showHtml = htmlString => {
    const html = {__html: htmlString};
    return <div dangerouslySetInnerHTML={html}/>;
  };

  handleTemplateVisibleChange = (visible, templateId) => {
    const {dispatch} = this.props;
    let newTemplateId;
    if (visible) {
      newTemplateId = templateId;
    }
    console.log('templateId: ', templateId);
    dispatch({
      type: 'notification/save',
      payload: {
        templateViewVisible: visible,
        templateId: newTemplateId,
      },
    });
  };

  onTableChange = (page, keyword) => {
    const {
      notification: {pagination},
    } = this.props;
    if (page.current !== pagination.currentPage || page.pageSize !== pagination.pageSize) {
      this.onSearch(page, keyword);
    }
  };

  onSearch = (page, keyword) => {
    const {
      dispatch,
      notification: {
        filter: {type},
        pagination,
      },
    } = this.props;
    pagination.currentPage = page.current;
    pagination.pageSize = page.pageSize;
    dispatch({
      type: 'notification/change',
      payload: {
        pagination,
        filter: {keyword, type},
      },
    });
  };

  render() {
    const {
      notification: {templateList, pagination},
      queryLoading,
    } = this.props;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const {
          dispatch,
          notification: {notificationInfo},
        } = this.props;
        if (selectedRows && selectedRows.length > 0) {
          notificationInfo.type = selectedRows[0].type;
          notificationInfo.title = selectedRows[0].title;
          notificationInfo.content = selectedRows[0].content;
          notificationInfo.fileList = selectedRows[0].fileList;
          notificationInfo.targetList = selectedRows[0].targetList;
        }
        dispatch({
          type: 'notification/saveData',
          payload: {
            visibleFlag: false,
            notificationInfo,
          },
        });
      },
    };
    const pageOpts = {
      total: pagination.totalSize,
      current: pagination.currentPage,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['5', '10', '15', '20'],
      pageChange: (page, pageSize) => {
        const {
          notification: {
            filter: {keyword},
          },
        } = this.props;
        this.onTableChange({current: page, pageSize}, keyword);
      },
    };
    const tableOpts = {
      pagination: false,
      footer: () => <PaginationComp {...pageOpts} />,
    };
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.searchTemplate}>
            <Input.Search
              allowClear
              placeholder={formatMessage({id: 'BTN_SEARCH'})}
              loading={queryLoading}
              onSearch={value => {
                const {
                  notification: {
                    pagination: {pageSize},
                  },
                } = this.props;
                this.onSearch({current: 1, pageSize}, value);
              }}
            />
          </Col>
        </Row>
        <Table
          size="small"
          className={`tabs-no-padding ${styles.searchTitle}`}
          columns={this.column}
          rowKey={record => `templateList${record.id}`}
          dataSource={templateList || []}
          scroll={{x: 660}}
          loading={queryLoading}
          rowSelection={{type: 'radio', ...rowSelection}}
          {...tableOpts}
        />
      </React.Fragment>
    );
  }
}

export default NotificationTemplate;
