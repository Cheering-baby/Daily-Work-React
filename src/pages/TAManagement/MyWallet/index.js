import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import {
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
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import SCREEN from '@/utils/screen';
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
        render: text => {
          return <Tooltip title={text}>{text}</Tooltip>;
        },
      },
      {
        title: formatMessage({ id: 'TRANSACTION_TYPE' }),
        dataIndex: 'tranType',
        key: 'tranType',
        render: text => {
          return <Tooltip title={transactionTypesMap[text]}>{transactionTypesMap[text]}</Tooltip>;
        },
      },
      {
        title: 'Transaction Date',
        key: 'time',
        render: (text, record) => {
          const timeText = record.sourceSystem ? record.sourceTransactionTime : record.createTime;
          return (
            <Tooltip title={timeText ? moment(timeText).format('DD-MMM-YYYY HH:mm:ss') : ''}>
              {timeText ? moment(timeText).format('DD-MMM-YYYY HH:mm:ss') : ''}
            </Tooltip>
          );
        },
      },
      {
        title: 'Amount',
        key: 'charge',
        render: (text, record) => {
          const chargeText =
            (record.flow === 0 ? '+' : '-') +
            record.charge.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <Tooltip title={chargeText}>{chargeText}</Tooltip>;
        },
      },
      {
        title: 'Invoice No',
        key: 'invoiceNo',
        render: (text, record) => {
          const invoiceText =
            (record.sourceSystem ? record.sourceInvoiceNo : record.invoiceNo) || '-';
          return <Tooltip title={invoiceText}>{invoiceText}</Tooltip>;
        },
      },
      {
        title: 'Reference No',
        key: 'referenceNo',
        dataIndex: 'referenceNo',
        render: text => {
          return <Tooltip title={text || '-'}>{text || '-'}</Tooltip>;
        },
      },
      {
        title: 'Galaxy Order No',
        key: 'galaxyOrderNo',
        dataIndex: 'galaxyOrderNo',
        render: text => {
          return <Tooltip title={text || '-'}>{text || '-'}</Tooltip>;
        },
      },
      {
        title: 'TA Reference No',
        key: 'taReferenceNo',
        dataIndex: 'taReferenceNo',
        render: text => {
          return <Tooltip title={text || '-'}>{text || '-'}</Tooltip>;
        },
      },
      {
        title: formatMessage({ id: 'STATUS' }),
        dataIndex: 'status',
        key: 'status',
        render: text => {
          return (
            <Tooltip title={statusList[text].label}>
              <div>
                <span className={statusList[text].class} />
                {statusList[text].label}
              </div>
            </Tooltip>
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
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: '/TAManagement/My Wallet',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_WALLET' }),
        url: null,
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
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
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
          <Form onSubmit={this.handleSearch}>
            <Row type="flex" justify="space-around" gutter={24}>
              <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
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
              <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
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
              <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
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
              <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} style={{ textAlign: 'right' }}>
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
