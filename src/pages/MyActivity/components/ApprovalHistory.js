import React, { PureComponent } from 'react';
import { Col, Row, Steps, Collapse, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import styles from './ApprovalHistory.less';

const { Step } = Steps;
const { Panel } = Collapse;

@connect(({ activityDetail }) => ({
  activityDetail,
}))
class ApprovalHistory extends PureComponent {
  render() {
    const {
      activityDetail: { historyHandlers, pendingHandlers },
    } = this.props;

    const approveHeader = (
      <div className={styles.approveHeader}>
        <div className="left">{formatMessage({ id: 'APPROVAL_HISTORY' })}</div>
        <div className="right">{formatMessage({ id: 'COMMON_EXPAND' })}</div>
      </div>
    );

    const steps = [];
    historyHandlers.map(historyHandler => {
      const stepsIcon = (
        <div
          className={
            historyHandler.status === '05' ? styles.rejectCircleStyle : styles.approveCircleStyle
          }
        />
      );
      const stepTitle = (
        <div className={styles.stepTitle}>
          <span className={styles.approveStyle}>{historyHandler.statusName}</span>
          <span>
            {historyHandler.statusTime
              ? moment(historyHandler.statusTime).format('DD-MMM-YYYY HH:mm')
              : ''}
          </span>
        </div>
      );
      const stepDesc = (
        <div>
          <span>{historyHandler.userCode}</span>
          {historyHandler.reason ? (
            <p className={styles.stepReason}>{historyHandler.reason}</p>
          ) : (
            ''
          )}
        </div>
      );
      steps.push({
        stepsIcon,
        stepTitle,
        stepDesc,
      });
      return historyHandler;
    });

    const pendingUsers = [];
    let statusName1 = '';
    pendingHandlers.map(pendingHandler => {
      pendingUsers.push(pendingHandler.userName);
      const { statusName } = pendingHandler;
      statusName1 = statusName;
      return pendingHandler;
    });

    if (pendingHandlers.length > 0) {
      const stepsIcon = <div className={styles.pendingCircleStyle} />;
      const stepTitle = (
        <div className={styles.stepTitle}>
          <span className={styles.approveStyle}>{statusName1}</span>
          <span>{pendingUsers.join(',')}</span>
        </div>
      );

      steps.push({
        stepsIcon,
        stepTitle,
        stepDesc: '',
      });
    }

    return (
      <React.Fragment>
        <Collapse
          expandIconPosition="right"
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => (
            <Icon type="down" rotate={isActive ? 0 : 180} style={{ color: '#1890FF' }} />
          )}
        >
          <Panel header={approveHeader} className={styles.DetailTitle} key="1">
            <Row>
              <Col span={14} offset={4}>
                <Steps current={1} direction="vertical" size="small">
                  {steps.map(step => (
                    <Step
                      title={step.stepTitle}
                      description={step.stepDesc}
                      icon={step.stepsIcon}
                    />
                  ))}
                </Steps>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default ApprovalHistory;
