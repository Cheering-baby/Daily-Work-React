import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Select, Input, Form, message, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './AddOnlinePLUModal.less';
import PaginationComp from '../../../components/PaginationComp';
import { objDeepCopy } from '../../../utils/tools';

const drawWidth = 800;
const { Option } = Select;
@Form.create()
@connect(({ commissionNew, loading }) => ({
  commissionNew,
  loading: loading.effects['commissionNew/fetchOfferList'],
}))
class AddOnlinePLUModal extends React.PureComponent {
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'commissionNew/queryThemeParks' });
    dispatch({
      type: 'commissionNew/fetchOfferList',
      payload: {
        bindingId: null,
        bindingType: 'Commission',
        usageScope: 'Online',
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/resetAddOnlinePLUData',
    });
  }

  search = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'commissionNew/fetchOfferList',
          payload: {
            bindingId: null,
            bindingType: 'Commission',
            usageScope: 'Online',
            commonSearchText: values.commonSearchText,
            themeParkCode: values.themeParkCode,
            currentPage: 1,
            pageSize: 10,
          },
        });
      }
    });
  };

  reset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'commissionNew/fetchOfferList',
      payload: {
        bindingId: null,
        bindingType: 'Commission',
        usageScope: 'Online',
        commonSearchText: null,
        themeParkCode: null,
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/resetAddOnlinePLUData',
    });
  };

  onSelectChange = (selectedRowKeys, offerList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveSelectOffer',
      payload: {
        selectedRowKeys,
        offerList,
      },
    });
  };

  onSubSelectChange = (subSelectedRowKeys, commoditySpecId, offerList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveSubSelectOffer',
      payload: {
        subSelectedRowKeys,
        commoditySpecId,
        offerList,
      },
    });
  };

  getSubRowSelectedRowKeys = (record, offerList) => {
    for (let i = 0; i < offerList.length; i += 1) {
      if (offerList[i].commoditySpecId === record.commoditySpecId) {
        const subSelectedKeys = [];
        for (let j = 0; j < offerList[i].subCommodityList.length; j += 1) {
          if (offerList[i].subCommodityList[j].isSelected) {
            subSelectedKeys.push(offerList[i].subCommodityList[j].commoditySpecId);
          }
        }
        return subSelectedKeys;
      }
    }
    return [];
  };

  onSubSubSelectChange = (
    subSubSelectedRowKeys,
    commoditySpecId,
    subCommoditySpecId,
    offerList
  ) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveSubSubSelectOffer',
      payload: {
        subSubSelectedRowKeys,
        commoditySpecId,
        subCommoditySpecId,
        offerList,
      },
    });
  };

  subExpandedRowRender = (
    record,
    commoditySpecId,
    subCommodityList,
    offerList,
    subCheckedOnlineList
  ) => {
    const { subCommodityList: dateList, commoditySpecId: selectedCommoditySpecId } = record;
    let subSubCheckedOnlineList = [];
    for (let i = 0; i < subCheckedOnlineList.length; i += 1) {
      if (selectedCommoditySpecId === subCheckedOnlineList[i].commoditySpecId) {
        subSubCheckedOnlineList = subCheckedOnlineList[i].subCommodityList;
      }
    }
    const subRowSelection = {
      columnWidth: 40,
      selectedRowKeys: this.getSubRowSelectedRowKeys(record, subCommodityList),
      onChange: selectedRowKeys =>
        this.onSubSubSelectChange(
          selectedRowKeys,
          commoditySpecId,
          record.commoditySpecId,
          offerList
        ),
      getCheckboxProps: rec => {
        return {
          disabled: !!subSubCheckedOnlineList.find(
            item => item.commoditySpecId === rec.commoditySpecId
          ),
        };
      },
    };
    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={dateList}
          pagination={false}
          bordered={false}
          rowKey={rec => rec.commoditySpecId}
          rowSelection={subRowSelection}
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
    const subRowSelection = {
      columnWidth: 40,
      selectedRowKeys: this.getSubRowSelectedRowKeys(record, offerList),
      onChange: selectedRowKeys =>
        this.onSubSelectChange(selectedRowKeys, record.commoditySpecId, offerList),
      getCheckboxProps: rec => {
        return {
          disabled: !!subCheckedOnlineList.find(
            item => item.commoditySpecId === rec.commoditySpecId
          ),
        };
      },
    };
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
          rowSelection={subRowSelection}
        />
      </div>
    );
  };

  handelOK = (offerList, checkedOnlineList) => {
    const {
      dispatch,
      commissionNew: {
        onlineOfferPagination: { currentPage, pageSize },
      },
    } = this.props;
    const selectedOfferList = [];
    for (let i = 0; i < offerList.length; i += 1) {
      if (offerList[i].isSelected) {
        selectedOfferList.push(objDeepCopy(offerList[i]));
      }
    }
    if (selectedOfferList.length === 0) {
      message.warning('Select at least one PLU.');
      return;
    }
    for (let i = 0; i < selectedOfferList.length; i += 1) {
      selectedOfferList[i].selectedType = 'offerPLU';
      for (let k = 0; k < selectedOfferList[i].subCommodityList.length; k += 1) {
        selectedOfferList[i].subCommodityList[k].proCommoditySpecId =
          selectedOfferList[i].commoditySpecId;
      }
      for (let j = 0; j < selectedOfferList[i].subCommodityList.length; j += 1) {
        selectedOfferList[i].subCommodityList[j].selectedType = 'subPLU';
        for (
          let k = 0;
          k < selectedOfferList[i].subCommodityList[j].subCommodityList.length;
          k += 1
        ) {
          selectedOfferList[i].subCommodityList[j].selectedType = 'packagePLU';
          selectedOfferList[i].subCommodityList[j].subCommodityList[k].proProCommoditySpecId =
            selectedOfferList[i].commoditySpecId;
          selectedOfferList[i].subCommodityList[j].subCommodityList[k].proCommoditySpecId =
            selectedOfferList[i].subCommodityList[j].commoditySpecId;
          selectedOfferList[i].subCommodityList[j].subCommodityList[k].selectedType = 'subPLU';
          if (!selectedOfferList[i].subCommodityList[j].subCommodityList[k].isSelected) {
            selectedOfferList[i].subCommodityList[j].subCommodityList.splice(k, 1);
            k -= 1;
          }
        }
        if (!selectedOfferList[i].subCommodityList[j].isSelected) {
          selectedOfferList[i].subCommodityList.splice(j, 1);
          j -= 1;
        }
      }
    }

    for (let i = 0; i < selectedOfferList.length; i += 1) {
      let changeFlag = true;
      for (let j = 0; j < checkedOnlineList.length; j += 1) {
        if (checkedOnlineList[j].commoditySpecId === selectedOfferList[i].commoditySpecId) {
          changeFlag = false;
          checkedOnlineList[j].subCommodityList = objDeepCopy(
            selectedOfferList[i].subCommodityList
          );
        }
      }
      if (changeFlag) {
        checkedOnlineList.push(selectedOfferList[i]);
      }
    }
    const displayOnlineList = [];
    if (currentPage * pageSize < checkedOnlineList.length) {
      for (let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i += 1) {
        displayOnlineList.unshift(checkedOnlineList[i]);
      }
    } else {
      for (let i = (currentPage - 1) * pageSize; i < checkedOnlineList.length; i += 1) {
        displayOnlineList.unshift(checkedOnlineList[i]);
      }
    }
    dispatch({
      type: 'commissionNew/save',
      payload: {
        checkedOnlineList,
        displayOnlineList,
      },
    });
    this.cancel();
  };

  getSelectedRowKes = offerList => {
    const selectedRowKeys = [];
    for (let i = 0; i < offerList.length; i += 1) {
      if (offerList[i].isSelected) {
        selectedRowKeys.push(offerList[i].commoditySpecId);
      }
      for (let j = 0; j < offerList[i].subCommodityList.length; j += 1) {
        if (offerList[i].subCommodityList[j].isSelected) {
          if (offerList[i].subCommodityList[j].bindingFlg === 'Y') {
            message.warning(
              'The system check selected product under this offer is tagged to any commission rule.'
            );
          }
        }
      }
    }
    return selectedRowKeys;
  };

  render() {
    const {
      loading,
      commissionNew: {
        addBindingModal,
        offerList = [],
        onlineSearchCondition: { currentPage, pageSize: nowPageSize },
        checkedOnlineList = [],
        addOnlinePLUTotalSize,
        themeParkList = [],
      },
      form: { getFieldDecorator },
    } = this.props;
    const pageOpts = {
      total: addOnlinePLUTotalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'commissionNew/fetchOfferList',
          payload: {
            currentPage: page,
            pageSize,
          },
        });
      },
    };
    const rowSelection = {
      columnWidth: 40,
      selectedRowKeys: this.getSelectedRowKes(offerList),
      onChange: selectedRowKey => this.onSelectChange(selectedRowKey, offerList),
      getCheckboxProps: record => {
        return {
          disabled: !!checkedOnlineList.find(
            item => item.commoditySpecId === record.commoditySpecId
          ),
        };
      },
    };
    return (
      <div>
        <Modal
          maskClosable={false}
          visible={addBindingModal}
          width={drawWidth}
          title={<span className={styles.title}>{formatMessage({ id: 'ADD_ONLINE_PLU' })}</span>}
          onCancel={this.cancel}
          footer={
            <div>
              <Button
                style={{ width: 60 }}
                onClick={() => this.handelOK(offerList, checkedOnlineList)}
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
              <Col className={styles.inputColStyle} xs={24} sm={12} md={9}>
                <Form.Item>
                  {getFieldDecorator(
                    `commonSearchText`,
                    {}
                  )(
                    <Input
                      style={{ minWidth: '100%' }}
                      placeholder="Offer Name/Identifier/Description"
                      allowClear
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col className={styles.inputColStyle} xs={24} sm={12} md={9}>
                <Form.Item>
                  {getFieldDecorator(
                    `themeParkCode`,
                    {}
                  )(
                    <Select
                      placeholder={formatMessage({ id: 'THEME_PARK' })}
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                      allowClear
                    >
                      {themeParkList &&
                        themeParkList.map(item => (
                          <Option key={item.itemValue} value={item.itemValue}>
                            {item.itemName}
                          </Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} md={6} className={styles.searchReset}>
                <Button style={{ marginRight: 8 }} type="primary" htmlType="submit">
                  Search
                </Button>
                <Button onClick={this.reset}>Reset</Button>
              </Col>
            </Row>
          </Form>
          <Table
            className={`tabs-no-padding ${styles.searchTitle}`}
            columns={this.columns}
            dataSource={offerList}
            pagination={false}
            size="small"
            loading={!!loading}
            expandedRowRender={record =>
              this.expandedRowRender(record, offerList, checkedOnlineList)
            }
            rowClassName={record =>
              record.subCommodityList.length === 0 ? styles.hideIcon : undefined
            }
            rowKey={record => record.commoditySpecId}
            rowSelection={rowSelection}
          />
          <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
        </Modal>
      </div>
    );
  }
}
export default AddOnlinePLUModal;
