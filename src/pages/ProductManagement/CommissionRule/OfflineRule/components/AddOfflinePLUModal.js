import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Select, Input, Form, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { cloneDeep } from 'lodash';
import styles from './AddOfflinePLUModal.less';

const drawWidth = 700;
const { Option } = Select;
let checkedList = [];
@Form.create()
@connect(({ offlineNew }) => ({
  offlineNew,
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
    const { dispatch } = this.props;

    dispatch({
      type: 'offlineNew/fetchPLUList',
      payload: {
        commodityType: 'PackagePlu',
        bindingType: 'Agent',
      },
    });
  }

  handleSearch = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const likeParam = {
          commonSearchText: values.commonSearchText || '',
          themeParkCode: values.themeParkCode || '',
        };
        dispatch({
          type: 'offlineNew/searchPLU',
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
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'offlineNew/resetPLU',
      payload: {
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
    checkedList = cloneDeep(PLUList).filter(item => {
      return selectedRowKeys.includes(item.key);
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/saveSelectPLU',
      payload: {
        selectedRowKeys,
      },
    });
  };

  handleOk = (selectedRowKeys, PLUList) => {
    const { dispatch } = this.props;
    if (selectedRowKeys.length > 0) {
      PLUList = PLUList.concat(checkedList);
      dispatch({
        type: 'offlineNew/save',
        payload: {
          PLUList,
          checkedList,
        },
      });
      this.handleCancel();
    } else {
      message.warning('Select at least one PLU.');
    }
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/save',
      payload: {
        addPLUModal: false,
      },
    });
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      form: { getFieldDecorator },
      offlineNew: {
        addPLUModal,
        selectedRowKeys,
        PLUList,
        currentPage,
        pageSize,
        totalSize,
        checkedList,
      },
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => {
        return {
          disabled: !!checkedList.find(item => item.commoditySpecId === record.commoditySpecId),
        };
      },
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
          onCancel={this.handleCancel}
          footer={
            <div>
              <Button
                style={{ width: 60 }}
                onClick={() => this.handleOk(selectedRowKeys, PLUList)}
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
                  <Select showSearch placeholder="Theme Park" allowClear style={{ width: '100%' }}>
                    <Option value="NEW">NEW</Option>
                    <Option value="PUBLISH">PUBLISH</Option>
                    <Option value="UNPUBLISH">UNPUBLISH</Option>
                  </Select>
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
            pagination={pagination}
            rowKey={record => record.commoditySpecId}
            size="small"
            rowSelection={rowSelection}
          />
        </Modal>
      </div>
    );
  }
}
export default AddOfflinePLUModal;
