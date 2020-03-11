import React from 'react';
import router from 'umi/router';
import { Breadcrumb, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './index.less';
import ModifyAttendanceCommission from '../../components/ModifyAttendanceCommission';
import ModifyTieredCommission from '../../components/ModifyTieredCommission';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class CommissionDetail extends React.PureComponent {
  routerTo = () => {
    router.push('/ProductManagement/CommissionRule/OnlineRule');
  };

  optionChange = e => {
    const { dispatch } = this.props;

    dispatch({
      type: 'commissionNew/save',
      payload: {
        value: e,
      },
    });
  };

  render() {
    const {
      match: { params },
    } = this.props;

    return (
      <Col lg={24} md={24} id="commissionNew">
        {/* <MediaQuery> */}
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className="breadcrumb-style">System Management</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style" onClick={this.routerTo}>
            Commission Rule Setup
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbbold">Modify Commission</Breadcrumb.Item>
        </Breadcrumb>
        {/* </MediaQuery> */}
        <Col lg={24} md={24}>
          <div className={`${styles.searchDiv} has-shadow no-border`}>
            <div className="title-header" style={{ padding: 16 }}>
              <span>{formatMessage({ id: 'MODIFY_COMMISSION' })}</span>
            </div>
            <Row type="flex" justify="space-around">
              {params.detail === 'Tiered' ? <ModifyTieredCommission /> : null}
              {params.detail === 'Attendance' ? <ModifyAttendanceCommission /> : null}
            </Row>
          </div>
        </Col>
      </Col>
    );
  }
}
export default CommissionDetail;
