import React, { PureComponent } from 'react';
import { Badge, Button, Card, Col, Icon, Modal, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import PaginationComp from '@/components/PaginationComp';
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
          width: '8%',
          dataIndex: 'index',
          key: 'index',
          render: (text, record, index) => `${index + 1}`,
        },
        {
          title: showTableTitle(formatMessage({ id: 'TITLE' })),
          dataIndex: 'title',
          key: 'title',
          width: '30%',
          render: text => {
            return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
          },
        },
        {
          title: showTableTitle(formatMessage({ id: 'TARGET_OBJECT' })),
          dataIndex: 'targetList',
          key: 'targetList',
          width: '15%',
          render: targetList => {
            let text = '';
            if (targetList && targetList.length > 0) {
              targetList.map(target => {
                if (isNvl(text)) {
                  text += !isNvl(target.targetObjName) ? `${target.targetObjName}` : '';
                } else {
                  text += !isNvl(target.targetObjName) ? `,${target.targetObjName}` : '';
                }
                return target;
              });
            }
            return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
          },
        },
        {
          title: showTableTitle(formatMessage({ id: 'FILE' })),
          dataIndex: 'fileList',
          key: 'fileList',
          width: '12%',
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
          width: '13%',
          render: text => {
            let statusStr;
            let statusTxt;
            // 01: Draft
            // 02: Pending (Schedule Release)
            // 03: Published
            switch (String(text).toLowerCase()) {
              case '01':
                statusStr = 'default';
                statusTxt = formatMessage({ id: 'NOTICE_STATUS_DRAFT' });
                break;
              case '02':
                statusStr = 'success';
                statusTxt = formatMessage({ id: 'NOTICE_STATUS_PUBLISHED' });
                break;
              case '03':
                statusStr = 'warning';
                statusTxt = formatMessage({ id: 'NOTICE_STATUS_PENDING' });
                break;
              default:
                statusStr = 'default';
                statusTxt = formatMessage({ id: 'NOTICE_STATUS_DRAFT' });
                break;
            }
            return <Badge status={statusStr} text={statusTxt || null} />;
          },
        },
        {
          title: showTableTitle(formatMessage({ id: 'PUBLISHED_DATE' })),
          dataIndex: 'scheduleDate',
          key: 'scheduleDate',
          width: '22%',
          render: text => {
            return !isNvl(text) ? moment(text).format('DD-MMM-YYYY HH:mm:ss') : '-';
          },
        },
        {
          title: showTableTitle(formatMessage({ id: 'OPERATION' })),
          width: '12%',
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
                (record.status === '03' &&
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
                (record.status === '03' &&
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
        title: <span style={{ marginLeft: 12 }}>{formatMessage({ id: 'NO' })}</span>,
        key: 'id',
        dataIndex: 'id',
        width: '10%',
        render: (text, record) => {
          const { currentReceiver } = record;
          if (currentReceiver) {
            const { status = '01' } = currentReceiver;
            if (status === '02') {
              return (
                <div>
                  <div className={styles.statusRadiusStyle} style={{ background: '#118AFA' }} />
                  {text}
                </div>
              );
            }
          }
          return <span style={{ marginLeft: 12 }}>{text}</span>;
        },
      },
      {
        title: showTableTitle(formatMessage({ id: 'TITLE' })),
        dataIndex: 'title',
        key: 'title',
        width: '40%',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: showTableTitle(formatMessage({ id: 'PUBLISHED_TIME' })),
        dataIndex: 'scheduleDate',
        key: 'scheduleDate',
        width: '25%',
        render: text => {
          return !isNvl(text) ? moment(text).format('DD-MMM-YYYY HH:mm:ss') : '-';
        },
      },
      {
        title: showTableTitle(formatMessage({ id: 'FILE' })),
        dataIndex: 'fileList',
        key: 'fileList',
        width: '15%',
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
                          <Tooltip title={item.fileSourceName}>
                            <div className={styles.fileListItemName}>{item.fileSourceName}</div>
                          </Tooltip>
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

  showRowClassName = record => {
    const { currentReceiver } = record;
    if (currentReceiver) {
      const { status = '01' } = currentReceiver;
      if (status === '02') {
        return styles.tableSpanStyle;
      }
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
          rowClassName={record => this.showRowClassName(record)}
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
