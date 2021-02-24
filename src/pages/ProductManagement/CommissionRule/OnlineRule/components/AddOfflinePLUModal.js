import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Select, Input, Form, message, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './AddOnlinePLUModal.less';
import PaginationComp from '../../../components/PaginationComp';
import { objDeepCopy, formatPrice, changeThemeParkDisplay } from '../../../utils/tools';

const drawWidth = 900;
const { Option } = Select;
@Form.create()
@connect(({ commissionNew, loading }) => ({
  commissionNew,
  loading: loading.effects['commissionNew/fetchPLUList'],
}))
class AddOfflinePLUModal extends React.PureComponent {
  columns = [
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
    {
      title: 'Price',
      dataIndex: 'commodityPrice',
      render: text => {
        const timeText = text || text === 0 ? formatPrice(text) : '';
        return timeText ? (
          <div>
            <Tooltip title={timeText} placement="topLeft">
              {timeText}
            </Tooltip>
          </div>
        ) : null;
      },
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
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
      key: 'themeParkCode',
      render: text => this.showThemeParkName(text),
    },
    {
      title: 'Price',
      dataIndex: 'commodityPrice',
      render: text => {
        const timeText = text || text === 0 ? formatPrice(text) : '';
        return timeText ? (
          <div>
            <Tooltip title={timeText} placement="topLeft">
              {timeText}
            </Tooltip>
          </div>
        ) : null;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'commissionNew/queryThemeParks' });
    dispatch({
      type: 'commissionNew/fetchPLUList',
      payload: {
        bindingId: null,
        bindingType: 'Commission',
        usageScope: 'Offline',
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/resetAddOfflinePLUData',
    });
  }

  showThemeParkName = text => {
    const {
      commissionNew: { themeParkList },
    } = this.props;
    const showThemeParks = changeThemeParkDisplay(text, themeParkList);
    if (showThemeParks !== null) {
      return (
        <Tooltip
          placement="topLeft"
          title={<span style={{ whiteSpace: 'pre-wrap' }}>{showThemeParks}</span>}
        >
          <span>{showThemeParks}</span>
        </Tooltip>
      );
    }
    return showThemeParks;
  };

  handleSearch = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'commissionNew/fetchPLUList',
          payload: {
            bindingId: null,
            bindingType: 'Commission',
            usageScope: 'Offline',
            commonSearchText: values.commonSearchText,
            themeParkCode: values.themeParkCode,
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
      type: 'commissionNew/fetchPLUList',
      payload: {
        bindingId: null,
        bindingType: 'Commission',
        usageScope: 'Offline',
        commonSearchText: null,
        themeParkCode: null,
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/resetAddOfflinePLUData',
    });
  };

