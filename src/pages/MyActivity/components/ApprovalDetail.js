import React from 'react';
import { Card, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import detailStyles from './ApprovalDetail.less';
import TASignUpDetails from './TASignUpDetails';
import ARApplyDetails from '@/pages/TAManagement/MyWallet/components/ARApplyDetails';

@Form.create()
@connect(({ activityDetail }) => ({
  activityDetail,
}))
class ApprovalDetail extends React.PureComponent {
  handleInitVal = key => {
    const { activityDetail } = this.props;
    return activityDetail[key];
  };

  render() {
    const { activityTplCode, businessId, activityDetail } = this.props;
    return (
      <Col span={24} id="signUpView">
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <div className={detailStyles.titleHeader}>
                    <span>{formatMessage({ id: 'TA_REGISTRATION_INFORMATION' })}</span>
                  </div>
                  {activityTplCode && activityTplCode === 'TA-SIGN-UP' ? (
                    <TASignUpDetails businessId={businessId} />
                  ) : null}
                  {activityTplCode && activityTplCode === 'ACCOUNT_AR_APPLY' ? (
                    <ARApplyDetails businessId={businessId} activityDetail={activityDetail} />
                  ) : null}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default ApprovalDetail;
