import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Select, Input, Form } from 'antd';
import { formatMessage } from 'umi/locale';
import { isEqual } from 'lodash';
import styles from './AddOnlinePLUModal.less';

const drawWidth = 700;
const { Option } = Select;
@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class AddOfflinePLUModal extends React.PureComponent {
  columns = [
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
      type: 'commissionNew/fetchPLUList',
      payload: {
        bindingId: tplId,
        bindingType: 'Agent',
        commodityType: 'PackagePlu',
      },
    });
  }

  handleSearch = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const likeParam = {
          commonSearchText: values.offerName || '',
        };
        dispatch({
          type: 'commissionNew/searchPLU',
          payload: {
            filter: {
              likeParam,
            },
          },
        });
      }
    });
  };

  handleReset = () => {
    const { dispatch, form, tplId } = this.props;
    form.resetFields();
    dispatch({
      type: 'commissionNew/resetPLU',
      payload: {
        currentPage: 1,
        pageSize: 10,
        bindingId: tplId,
        bindingType: 'Agent',
        commodityType: 'PackagePlu',
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/save',
      payload: {
        addPLUModal: false,
      },
    });
  };

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/saveSelectPLU',
      payload: {
        selectedRowKeys,
      },
    });
  };

  handleTableChange = page => {
    const {
      dispatch,
      commissionNew: { pagination },
    } = this.props;

    // If the paging changes, call the query interface again
    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'commissionNew/tableChanged',
        payload: {
          pagination: page,
        },
      });
    }
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      form: { getFieldDecorator },
      commissionNew: { addPLUModal, selectedRowKeys, PLUList, currentPage, pageSize, totalSize },
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
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
        <Modal
          maskClosable={false}
          visible={addPLUModal}
          width={drawWidth}
          title={<span className={styles.title}>{formatMessage({ id: 'ADD_OFFLINE_PLU' })}</span>}
          onCancel={this.cancel}
          footer={
            <div>
              <Button style={{ width: 60 }} onClick={this.OK} type="primary">
                OK
              </Button>
              <Button onClick={this.cancel} style={{ width: 60 }} onClick={this.cancel}>
                Cancel
              </Button>
            </div>
          }
        >
          <Form onSubmit={this.handleSearch}>
            <Row>
              <Col className={styles.inputColStyle} xs={24} sm={12} md={9}>
                <Form.Item>
                  {getFieldDecorator(`offerName`, {
                    rules: [
                      {
                        required: false,
                        message: '',
                      },
                    ],
                  })(
                    <Input
                      style={{ minWidth: '100%' }}
                      placeholder={formatMessage({ id: 'PLU_CODE_AND_DESCRIPTION' })}
                      allowClear
                      onChange={this.changeOfferIdenOrName}
                      // value={offerIdenOrName}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col className={styles.inputColStyle} xs={12} sm={12} md={9}>
                {getFieldDecorator(`themePark`, {
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    placeholder="Status"
                    allowClear
                    style={{ width: '100%' }}
                    // onChange={this.changeFilterStatus}
                  >
                    <Option value="NEW">NEW</Option>
                    <Option value="PUBLISH">PUBLISH</Option>
                    <Option value="UNPUBLISH">UNPUBLISH</Option>
                  </Select>
                )}
              </Col>
              <Col xs={12} sm={12} md={6} className={styles.searchReset}>
                <Button
                  style={{ marginRight: 8 }}
                  htmlType="button"
                  type="primary"
                  htmlType="submit"
                >
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
            pagination={pagination}
            rowSelection={rowSelection}
            rowKey={record => record.commoditySpecId}
            size="small"
            onChange={this.handleTableChange}
          />
        </Modal>
      </div>
    );
  }
}
export default AddOfflinePLUModal;
