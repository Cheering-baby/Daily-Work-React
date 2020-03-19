import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';

import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import Invoice from './components/invoice';
import Topup from './components/topup';
import ARApply from './components/ARApply';
import More from './components/More';
import styles from './index.less';

// eslint-disable-next-line no-unused-vars
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
  loading: loading.models.myWallet,
}))
class MyWallet extends React.PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'myWallet/fetchTransactionTypes' });
    // dispatch({ type: 'myWallet/fetchWalletTypes' });
    dispatch({ type: 'myWallet/fetchAccountDetail' });
    dispatch({ type: 'myWallet/fetchAccountFlowList' });
    dispatch({
      type: 'myWallet/fetchMyActivityList',
      payload: {
        activityTplCode: 'ACCOUNT_AR_APPLY',
        currentPage: 1,
        pageSize: 1,
        queryType: '03',
      },
    });
  }

  handleSearch = ev => {
    ev.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({ type: 'myWallet/fetchAccountFlowList', payload: { filter: values } });
      }
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'myWallet/fetchAccountFlowList',
          payload: {
            filter: values,
            pagination: {
              currentPage: 1,
              pageSize: 20,
            },
          },
        });
      }
    });
  };

  handleTableChange = page => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myWallet/fetchAccountFlowList',
      payload: {
        pagination: {
          currentPage: page.current,
          pageSize: page.pageSize,
        },
      },
    });
  };

  invoiceDetail = id => {
    this.invoice.open(id);
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      myWallet: {
        dataSource = [],
        transactionTypes = [],
        account = {},
        pagination = {},
        arActivity = {},
      },
    } = this.props;
    const { eWallet, ar } = account;
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
        render: (text, record, index) => (index < 9 ? `0${index + 1}` : `${index + 1}`),
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
        title: 'Transaction Date',
        key: 'time',
        render: (text, record) => {
          const timeText = record.sourceSystem ? record.sourceTransactionTime : record.createTime;
          return timeText ? moment(timeText).format('DD-MMM-YYYY HH:mm:ss') : '';
        },
      },
      {
        title: 'Amount',
        key: 'charge',
        render: (text, record) =>
          (record.flow === 0 ? '+' : '-') +
          record.charge.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      },
      {
        title: 'Invoice No',
        key: 'invoiceNo',
        render: (text, record) =>
          (record.sourceSystem ? record.sourceInvoiceNo : record.invoiceNo) || '-',
      },
      {
        title: 'Reference No',
        key: 'referenceNo',
        dataIndex: 'referenceNo',
        render: text => text || '-',
      },
      {
        title: 'Galaxy Order No',
        key: 'galaxyOrderNo',
        dataIndex: 'galaxyOrderNo',
        render: text => text || '-',
      },
      {
        title: 'TA Reference No',
        key: 'taReferenceNo',
        dataIndex: 'taReferenceNo',
        render: text => text || '-',
      },
      {
        title: formatMessage({ id: 'STATUS' }),
        dataIndex: 'status',
        key: 'status',
        render: text => {
          return (
            <div>
              <span className={statusList[text].class} />
              {statusList[text].label}
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'OPERATION' }),
        key: 'operation',
        render: (text, record) => {
          if (record.tranType === 'ONLINE_TOPUP' || record.tranType === 'OFFLINE_TOPUP') {
            return (
              <Tooltip title={formatMessage({ id: 'INVOICE' })}>
                <span>
                  <Button
                    type="link"
                    icon="printer"
                    onClick={() => this.invoiceDetail(record.accountBookFlowId)}
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
      current: pagination.currentPage,
      pageSize: pagination.pageSize,
      total: pagination.total,
    };
    return (
      <Col lg={24} md={24}>
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className={styles.BreadcrumbStyle}>TA Management</Breadcrumb.Item>
          <Breadcrumb.Item className={styles.Breadcrumbbold}>My Wallet</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Row gutter={24}>
            <Col lg={12} md={12}>
              <div className={`${styles.flexBetween} ${styles.walletCard}`}>
                <div style={{ height: '100%' }} className={styles.flexCenter}>
                  <div className={styles.lighthouse} />
                  <div className={styles.account}>
                    <div className={styles.label}>eWallet:</div>
                    {eWallet && (
                      <div className={`${styles.labelValue} ${styles.colorBlack}`}>
                        <span className={styles.symbolPart}>$</span>
                        <span className={styles.integerPart}>{eWallet.integer}</span>
                        <span className={styles.decimalPart}>.{eWallet.decimal}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ paddingRight: '24px' }}>
                  <Topup />
                </div>
              </div>
            </Col>
            <Col lg={12} md={12}>
              <div className={`${styles.flexBetween} ${styles.walletCard}`}>
                <div style={{ height: '100%' }} className={styles.flexCenter}>
                  <div className={styles.lighthouseOrange} />
                  <div className={styles.account}>
                    <div className={styles.label}>AR:</div>
                    {ar && (
                      <div className={`${styles.labelValue} ${styles.colorOrange}`}>
                        <span className={styles.symbolPart}>$</span>
                        <span className={styles.integerPart}>{ar.integer}</span>
                        <span className={styles.decimalPart}>.{ar.decimal}</span>
                      </div>
                    )}
                    {!ar &&
                      (arActivity ? (
                        <div className={`${styles.labelValue} ${styles.colorOrange}`}>
                          Pending Operation
                        </div>
                      ) : (
                        <div className={`${styles.labelValue} ${styles.colorOrange}`}>
                          No Account-Ar
                        </div>
                      ))}
                  </div>
                </div>
                {!ar && (
                  <div style={{ paddingRight: '24px' }}>{arActivity ? <More /> : <ARApply />}</div>
                )}
              </div>
            </Col>
          </Row>
        </Card>
        <Card>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col lg={6} xs={24}>
                <Form.Item>
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
              <Col lg={6} xs={24}>
                <Form.Item>
                  {getFieldDecorator(`transactionType`, {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Select placeholder="Transaction Type" allowClear>
                      {transactionTypes.map((item, index) => {
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <Select.Option value={item.value} key={`tr_options_${index}`}>
                            {item.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} xs={24}>
                <Form.Item>
                  {getFieldDecorator(`dateRange`, {
                    rules: [{ required: false, message: '' }],
                  })(
                    <DatePicker.RangePicker
                      format="DD-MMM-YYYY"
                      allowClear
                      disabledDate={current => current && current > moment().endOf('day')}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} xs={24} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#1890FF', width: '73px', borderRadius: '4px' }}
                >
                  {formatMessage({ id: 'BTN_SEARCH' })}
                </Button>
                <Button
                  style={{ marginLeft: 8, width: '66px', borderRadius: '4px' }}
                  onClick={this.handleReset}
                >
                  {formatMessage({ id: 'BTN_RESET' })}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Spin spinning={loading}>
            <Table
              size="small"
              className={styles.tableStyle}
              dataSource={dataSource}
              columns={columns}
              pagination={paginationSetting}
              onChange={this.handleTableChange}
            />
          </Spin>
        </Card>
        <Invoice
          onRef={ref => {
            this.invoice = ref;
          }}
        />
      </Col>
    );
  }
}

export default MyWallet;
