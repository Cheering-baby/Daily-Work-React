import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Row, Col, Button, Input, Form } from 'antd';
import { formatMessage } from 'umi/locale';
import { isEqual } from 'lodash';
import styles from './AddOfferModal.less';

const drawWidth = 700;
@Form.create()
@connect(({ grant, loading }) => ({
  grant,
  loading: loading.effects['grant/addOfferList'],
}))
class AddOfferModal extends React.PureComponent {
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

  componentDidMount() {
    const { dispatch, rowAllSelected } = this.props;
    dispatch({
      type: 'grant/fetchCommodityList',
      payload: {
        bindingId: rowAllSelected && rowAllSelected.taId ? rowAllSelected.taId : '',
        bindingType: 'Agent',
        commodityType: 'Offer',
      },
    });
  }

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'grant/saveSelectOffer',
      payload: {
        selectedRowKeys,
      },
    });
  };

  search = e => {
    const { form, dispatch, rowAllSelected } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const likeParam = {
          commonSearchText: values.offerName || '',
        };
        dispatch({
          type: 'grant/search',
          payload: {
            filter: {
              likeParam,
            },
            bindingId: rowAllSelected && rowAllSelected.taId ? rowAllSelected.taId : '',
            bindingType: 'Agent',
            commodityType: 'Offer',
          },
        });
      }
    });
  };

  handleReset = () => {
    const { dispatch, form, rowAllSelected } = this.props;
    form.resetFields();
    dispatch({
      type: 'grant/reset',
      payload: {
        currentPage: 1,
        pageSize: 10,
        bindingId: rowAllSelected && rowAllSelected.taId ? rowAllSelected.taId : '',
        bindingType: 'Agent',
        commodityType: 'Offer',
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'grant/save',
      payload: {
        addOfferModal: false,
      },
    });
  };

  handleTableChange = page => {
    const {
      dispatch,
      rowAllSelected,
      grant: { pagination },
    } = this.props;

    // If the paging changes, call the query interface again
    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'grant/tableChanged',
        payload: {
          pagination: page,
          bindingId: rowAllSelected && rowAllSelected.taId ? rowAllSelected.taId : '',
          bindingType: 'Agent',
          commodityType: 'Offer',
        },
      });
    }
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      loading,
      grant: {
        addOfferModal,
        addOfferList,
        selectedRowKeys,
        pagination: { currentPage, pageSize, totalSize },
      },
      form: { getFieldDecorator },
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
          visible={addOfferModal}
          width={drawWidth}
          title={<span className={styles.title}>{formatMessage({ id: 'ADD_OFFER' })}</span>}
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
                <Button style={{ marginRight: 8 }} type="primary" onClick={this.search}>
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
              loading={loading}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </Form>
        </Modal>
      </div>
    );
  }
}
export default AddOfferModal;
