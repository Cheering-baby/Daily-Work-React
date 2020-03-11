import React from 'react';
import { Col, Form, Row, Table, Tabs } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../../OnlineRule/Detail/$detail/index.less';

const { TabPane } = Tabs;

@Form.create()
@connect(({ offlineNew }) => ({
  offlineNew,
}))
class DetailForTiered extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'TIERED_COMMISSION_TIER' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      dataIndex: 'identifier',
      key: 'identifier',
    },
  ];

  parkColumns = [
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
    // const {
    // } = this.props;

    return (
      <Col lg={24} md={24} id="commissionNew">
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <div className="title-header" style={{ paddingLeft: 16 }}>
            <span className="detail-title">{formatMessage({ id: 'TIERED_COMMISSION' })}</span>
          </div>
          <div>
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
          </div>
          <div className={styles.parkTabStyle}>
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
          <div className="title-header" style={{ padding: 16 }}>
            <span className="detail-title">
              {formatMessage({ id: 'COMMISSION_OFFER_UNDER_RULE' })}
            </span>
          </div>
          <Table
            bordered={false}
            size="small"
            // dataSource={commissionRuleSetupList}
            // pagination={pagination}
            // loading={loading}
            columns={this.columns}
            className={styles.offerTableStyle}
          />
        </Form>
      </Col>
    );
  }
}
export default DetailForTiered;
