import React, { Component } from 'react';
import { Col, Form, Row } from 'antd';
import { connect } from 'dva';
import TaRegistration from './TASignUpDetailForRegistrationInformation/TaRegistration';
import FileUpload from '@/pages/MyActivity/components/TASignUpDetail/TASignUpDetailForRegistrationInformation/FileUpload';
import styles from './index.less';

@Form.create()
@connect(({ taSignUpDetail }) => ({
  taSignUpDetail,
}))
class TASignUpDetail extends Component {
  state = {
    downFileLoadingFlag: false,
  };

  componentDidMount() {}

  render() {
    const {
      taSignUpDetail: { otherInfo = {}, customerInfo = {} },
    } = this.props;
    const { downFileLoadingFlag = false } = this.state;
    return (
      <Col lg={24} md={24} id="SubTASignUpDetail">
        <Col span={24} className={styles.activityCard}>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              {customerInfo && customerInfo.companyInfo && (
                <FileUpload
                  companyInfo={customerInfo.companyInfo}
                  downFileLoadingFlag={downFileLoadingFlag}
                  updateDownFileLoading={val => this.setState(val)}
                />
              )}
              <TaRegistration otherInfo={otherInfo} customerInfo={customerInfo} />
            </Col>
          </Row>
        </Col>
      </Col>
    );
  }
}

export default TASignUpDetail;
