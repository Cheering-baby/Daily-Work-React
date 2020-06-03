import React, { PureComponent } from 'react';
import { Card, Col, Row, Steps } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import styles from './ApprovalHistory.less';

const { Step } = Steps;

@connect(({ activityDetail }) => ({
  activityDetail,
}))
class ApprovalHistory extends PureComponent {
  render() {
    const {
      activityDetail: { historyHandlers, pendingHandlers },
    } = this.props;

    const steps = [];

    historyHandlers.map((historyHandler, index) => {
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
        key: index + 1,
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
        </div>
      );
      const stepDesc = (
        <div>
          <span>{pendingUsers.join(',')}</span>
        </div>
      );
      steps.push({
        stepsIcon,
        stepTitle,
        stepDesc,
        key: 0,
      });
    }

    return (
      <Col span={24} className={styles.activityCard}>
        <Card>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Col span={24}>
                <span className={styles.approveHeader}>
                  {' '}
                  {formatMessage({ id: 'APPROVAL_RESULT' })}
                </span>
              </Col>
              <Col className={styles.detailTitle}>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
                    <Steps current={1} direction="vertical" size="small">
                      {steps.map(step => (
                        <Step
                          title={step.stepTitle}
                          description={step.stepDesc}
                          icon={step.stepsIcon}
                          key={step.key}
                        />
                      ))}
                    </Steps>
                  </Col>
                </Row>
              </Col>
            </Col>
          </Row>
        </Card>
      </Col>
    );
  }
}

export default ApprovalHistory;
