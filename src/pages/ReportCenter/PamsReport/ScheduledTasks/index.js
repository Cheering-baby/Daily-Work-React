import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Button, Col, Row, Spin, Tooltip } from 'antd';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import BreadcrumbComp from '@/pages/ReportCenter/components/BreadcrumbComp';

import SCREEN from '@/utils/screen';
import {
  PAGE_SIZE,
  PATH_PAMS_REPORT_SCHEDULED_TASKS_NEW,
} from '@/pages/ReportCenter/consts/pamsReport';
import ScheduledTasksFilterBanner from '@/pages/ReportCenter/PamsReport/ScheduledTasks/components/ScheduledTasksFilterBanner';
import ScheduledTasksTableBanner from '@/pages/ReportCenter/PamsReport/ScheduledTasks/components/ScheduledTasksTableBanner';

const mapStateToProps = ({ scheduledTasks, loading }) => ({
  scheduledTasks,
  loadingFlag:
    loading.effects['scheduledTasks/fetchScheduledTaskList'] ||
    loading.effects['scheduledTasks/fetchScheduledTaskDetail'] ||
    loading.effects['scheduledTasks/createScheduledTask'] ||
    loading.effects['scheduledTasks/updateScheduledTask'] ||
    loading.effects['scheduledTasks/deleteScheduledTask'],
  fetchReceiverListLoadingFlag: loading.effects['scheduledTasks/fetchReceiverList'],
});

const breadcrumbArr = [
  { breadcrumbName: formatMessage({ id: 'REPORT_CENTER' }) },
  { breadcrumbName: formatMessage({ id: 'PAMS' }) },
  {
    breadcrumbName: formatMessage({ id: 'SCHEDULED_TASKS' }),
  },
];

const ScheduledTasks = props => {
  const {
    dispatch,
    loadingFlag = false,
    history,
    scheduledTasks: { selectedReceivers },
  } = props;

  useEffect(() => {
    dispatch({ type: 'scheduledTasks/fetchScheduledTaskList' });
  }, [dispatch]);

  const handleSearch = (filterOptions = {}) => {
    Object.assign(filterOptions, { selectedReceivers });
    dispatch({
      type: 'scheduledTasks/fetchScheduledTaskList',
      payload: {
        filterOptions,
      },
    });
  };

  const handleReset = () => {
    dispatch({
      type: 'scheduledTasks/fetchScheduledTaskList',
      payload: {
        filterOptions: {},
        currentPage: 1,
        pageSize: PAGE_SIZE,
      },
    });
    dispatch({
      type: 'scheduledTasks/updateState',
      payload: {
        selectedReceivers: [],
      },
    });
  };

  const NewButton = (
    <Tooltip title="New Scheduled Task">
      <Button
        style={{ marginLeft: 10, marginRight: 20, width: 80 }}
        type="primary"
        htmlType="button"
        onClick={() => {
          history.push({
            pathname: PATH_PAMS_REPORT_SCHEDULED_TASKS_NEW,
          });
        }}
      >
        New
      </Button>
    </Tooltip>
  );

  return (
    <>
      <Row>
        <Col span={20} xs={24} sm={24} md={20} className={styles.pageHeaderTitle}>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
        </Col>
        <Col span={4} xs={24} sm={24} md={4} style={{ textAlign: 'right' }}>
          {NewButton}
        </Col>
        <Col span={24} style={{ marginTop: '10px' }}>
          <Spin spinning={loadingFlag}>
            <ScheduledTasksFilterBanner
              {...props}
              handleSearch={handleSearch}
              handleReset={handleReset}
            />
          </Spin>
        </Col>
        <Col span={24} style={{ marginTop: '10px' }}>
          <Spin spinning={loadingFlag}>
            <ScheduledTasksTableBanner {...props} />
          </Spin>
        </Col>
      </Row>
    </>
  );
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(ScheduledTasks);
