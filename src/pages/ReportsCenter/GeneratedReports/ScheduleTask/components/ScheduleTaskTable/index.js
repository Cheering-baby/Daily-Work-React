import { Badge, Dropdown, Icon, Menu, Row, Table, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import styles from './index.less';
import { PAGE_SIZE } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/common';
import ResponsivePagination from '@/components/ResponsivePagination';
import STATUS_COLOR_MAP from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/scheduleTaskStatus';

export const ScheduleTaskStatusBadge = ({ status }) => {
  const backgroundColor = useMemo(() => STATUS_COLOR_MAP[status], [status]);
  return (
    <Tooltip title={status}>
      <div className={styles.ellipsis}>
        <Badge dot style={{ backgroundColor, marginRight: '5px', marginTop: '2px', zIndex: 0 }} />
        &nbsp;
        {status}
      </div>
    </Tooltip>
  );
};

const ScheduleTaskTable = ({
  dispatch,
  scheduleTask: {
    basicTable: { totalSize, pageSize = PAGE_SIZE, currentPage, dataList },
  },
  operation: { viewTaskDetail, editTask, disableTask, viewTaskLog },
}) => {
  const renderContent = text => (
    <Tooltip title={text} placement="topLeft">
      <div className={styles.ellipsis}>{text}</div>
    </Tooltip>
  );

  const OverlayMenu = row => (
    <Menu>
      <Menu.Item
        disabled={
          row.status === 'Inactive' || (row.cronType === 'Ad-hoc' && row.status !== 'Pending')
        }
        onClick={() => {
          disableTask(row);
        }}
      >
        Disable
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          viewTaskLog(row);
        }}
      >
        Operation Status
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      key: 'no',
      title: 'No.',
      dataIndex: 'no',
      render: (text, row, index) => index + (currentPage - 1) * pageSize + 1,
    },
    {
      key: 'scheduleReportName',
      title: 'Schedule Report Name',
      dataIndex: 'scheduleReportName',
      sorter: true,
      className: styles.reportNameColumn,
    },
    {
      key: 'reportType',
      title: 'Report Type',
      dataIndex: 'reportType',
      sorter: true,
      className: styles.reportNameColumn,
    },
    {
      key: 'cronType',
      title: 'Report Frequency',
      dataIndex: 'cronType',
      sorter: true,
      render: renderContent,
    },
    {
      key: 'updateBy',
      title: 'Last Modified By',
      dataIndex: 'updateBy',
      sorter: true,
      render: renderContent,
    },
    {
      key: 'generationDateTime',
      title: 'Schedule Date Time',
      dataIndex: 'generationDateTime',
      sorter: true,
      render: renderContent,
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      render: text => <ScheduleTaskStatusBadge status={text} />,
    },
    {
      key: 'operation',
      title: 'Operation',
      dataIndex: 'operation',
      render: (text, row) => {
        const banFlag = row.status === 'Inactive';
        const adhocFlag = row.cronType === 'Ad-hoc' && row.status !== 'Pending';
        return (
          <>
            <Tooltip placement="top" title="View Detail">
              <Icon
                type="eye"
                onClick={() => {
                  viewTaskDetail(row);
                }}
              />
            </Tooltip>
            <Tooltip placement="top" title="Edit Task">
              <Icon
                type="edit"
                className={(banFlag || adhocFlag) ? styles.ban : undefined}
                onClick={() => {
                  if (banFlag || adhocFlag) return;
                  editTask(row);
                }}
              />
            </Tooltip>
            <Dropdown overlay={OverlayMenu(row)} placement="bottomCenter">
              <Icon type="ellipsis" />
            </Dropdown>
          </>
        );
      },
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
          onChange={(pagination, filters, sorter) => {
            dispatch({
              type: 'scheduleTask/fetchScheduleTaskLogList',
              payload: { sortOptions: { [sorter.field]: sorter.order } },
            });
          }}
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
              type: 'scheduleTask/fetchScheduleTaskLogList',
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

export default ScheduleTaskTable;
