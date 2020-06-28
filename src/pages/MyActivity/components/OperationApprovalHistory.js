import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Col, Row, Steps } from 'antd';
import styles from './OperationApprovalHistory.less';
import {isNvl} from "@/utils/utils";

const { Step } = Steps;

@connect(({ activityDetail }) => ({
  activityDetail,
}))
class OperationApprovalHistory extends PureComponent {

  getTargetDesc = (targetList) => {
    const taList = targetList.filter(item => item.targetType === '01').map(item => item.targetObjName);
    const roleList = targetList.filter(item => item.targetType === '02').map(item => item.targetObjName);
    const userList = targetList.filter(item => item.targetType === '03').map(item => item.targetObjName);
    const subTaList = targetList.filter(item => item.targetType === '04').map(item => item.targetObjName);
    return (<dev>
      {roleList && roleList.length > 0 ? <div><span>Role: {roleList.join(',')}</span></div> : null}
      {userList && userList.length > 0 ? <div><span>User: {userList.join(',')}</span></div> : null}
      {taList && taList.length > 0 ? <div><span>Travel Agent: {taList.join(',')}</span></div> : null}
      {subTaList && subTaList.length > 0 ? <div><span>Sub Travel Agent: {subTaList .join(',')}</span></div> : null}
    </dev>)
  };

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

    const pendingTarget = [];
    let statusName1 = '';
    pendingHandlers.map(pendingHandler => {
      pendingTarget.push({
        targetType: pendingHandler.targetType,
        targetObjName: isNvl(pendingHandler.targetObjName) ? pendingHandler.targetObj: pendingHandler.targetObjName,
      });      const { statusName } = pendingHandler;
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

      const stepDesc = this.getTargetDesc(pendingTarget);

      steps.push({
        stepsIcon,
        stepTitle,
        stepDesc,
        key: 0,
      });
    }
    return (
      <React.Fragment>
        <Col className={styles.detailTitle}>
          <Row>
            <Col span={24}>
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
      </React.Fragment>
    );
  }
}

export default OperationApprovalHistory;
