import React from 'react';
import { Col, Form, Icon, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import styles from '../Detail/$detail/index.less';

@Form.create()
@connect(({ detail, loading }) => ({
  detail,
  loading: loading.effects['detail/offerDetail'],
}))
class DetailForBinding extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      dataIndex: 'commodityName',
    },
    {
      title: formatMessage({ id: 'OFFER_IDENTIFIER' }),
      dataIndex: 'commodityIdentifier',
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'commoditySpecId',
      render: (text, record) => {
        const Text = text || '';
        return Text ? (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
              <Icon
                type="delete"
                onClick={() => {
                  this.delete(record);
                }}
              />
            </Tooltip>
          </div>
        ) : null;
      },
    },
  ];

  detailColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commodityCode',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'commoditySpecId',
      render: (text, record) => {
        const Text = text || '';
        return Text ? (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
              <Icon
                type="delete"
                onClick={() => {
                  this.delete(record);
                }}
              />
            </Tooltip>
          </div>
        ) : null;
      },
    },
  ];

  pluColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commodityCode',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
    },
  ];

  componentDidMount() {
    const { dispatch, tplId } = this.props;
    dispatch({
      type: 'detail/offerDetail',
      payload: {
        tplId,
        commodityType: 'Offer',
      },
    });
    dispatch({
      type: 'detail/pluDetail',
      payload: {
        tplId,
        commodityType: 'PackagePlu',
      },
    });
  }

  onExpandEvent = (expanded, record) => {
    const { expandedRowKeys = [], dispatch } = this.props;
    const expandedRowKeySet = new Set(expandedRowKeys);
    if (expanded) {
      expandedRowKeySet.add(record.commodityCode);
    } else {
      expandedRowKeySet.delete(record.commodityCode);
    }
    dispatch({
      type: 'detail/saveData',
      payload: {
        expandedRowKeys: [...expandedRowKeySet],
      },
    });
  };

  expandedRowRender = record => {
    const { subCommodityList } = record;
    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={subCommodityList}
          pagination={false}
          bordered={false}
          className={`tabs-no-padding ${styles.searchTitle}`}
        />
      </div>
    );
  };

  handleTableChange = page => {
    const {
      dispatch,
      detail: { pagination },
    } = this.props;

    // page change
    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'detail/bindingDetail',
        payload: {
          pagination: {
            currentPage: page.current,
            pageSize: page.pageSize,
          },
          commodityType: 'PackagePlu',
        },
      });
    }
  };

  pluTableChange = page => {
    const {
      dispatch,
      detail: { pagination },
    } = this.props;

    // page change
    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'detail/bindingDetail',
        payload: {
          pagination: {
            currentPage: page.current,
            pageSize: page.pageSize,
          },
          commodityType: 'Offer',
        },
      });
    }
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  pluShowTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      detail: { bingdingOffer, currentPage, pageSize, totalSize, bingdingPLU },
      offerDetail,
    } = this.props;
    const pagination = {
      current: currentPage,
      pageSize,
      total: totalSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['20', '50', '100'],
      showTotal: this.pluShowTotal,
    };
    const pluPagination = {
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
        <Col lg={24} md={24} id="detailForBinding">
          <Row type="flex" justify="space-around">
            <Col span={24} style={{ paddingTop: '14px' }}>
              <span className="detail-title">{formatMessage({ id: 'BINDING' })}</span>
            </Col>
          </Row>
          <Row style={{ paddingTop: '14px' }}>
            <Col span={24}>
              <Table
                rowKey={record => record.commoditySpecId}
                size="small"
                columns={this.columns}
                dataSource={bingdingOffer}
                pagination={pagination}
                onChange={this.handleTableChange}
                expandedRowRender={this.expandedRowRender}
                onExpand={(expanded, record) => {
                  this.onExpandEvent(expanded, record);
                }}
                loading={offerDetail}
                className={`tabs-no-padding ${styles.searchTitle}`}
              />
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={24} style={{ paddingTop: '14px' }}>
              <span className="detail-title">{formatMessage({ id: 'OFFLINE_PLU' })}</span>
            </Col>
          </Row>
          <Row style={{ paddingTop: '14px' }}>
            <Col span={24}>
              <Table
                rowKey={record => record.commoditySpecId}
                size="small"
                columns={this.pluColumns}
                dataSource={bingdingPLU}
                className={`tabs-no-padding ${styles.searchTitle}`}
                pagination={pluPagination}
                onChange={this.pluTableChange}
              />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}
export default DetailForBinding;
