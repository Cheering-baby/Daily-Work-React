import { Badge, Dropdown, Icon, Menu, Row, Table, Tooltip } from 'antd';
import React, { useMemo, useState, Component } from 'react';
import { Resizable } from 'react-resizable';
// import Moveable from "react-moveable";
import styles from './index.less';
import { PAGE_SIZE } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/common';
import ResponsivePagination from '@/components/ResponsivePagination';
import STATUS_COLOR_MAP from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/scheduleTaskStatus';

const ResizeableTitle = props => {
  const { setResize, onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      onResizeStart={() => setResize(true)}
      onResizeStop={() => setResize(false)}
    >
      <th {...restProps} />
    </Resizable>
  );
};

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

const columnsInitial = [
  {
    key: 'no',
    title: 'No.',
    dataIndex: 'no',
    width: 50,
  },
  {
    key: 'scheduleReportName',
    title: 'Scheduled Report Name',
    dataIndex: 'scheduleReportName',
    sorter: true,
    className: styles.reportNameColumn,
    width: 200,
  },
  {
    key: 'reportType',
    title: 'Report Type',
    dataIndex: 'reportType',
    sorter: true,
    className: styles.reportNameColumn,
    width: 150,
  },
  {
    key: 'cronType',
    title: 'Report Frequency',
    dataIndex: 'cronType',
    sorter: true,
    width: 160,
  },
  {
    key: 'updateBy',
    title: 'Last Modified By',
    dataIndex: 'updateBy',
    sorter: true,
    width: 150,
  },
  {
    key: 'generationDateTime',
    title: 'Scheduled Date Time',
    dataIndex: 'generationDateTime',
    sorter: true,
    width: 200,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    render: text => <ScheduleTaskStatusBadge status={text} />,
  },
  {
    key: 'operation',
    title: 'Operation',
    dataIndex: 'operation',
  },
];

class ScheduleTaskTable extends Component {
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      resize: false,
      columns: columnsInitial,
    };
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const {
      dispatch,
      scheduleTask: {
        basicTable: { totalSize, pageSize = PAGE_SIZE, currentPage, dataList },
      },
      operation: { viewTaskDetail, editTask, disableTask, viewTaskLog },
    } = this.props;
    const { resize, columns } = this.state;

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

    const columnsShow = columns.map((i, zIndex) => {
      i.onHeaderCell = column => ({
        width: column.width,
        setResize: value =>
          this.setState({
            resize: value,
          }),
        onResize: this.handleResize(zIndex),
        minConstraints: column.minConstraints ? column.minConstraints : [60, 50],
      });
      if (i.dataIndex === 'no') {
        return {
          ...i,
          render: (text, row, index) => index + (currentPage - 1) * pageSize + 1,
        };
      }
      if (i.dataIndex === 'operation') {
        return {
          ...i,
          render: (text, row) => {
            const banFlag = row.status === 'Inactive';
            const adhocFlag = row.cronType === 'Ad-hoc' && row.status !== 'Pending';
            return (
              <div style={{ width: '100px' }}>
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
                    className={banFlag || adhocFlag ? styles.ban : undefined}
                    onClick={() => {
                      if (banFlag || adhocFlag) return;
                      editTask(row);
                    }}
                  />
                </Tooltip>
                <Dropdown overlay={OverlayMenu(row)} placement="bottomCenter">
                  <Icon type="ellipsis" />
                </Dropdown>
              </div>
            );
          },
        };
      }
      return i;
    });
    return (
      <>
        <Row style={{ marginTop: '10px' }}>
          <Table
            bordered
            size="small"
            columns={columnsShow}
            dataSource={dataList}
            scroll={{ x: 1050 }}
            onChange={(pagination, filters, sorter) => {
              if (!resize) {
                dispatch({
                  type: 'scheduleTask/fetchScheduleTaskLogList',
                  payload: { sortOptions: { [sorter.field]: sorter.order } },
                });
              }
            }}
            pagination={false}
            className={`${styles.tableStyles} ${resize ? styles.resize : null}`}
            rowKey={r => r.key}
            components={this.components}
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
  }
}

export default ScheduleTaskTable;
