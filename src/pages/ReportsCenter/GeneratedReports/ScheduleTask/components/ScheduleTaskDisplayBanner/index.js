import { Button, Card, Col, Icon, message, Modal, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import {
  PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK_EDIT,
  PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK_LOG,
  PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK_NEW,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/scheduleTaskPath';
import ScheduleTaskTable from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskTable';
import ScheduleTaskCalendar from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskCalendar';
import ScheduleTaskDetailDrawer from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskDetailDrawer';
import { REPORT_TYPE_MAP } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/authority';
import { PAGE_SIZE } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/common';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

const ScheduleTaskDisplayBanner = props => {
  const {
    history,
    dispatch,
    scheduleTask: { reportTypeOptions = [], detailFormItems },
  } = props;
  const [calendarMode, setCalendarMode] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState();
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (!calendarMode && reportTypeOptions.length > 0) {
      dispatch({
        type: 'scheduleTask/fetchScheduleTaskLogList',
        payload: {
          currentPage: 1,
          pageSize: PAGE_SIZE,
        },
      });
    }
  }, [calendarMode]);

  const viewTaskDetail = task => {
    setDrawerVisible(true);
    setSelectedReportType(task.reportType);
    dispatch({
      type: 'scheduleTask/fetchScheduleTaskDetail',
      payload: { jobLogCode: task.jobLogCode },
    });
  };

  const editTask = task => {
    history.push({
      pathname: PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK_EDIT,
      query: { jobCode: task.jobCode, reportType: task.reportType, editTask: task.reportType },
    });
  };

  const disableTask = task => {
    Modal.confirm({
      title: 'Are you sure to disable the task?',
      okText: 'Yes',
      okType: 'Default',
      cancelText: 'No',
      autoFocusButton: 'cancel',
      onOk() {
        dispatch({
          type: 'scheduleTask/disableScheduleTask',
          payload: { jobCode: task.jobCode, jobLogId: task.jobLogCode },
        }).then(res => {
          if (res) {
            dispatch({
              type: 'scheduleTask/fetchScheduleTaskLogList',
            });
            message.success('Disabled scheduled task successfully.');
          } else {
            message.warn('Failed to disable scheduled task.');
          }
        });
      },
    });
  };

  const viewTaskLog = task => {
    history.push({
      pathname: PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK_LOG,
      query: {
        jobCode: task.jobCode,
        reportType: task.reportType,
        parentTaskId: task.jobLogCode,
        reportType2: task.reportType,
      },
    });
  };

  const operation = { viewTaskDetail, editTask, disableTask, viewTaskLog };

  const hasReportPrivFlag = useMemo(() => {
    const keys = Object.keys(REPORT_TYPE_MAP);
    let flag = false;
    keys.forEach(k => {
      if (hasAllPrivilege([REPORT_TYPE_MAP[k]])) {
        flag = true;
      }
    });
    return flag;
  }, [hasAllPrivilege]);

  return (
    <>
      <Card className={styles.card}>
        <Row>
          <Col span={24} className={styles.spaceBetween}>
            <Button
              style={{ width: 80, zIndex: 999 }}
              type="primary"
              htmlType="button"
              onClick={() => {
                if (!hasReportPrivFlag) {
                  message.warn(
                    'You do not have permission to schedule any reports. Please contact manager to grant related permissions.',
                    5
                  );
                  return;
                }
                history.push({
                  pathname: PATH_REPORT_CENTER_GENERATED_SCHEDULE_TASK_NEW,
                });
              }}
            >
              {' '}
              New
            </Button>
            <Button
              style={{ width: 80, zIndex: 999, boxShadow: 'none' }}
              className={styles.noBorder}
              onClick={() => {
                setCalendarMode(preState => {
                  const updateState = !preState;
                  dispatch({
                    type: 'scheduleTask/updateState',
                    payload: {
                      calendarOptions: { isCalendar: updateState },
                    },
                  });
                  return updateState;
                });
              }}
            >
              {calendarMode ? <Icon type="unordered-list" /> : <Icon type="calendar" />}
              Switch
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {calendarMode ? (
              <ScheduleTaskCalendar {...props} operation={operation} />
            ) : (
              <ScheduleTaskTable {...props} operation={operation} />
            )}
          </Col>
        </Row>
      </Card>
      <ScheduleTaskDetailDrawer
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        reportType={selectedReportType}
        detailFormItems={detailFormItems}
      />
    </>
  );
};
export default ScheduleTaskDisplayBanner;