  onSelectChange = selectedRowKeys => {
    const {
      commissionNew: { PLUList },
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveSelectPLU',
      payload: {
        selectedRowKeys,
        PLUList,
      },
    });
  };

  handleOk = (PLUList, checkedList) => {
    const {
      dispatch,
      commissionNew: {
        offlinePLUPagination: { currentPage, pageSize },
      },
    } = this.props;
    const selectedPLUList = [];
    for (let i = 0; i < PLUList.length; i += 1) {
      if (PLUList[i].isSelected) {
        selectedPLUList.push(objDeepCopy(PLUList[i]));
      }
    }
    if (selectedPLUList.length === 0) {
      message.warning('Select at least one PLU.');
      return;
    }
    for (let i = 0; i < selectedPLUList.length; i += 1) {
      selectedPLUList[i].selectedType = 'subPLU';
      for (let k = 0; k < selectedPLUList[i].subCommodityList.length; k += 1) {
        selectedPLUList[i].selectedType = 'packagePLU';
        selectedPLUList[i].subCommodityList[k].proCommoditySpecId =
          selectedPLUList[i].commoditySpecId;
        selectedPLUList[i].subCommodityList[k].selectedType = 'subPLU';
      }
      for (let j = 0; j < selectedPLUList[i].subCommodityList.length; j += 1) {
        if (!selectedPLUList[i].subCommodityList[j].isSelected) {
          selectedPLUList[i].subCommodityList.splice(j, 1);
          j -= 1;
        }
      }
    }
    for (let i = 0; i < selectedPLUList.length; i += 1) {
      let changeFlag = true;
      for (let j = 0; j < checkedList.length; j += 1) {
        if (checkedList[j].commoditySpecId === selectedPLUList[i].commoditySpecId) {
          changeFlag = false;
          checkedList[j].subCommodityList = objDeepCopy(selectedPLUList[i].subCommodityList);
        }
      }
      if (changeFlag) {
        checkedList.push(selectedPLUList[i]);
      }
    }
    const displayOfflineList = [];
    if (currentPage * pageSize < checkedList.length) {
      for (let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i += 1) {
        displayOfflineList.unshift(checkedList[i]);
      }
    } else {
      for (let i = (currentPage - 1) * pageSize; i < checkedList.length; i += 1) {
        displayOfflineList.unshift(checkedList[i]);
      }
    }
    dispatch({
      type: 'commissionNew/save',
      payload: {
        checkedList,
        displayOfflineList,
      },
    });
    this.handleCancel();
  };

  onSubSelectChange = (subSelectedRowKeys, commoditySpecId, PLUList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveSubSelectPLU',
      payload: {
        subSelectedRowKeys,
        commoditySpecId,
        PLUList,
      },
    });
  };

  getSubRowSelectedRowKeys = (record, PLUList) => {
    for (let i = 0; i < PLUList.length; i += 1) {
      if (PLUList[i].commoditySpecId === record.commoditySpecId) {
        const subSelectedKeys = [];
        for (let j = 0; j < PLUList[i].subCommodityList.length; j += 1) {
          if (PLUList[i].subCommodityList[j].isSelected) {
            subSelectedKeys.push(PLUList[i].subCommodityList[j].commoditySpecId);
          }
        }
        return subSelectedKeys;
      }
    }
    return [];
  };

  expandedRowRender = (record, PLUList, checkedList) => {
    const { subCommodityList, commoditySpecId } = record;
    let subCheckedList = [];
    for (let i = 0; i < checkedList.length; i += 1) {
      if (commoditySpecId === checkedList[i].commoditySpecId) {
        subCheckedList = checkedList[i].subCommodityList;
      }
    }
    const subRowSelection = {
      selectedRowKeys: this.getSubRowSelectedRowKeys(record, PLUList),
      onChange: selectedRowKeys =>
        this.onSubSelectChange(selectedRowKeys, record.commoditySpecId, PLUList),
      getCheckboxProps: rec => {
        return {
          disabled:
            rec.bindingOtherFlg === 'Y' ||
            !!subCheckedList.find(item => item.commoditySpecId === rec.commoditySpecId),
        };
      },
    };
    if (subCommodityList.length === 0) {
      return null;
    }
    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={subCommodityList}
          pagination={false}
          bordered={false}
          rowKey={rec => rec.commoditySpecId}
          rowSelection={subRowSelection}
        />
      </div>
    );
  };

  getSelectedRowKes = PLUList => {
    const selectedRowKeys = [];
    for (let i = 0; i < PLUList.length; i += 1) {
      if (PLUList[i].isSelected) {
        selectedRowKeys.push(PLUList[i].commoditySpecId);
      }
    }
    return selectedRowKeys;
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      commissionNew: {
        addPLUModal,
        PLUList,
        checkedList,
        themeParkList = [],
        offlineSearchCondition: { currentPage, pageSize: nowPageSize },
        addOfflinePLUTotalSize,
      },
    } = this.props;
    const rowSelection = {
      columnWidth: 40,
      selectedRowKeys: this.getSelectedRowKes(PLUList),
      onChange: this.onSelectChange,
      getCheckboxProps: record => {
        const { subCommodityList = [] } = record;
        const isDisabled =
          subCommodityList.length > 0 &&
          !subCommodityList.find(rec => {
            // const fd = checkedOnlineList.find(item => rec.commoditySpecId === item.commoditySpecId);
            // const subCheckedOnlineList = fd? fd.subCommodityList : [];

            return rec.bindingOtherFlg !== 'Y';
          });
        return {
          disabled:
            isDisabled ||
            record.bindingOtherFlg === 'Y' ||
            !!checkedList.find(item => item.commoditySpecId === record.commoditySpecId),
        };
      },
    };
    const pageOpts = {
      total: addOfflinePLUTotalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'commissionNew/fetchPLUList',
          payload: {
            currentPage: page,
            pageSize,
          },
        });
      },
    };
    return (
      <div>
        <Modal
          maskClosable={false}
          visible={addPLUModal}
          width={drawWidth}
          title={<span className={styles.title}>{formatMessage({ id: 'ADD_OFFLINE_PLU' })}</span>}
          onCancel={this.handleCancel}
          footer={
            <div>
              <Button
                style={{ width: 60 }}
                onClick={() => this.handleOk(PLUList, checkedList)}
                type="primary"
              >
                OK
              </Button>
              <Button onClick={this.handleCancel} style={{ width: 60 }}>
                Cancel
              </Button>
            </div>
          }
        >
          <Form onSubmit={this.handleSearch}>
            <Row>
              <Col className={styles.inputColStyle} xs={24} sm={12} md={9}>
                <Form.Item>
                  {getFieldDecorator(
                    `commonSearchText`,
                    {}
                  )(
                    <Input
                      style={{ minWidth: '100%' }}
                      placeholder={formatMessage({ id: 'PLU_CODE_AND_DESCRIPTION' })}
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
                          <Option key={item.bookingCategoryCode} value={item.bookingCategoryCode}>
                            {item.bookingCategoryName}
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
                <Button onClick={this.handleReset}>Reset</Button>
              </Col>
            </Row>
          </Form>
          <Table
            className={`tabs-no-padding ${styles.searchTitle}`}
            columns={this.columns}
            dataSource={PLUList}
            pagination={false}
            loading={!!loading}
            rowSelection={rowSelection}
            rowKey={record => record.commoditySpecId}
            expandedRowRender={record => this.expandedRowRender(record, PLUList, checkedList)}
            rowClassName={record =>
              record.subCommodityList.length === 0 ? styles.hideIcon : undefined
            }
            size="small"
          />
          <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
        </Modal>
      </div>
    );
  }
}
export default AddOfflinePLUModal;
