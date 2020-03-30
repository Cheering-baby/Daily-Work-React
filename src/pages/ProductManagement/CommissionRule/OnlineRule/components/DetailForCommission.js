import React from 'react';
import { connect } from 'dva';
import { Col, Form, Row, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { isEqual } from 'lodash';
import styles from '../Detail/$detail/index.less';

@Form.create()
@connect(({ detail, loading }) => ({
  detail,
  loading: loading.effects['detail/queryDetail'],
}))
class DetailForCommission extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'TIERED_COMMISSION_TIER' }),
      dataIndex: 'commissionValue',
    },
    {
      title: formatMessage({ id: 'COMMISSION_SCHEMA' }),
      dataIndex: 'minimum',
      render: (text, record) => (
        <span>
          {record.minimum}~{record.maxmum}
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch, tplId } = this.props;
    dispatch({
      type: 'detail/queryDetail',
      payload: {
        tplId,
      },
    });
    dispatch({
      type: 'detail/bindingDetail',
      payload: {
        tplId,
        commodityType: 'Offer',
      },
    });
    dispatch({
      type: 'detail/bindingDetail',
      payload: {
        tplId,
        commodityType: 'PackagePlu',
      },
    });
  }

  handleTableChange = page => {
    const {
      dispatch,
      detail: { pagination },
    } = this.props;

    // page change
    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'detail/tableChanged',
        payload: {
          pagination: {
            currentPage: page.current,
            pageSize: page.pageSize,
          },
        },
      });
    }
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      detail: { loading, commisssionList, tieredList, currentPage, pageSize, totalSize },
    } = this.props;
    const pagination = {
      current: currentPage,
      pageSize,
      total: totalSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['20', '50', '100'],
      showTotal: this.showTotal,
    };
    return (
      <div>
        <Col lg={24} md={24} id="detailForTieredCommission">
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <span className={styles.commissionTitle}>
                {formatMessage({ id: 'TIERED_COMMISSION' })}
              </span>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'PRODUCT_COMMISSION_NAME' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {commisssionList && commisssionList.commissionName
                        ? commisssionList.commissionName
                        : ''}
                    </span>
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
                    <span>
                      {commisssionList && commisssionList.commissionType
                        ? commisssionList.commissionType
                        : ''}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'EFFECTIVE_PERIOD' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {commisssionList && commisssionList.effectiveDate
                        ? moment(commisssionList.effectiveDate).format('YYYY-MM-DD hh:mm:ss')
                        : ''}{' '}
                      ~
                      {commisssionList && commisssionList.expiryDate
                        ? moment(commisssionList.expiryDate).format('YYYY-MM-DD hh:mm:ss')
                        : ''}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'CALCULATION_CYCLE' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {commisssionList && commisssionList.caluculateCycle
                        ? commisssionList.caluculateCycle
                        : ''}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ paddingTop: '14px' }}>
            <Col span={24}>
              <Table
                rowKey={record => record.tplId}
                size="small"
                columns={this.columns}
                dataSource={tieredList}
                className={`tabs-no-padding ${styles.searchTitle}`}
                loading={loading}
                pagination={pagination}
                onChange={this.handleTableChange}
              />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}
export default DetailForCommission;
