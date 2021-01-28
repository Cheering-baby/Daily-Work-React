import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Input, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { formatPageData } from '@/pages/ProductManagement/utils/tools';
import styles from './AddOnlinePLUModal.less';
import PaginationComp from '../../../components/PaginationComp';

const drawWidth = 800;
@connect(({ commissionNew }) => ({
  excludedTA: commissionNew.excludedTA,
}))
class AddOnlinePLUModal extends React.PureComponent<any> {
  columns = [
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      dataIndex: 'offerName',
      key: 'offerName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OFFER_IDENTIFIER' }),
      dataIndex: 'offerIdentifier',
      key: 'offerIdentifier',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OFFER_DESCRIPTION' }),
      dataIndex: 'offerDescription',
      key: 'offerDescription',
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

  subExpandedRowRender = record => {
    const { subCommodityList: dateList } = record;

    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={dateList}
          pagination={false}
          bordered={false}
          rowKey={rec => rec.commoditySpecId}
        />
      </div>
    );
  };

  expandedRowRender = (record, offerList, checkedOnlineList) => {
    const { subCommodityList, commoditySpecId } = record;
    let subCheckedOnlineList = [];
    for (let i = 0; i < checkedOnlineList.length; i += 1) {
      if (commoditySpecId === checkedOnlineList[i].commoditySpecId) {
        subCheckedOnlineList = checkedOnlineList[i].subCommodityList;
      }
    }
    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={subCommodityList}
          pagination={false}
          bordered={false}
          rowClassName={rec => (rec.subCommodityList.length === 0 ? styles.hideIcon : undefined)}
          expandedRowRender={rec =>
            this.subExpandedRowRender(
              rec,
              record.commoditySpecId,
              subCommodityList,
              offerList,
              subCheckedOnlineList
            )
          }
          rowKey={rec => rec.commoditySpecId}
        />
      </div>
    );
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        showGrantedOffer: false,
        grantOfferSearch: false,
        grantOfferListFilter: [],
        grantOfferSearchOfferKey: '',
      },
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        grantOfferSearch: false,
        grantOfferListFilter: [],
        grantOfferSearchOfferKey: '',
      },
    });
  };

  changeSearchOfferKey = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        grantOfferSearchOfferKey: e.target.value,
      },
    });
  };

  search = () => {
    const {
      dispatch,
      excludedTA: { grantOfferSearchOfferKey, grantOfferList },
    } = this.props;
    const grantOfferListFilter = grantOfferList.filter(
      ({ offerIdentifier, offerName, offerDescription }) =>
        (offerIdentifier &&
          offerIdentifier.toLowerCase().indexOf(grantOfferSearchOfferKey.toLowerCase().trim()) >=
            0) ||
        (offerName &&
          offerName.toLowerCase().indexOf(grantOfferSearchOfferKey.toLowerCase().trim()) >= 0) ||
        (offerDescription &&
          offerDescription.toLowerCase().indexOf(grantOfferSearchOfferKey.toLowerCase().trim()) >=
            0)
    );
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        grantOfferSearch: true,
        grantOfferListFilter,
      },
    });
  };

  render() {
    const {
      dispatch,
      excludedTA: {
        grantOfferList,
        showGrantedOffer,
        grantOfferSearch,
        grantOfferListFilter,
        grantOfferSearchOfferKey,
        grantOfferListPagination: { pageSize, currentPage },
      },
    } = this.props;

    const compareData = grantOfferSearch ? grantOfferListFilter : grantOfferList;

    const grantOfferListShow = formatPageData(currentPage, pageSize, compareData).items;

    const pageOpts = {
      pageSize,
      total: compareData.length,
      current: currentPage,
      pageChange: (current, pageSizeNow) => {
        dispatch({
          type: 'commissionNew/saveExcludedTA',
          payload: {
            grantOfferListPagination: {
              pageSize: pageSizeNow,
              currentPage: current,
            },
          },
        });
      },
    };

    return (
      <div>
        <Modal
          width={drawWidth}
          maskClosable={false}
          visible={showGrantedOffer}
          onCancel={() => this.cancel()}
          title={
            <span className={styles.title}>{formatMessage({ id: 'VIEW_GRANTED_OFFERS' })}</span>
          }
          footer={
            <div>
              <Button style={{ width: 60 }} onClick={() => this.cancel()} type="primary">
                OK
              </Button>
            </div>
          }
        >
          <Row>
            <Col className={styles.inputColStyle} xs={24} sm={12} md={10}>
              <Input
                allowClear
                autoComplete="off"
                style={{ minWidth: '100%' }}
                value={grantOfferSearchOfferKey}
                onChange={this.changeSearchOfferKey}
                placeholder="Offer Name/Identifier/Description"
              />
            </Col>
            <Col xs={12} sm={12} md={6} className={styles.searchReset}>
              <Button style={{ marginRight: 8 }} onClick={this.search} type="primary">
                Search
              </Button>
              <Button onClick={this.reset}>Reset</Button>
            </Col>
          </Row>
          <Table
            size="small"
            pagination={false}
            columns={this.columns}
            dataSource={grantOfferListShow}
            rowKey={record => record.offerNo}
            className={`tabs-no-padding ${styles.searchTitle}`}
            // expandedRowRender={record =>
            //   this.expandedRowRender(record, grantOfferList, checkedOnlineList)
            // }
            // rowClassName={record =>
            //   record.subCommodityList.length === 0 ? styles.hideIcon : undefined
            // }
          />
          <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
        </Modal>
      </div>
    );
  }
}
export default AddOnlinePLUModal;
