import React, { PureComponent } from 'react';
import { Breadcrumb, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import OrgTree from './components/OrgTree';
import OrgInformation from './components/OrgInformation';
import OrgOperDrawer from './components/OrgOperDrawer';
import styles from './index.less';

@connect()
class OrgManagement extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'orgManagement/queryUserOrgTree',
      payload: {
        orgCode: 'TEST_TA_1',
      },
    });
  }

  render() {
    return (
      <Col lg={24} md={24} id="watermark">
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className={styles.breadCrumbStyle}>
            {formatMessage({ id: 'SYSTEM_MANAGEMENT' })}
          </Breadcrumb.Item>
          <Breadcrumb.Item className={styles.breadCrumbBold}>
            {formatMessage({ id: 'ORG_MANAGEMENT' })}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={16}>
          <Col lg={7} md={24} sm={24} xs={24}>
            <OrgTree />
          </Col>
          <Col lg={17} md={24} sm={24} xs={24}>
            <OrgInformation />
          </Col>
        </Row>
        <OrgOperDrawer />
      </Col>
    );
  }
}

export default OrgManagement;
