import React from 'react';
import { Card, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import SubTaRegistration from '@/pages/MyActivity/components/SubTASignUpDetail/SubTaDetailForRegistrationInformation/SubTaRegistration';

@Form.create()
@connect(({ subTaSignUpDetail }) => ({
  subTaSignUpDetail,
}))
class SubTASignUpDetail extends React.PureComponent {
  componentDidMount() {}

  render() {
    const {
      subTaSignUpDetail: { subTaInfo = {} },
    } = this.props;
    return (
      <React.Fragment>
        <Col lg={24} md={24} id="SubTASignUpDetail">
          <Col span={24} className={styles.activityCard}>
            <Card>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <SubTaRegistration subTaInfo={subTaInfo} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Col>
      </React.Fragment>
    );
  }
}

export default SubTASignUpDetail;
