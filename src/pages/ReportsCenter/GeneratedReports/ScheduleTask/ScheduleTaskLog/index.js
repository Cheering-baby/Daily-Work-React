import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Spin, Table, Tooltip } from 'antd';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import {
  PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK,
  SCHEDULE_TASK,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/scheduleTaskPath';
import ResponsivePagination from '@/components/ResponsivePagination';
import { ScheduleTaskStatusBadge } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskTable';
import { PAGE_SIZE } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/common';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import SCREEN from '@/utils/screen';

const waterMarkProps = {
  id: 'watermark',
  style: { width: '100%', height: '100%' },
  className: styles['watermark-box'],
};

const renderContent = text => (
  <Tooltip title={text} placement="topLeft">
    <div className={styles.ellipsis}>{text}</div>
  </Tooltip>
);

const mapStateToProps = ({ scheduleTask, loading }) => ({
  scheduleTask,
  loadingFlag: loading.effects['scheduleTask/fetchScheduleTaskLogList'],
});

const ScheduleTaskLog = props => {
  const {
    dispatch,
    loadingFlag = false,
    location: {
      query: { parentTaskId, reportType = '' },
    },
    scheduleTask: {
      basicTable: { totalSize, pageSize = PAGE_SIZE, currentPage, dataList },
    },
  } = props;

  // const menus = [
  //   { name: REPORT_CENTER },
  //   { name: GENERATED_REPORTS },
  //   { name: SCHEDULE_TASK, href: `#${PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK}` },
  //   { name: reportType },
  // ];

  const breadcrumbArr = [
    {
      breadcrumbName: formatMessage({ id: 'REPORT_CENTER' }),
      url: null,
    },
    {
      breadcrumbName: formatMessage({ id: 'MENU_REPORTS' }),
      url: null,
    },
    {
      breadcrumbName: formatMessage({ id: 'SCHEDULE_TASK' }),
      url: `${PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK}`,
    },
    {
      breadcrumbName: `${SCHEDULE_TASK}`,
      url: null,
    },
  ];

  const fetchDataList = payload => {
    dispatch({
      type: 'scheduleTask/fetchScheduleTaskLogList',
      payload,
    });
  };

  useEffect(() => {
    fetchDataList({
      filterOptions: { parentTaskId },
      calendarOptions: { isCalendar: false },
    });
  }, []);

  const columns = [
    {
      key: 'no',
      title: 'No.',
      dataIndex: 'no',
      render: (text, row, index) => index + (currentPage - 1) * pageSize + 1,
    },
    {
      key: 'reportsName',
      title: 'Reports Name',
      dataIndex: 'reportsName',
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
      key: 'generatedDate',
      title: 'Generated Date',
      dataIndex: 'generatedDate',
      sorter: true,
      render: renderContent,
    },
    {
      key: 'remarks',
      title: 'Remarks',
      dataIndex: 'remarks',
      render: renderContent,
    },
  ];

  return (
    <>
      <div {...waterMarkProps}>
        <Row>
          <MediaQuery
            maxWidth={SCREEN.screenMdMax}
            minWidth={SCREEN.screenSmMin}
            minHeight={SCREEN.screenSmMin}
          >
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
          <MediaQuery minWidth={SCREEN.screenLgMin}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
        </Row>
        <Row style={{ marginLeft: 10, marginRight: 10 }}>
          <Spin spinning={loadingFlag}>
            <Card
              className={styles.card}
              title={<span className={styles.title}>{reportType.toUpperCase()}</span>}
            >
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
            </Card>
          </Spin>
        </Row>
      </div>
    </>
  );
};

export default connect(mapStateToProps)(ScheduleTaskLog);
