import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import detailStyles from './index.less';

@connect(({ activityDetail }) => ({
  activityDetail,
}))
class TransactionBookingDetail extends Component {
  componentDidMount() {}

  getOrderNo = () => {
    const { activityDetail = {} } = this.props;
    const { activityInfo = {} } = activityDetail;
    return activityInfo.businessId || '-';
  };

  gotoOrderDetail = () => {
    const { activityDetail = {} } = this.props;
    const { activityInfo = {} } = activityDetail;

    const orderNo = activityInfo.businessId;

    router.push(`/TicketManagement/Ticketing/QueryOrder?orderNo=${orderNo}`);
  };

  render() {
    const gridOpts = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

    return (
      <Col lg={24} md={24} id="TransactionBookingDetail">
        <Card>
          <Row>
            <Col span={24}>
              <span className={detailStyles.titleHeader}>
                {formatMessage({ id: 'ORDER_INFORMATION' })}
              </span>
            </Col>
          </Row>
          <Row>
            <Col {...gridOpts} className={detailStyles.basicInfoContent}>
              <Col span={8}>
                <span>{formatMessage({ id: 'PARTNERS_TRANSACTION_NO' })}</span>
              </Col>
              <Col span={16}>
                <span>{this.getOrderNo()}</span>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col {...gridOpts} className={detailStyles.basicInfoContent}>
              <Col span={8} />
              <Col span={16}>
                <Button type="primary" onClick={this.gotoOrderDetail}>
                  {formatMessage({ id: 'ORDER_DETAIL' })}
                </Button>
              </Col>
            </Col>
          </Row>
        </Card>
      </Col>
    );
  }
}

export default TransactionBookingDetail;
