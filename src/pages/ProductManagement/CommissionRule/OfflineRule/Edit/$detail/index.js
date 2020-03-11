import React from 'react';
import router from 'umi/router';
import { Breadcrumb, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './index.less';
import EditForTiered from '../../components/EditForTiered';
import EditForAttendance from '../../components/EditForAttendance';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class OfflineEdit extends React.PureComponent {
  routerTo = () => {
    router.push('/ProductManagement/CommissionRule/OfflineRule');
  };

  render() {
    const {
      match: { params },
    } = this.props;

    return (
      <Col lg={24} md={24} id="commissionModify">
        {/* <MediaQuery> */}
        <Breadcrumb separator=" > ">
          <Breadcrumb.Item className="breadcrumb-style">System Management</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style">Commission Rule</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style" onClick={this.routerTo}>
            Offline Rule
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbbold">Modify Commission</Breadcrumb.Item>
        </Breadcrumb>
        {/* </MediaQuery> */}
        <Col lg={24} md={24}>
          <div className={`${styles.searchDiv} has-shadow no-border`}>
            <div className="title-header" style={{ padding: '16px' }}>
              <span>{formatMessage({ id: 'COMMISSION_MODIFY' })}</span>
            </div>
            <Row type="flex" justify="space-around">
              {params.detail === 'Tiered' || params.detail === 'Fixed' ? <EditForTiered /> : null}
              {params.detail === 'Attendance' ? <EditForAttendance /> : null}
            </Row>
          </div>
        </Col>
      </Col>
    );
  }
}
export default OfflineEdit;
