import React from 'react';
import { Card, Col, Icon, Popover, Row, Tag, Tooltip } from 'antd';
import styles from './index.less';
import { ScheduleTaskStatusBadge } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskTable';
import {
  CRON_TYPE_BACKGROUD_COLOR_MAP,
  CRON_TYPE_COLOR_MAP,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/scheduledTaskCronType';

const PopContent = ({ task, isDrawer = false, operation }) => {
  const { reportName, cronType, status } = task;
  const { viewTaskDetail, editTask, disableTask, viewTaskLog } = operation;
  const color = CRON_TYPE_COLOR_MAP[cronType];
  const backgroundColor = CRON_TYPE_BACKGROUD_COLOR_MAP[cronType];
  const containerClassName = isDrawer ? styles.drawerCard : null;
  const cardClassName = !isDrawer ? styles.noBorder : null;
  const cardStyle = isDrawer
    ? {
        fontSize: 18,
        borderLeft: `2px solid ${color}`,
        backgroundColor,
        color,
      }
    : null;
  const banFlag = task.status === 'Inactive';
  const adhocFlag = task.cronType === 'Ad-hoc' && task.status !== 'Pending';
  return (
    <div className={containerClassName}>
      <Card
        className={cardClassName}
        actions={[
          <Tooltip title="View Details">
            <Icon
              type="eye"
              key="eye"
              onClick={() => {
                viewTaskDetail(task);
              }}
            />
          </Tooltip>,
          <Tooltip title="Operation Status">
            <Icon
              type="file"
              key="file"
              onClick={() => {
                viewTaskLog(task);
              }}
            />
          </Tooltip>,
          <Tooltip title="Edit Task">
            <Icon
              type="edit"
              key="edit"
              className={banFlag || adhocFlag ? styles.ban : undefined}
              onClick={() => {
                if (banFlag || adhocFlag) return;
                editTask(task);
              }}
            />
          </Tooltip>,
          <Tooltip title="Disable">
            <Icon
              type="stop"
              key="stop"
              className={banFlag || adhocFlag ? styles.ban : undefined}
              onClick={() => {
                if (banFlag || adhocFlag) return;
                disableTask(task);
              }}
            />
          </Tooltip>,
        ]}
        style={cardStyle}
      >
        <Row style={{ marginBottom: 5 }}>{reportName}</Row>
        <Row type="flex" justify="space-between">
          <Col>
            <Tag color={CRON_TYPE_COLOR_MAP[cronType]} className={styles.cronType}>
              {cronType}
            </Tag>
          </Col>
          <Col>
            <ScheduleTaskStatusBadge status={status} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const ReportCard = ({ task, operation, isDrawer = false, selected = false }) => {
  const { reportName, cronType, status } = task;
  const color = CRON_TYPE_COLOR_MAP[cronType];
  const backgroundColor = CRON_TYPE_BACKGROUD_COLOR_MAP[cronType];

  return (
    <>
      {selected ? (
        <PopContent isDrawer task={task} operation={operation} />
      ) : (
        <Card hoverable>
          <div
            className={styles.border}
            style={{
              fontSize: 18,
              borderLeft: `2px solid ${color}`,
              backgroundColor,
              color,
            }}
          >
            <Row
              style={
                isDrawer
                  ? { marginLeft: 5, padding: '15px 10px 15px 5px' }
                  : { marginLeft: 5, padding: 3 }
              }
            >
              <Col span={isDrawer ? 18 : 24} className={styles.ellipsis}>
                <span className={styles.reportName}>{reportName}</span>
              </Col>
              {isDrawer && (
                <Col span={6} style={{ textAlign: 'right' }}>
                  <ScheduleTaskStatusBadge status={status} />
                </Col>
              )}
            </Row>
          </div>
        </Card>
      )}
    </>
  );
};

const ScheduleTaskRecordCard = ({ isDrawer = false, selected = false, task, operation }) => {
  const { reportName } = task;
  return (
    <div className={styles.popoverCard} style={{ marginBottom: 10 }}>
      {isDrawer ? (
        <ReportCard task={task} operation={operation} isDrawer selected={selected} />
      ) : (
        <Popover
          overlayStyle={{ width: 300 }}
          overlayClassName={styles.popover}
          placement="rightTop"
          content={
            <div>
              <PopContent task={task} operation={operation} key={reportName} />
            </div>
          }
        >
          <div>
            <ReportCard task={task} operation={operation} />
          </div>
        </Popover>
      )}
    </div>
  );
};

export default ScheduleTaskRecordCard;
