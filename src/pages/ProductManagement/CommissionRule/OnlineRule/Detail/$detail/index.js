import React from 'react';
import router from 'umi/router';
import { Breadcrumb, Button, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './index.less';
import DetailForTieredCommission from '../../components/DetailForTieredCommission';
import DetailForAttendance from '../../components/DetailForAttendance';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class CommissionDetail extends React.PureComponent {
  routerTo = () => {
    router.push('/ProductManagement/CommissionRule/OnlineRule');
  };

  toEdit = () => {
    router.push('/ProductManagement/CommissionRule/OnlineRule/Edit/11');
  };

  render() {
    const {
      match: { params },
    } = this.props;

    return (
      <Col lg={24} md={24} id="commissionDetail">
        {/* <MediaQuery> */}
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className="breadcrumb-style">System Management</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style">Commission Rule</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style" onClick={this.routerTo}>
            Online Rule
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbbold">Details</Breadcrumb.Item>
        </Breadcrumb>
        {/* </MediaQuery> */}
        <Col lg={24} md={24}>
          <div className={`${styles.searchDiv} has-shadow no-border`}>
            <Button
              icon="edit"
              style={{ marginTop: 16, marginLeft: 16 }}
              onClick={() => this.toEdit()}
            />
            <div className="title-header" style={{ padding: 16 }}>
              <span>{formatMessage({ id: 'COMMISSION_DETAIL' })}</span>
            </div>
            <Row type="flex" justify="space-around" style={{ paddingLeft: 16 }}>
              {params.detail === 'Tiered' ? <DetailForTieredCommission /> : null}
              {params.detail === 'Attendance' ? <DetailForAttendance /> : null}
            </Row>
          </div>
        </Col>
      </Col>
    );
  }
}
export default CommissionDetail;
