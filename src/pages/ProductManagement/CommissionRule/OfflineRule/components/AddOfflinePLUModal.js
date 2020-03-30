import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Select, Input, Form } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './AddOfflinePLUModal.less';

const drawWidth = 700;
const { Option } = Select;
@Form.create()
@connect(({ offlineNew }) => ({
  offlineNew,
}))
class AddOfflinePLUModal extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'PLUName',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'PLUDescription',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themePark',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'offlineNew/fetchPLUList',
      payload: {
        commodityType: 'PackagePlu',
      },
    });
  }

  handleSearch = ev => {
    ev.preventDefault();
    const { form } = this.props;
    const { dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'offlineNew/searchPLU',
          payload: {
            filter: {
              offerName: values.offerName,
              themePark: values.themePark,
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
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/saveSelectPLU',
      payload: {
        selectedRowKeys,
      },
    });
  };

  // onSelectChange = (selectedRowKeys, selectedRows) => {
  //   const {
  //     dispatch,
  //     commissionNew: { offerExistedDisales },
  //   } = this.props;
  //   const offerSelectItemPush = [];
  //   selectedRows.forEach(item => {
  //     const { PLUCode } = item;
  //     if (offerExistedDisales.indexOf(PLUCode) === -1) {
  //       item.opType = 'A';
  //       offerSelectItemPush.push(item);
  //     }
  //   });
  //   dispatch({
  //     type: 'commissionNew/saveSelectPLU',
  //     payload: {
  //       PLUSelected: selectedRowKeys,
  //       PLUSelectItem: offerSelectItemPush,
  //     },
  //   });
  // };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      form: { getFieldDecorator },
      offlineNew: { addPLUModal, selectedRowKeys, PLUList, currentPage, pageSize, totalSize },
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
              <Button onClick={this.cancel} style={{ width: 60 }}>
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
                      placeholder="PLU Code/PLU Description"
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
                    // className={styles.inputStyle}
                    allowClear
                    style={{ width: '100%' }}
                    // onChange={this.changeFilterStatus}
                    // value={filterStatus}
                  >
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
            rowKey={record => record.PLUCode}
            size="small"
            rowSelection={rowSelection}
          />
        </Modal>
      </div>
    );
  }
}
export default AddOfflinePLUModal;
