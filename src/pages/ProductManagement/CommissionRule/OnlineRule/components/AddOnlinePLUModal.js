import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Select, Input, Form } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './AddOnlinePLUModal.less';

const drawWidth = 700;
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
    },
    {
      title: formatMessage({ id: 'OFFER_IDENTIFIER' }),
      dataIndex: 'commodityIdentifier',
    },
  ];

  detailColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commodityCode',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityIdentifier',
    },
  ];

  componentDidMount() {
    const { dispatch, tplId } = this.props;

    dispatch({
      type: 'commissionNew/fetchOfferList',
      payload: {
        bindingId: tplId,
        bindingType: 'Agent',
        commodityType: 'Offer',
      },
    });
  }

  search = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const likeParam = {
          commonSearchText: values.offerName || '',
        };
        dispatch({
          type: 'commissionNew/searchOffer',
          payload: {
            filter: {
              likeParam,
            },
          },
        });
      }
    });
  };

  reset = () => {
    const { dispatch, form, tplId } = this.props;
    form.resetFields();
    dispatch({
      type: 'commissionNew/reset',
      payload: {
        currentPage: 1,
        pageSize: 10,
        bindingId: tplId,
        bindingType: 'Agent',
        commodityType: 'Offer',
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/save',
      payload: {
        addBindingModal: false,
      },
    });
  };

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveSelectOffer',
      payload: {
        selectedRowKeys,
      },
    });
  };

  onExpandEvent = (expanded, record) => {
    const { expandedRowKeys = [], dispatch } = this.props;
    const expandedRowKeySet = new Set(expandedRowKeys);
    if (expanded) {
      expandedRowKeySet.add(record.PLUCode);
    } else {
      expandedRowKeySet.delete(record.PLUCode);
    }
    dispatch({
      type: 'commissionNew/saveData',
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
        />
      </div>
    );
  };

  onChangeEvent = pagination => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    dispatch({
      type: 'commissionNew/saveData',
      payload: {
        currentPage: current,
        pageSize,
        expandedRowKeys: [],
      },
    }).then(() => {
      dispatch({
        type: 'commissionNew/fetchOfferList',
      });
    });
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      loading,
      commissionNew: {
        addBindingModal,
        offerList,
        currentPage,
        pageSize,
        totalSize,
        selectedRowKeys,
      },
      form: { getFieldDecorator },
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
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
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
              <Button style={{ width: 60 }} onClick={this.OK} type="primary">
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
                    `offerName`,
                    {}
                  )(
                    <Input
                      style={{ minWidth: '100%' }}
                      placeholder="Search (Offer Name/Identifier)"
                      allowClear
                      onChange={this.changeOfferIdenOrName}
                      // value={offerIdenOrName}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col className={styles.inputColStyle} xs={12} sm={12} md={9}>
                <Select
                  showSearch
                  placeholder="Status"
                  // className={styles.inputStyle}
                  allowClear
                  style={{ width: '100%' }}
                  // onChange={this.changeFilterStatus}
                  // value={filterStatus}
                >
                  <Option value="NEW" key="NEW">
                    NEW
                  </Option>
                  <Option value="PUBLISH" key="PUBLISH">
                    PUBLISH
                  </Option>
                  <Option value="UNPUBLISH" key="UNPUBLISH">
                    UNPUBLISH
                  </Option>
                </Select>
              </Col>
              <Col xs={12} sm={12} md={6} className={styles.searchReset}>
                <Button
                  style={{ marginRight: 8 }}
                  // htmlType="button"
                  type="primary"
                  htmlType="submit"
                >
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
            pagination={pagination}
            size="small"
            loading={loading}
            expandedRowRender={this.expandedRowRender}
            onChange={(pagination, filters, sorter, extra) => {
              this.onChangeEvent(pagination, filters, sorter, extra);
            }}
            onExpand={(expanded, record) => {
              this.onExpandEvent(expanded, record);
            }}
            rowSelection={rowSelection}
          />
        </Modal>
      </div>
    );
  }
}
export default AddOnlinePLUModal;
