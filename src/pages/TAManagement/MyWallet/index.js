/* eslint-disable */
import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Breadcrumb,
  Tooltip,
} from 'antd';

import Invoice from './components/invoice';
import Topup from './components/topup';

import styles from './index.less';

const formItemLayout = {
  labelCol: {
    // lg: { span: 6 },
    // xs: { span: 24 },
    // sm: { span: 8 },
  },
  wrapperCol: {
    lg: { span: 24 },
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

@Form.create()
@connect(({ myWallet, loading }) => ({
  myWallet,
  loading: loading.effects['myWallet/fetchAccountFlowlList'],
}))
class MyWallet extends React.PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'myWallet/fetchTransactionTypes' });
    dispatch({ type: 'myWallet/fetchWalletTypes' });
    dispatch({ type: 'myWallet/fetchAccountDetail' });
    dispatch({ type: 'myWallet/fetchAccountFlowlList' });
  }

  topUp = () => {
    this.topup.open();
  };

  handleSearch = ev => {
    ev.preventDefault();
    const vm = this;
    const { dispatch } = this.props;
    vm.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({ type: 'myWallet/fetchAccountFlowlList', payload: { filter: values } });
      }
    });
  };

  handleReset = () => {
    const vm = this;
    // const { dispatch } = vm.props;
    vm.props.form.resetFields();
    vm.dispatch({
      type: 'myWallet/search',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  handleTableChange = page => {
    const {
      dispatch,
      myWallet: { pagination },
    } = this.props;

    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'myWallet/fetchAccountFlowlList',
        payload: {
          pagination: page,
        },
      });
    }
  };

  invoiceDetail = id => {
    this.invoice.open(id);
  };

  render() {
    const vm = this;
    const { getFieldDecorator } = vm.props.form;
    const {
      myWallet: {
        dataSource = [],
        walletTypes = [],
        transactionTypes = [],
        account = {},
        pagination = {},
      },
    } = this.props;
    const eWallet = account.eWallet || {};
    const ar = account.ar || {};
    const transactionTypesMap = {};
    transactionTypes.forEach(item => {
      transactionTypesMap[item.value] = item.label;
    });

    const statusList = {
      A: {
        class: styles.statusSuccess,
        label: 'SUCCESS',
      },
      X: {
        class: styles.statusFail,
        label: 'FAIL',
      },
    };

    const columns = [
      {
        title: 'No',
        width: 80,
        key: 'index',
        render: (text, record, index) => (index < 10 ? `0${index + 1}` : `${index + 1}`),
      },
      {
        title: formatMessage({ id: 'TRANSACTION_NO' }),
        dataIndex: 'transactionId',
        key: 'transactionId',
      },
      {
        title: formatMessage({ id: 'TRANSACTION_TYPE' }),
        dataIndex: 'tranType',
        key: 'tranType',
        render: text => {
          return transactionTypesMap[text];
        },
      },
      {
        title: 'Transaction Time',
        dataIndex: 'time',
        key: 'time',
        render: (text, record) =>
          record.sourceSystem ? record.sourceTransactionTime : record.createTime,
      },
      {
        title: 'Income',
        key: 'income',
        render: (text, record) => (record.flow === 0 ? `+${record.charge}` : ''),
      },
      {
        title: 'Expenditure',
        key: 'expenditure',
        render: (text, record) => (record.flow === 1 ? `-${record.charge}` : ''),
      },
      {
        title: formatMessage({ id: 'STATUS' }),
        dataIndex: 'status',
        key: 'status',
        render: text => {
          return (
            <div>
              <span className={statusList[text]['class']} />
              {statusList[text]['label']}
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'OPERATION' }),
        key: 'operation',
        render: (text, record) => {
          if (record.tranType === 'ONLINE_TOPUP' || record.type === 'OFFILNE_TOPUP') {
            return (
              <Tooltip title={formatMessage({ id: 'INVOICE' })}>
                <span>
                  <Button
                    type="link"
                    icon="printer"
                    onClick={e => vm.invoiceDetail(record.accountBookFlowId)}
                  />
                </span>
              </Tooltip>
            );
          }
        },
      },
    ];

    const paginationSetting = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['20', '50', '100'],
      showTotal(total) {
        return `Total ${total} items`;
      },
    };
    Object.assign(paginationSetting, pagination);
    return (
      <Col lg={24} md={24}>
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className={styles.BreadcrumbStyle}>TA Management</Breadcrumb.Item>
          <Breadcrumb.Item className={styles.Breadcrumbbold}>My Wallet</Breadcrumb.Item>
        </Breadcrumb>
        <Card bodyStyle={{ height: '53px' }}>
          <Col lg={12} md={12} className={styles.flexCenter}>
            <span className={styles.label}>eWallet: </span>
            <span className={`${styles.labelValue} ${styles.colorBlack}`}>${eWallet.balance}</span>
            <Button type="link" onClick={vm.topUp}>
              Top Up
            </Button>
          </Col>
          <Col lg={12} md={12} className={styles.flexCenter}>
            <span className={styles.label}>AR:</span>
            <span className={`${styles.labelValue} ${styles.colorOrange}`}>${ar.balance}</span>
            {ar.balance === undefined && <Button type="link">Apply</Button>}
          </Col>
        </Card>
        <Card>
          <Form className="ant-advanced-search-form" onSubmit={vm.handleSearch}>
            <Row gutter={24}>
              <Col lg={6} xs={24}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator(`transactionId`, {
                    rules: [
                      {
                        required: false,
                        message: '',
                      },
                    ],
                  })(<Input placeholder="PAMS Transaction No." allowClear />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  {getFieldDecorator(`walletType`, {
                    rules: [
                      {
                        required: false,
                        message: '',
                      },
                    ],
                  })(
                    <Select placeholder="Wallet Type">
                      {walletTypes.map((item, index) => {
                        return (
                          <Select.Option value={item.value} key={index}>
                            {item.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  {getFieldDecorator(`transactionType`, {
                    rules: [
                      {
                        required: false,
                        message: '',
                      },
                    ],
                  })(
                    <Select placeholder="Transaction Type">
                      {transactionTypes.map((item, index) => {
                        return (
                          <Select.Option value={item.value} key={index}>
                            {item.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  {getFieldDecorator(`dateRange`, {
                    rules: [
                      {
                        required: false,
                        message: '',
                      },
                    ],
                  })(<DatePicker.RangePicker></DatePicker.RangePicker>)}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: '15px' }}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#1890FF', width: '73px', borderRadius: '4px' }}
                >
                  {formatMessage({ id: 'BTN_SEARCH' })}
                </Button>
                <Button
                  style={{ marginLeft: 8, width: '66px', borderRadius: '4px' }}
                  onClick={vm.handleReset}
                >
                  {formatMessage({ id: 'BTN_RESET' })}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Table
            size="small"
            className={styles.tableStyle}
            dataSource={dataSource}
            columns={columns}
            pagination={paginationSetting}
            onChange={this.handleTableChange}
          />
        </Card>
        <Invoice
          onRef={ref => {
            this.invoice = ref;
          }}
        />
        <Topup
          onRef={ref => {
            this.topup = ref;
          }}
        />
      </Col>
    );
  }
}

export default MyWallet;
