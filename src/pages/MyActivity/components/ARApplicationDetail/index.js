import React from 'react';
import { formatMessage } from 'umi/locale';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import DetailForFileInformation from '@/components/DetailForFileInformation';
import TaRegistration from '../TASignUpDetail/TASignUpDetailForRegistrationInformation/TaRegistration';
// import MainTravelAgentDetail from './MainTravelAgentDetail'

import styles from './index.less';

@connect(({ taSignUpDetail }) => ({
  taSignUpDetail,
}))
class ARApplicationDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch,
      taSignUpDetail: { customerInfo },
    } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    dispatch({
      type: 'commonSignUpDetail/queryCityList',
      payload: { countryId: companyInfo.country },
    });
    dispatch({
      type: 'commonSignUpDetail/queryCityList',
      payload: { countryId: companyInfo.country, isBil: true },
    });
  }

  render() {
    const {
      taSignUpDetail: { otherInfo = {}, customerInfo = {} },
    } = this.props;
    const { activityDetail = {} } = this.props;
    const { activityInfo = {} } = activityDetail;
    const { content = '' } = activityInfo;
    const contentObj = content ? JSON.parse(content) : [];
    return (
      <React.Fragment>
        <Col lg={24} md={24} className={styles.container}>
          <Col span={24}>
            <Card>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <span className={styles.titleHeader}>
                    {formatMessage({ id: 'AR_APPLY_INFORMATION' })}
                  </span>
                </Col>
              </Row>
              <DetailForFileInformation
                ifLongLayout
                fileTxt={`${formatMessage({ id: 'AR_CREDIT_LIMIT' })  }:`}
                fileKeys={{
                  labelName: 'fileName',
                  labelPath: 'filePath',
                  labelSourceName: 'fileSourceName',
                }}
                fileList={contentObj.uploadFiles || null}
                beforeDown={() => {}}
                afterDown={() => {}}
              />
            </Card>
          </Col>
        </Col>
        <TaRegistration otherInfo={otherInfo} customerInfo={customerInfo} />
      </React.Fragment>
    );
  }
}

export default ARApplicationDetail;
