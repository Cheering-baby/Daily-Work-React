import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import { Button, Card, Col, Form, Row, Spin, Table, Tooltip, Modal, Collapse } from 'antd';
import CurrencyFormatter from 'currencyformatter.js';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import SCREEN from '@/utils/screen';
import Invoice from './components/invoice';
import Topup from './components/topup';
import ARApply from './components/ARApply';
import More from './components/More';
import Approval from './components/Approval';
import styles from './index.less';
import Filter from './components/Filter';

const CURRENCY_FORMATTER_OPTIONS = {
  // currency: 	'USD', 		// If currency is not supplied, defaults to USD
  symbol: '', // Overrides the currency's default symbol
  // thousand: ',',
  // locale: 	'en',			  // Overrides the currency's default locale (see supported locales)
  decimal: '.', // Overrides the locale's decimal character
  group: ',', // Overrides the locale's group character (thousand separator)
  pattern: '#,##0', // Overrides the locale's default display pattern
};

const CURRENCY_FORMATTER_OPTIONS_DECIMAL = {
  // currency: 	'USD', 		// If currency is not supplied, defaults to USD
  symbol: '', // Overrides the currency's default symbol
  // thousand: ',',
  // locale: 	'en',			  // Overrides the currency's default locale (see supported locales)
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
@connect(({ global, myWallet, loading }) => ({
  global,
  myWallet,
  loading: loading.effects['myWallet/fetchAccountFlowList'],
}))
class MyWallet extends React.PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch, location } = this.props;

    this.handleTopupCompleted(location.search);
    dispatch({ type: 'myWallet/clear' });
    dispatch({ type: 'myWallet/fetchTransactionTypes' });
    // dispatch({ type: 'myWallet/fetchWalletTypes' });
    dispatch({ type: 'myWallet/fetchAccountDetail' }).then(() => {
      dispatch({ type: 'myWallet/fetchMyActivityList' });
    });
    dispatch({ type: 'myWallet/fetchAccountFlowList' });

    this.interval = setInterval(() => dispatch({ type: 'myWallet/fetchAccountDetail' }), 1000 * 5);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleTopupCompleted = search => {
    if (!search) return;
    const arrs = search.split('?');
    const result = {};
    if (arrs[1]) {
      const arr = arrs[1].split('&');
      // eslint-disable-next-line no-plusplus
      for (let i = 0, j = arr.length; i < j; i++) {
        const _r = arr[i].split('=');
        // eslint-disable-next-line prefer-destructuring
        result[_r[0]] = _r[1];
      }
    }
    if (result.paymentOrderId) {
      if (result.errorCode) {
        Modal.warning({
          width: 430,
          content: (
            <div style={{ padding: '0 38px' }}>
              The payment order No. [
              <span style={{ 'font-weight': 'bold' }}>{result.paymentOrderId}</span>] failed to top
              up.
              <br />
              For assistance, please contact your sales manager with payment order No.
            </div>
          ),
        });
      } else {
        Modal.success({
          width: 450,
          content: (
            <div style={{ padding: '0 38px' }}>
              The payment order No. [
              <span style={{ 'font-weight': 'bold' }}>{result.paymentOrderId}</span>] top up
              successfully!
            </div>
          ),
        });
      }
    }
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
      type: 'myWallet/save',
      payload: {
        activeKey: key,
      },
    });
  };

  render() {
    const {
      loading,
      myWallet: {
        dataSource = [],
        transactionTypes = [],
        account = {},
        pagination = {},
        arActivity = {},
        activeKey,
      },
      global: { userCompanyInfo = {} },
    } = this.props;

    const taUserStatus = userCompanyInfo.status || '-1';
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
        title: 'No.',
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
        width: 200,
      },
      {
        title: formatMessage({ id: 'TRANSACTION_TYPE' }),
        dataIndex: 'tranType',
        key: 'tranType',
        render: text => {
          return <Tooltip title={transactionTypesMap[text]}>{transactionTypesMap[text]}</Tooltip>;
        },
        width: 120,
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
        width: 170,
      },
      {
        title: 'Amount',
        key: 'charge',
        render: (text, record) => {
          const chargeText =
            (record.flow === 0 ? '+' : '-') +
            CurrencyFormatter.format(record.charge, CURRENCY_FORMATTER_OPTIONS_DECIMAL);
          return <Tooltip title={chargeText}>{chargeText}</Tooltip>;
        },
        width: 100,
      },
      {
        title: 'Invoice No.',
        key: 'invoiceNo',
        render: (text, record) => {
          const invoiceText =
            (record.sourceSystem ? record.sourceInvoiceNo : record.invoiceNo) || '-';
          return <Tooltip title={invoiceText}>{invoiceText}</Tooltip>;
        },
        width: 100,
      },
      {
        title: 'Partners Order No.',
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
                      `/TicketManagement/Ticketing/QueryOrder?backFlag=payment&orderNo=${text}&checked=true`
                    );
                  }
                }}
              >
                {text || '-'}
              </span>
            </Tooltip>
          );
        },
        width: 120,
      },
      {
        title: 'Galaxy Order No.',
        key: 'galaxyOrderNo',
        dataIndex: 'galaxyOrderNo',
        render: text => {
          return <Tooltip title={text || '-'}>{text || '-'}</Tooltip>;
        },
        width: 120,
      },
      {
        title: 'Travel Agent Reference No.',
        key: 'taReferenceNo',
        dataIndex: 'taReferenceNo',
        render: text => {
          return <Tooltip title={text || '-'}>{text || '-'}</Tooltip>;
        },
        width: 120,
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
        width: 120,
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
        width: 90,
      },
    ];
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_WALLET' }),
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
      <Col lg={24} md={24} id="MyWallet">
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
                    <div style={{ padding: '0px 24px 0 14px' }}>
                      {taUserStatus === '0' && <Topup />}
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={12}>
                  <div
                    className={`${styles.flexBetween} ${styles.walletCard}`}
                    style={{ borderLeftColor: 'orange' }}
                  >
                    <div style={{ height: '100%' }} className={styles.flexCenter}>
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
                        {!ar && arActivity.status === ACTIVITY_STATUS.Approved && <Approval />}
                      </div>
                    </div>
                    {!ar &&
                      (!arActivity.status || arActivity.status === ACTIVITY_STATUS.Rejected) && (
                        <div style={{ padding: '0px 24px 0 14px' }}>
                          {taUserStatus === '0' && <ARApply />}
                        </div>
                      )}

                    {!ar && arActivity.status === ACTIVITY_STATUS.PendingOthersReview && (
                      <div style={{ padding: '0px 24px 0 14px' }}>
                        {taUserStatus === '0' && <More />}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        </div>
        <Card>
          <div id="pageSearchCard">
            <Filter />
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
