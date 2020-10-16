import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import CurrencyFormatter from 'currencyformatter.js';
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
  Collapse,
} from 'antd';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import SortSelect from '@/components/SortSelect';
import WalletInvoice from '@/pages/TravelAgentWallet/components/Invoice';

const CURRENCY_FORMATTER_OPTIONS = {
  symbol: '', // Overrides the currency's default symbol
  decimal: '.', // Overrides the locale's decimal character
  group: ',', // Overrides the locale's group character (thousand separator)
  pattern: '#,##0', // Overrides the locale's default display pattern
};

const CURRENCY_FORMATTER_OPTIONS_DECIMAL = {
  symbol: '', // Overrides the currency's default symbol
  decimal: '.', // Overrides the locale's decimal character
  group: ',', // Overrides the locale's group character (thousand separator)
  pattern: '#,##0.00', // Overrides the locale's default display pattern
};

const ACTIVITY_STATUS = {
  Approved: '00',
  Rejected: '01',
  PendingReview: '02',
  PendingOthersReview: '03',
};

@Form.create()
@connect(({ global, taWalletMgr, loading }) => ({
  global,
  taWalletMgr,
  loading: loading.effects['taWalletMgr/fetchAccountFlowList'],
}))
class Wallet extends React.PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({ type: 'taWalletMgr/clear' });
    dispatch({ type: 'taWalletMgr/fetchTransactionTypes' });
    const {
      query: { taId },
    } = location;
    if (taId) {
      dispatch({
        type: 'taWalletMgr/effectSave',
        payload: {
          taId,
        },
      }).then(() => {
        dispatch({ type: 'taWalletMgr/fetchAccountDetail' }).then(() => {
          dispatch({ type: 'taWalletMgr/fetchMyActivityList' });
        });
        dispatch({ type: 'taWalletMgr/fetchAccountFlowList' });
        this.interval = setInterval(
          () => dispatch({ type: 'taWalletMgr/fetchAccountDetail' }),
          1000 * 5
        );
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSearch = ev => {
    ev.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({ type: 'taWalletMgr/fetchAccountFlowList', payload: { filter: values } });
      }
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'taWalletMgr/fetchAccountFlowList',
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
      type: 'taWalletMgr/fetchAccountFlowList',
      payload: {
        pagination: {
          currentPage: page.current,
          pageSize: page.pageSize,
        },
      },
    });
  };

  getTableHeight = () => {
    const { offsetHeight: layoutHeight } = document.getElementById('layout');
    if (
      document.getElementById('pageHeaderTitle') &&
      document.getElementById('walletCard') &&
      document.getElementById('pageSearchCard')
    ) {
      const { offsetHeight: pageHeaderTitleHeight } = document.getElementById('pageHeaderTitle');
      const { offsetHeight: walletCardHeight } = document.getElementById('walletCard');
      const { offsetHeight: pageSearchCardHeight } = document.getElementById('pageSearchCard');
      return layoutHeight - pageHeaderTitleHeight - walletCardHeight - pageSearchCardHeight - 320;
    }
    return layoutHeight;
  };

  changePanel = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taWalletMgr/save',
      payload: {
        activeKey: key,
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
      taWalletMgr: {
        dataSource = [],
        transactionTypes = [],
        account = {},
        pagination = {},
        arActivity = {},
        activeKey,
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
        width: 200,
        dataIndex: 'transactionId',
        key: 'transactionId',
        render: text => {
          return <Tooltip title={text}>{text}</Tooltip>;
        },
      },
      {
        title: formatMessage({ id: 'TRANSACTION_TYPE' }),
        width: 120,
        dataIndex: 'tranType',
        key: 'tranType',
        render: text => {
          return <Tooltip title={transactionTypesMap[text]}>{transactionTypesMap[text]}</Tooltip>;
        },
      },
      {
        title: 'Transaction Date',
        width: 170,
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
        width: 100,
        key: 'charge',
        render: (text, record) => {
          const chargeText =
            (record.flow === 0 ? '+' : '-') +
            CurrencyFormatter.format(record.charge, CURRENCY_FORMATTER_OPTIONS_DECIMAL);
          return <Tooltip title={chargeText}>{chargeText}</Tooltip>;
        },
      },
      {
        title: 'Invoice No.',
        width: 100,
        key: 'invoiceNo',
        render: (text, record) => {
          const invoiceText =
            (record.sourceSystem ? record.sourceInvoiceNo : record.invoiceNo) || '-';
          return <Tooltip title={invoiceText}>{invoiceText}</Tooltip>;
        },
      },
      {
        title: 'Partners Order No.',
        width: 120,
        key: 'referenceNo',
        dataIndex: 'referenceNo',
        render: text => {
          return (
            <Tooltip title={text || '-'}>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (text) {
                    router.push(
                      `/TicketManagement/Ticketing/QueryOrder?backFlag=payment&orderNo=${text}`
                    );
                  }
                }}
              >
                {text || '-'}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Galaxy Order No.',
        width: 120,
        key: 'galaxyOrderNo',
        dataIndex: 'galaxyOrderNo',
        render: text => {
          return <Tooltip title={text || '-'}>{text || '-'}</Tooltip>;
        },
      },
      {
        title: 'Travel Agent Reference No.',
        width: 120,
        key: 'taReferenceNo',
        dataIndex: 'taReferenceNo',
        render: text => {
          return <Tooltip title={text || '-'}>{text || '-'}</Tooltip>;
        },
      },
      {
        title: formatMessage({ id: 'STATUS' }),
        width: 120,
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
        width: 90,
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
        breadcrumbName: formatMessage({ id: 'TRAVEL_AGENT_WALLET' }),
        url: '/TravelAgentWallet',
      },
      {
        breadcrumbName: formatMessage({ id: 'WALLET' }),
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
        <div id="pageHeaderTitle">
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
        </div>
        <div id="walletCard" style={{ marginBottom: 16 }}>
          <Collapse activeKey={activeKey} onChange={key => this.changePanel(key)}>
            <Collapse.Panel
              header={activeKey.length === 0 ? 'Show balance widget' : 'Hide balance widget'}
              key="1"
            >
              <Row gutter={24}>
                <Col lg={12} md={12}>
                  <div className={`${styles.flexBetween} ${styles.walletCard}`}>
                    <div style={{ height: '100%' }} className={styles.flexCenter}>
                      <div className={styles.lighthouse} />
                      <div className={styles.account}>
                        <div className={styles.label}>{formatMessage({ id: 'EW' })}:</div>
                        {eWallet && (
                          <div className={`${styles.labelValue} ${styles.colorBlack}`}>
                            <span className={styles.symbolPart}>$</span>
                            <span className={styles.integerPart}>
                              {CurrencyFormatter.format(
                                eWallet.balance,
                                CURRENCY_FORMATTER_OPTIONS
                              )}
                            </span>
                            <span className={styles.decimalPart}>.{eWallet.decimal}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={12}>
                  <div className={`${styles.flexBetween} ${styles.walletCard}`}>
                    <div style={{ height: '100%' }} className={styles.flexCenter}>
                      <div className={styles.lighthouseOrange} />
                      <div className={styles.account}>
                        <div className={styles.label}>{formatMessage({ id: 'AR' })}:</div>
                        {ar && (
                          <div className={`${styles.labelValue} ${styles.colorOrange}`}>
                            <span className={styles.symbolPart}>$</span>
                            <span className={styles.integerPart}>
                              {CurrencyFormatter.format(ar.integer, CURRENCY_FORMATTER_OPTIONS)}
                            </span>
                            <span className={styles.decimalPart}>.{ar.decimal}</span>
                          </div>
                        )}
                        {!ar && !arActivity.status && (
                          <div className={`${styles.labelValue} ${styles.colorOrange}`}>
                            {formatMessage({ id: 'No_Account_Ar' })}
                          </div>
                        )}
                        {!ar && arActivity.status === ACTIVITY_STATUS.Rejected && (
                          <div className={`${styles.labelValue} ${styles.colorOrange}`}>
                            {formatMessage({ id: 'REJECT' })}
                          </div>
                        )}
                        {!ar && arActivity.status === ACTIVITY_STATUS.PendingOthersReview && (
                          <div className={`${styles.labelValue} ${styles.colorOrange}`}>
                            {formatMessage({ id: 'PENDING_OPREATION' })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        </div>
        <Card>
          <div id="pageSearchCard">
            <Form onSubmit={this.handleSearch}>
              <Row justify="space-around" gutter={24}>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
                  <Form.Item>
                    {getFieldDecorator(`transactionId`, {
                      rules: [
                        {
                          required: false,
                          message: '',
                        },
                      ],
                    })(<Input placeholder="PARTNERS Transaction No." allowClear />)}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
                  <Form.Item>
                    {getFieldDecorator(`transactionType`, {
                      rules: [{ required: false, message: '' }],
                    })(
                      <SortSelect
                        placeholder="Transaction Type"
                        allowClear
                        options={transactionTypes.map((item, index) => {
                          return (
                            // eslint-disable-next-line react/no-array-index-key
                            <Select.Option value={item.value} key={`tr_options_${index}`}>
                              {item.label}
                            </Select.Option>
                          );
                        })}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
                  <Form.Item>
                    {getFieldDecorator(`dateRange`, {
                      rules: [{ required: false, message: '' }],
                    })(
                      <DatePicker.RangePicker
                        style={{ width: '100%' }}
                        format="DD-MMM-YYYY"
                        allowClear
                        disabledDate={current => current && current > moment().endOf('day')}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
                  <Form.Item>
                    {getFieldDecorator(
                      'galaxyOrderNo',
                      {}
                    )(
                      <Input
                        allowClear
                        disabled={loading}
                        placeholder={formatMessage({
                          id: 'MyWallet.flow.filter.galaxyOrderNo.placeholder',
                        })}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
                  <Form.Item>
                    {getFieldDecorator(
                      'invoiceNo',
                      {}
                    )(
                      <Input
                        allowClear
                        disabled={loading}
                        placeholder={formatMessage({
                          id: 'MyWallet.flow.filter.invoiceNo.placeholder',
                        })}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                  xxl={6}
                  style={{ textAlign: 'right', float: 'right' }}
                >
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
          </div>
        </Card>
        <Card>
          <Spin spinning={loading}>
            <MediaQuery maxWidth={SCREEN.screenXsMax}>
              <Table
                size="small"
                className={styles.tableStyle}
                dataSource={dataSource}
                columns={columns}
                pagination={paginationSetting}
                onChange={this.handleTableChange}
                scroll={{ x: 800 }}
              />
            </MediaQuery>
            <MediaQuery minWidth={SCREEN.screenSmMin}>
              <Table
                size="small"
                className={styles.tableStyle}
                dataSource={dataSource}
                columns={columns}
                pagination={paginationSetting}
                onChange={this.handleTableChange}
                scroll={{ x: 800, y: this.getTableHeight() }}
              />
            </MediaQuery>
          </Spin>
        </Card>
        <WalletInvoice
          onRef={ref => {
            this.invoice = ref;
          }}
        />
      </Col>
    );
  }
}

export default Wallet;
