import React, { Fragment } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import detailStyles from '../../index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import DetailForCommission from '../../components/DetailForCommission';
import DetailForBinding from '../../components/DetailForBinding';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class CommissionDetail extends React.PureComponent {
  render() {
    const {
      match: { params },
    } = this.props;

    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'PRODUCT_MANAGEMENT' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'COMMISSION_RULE_TITLE' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'TIERED_ATTENDANCE_RULE' }),
        url: '/ProductManagement/CommissionRule/OnlineRule',
      },
      {
        breadcrumbName: formatMessage({ id: 'COMMON_DETAILS' }),
        url: null,
      },
    ];

    return (
      <Fragment>
        <Form onSubmit={this.commit}>
          <Row type="flex" justify="space-around" id="mainTaView">
            <Col span={24} className={detailStyles.pageHeaderTitle}>
              <MediaQuery
                maxWidth={SCREEN.screenMdMax}
                minWidth={SCREEN.screenSmMin}
                minHeight={SCREEN.screenSmMin}
              >
                <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
              </MediaQuery>
              <MediaQuery minWidth={SCREEN.screenLgMin}>
                <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
              </MediaQuery>
            </Col>
            <Col span={24}>
              <Card>
                <DetailForCommission tplId={params.detail} />
                <DetailForBinding tplId={params.detail} />
              </Card>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}
export default CommissionDetail;
