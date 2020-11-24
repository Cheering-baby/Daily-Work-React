import React from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, message, Modal, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './AddOfferModal.less';
import PaginationComp from '@/pages/ProductManagement/components/PaginationComp';
import { objDeepCopy } from '@/pages/ProductManagement/utils/tools';

const drawWidth = 900;
@Form.create()
@connect(({ grant, loading }) => ({
  grant,
  loading: loading.effects['grant/fetchCommodityList'],
}))
class AddOfferModal extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      dataIndex: 'commodityName',
      key: 'commodityName',
      width: '20%',
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
      width: '40%',
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
      width: '40%',
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'grant/fetchCommodityList' });
  }

  onSelectChange = (selectedRowKeys, addOfferList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'grant/saveSelectOffer',
      payload: {
        selectedRowKeys,
        addOfferList,
      },
    });
  };

  handleOk = (addOfferList, checkedList) => {
    const {
      dispatch,
      grant: {
        grantPagination: { currentPage, pageSize },
      },
    } = this.props;
    const selectedOfferList = [];
    for (let i = 0; i < addOfferList.length; i += 1) {
      if (addOfferList[i].isSelected) {
        selectedOfferList.push(objDeepCopy(addOfferList[i]));
      }
    }
    if (selectedOfferList.length === 0) {
      message.warning('Please select at least one offer.');
      return false;
    }
    for (let i = 0; i < selectedOfferList.length; i += 1) {
      let changeFlag = true;
      for (let j = 0; j < checkedList.length; j += 1) {
        if (checkedList[j].bindingId === selectedOfferList[i].commoditySpecId) {
          changeFlag = false;
        }
      }
      if (changeFlag) {
        checkedList.push({
          bindingId: selectedOfferList[i].commoditySpecId,
          bindingName: selectedOfferList[i].commodityName,
          bindingIdentifier: selectedOfferList[i].commodityIdentifier,
          bindingCode: selectedOfferList[i].commodityCode,
          bindingDescription: selectedOfferList[i].commodityDescription,
          // subBindingList: selectedOfferList[i].subCommodityList
        });
      }
    }
    const displayGrantOfferList = [];
    if (currentPage * pageSize < checkedList.length) {
      for (let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i += 1) {
        displayGrantOfferList.unshift(checkedList[i]);
      }
    } else {
      for (let i = (currentPage - 1) * pageSize; i < checkedList.length; i += 1) {
        displayGrantOfferList.unshift(checkedList[i]);
      }
    }
    dispatch({
      type: 'grant/save',
      payload: {
        checkedList,
        displayGrantOfferList,
        searchVal: undefined,
        searchType: false,
        expandedRowKeys: [],
      },
    });
    this.cancel();
  };

  search = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    e.stopPropagation();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'grant/fetchCommodityList',
          payload: {
            commonSearchText: values.offerName || '',
            bindingId: null,
            bindingType: 'Agent',
            usageScope: 'Online',
            currentPage: 1,
            pageSize: 10,
          },
        });
      }
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'grant/fetchCommodityList',
      payload: {
        commonSearchText: null,
        bindingId: null,
        bindingType: 'Agent',
        usageScope: 'Online',
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'grant/resetAddOffer' });
  };

  getSelectedRowKes = addOfferList => {
    const selectedRowKeys = [];
    for (let i = 0; i < addOfferList.length; i += 1) {
      if (addOfferList[i].isSelected) {
        selectedRowKeys.push(addOfferList[i].commoditySpecId);
      }
      for (let j = 0; j < addOfferList[i].subCommodityList.length; j += 1) {
        if (addOfferList[i].subCommodityList[j].isSelected) {
          if (addOfferList[i].subCommodityList[j].bindingFlg === 'Y') {
            message.warning(
              'The system check selected product under this offer is tagged to any commission rule.'
            );
          }
        }
      }
    }
    return selectedRowKeys;
  };

  getSubRowSelectedRowKeys = (record, addOfferList) => {
    for (let i = 0; i < addOfferList.length; i += 1) {
      if (addOfferList[i].commoditySpecId === record.commoditySpecId) {
        const subSelectedKeys = [];
        for (let j = 0; j < addOfferList[i].subCommodityList.length; j += 1) {
          if (addOfferList[i].subCommodityList[j].isSelected) {
            subSelectedKeys.push(addOfferList[i].subCommodityList[j].commoditySpecId);
          }
        }
        return subSelectedKeys;
      }
    }
    return [];
  };

  subExpandedRowRender = (
    record,
    commoditySpecId,
    subCommodityList,
    addOfferList,
    subCheckedOnlineList
  ) => {
    const { subCommodityList: dateList, commoditySpecId: selectedCommoditySpecId } = record;
    let subSubCheckedOnlineList = [];
    for (let i = 0; i < subCheckedOnlineList.length; i += 1) {
      if (selectedCommoditySpecId === subCheckedOnlineList[i].commoditySpecId) {
        subSubCheckedOnlineList = subCheckedOnlineList[i].subCommodityList;
      }
    }

    return (
      <div style={{ margin: '-9px -9px -9px 0' }}>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={dateList}
          pagination={false}
          bordered={false}
          rowKey={rec => rec.commoditySpecId}
          // rowSelection={subRowSelection}
        />
      </div>
    );
  };

  onSubSelectChange = (subSelectedRowKeys, commoditySpecId, addOfferList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'grant/saveSubSelectOffer',
      payload: {
        subSelectedRowKeys,
        commoditySpecId,
        addOfferList,
      },
    });
  };

  expandedRowRender = (record, addOfferList, checkedList) => {
    const { subCommodityList, commoditySpecId } = record;
    let subCheckedOnlineList = [];
    for (let i = 0; i < checkedList.length; i += 1) {
      if (commoditySpecId === checkedList[i].commoditySpecId) {
        subCheckedOnlineList = checkedList[i].subCommodityList;
      }
    }

    return (
      <div style={{ margin: '-9px -9px -9px 0' }}>
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
              addOfferList,
              subCheckedOnlineList
            )
          }
          rowKey={rec => rec.commoditySpecId}
          // rowSelection={subRowSelection}
        />
      </div>
    );
  };

  render() {
    const {
      loading,
      grant: {
        addOfferModal,
        addOfferList,
        searchCondition: { currentPage, pageSize: nowPageSize },
        searchOfferTotalSize,
        checkedList,
      },
      form: { getFieldDecorator },
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.getSelectedRowKes(addOfferList),
      onChange: selectedRowKey => this.onSelectChange(selectedRowKey, addOfferList),
      getCheckboxProps: record => {
        return {
          disabled: !!checkedList.find(item => item.bindingId === record.commoditySpecId),
        };
      },
    };
    const pageOpts = {
      total: searchOfferTotalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'grant/fetchCommodityList',
          payload: {
            currentPage: page,
            pageSize,
          },
        });
      },
    };
    return (
      <Modal
        maskClosable={false}
        visible={addOfferModal}
        width={drawWidth}
        title={<span className={styles.title}>{formatMessage({ id: 'ADD_OFFER' })}</span>}
        onCancel={this.cancel}
        footer={
          <div>
            <Button
              style={{ width: 60 }}
              onClick={() => this.handleOk(addOfferList, checkedList)}
              type="primary"
            >
              OK
            </Button>
            <Button onClick={this.cancel} style={{ width: 60 }}>
              Cancel
            </Button>
          </div>
        }
      >
        <Form onSubmit={this.search}>
          <Row>
            <Col xs={24} sm={12} md={9}>
              <Form.Item>
                {getFieldDecorator(
                  `offerName`,
                  {}
                )(
                  <Input
                    style={{ minWidth: '100%' }}
                    placeholder="Offer Name/Identifier"
                    allowClear
                    autoComplete="off"
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={12} sm={12} md={6} className={styles.searchReset}>
              <Button style={{ marginRight: 8 }} type="primary" htmlType="submit">
                Search
              </Button>
              <Button onClick={this.handleReset}>Reset</Button>
            </Col>
          </Row>
          <Table
            className={`tabs-no-padding ${styles.searchTitle}`}
            columns={this.columns}
            dataSource={addOfferList}
            size="small"
            rowSelection={rowSelection}
            expandedRowRender={record => this.expandedRowRender(record, addOfferList, checkedList)}
            loading={!!loading}
            pagination={false}
            rowKey={record => record.commoditySpecId}
            rowClassName={record =>
              record.subCommodityList.length === 0 ? styles.hideIcon : undefined
            }
          />
          <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
        </Form>
      </Modal>
    );
  }
}
export default AddOfferModal;
