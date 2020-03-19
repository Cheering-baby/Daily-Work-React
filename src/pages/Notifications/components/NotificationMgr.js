import React, { PureComponent } from 'react';
import { Badge, Button, Card, Col, Icon, Modal, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import PaginationComp from './PaginationComp';
import { isNvl } from '@/utils/utils';
import { showTableTitle } from '../utils/pubUtils';
import styles from '../index.less';

const colProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

class NotificationMgr extends PureComponent {
  static defaultProps = {
    onTableChange: () => {},
  };

  getColumn = isAdminRoleFlag => {
    if (isAdminRoleFlag) {
      return [
        {
          title: showTableTitle(formatMessage({ id: 'NO' })),
          key: 'id',
          dataIndex: 'id',
          width: '10%',
        },
        {
          title: showTableTitle(formatMessage({ id: 'TITLE' })),
          dataIndex: 'title',
          key: 'title',
          width: '30%',
          render: text => {
            return !isNvl(text) ? text : '-';
          },
        },
        {
          title: showTableTitle(formatMessage({ id: 'TARGET_OBJECT' })),
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
          title: showTableTitle(formatMessage({ id: 'FILE' })),
          dataIndex: 'fileList',
          key: 'fileList',
          width: '10%',
          render: fileList => {
            return !isNvl(fileList) && fileList.length > 0 ? (
              <div className={styles.fileListLenInfo}>
                <span>
                  <div className={styles.fileListLenItemName}>{fileList.length}</div>
                  <Icon type="paper-clip" className={styles.fileListLenInfoPaperClip} />
                </span>
              </div>
            ) : (
              '-'
            );
          },
        },
        {
          title: showTableTitle(formatMessage({ id: 'TYPE' })),
          dataIndex: 'type',
          key: 'type',
          width: '10%',
          render: type => {
            if (type === '01') {
              return formatMessage({ id: 'TYPE_BULLETIN' });
            }
            if (type === '02') {
              return formatMessage({ id: 'TYPE_CIRCULAR' });
            }
            if (type === '03') {
              return formatMessage({ id: 'TYPE_ACTIVITY' });
            }
            if (type === '04') {
              return formatMessage({ id: 'TYPE_SYSTEM_NOTIFICATIONS' });
            }
            return type;
          },
        },
        {
          title: showTableTitle(formatMessage({ id: 'STATUS' })),
          dataIndex: 'status',
          key: 'status',
          width: '15%',
          render: text => {
            let statusStr = 'default';
            let statusTxt = '';
            // 01: Draft
            // 02: Pending (Schedule Release)
            // 03: Published
            switch (String(text).toLowerCase()) {
              case '01':
                statusStr = 'default';
                statusTxt = formatMessage({ id: 'STATUS_DRAFT' });
                break;
              case '02':
                statusStr = 'warning';
                statusTxt = formatMessage({ id: 'STATUS_PENDING' });
                break;
              case '03':
                statusStr = 'success';
                statusTxt = formatMessage({ id: 'STATUS_PUBLISHED' });
                break;
              default:
                statusStr = 'default';
                statusTxt = formatMessage({ id: 'STATUS_DRAFT' });
                break;
            }
            return <Badge status={statusStr} text={statusTxt || null} />;
          },
        },
        {
          title: showTableTitle(formatMessage({ id: 'OPERATION' })),
          width: '10%',
          render: (text, record) => (
            <div>
              <Tooltip title="detail">
                <Icon
                  type="eye"
                  className={styles.iconClass}
                  onClick={event => {
                    this.handleIconClick('detail', record, event);
                  }}
                />
              </Tooltip>
              {record.subType === '01' &&
              (record.status === '01' ||
                (record.status === '02' &&
                  moment(record.scheduleDate, 'YYYY-MM-DD HH:mm:ss') >= moment())) ? (
                    <Tooltip title="edit">
                      <Icon
                        type="edit"
                        className={styles.iconClass}
                        onClick={event => {
                      this.handleIconClick('edit', record, event);
                    }}
                      />
                    </Tooltip>
              ) : null}
              {record.subType === '01' &&
              (record.status === '01' ||
                (record.status === '02' &&
                  moment(record.scheduleDate, 'YYYY-MM-DD HH:mm:ss') >= moment())) ? (
                    <Tooltip title="delete">
                      <Icon
                        type="delete"
                        className={styles.iconClass}
                        onClick={event => {
                      this.handleIconClick('delete', record, event);
                    }}
                      />
                    </Tooltip>
              ) : null}
            </div>
          ),
        },
      ];
    }
    return [
      {
        title: showTableTitle(formatMessage({ id: 'NO' })),
        key: 'id',
        dataIndex: 'id',
        width: '10%',
      },
      {
        title: showTableTitle(formatMessage({ id: 'TITLE' })),
        dataIndex: 'title',
        key: 'title',
        width: '40%',
        render: text => {
          return !isNvl(text) ? text : '-';
        },
      },
      {
        title: showTableTitle(formatMessage({ id: 'PUBLISHED_TIME' })),
        dataIndex: 'currentReceiver',
        key: 'currentReceiver',
        width: '15%',
        render: text => {
          return !isNvl(text) && !isNvl(text.publishTime) ? text.publishTime : '-';
        },
      },
      {
        title: showTableTitle(formatMessage({ id: 'FILE' })),
        dataIndex: 'fileList',
        key: 'fileList',
        width: '25%',
        render: (text, record) => {
          return (
            <Col span={24}>
              <div className={styles.fileList}>
                {record &&
                  record.fileList &&
                  record.fileList.length > 0 &&
                  record.fileList.map(item => (
                    <div key={String(item.number) + Math.random()} className={styles.fileListItem}>
                      <div className={styles.fileListItemInfo}>
                        <span>
                          <Icon type="paper-clip" className={styles.fileListItemInfoPaperClip} />
                          <div className={styles.fileListItemName}>{item.fileName}</div>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </Col>
          );
        },
      },
      {
        title: showTableTitle(formatMessage({ id: 'OPERATION' })),
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip title="detail">
              <Icon
                type="eye"
                className={styles.iconClass}
                onClick={event => {
                  this.handleIconClick('detail', record, event);
                }}
              />
            </Tooltip>
          </div>
        ),
      },
    ];
  };

  onChangeEvent = pagination => {
    const { onTableChange } = this.props;
    onTableChange(pagination);
  };

  add = e => {
    e.preventDefault();
    const { onTableAddChange } = this.props;
    onTableAddChange();
  };

  handleIconClick = (type, notificationInfo, e) => {
    e.preventDefault();
    const { onTableEditChange, onTableDetailChange, onTableDelChange } = this.props;
    if (String(type).toLowerCase() === 'detail') {
      onTableDetailChange(notificationInfo);
    }
    if (String(type).toLowerCase() === 'edit') {
      onTableEditChange(notificationInfo);
    }
    if (String(type).toLowerCase() === 'delete') {
      Modal.confirm({
        title: formatMessage({ id: 'NOTIFICATIONS_DEL_MENU_CONFIRM' }),
        okText: formatMessage({ id: 'COMMON_YES' }),
        cancelText: formatMessage({ id: 'COMMON_NO' }),
        icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
        onOk: () => {
          onTableDelChange(notificationInfo);
        },
      });
    }
  };

  render() {
    const {
      pagination,
      notificationList,
      notificationListLoading,
      isAdminRoleFlag = false,
    } = this.props;

    const pageOpts = {
      total: pagination.totalSize,
      current: pagination.currentPage,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['5', '10', '15', '20'],
      pageChange: (page, pageSize) => {
        this.onChangeEvent({ current: page, pageSize });
      },
    };

    const tableOpts = {
      pagination: false,
      footer: () => <PaginationComp {...pageOpts} />,
    };

    return (
      <Card className={`as-shadow no-border ${styles.tableCardClass}`}>
        {isAdminRoleFlag && (
          <Row gutter={24}>
            <Col {...colProps} className={styles.tableCardClassCol}>
              <Button type="primary" onClick={e => this.add(e)}>
                {formatMessage({ id: 'COMMON_NEW' })}
              </Button>
            </Col>
          </Row>
        )}
        <Table
          size="small"
          className={`tabs-no-padding ${styles.searchTitle}`}
          columns={this.getColumn(isAdminRoleFlag)}
          rowKey={record => `notificationList${record.id}`}
          dataSource={notificationList}
          loading={notificationListLoading}
          scroll={{ x: 660 }}
          {...tableOpts}
        />
      </Card>
    );
  }
}

export default NotificationMgr;
