import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Select, Input, Form, message, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './AddOfflinePLUModal.less';
import PaginationComp from '../../../components/PaginationComp';
import { objDeepCopy } from '@/pages/ProductManagement/utils/tools';
import { formatPrice } from '../../../utils/tools';
import SortSelect from '@/components/SortSelect';

const drawWidth = 900;
const { Option } = Select;
@Form.create()
@connect(({ offlineNew, loading }) => ({
  offlineNew,
  loading: loading.effects['offlineNew/fetchPLUList'],
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
        const timeText = text ? formatPrice(text) : '';
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
        const timeText = text ? formatPrice(text) : '';
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
    dispatch({ type: 'offlineNew/queryThemeParks' });
    dispatch({
      type: 'offlineNew/fetchPLUList',
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
      type: 'offlineNew/resetAddOfflinePLUData',
    });
  }

  showThemeParkName = text => {
    const {
      offlineNew: { themeParkList },
    } = this.props;
    for (let i = 0; i < themeParkList.length; i += 1) {
      if (themeParkList[i].bookingCategoryCode === text) {
        return (
          <Tooltip
            placement="topLeft"
            title={
              <span style={{ whiteSpace: 'pre-wrap' }}>{themeParkList[i].bookingCategoryName}</span>
            }
          >
            <span>{themeParkList[i].bookingCategoryName}</span>
          </Tooltip>
        );
      }
    }
    return null;
  };

  handleSearch = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'offlineNew/fetchPLUList',
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
      type: 'offlineNew/fetchPLUList',
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

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/save',
      payload: {
        addPLUModal: false,
      },
    });
  };

  onSelectChange = selectedRowKeys => {
    const {
      offlineNew: { PLUList },
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/saveSelectPLU',
      payload: {
        selectedRowKeys,
        PLUList,
      },
    });
  };

  handleOk = (PLUList, checkedList) => {
    const {
      dispatch,
      offlineNew: {
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
      type: 'offlineNew/save',
      payload: {
        checkedList,
        displayOfflineList,
      },
    });
    this.handleCancel();
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/resetAddOfflinePLUData',
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

  onSubSelectChange = (subSelectedRowKeys, commoditySpecId, PLUList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/saveSubSelectPLU',
      payload: {
        subSelectedRowKeys,
        commoditySpecId,
        PLUList,
      },
    });
  };

  expandedRowRender = (record, PLUList, checkedList, offlineList) => {
    const { subCommodityList, commoditySpecId } = record;
    let subCheckedList = [];
    for (let i = 0; i < checkedList.length; i += 1) {
      if (commoditySpecId === checkedList[i].commoditySpecId) {
        subCheckedList = checkedList[i].subCommodityList;
      }
    }

    const subChecked = [];
    for (let i = 0; i < offlineList.length; i += 1) {
      if (commoditySpecId === offlineList[i].commoditySpecId) {
        subCheckedList = offlineList[i].subCommodityList;
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
            !!subCheckedList.find(item => item.commoditySpecId === rec.commoditySpecId) ||
            !!subChecked.find(item => item.commoditySpecId === rec.commoditySpecId),
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
      form: { getFieldDecorator },
      loading,
      offlineList,
      offlineNew: {
        addPLUModal,
        PLUList,
        checkedList,
        themeParkList = [],
        offlineSearchCondition: { currentPage, pageSize: nowPageSize },
        addOfflinePLUTotalSize,
      },
    } = this.props;
    const commissionList = [];

    if (offlineList.length > 0) {
      for (let i = 0; i < offlineList.length; i += 1) {
        if (offlineList[i].subCommodityList) {
          for (let j = 0; j < offlineList[i].subCommodityList.length; j += 1) {
            commissionList.push(offlineList[i].subCommodityList[j]);
          }
        }
      }
    }

    const rowSelection = {
      columnWidth: 40,
      selectedRowKeys: this.getSelectedRowKes(PLUList),
      onChange: this.onSelectChange,
      getCheckboxProps: record => {
        // const { subCommodityList = [] } = record;
        // const isDisabled = subCommodityList.length>0 && !subCommodityList.find(rec => {
        //   // const fd = checkedOnlineList.find(item => rec.commoditySpecId === item.commoditySpecId);
        //   // const subCheckedOnlineList = fd? fd.subCommodityList : [];

        //  return rec.bindingOtherFlg !== 'Y'
        // });
        const record2 = [];
        if (record.subCommodityList) {
          for (let i = 0; i < record.subCommodityList.length; i += 1) {
            record2.push(record.subCommodityList[i].commoditySpecId);
          }
        }

        let subChecked = [];
        for (let i = 0; i < offlineList.length; i += 1) {
          if (offlineList[i].subCommodityList) {
            subChecked = offlineList[i].subCommodityList;
          }
        }
        let rec = [];
        if (record.subCommodityList.length > 0) {
          for (let i = 0; i < record.subCommodityList.length; i += 1) {
            if (record.subCommodityList) {
              rec = record.subCommodityList[i].commoditySpecId;
            }
          }
        }

        return {
          disabled:
            // isDisabled ||
            record.bindingOtherFlg === 'Y' ||
            !!checkedList.find(item => item.commoditySpecId === record.commoditySpecId) ||
            !!offlineList.find(item => item.commoditySpecId === record.commoditySpecId) ||
            !!subChecked.find(item => item.commoditySpecId === rec),
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
          type: 'offlineNew/fetchPLUList',
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
                  {getFieldDecorator(`commonSearchText`, {
                    rules: [
                      {
                        required: false,
                        message: '',
                      },
                    ],
                  })(
                    <Input
                      style={{ minWidth: '100%' }}
                      placeholder="PLU Code/PLU Description"
                      allowClear
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col className={styles.inputColStyle} xs={12} sm={12} md={9}>
                {getFieldDecorator(`themeParkCode`, {
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(
                  <SortSelect
                    showSearch
                    placeholder="Theme Park"
                    allowClear
                    style={{ width: '100%' }}
                    options={
                      themeParkList &&
                      themeParkList.map(item => (
                        <Option key={item.bookingCategoryCode} value={item.bookingCategoryCode}>
                          {item.bookingCategoryName}
                        </Option>
                      ))
                    }
                  />
                )}
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
            rowKey={record => record.commoditySpecId}
            size="small"
            loading={!!loading}
            expandedRowRender={record =>
              this.expandedRowRender(record, PLUList, checkedList, offlineList)
            }
            rowSelection={rowSelection}
            rowClassName={record =>
              record.subCommodityList.length === 0 ? styles.hideIcon : undefined
            }
          />
          <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
        </Modal>
      </div>
    );
  }
}
export default AddOfflinePLUModal;
