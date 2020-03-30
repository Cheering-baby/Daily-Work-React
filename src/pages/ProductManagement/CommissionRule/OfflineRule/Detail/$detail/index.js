import React from 'react';
import router from 'umi/router';
import { Button, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import styles from './index.less';
import DetailForTiered from '../../components/DetailForTiered';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class OfflineDetail extends React.PureComponent {
  edit = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OfflineRule/New',
      query: { type: 'edit' },
    });
  };

  render() {
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
        breadcrumbName: formatMessage({ id: 'OFFLINE_FIXED_COMMISSION' }),
        url: '/ProductManagement/CommissionRule/OfflineRule',
      },
      {
        breadcrumbName: formatMessage({ id: 'COMMON_DETAILS' }),
        url: null,
      },
    ];
    return (
      <Row type="flex" justify="space-around" id="mainTaView">
        <Col span={24}>
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
        <Col lg={24} md={24}>
          <div className={`${styles.searchDiv} has-shadow no-border`}>
            <Button icon="edit" style={{ margin: 16 }} onClick={this.edit} />
            <Row type="flex" justify="space-around">
              <DetailForTiered />
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}
export default OfflineDetail;
