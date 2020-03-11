import React from 'react';
import { Table, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../Detail/$detail/index.less';

@Form.create()
// @connect(({}) => ({}))
class DetailForOfferRule extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: formatMessage({ id: 'TIERED_COMMISSION_TIER' }),
        dataIndex: 'tieredCommissionTier',
        key: 'tieredCommissionTier',
      },
      {
        title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
        dataIndex: 'commissionScheme',
        key: 'commissionScheme',
      },
    ];
  }

  render() {
    return (
      <Col lg={24} md={24} id="detailForTieredCommission">
        <Col lg={24} md={24}>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <span className={styles.DetailTitle}>
                {formatMessage({ id: 'COMMISSION_OFFER_UNDER_RULE' })}
              </span>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Table
                columns={this.columns}
                // dataSource={tieredCommissionRuleList}
                scroll={{ x: 'max-content' }}
              />
            </Col>
          </Row>
        </Col>
      </Col>
    );
  }
}
export default DetailForOfferRule;
