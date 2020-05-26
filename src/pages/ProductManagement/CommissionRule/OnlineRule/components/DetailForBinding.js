import React from 'react';
import { Col, Form, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../Detail/$detail/index.less';
import PaginationComp from '../../../components/PaginationComp';

@Form.create()
@connect(({ commissionNew, loading }) => ({
  commissionNew,
  loading: loading.effects['detail/offerDetail'],
}))
class DetailForBinding extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      dataIndex: 'commodityName',
      key: 'commodityName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OFFER_IDENTIFIER' }),
      dataIndex: 'commodityIdentifier',
      key: 'commodityIdentifier',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OFFER_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
  ];

  detailColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commoditySpecId',
      key: 'commoditySpecId',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
  ];

  pluColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commoditySpecId',
      key: 'commoditySpecId',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
      key: 'themeParkCode',
      render: text => this.showThemeParkName(text),
    },
  ];

  pluDetailColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commoditySpecId',
      key: 'commoditySpecId',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
      key: 'themeParkCode',
      render: text => this.showThemeParkName(text),
    },
  ];

  subDetailColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commoditySpecId',
      key: 'commoditySpecId',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
  ];

  showThemeParkName = text => {
    const {
      commissionNew: { themeParkList },
    } = this.props;
    for (let i = 0; i < themeParkList.length; i += 1) {
      if (themeParkList[i].itemValue === text) {
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{themeParkList[i].itemName}</span>}
          >
            <span>{themeParkList[i].itemName}</span>
          </Tooltip>
        );
      }
    }
    return null;
  };

  subExpandedRowRender = record => {
    const { subCommodityList } = record;
    return (
      <div>
        <Table
          size="small"
          columns={this.subDetailColumns}
          dataSource={subCommodityList}
          expandedRowRender={rec => this.subExpandedRowRender(rec)}
          rowClassName={rec =>
            rec.subCommodityList === null || rec.subCommodityList.length === 0
              ? styles.hideIcon
              : undefined
          }
          pagination={false}
          bordered={false}
        />
      </div>
    );
  };

  onlineExpandedRowRender = record => {
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
          expandedRowRender={rec => this.subExpandedRowRender(rec)}
          rowClassName={rec =>
            rec.subCommodityList === null || rec.subCommodityList.length === 0
              ? styles.hideIcon
              : undefined
          }
        />
      </div>
    );
  };

  offlineExpandedRowRender = record => {
    const { subCommodityList } = record;
    return (
      <div>
        <Table
          size="small"
          columns={this.pluDetailColumns}
          dataSource={subCommodityList}
          pagination={false}
          bordered={false}
          rowClassName={rec =>
            rec.subCommodityList === null || rec.subCommodityList.length === 0
              ? styles.hideIcon
              : undefined
          }
        />
      </div>
    );
  };

  getRowSelectedClassName = (record, index) => {
    if (index === 0) {
      return styles.hideIcon;
    }
    if (record.subCommodityList.length === 0) {
      return styles.hideIcon;
    }
    return undefined;
  };

  getRowSelectedClassName2 = record => {
    if (record.subCommodityList.length === 0) {
      return styles.hideIcon;
    }
  };

  render() {
    const {
      commissionNew: {
        checkedOnlineList = [],
        onlineOfferPagination,
        displayOnlineList = [],
        checkedList = [],
        offlinePLUPagination,
        displayOfflineList = [],
      },
      loading,
    } = this.props;
    const { currentPage: onlineCurrentPage, pageSize: onlinePageSize } = onlineOfferPagination;
    const { currentPage: offlineCurrentPage, pageSize: offlinePageSize } = offlinePLUPagination;
    const onlinePageOpts = {
      total: checkedOnlineList.length,
      current: onlineCurrentPage,
      pageSize: onlinePageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'commissionNew/effectSave',
          payload: {
            onlineOfferPagination: {
              currentPage: page,
              pageSize,
            },
          },
        }).then(() => {
          setTimeout(() => {
            dispatch({
              type: 'commissionNew/changeOnlinePage',
              payload: {
                checkedOnlineList,
              },
            });
          }, 500);
        });
      },
    };

    const offlinePageOpts = {
      total: checkedList.length,
      current: offlineCurrentPage,
      pageSize: offlinePageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'commissionNew/effectSave',
          payload: {
            offlinePLUPagination: {
              currentPage: page,
              pageSize,
            },
          },
        }).then(() => {
          setTimeout(() => {
            dispatch({
              type: 'commissionNew/changeOfflinePage',
              payload: {
                checkedList,
              },
            });
          }, 500);
        });
      },
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
                dataSource={displayOnlineList}
                pagination={false}
                expandedRowRender={this.onlineExpandedRowRender}
                loading={loading}
                className={`tabs-no-padding ${styles.searchTitle}`}
                rowClassName={(record, index) => this.getRowSelectedClassName2(record, index)}
              />
              <PaginationComp style={{ marginTop: 10 }} {...onlinePageOpts} />
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
                dataSource={displayOfflineList}
                className={`tabs-no-padding ${styles.searchTitle}`}
                rowClassName={(record, index) => this.getRowSelectedClassName(record, index)}
                expandedRowRender={this.offlineExpandedRowRender}
                pagination={false}
              />
              <PaginationComp style={{ marginTop: 10 }} {...offlinePageOpts} />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}
export default DetailForBinding;
