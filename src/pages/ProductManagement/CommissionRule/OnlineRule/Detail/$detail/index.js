import React, { Fragment } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import router from 'umi/router';
import detailStyles from '../../index.less';
import SCREEN from '@/utils/screen';
import DetailForCommission from '../../components/DetailForCommission';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import DetailForBinding from '@/pages/ProductManagement/CommissionRule/OnlineRule/components/DetailForBinding';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class CommissionDetail extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { tplId },
      },
    } = this.props;
    if (tplId !== null) {
      dispatch({
        type: 'detail/queryDetail',
        payload: {
          tplId,
        },
      });
      dispatch({
        type: 'commissionNew/queryBindingDetailList',
        payload: {
          tplId,
          usageScope: 'Online',
        },
      });
      dispatch({
        type: 'commissionNew/queryBindingDetailList',
        payload: {
          tplId,
          usageScope: 'Offline',
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/clean',
    });
  }

  toEdit = (tplId, id) => {
    router.push({
      pathname: `/ProductManagement/CommissionRule/OnlineRule/Edit/${id}`,
      query: { type: 'edit', tplId },
    });
  };

  render() {
    const {
      location: {
        query: { tplId },
      },
    } = this.props;

    const title = [
      {
        name: formatMessage({ id: 'PRODUCT_MANAGEMENT' }),
      },
      {
        name: formatMessage({ id: 'COMMISSION_RULE_TITLE' }),
      },
      {
        name: formatMessage({ id: 'ONLINE_FIXED_COMMISSION' }),
        href: '#/ProductManagement/CommissionRule/OnlineRule',
      },
      {
        name: formatMessage({ id: 'COMMON_DETAILS' }),
      },
    ];

    return (
      <Fragment>
        <Form onSubmit={this.commit}>
          <Row type="flex" justify="space-around" id="mainTaView">
            <Col span={24} className={detailStyles.pageHeaderTitle}>
              <MediaQuery minWidth={SCREEN.screenSm}>
                <BreadcrumbCompForPams title={title} />
              </MediaQuery>
            </Col>
            <Col span={24}>
              <Card>
                {/* <Tooltip placement="top" title="Edit"> */}
                {/* <Button */}
                {/* icon="edit" */}
                {/* style={{ marginBottom: 10 }} */}
                {/* onClick={() => this.toEdit(tplId, params.detail)} */}
                {/* /> */}
                {/* </Tooltip> */}
                <DetailForCommission tplId={tplId} />
                <DetailForBinding tplId={tplId} />
              </Card>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}
export default CommissionDetail;
