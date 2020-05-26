import { Badge, Card, Col, Dropdown, Icon, Menu, message, Modal, Row, Table, Tooltip } from 'antd';
import React from 'react';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import ResponsivePagination from '@/pages/ReportCenter/components/ResponsivePagination';
import {
  PAGE_SIZE,
  PATH_PAMS_REPORT_SCHEDULED_TASKS_NEW,
} from '@/pages/ReportCenter/consts/pamsReport';
import CryptoAES from '@/pages/ReportCenter/PamsReport/utils/cryptoAES';

const STATUS_MAP = {
  Well: '#5CB85C',
  Failed: '#D9534F',
};

const TableComponent = ({
  history,
  dispatch,
  scheduledTasks: {
    taskTable: { totalSize, pageSize = PAGE_SIZE, currentPage, dataList },
  },
}) => {
  const renderContent = text => (
    <Tooltip title={text} placement="topLeft">
      <div className={styles.ellipsis}>{text}</div>
    </Tooltip>
  );

  const OverlayMenu = row => (
    <Menu>
      <Menu.Item
        onClick={() => {
          Modal.confirm({
            title: 'Are you sure to delete the task?',
            okText: 'Yes',
            okType: 'Default',
            cancelText: 'No',
            autoFocusButton: 'cancel',
            onOk() {
              dispatch({
                type: 'scheduledTasks/deleteScheduledTask',
                payload: { id: row.id },
              }).then(res => {
                if (res) {
                  dispatch({
                    type: 'scheduledTasks/fetchScheduledTaskList',
                  });
                  message.success('Deleted scheduled task successfully.');
                } else {
                  message.warn('Failed to delete scheduled task.');
                }
              });
            },
          });
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      key: 'reportName',
      title: formatMessage({ id: 'REPORT_NAME' }),
      dataIndex: 'reportName',
      render: renderContent,
    },
    {
      key: 'status',
      title: formatMessage({ id: 'STATUS' }),
      dataIndex: 'status',
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <div className={styles.ellipsis}>
            <Badge
              dot
              style={{
                backgroundColor: STATUS_MAP[text] || '#5CB85C',
                marginRight: '5px',
                marginTop: '2px',
                zIndex: 0,
              }}
            />
            &nbsp;
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      key: 'receiver',
      title: formatMessage({ id: 'RECEIVER' }),
      dataIndex: 'receiver',
      render: renderContent,
    },
    {
      key: 'lastSendTime',
      title: formatMessage({ id: 'LAST_SEND_TIME' }),
      dataIndex: 'lastSendTime',
      render: renderContent,
    },
    {
      key: 'operation',
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
      render: (text, row) => (
        <>
          <Tooltip placement="top" title="View Detail">
            <Icon
              type="eye"
              onClick={() => {
                const _crypto = CryptoAES.Encrypt(`${row.id},DETAIL,${row.reportName}`);
                history.push({
                  pathname: PATH_PAMS_REPORT_SCHEDULED_TASKS_NEW,
                  query: { _crypto },
                });
              }}
            />
          </Tooltip>
          <Tooltip placement="top" title="Edit Task">
            <Icon
              type="edit"
              onClick={() => {
                const _crypto = CryptoAES.Encrypt(`${row.id},EDIT,${row.reportName}`);
                history.push({
                  pathname: PATH_PAMS_REPORT_SCHEDULED_TASKS_NEW,
                  query: { _crypto },
                });
              }}
            />
          </Tooltip>
          <Dropdown overlay={OverlayMenu(row)} placement="bottomCenter">
            <Icon type="ellipsis" />
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <>
      <Row style={{ marginTop: '10px' }}>
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={dataList}
          scroll={{ x: true }}
          pagination={false}
          className={styles.tableStyles}
          rowKey={r => r.key}
        />
      </Row>
      <Row style={{ marginTop: '10px', textAlign: 'right' }}>
        <ResponsivePagination
          totalSize={totalSize}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(current, size) => {
            dispatch({
              type: 'scheduledTasks/fetchScheduledTaskList',
              payload: {
                currentPage: current,
                pageSize: size,
              },
            });
          }}
        />
      </Row>
    </>
  );
};

const ScheduledTasksTableBanner = props => {
  return (
    <>
      <Card className={styles.card}>
        <Row>
          <Col span={24}>
            <TableComponent {...props} />
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default ScheduledTasksTableBanner;
