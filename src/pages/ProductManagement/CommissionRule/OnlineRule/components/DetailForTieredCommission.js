import React from 'react';
import { Tabs, Col, Form, Row, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../Detail/$detail/index.less';

const { TabPane } = Tabs;
@Form.create()
// @connect(({}) => ({}))
class DetailForTieredCommission extends React.PureComponent {
  columns = [
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

  render() {
    return (
      <Col lg={24} md={24}>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <span className="detail-title">{formatMessage({ id: 'TIERED_COMMISSION' })}</span>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'COMMISSION_CREATED_BY' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span />
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'COMMISSION_CREATED_TIME' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span />
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'PRODUCT_COMMISSION_NAME' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span />
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <div>
          <Tabs className="tabs-style" style={{ paddingTop: '15px' }}>
            <TabPane tab="Theme Park 01">
              <Table
                columns={this.parkColumns}
                // dataSource={list}
                scroll={{ x: 'max-content' }}
              />
            </TabPane>
          </Tabs>
        </div>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <span className={styles.DetailTitle}>{formatMessage({ id: 'OFFER_UNDER_RULE' })}</span>
          </Col>
        </Row>
        <Table
          rowKey="id"
          bordered={false}
          // size="small"
          columns={this.columns}
        />
      </Col>
    );
  }
}
export default DetailForTieredCommission;
