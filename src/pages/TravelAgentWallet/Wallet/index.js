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
  Modal,
} from 'antd';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import SortSelect from '@/components/SortSelect';

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
    const {query: { taId }} = location;
    if(taId){
      dispatch({
        type: 'taWalletMgr/effectSave',
        payload: {
          taId
        }
      }).then(()=> {
        dispatch({type: 'taWalletMgr/fetchAccountDetail',}).then(() => {
          dispatch({type: 'taWalletMgr/fetchMyActivityList',});
        });
        dispatch({ type: 'taWalletMgr/fetchAccountFlowList' });
        this.interval = setInterval(() => dispatch({ type: 'taWalletMgr/fetchAccountDetail' }), 1000 * 5);
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
        title: 'Travel Agent Reference No',
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
                    <div className={styles.label}>{formatMessage({ id: 'EW' })}:</div>
                    {eWallet && (
                      <div className={`${styles.labelValue} ${styles.colorBlack}`}>
                        <span className={styles.symbolPart}>$</span>
                        <span className={styles.integerPart}>{eWallet.integer}</span>
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
                        <span className={styles.integerPart}>{ar.integer}</span>
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
      </Col>
    );
  }
}

export default Wallet;