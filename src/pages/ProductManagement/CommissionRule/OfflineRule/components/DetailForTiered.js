import React from 'react';
import { Col, Form, Row, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../../OnlineRule/Detail/$detail/index.less';

@Form.create()
@connect(({ offlineNew }) => ({
  offlineNew,
}))
class DetailForTiered extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'NO' }),
      dataIndex: 'seqOrder',
    },
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'pluCode',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'pluDescription',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'pluPark',
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
    },
  ];

  render() {
    return (
      <Col lg={24} md={24} id="commissionNew">
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <div className="title-header" style={{ paddingLeft: 16 }}>
            <span className="title-header">{formatMessage({ id: 'TIERED_COMMISSION' })}</span>
          </div>
          <div>
            <Row>
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
            </Row>
          </div>
          <div className="title-header" style={{ padding: 16 }}>
            <span className="title-header">{formatMessage({ id: 'BINDING' })}</span>
          </div>
          <div style={{ padding: '0 15px' }}>
            <Table
              bordered={false}
              size="small"
              // dataSource={commissionRuleSetupList}
              // pagination={pagination}
              // loading={loading}
              className={`tabs-no-padding ${styles.searchTitle}`}
              columns={this.columns}
            />
          </div>
        </Form>
      </Col>
    );
  }
}
export default DetailForTiered;
