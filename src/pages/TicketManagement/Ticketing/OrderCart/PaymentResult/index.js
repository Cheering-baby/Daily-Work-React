import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Button, Card, Col, Icon, message, Row, Spin, Steps } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import styles from './index.less';
import successIcon from './assets/success.svg';
import failIcon from './assets/fail.png';
import { toThousandsByRound } from '@/pages/TicketManagement/utils/orderCartUtil';

let doingQueryFlag = null;

@connect(({ global, ticketBookingAndPayMgr }) => ({
  global,
  ticketBookingAndPayMgr,
}))
class PaymentResult extends Component {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      80;
    this.state = {
      clientHeight,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { orderNo, errorCode },
      },
    } = this.props;

    if (orderNo) {
      doingQueryFlag = 'doing';

      dispatch({
        type: 'ticketBookingAndPayMgr/save',
        payload: {
          paymentResultLoading: true,
          bookingNo: orderNo,
        },
      });

      const waitingTime = () => {
        return new Promise(resolve => {
          setTimeout(() => resolve(), 5000);
        });
      };

      const tryAgainFetchQuery = () => {
        dispatch({
          type: 'ticketBookingAndPayMgr/fetchQueryOrderDetail',
          payload: {
            orderNo,
          },
        }).then(bookDetail => {
          let statusValue = false;
          if (bookDetail && bookDetail.status) {
            statusValue = bookDetail.status;
          }
          if (errorCode) {
            statusValue = 'paymentFailed';
          }
          if (
            statusValue === 'WaitingForPaying' ||
            statusValue === 'Paying' ||
            statusValue === 'Archiving'
          ) {
            waitingTime().then(() => {
              if (doingQueryFlag != null) {
                tryAgainFetchQuery();
              }
            });
          } else {
            doingQueryFlag = null;
            dispatch({
              type: 'ticketBookingAndPayMgr/save',
              payload: {
                paymentResultLoading: false,
              },
            });
            if (statusValue === 'Complete') {
              dispatch({
                type: 'ticketBookingAndPayMgr/fetchInvoiceDownload',
                payload: {
                  paymentResultLoading: false,
                },
              });
            }
          }
        });
      };

      tryAgainFetchQuery();
    } else {
      message.error('PARTNERS Order No. not found.');
    }
  }

  componentWillUnmount() {
    doingQueryFlag = null;
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/resetData',
      payload: {},
    });
  }

  getBookingResultIcon = () => {
    const {
      ticketBookingAndPayMgr: { bookDetail = {} },
    } = this.props;
    if (bookDetail && bookDetail.status === 'Complete') {
      return successIcon;
    }
    if (bookDetail && bookDetail.status === 'PendingApproval') {
      return successIcon;
    }
    return failIcon;
  };

  checkBookingHandleInfo = () => {
    const {
      ticketBookingAndPayMgr: { bookDetail = {} },
      location: {
        query: { errorCode },
      },
    } = this.props;
    if (errorCode) {
      return true;
    }
    let statusValue = false;
    if (bookDetail && bookDetail.status) {
      statusValue = bookDetail.status;
    } else {
      return false;
    }
    if (
      statusValue === 'WaitingForPaying' ||
      statusValue === 'Paying' ||
      statusValue === 'Archiving'
    ) {
      return false;
    }
    return true;
  };

  getTotalAmount = bookDetail => {
    let totalAmountStr = '-';
    if (bookDetail && bookDetail.totalPrice) {
      totalAmountStr = bookDetail.totalPrice;
    }
    return toThousandsByRound(totalAmountStr);
  };

  getOrderDate = bookDetail => {
    let orderDateStr = '-';
    if (bookDetail && bookDetail.createTime) {
      orderDateStr = bookDetail.createTime;
      const date = moment(orderDateStr, 'YYYY-MM-DDTHH:mm:ss');
      orderDateStr = moment(date).format('DD-MMM-YYYY HH:mm:ss');
    }
    return orderDateStr;
  };

  getPaymentMode = bookDetail => {
    let paymentModeStr = '-';
    if (bookDetail && bookDetail.paymentMode) {
      paymentModeStr = bookDetail.paymentMode;
    }
    return paymentModeStr;
  };

  getPaymentResult = bookDetail => {
    let paymentResultStr = '-';

    const {
      global: {
        userCompanyInfo: { companyType },
      },
      location: {
        query: { errorCode },
      },
    } = this.props;
    if (errorCode) {
      return 'Payment Failed';
    }
    if (companyType === '01') {
      if (bookDetail && bookDetail.status && bookDetail.status === 'Complete') {
        paymentResultStr = 'Payment Successful';
      } else {
        paymentResultStr = 'Order Failed';
      }
    } else if (companyType === '02') {
      if (bookDetail && bookDetail.status && bookDetail.status === 'PendingApproval') {
        paymentResultStr = 'Submit Successful';
      } else {
        paymentResultStr = 'Submit Failed';
      }
    }

    return paymentResultStr;
  };

  backToCartEvent = () => {
    router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);
  };

  gotoOrderQueryEvent = () => {
    router.push(`/TicketManagement/Ticketing/QueryOrder`);
  };

  downloadFileEvent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/fetchTicketDownload',
      payload: {},
    }).then(result => {
      if (result) {
        const openWindow = window.open(result);
        if (!openWindow) {
          message.error('Open window error!');
        }
      }
    });
  };

  getDownloadBtnName = bookDetail => {
    let deliveryMode = 'BOCA';
    if (bookDetail && bookDetail.offers) {
      bookDetail.offers.forEach(offer => {
        if (offer.deliveryInfo) {
          // eslint-disable-next-line prefer-destructuring
          deliveryMode = offer.deliveryInfo.deliveryMode;
        }
      });
    }
    if (deliveryMode === 'BOCA') {
      return 'Download Collection Letter';
    }
    if (deliveryMode === 'VID') {
      return 'Export VID';
    }
    if (deliveryMode === 'e-Ticket') {
      return 'Download e-Ticket';
    }
  };

  getOrderResult = bookDetail => {
    let statusValue = false;
    if (bookDetail && bookDetail.status) {
      statusValue = bookDetail.status;
    } else {
      return 'process';
    }
    if (statusValue === 'Complete' || statusValue === 'PendingApproval') {
      return 'Complete';
    }
    if (
      statusValue === 'WaitingForPaying' ||
      statusValue === 'Paying' ||
      statusValue === 'Archiving'
    ) {
      return 'process';
    }
    return 'Failed';
  };

  getOrderProcess = bookDetail => {
    let statusValue = false;
    if (bookDetail && bookDetail.status) {
      statusValue = bookDetail.status;
    } else {
      return 'process';
    }
    if (statusValue === 'Complete' || statusValue === 'PendingApproval') {
      return 'finish';
    }
    if (
      statusValue === 'WaitingForPaying' ||
      statusValue === 'Paying' ||
      statusValue === 'Archiving'
    ) {
      return 'process';
    }
    return 'error';
  };

  render() {
    const { clientHeight } = this.state;

    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: {
        downloadFileLoading = false,
        bookDetail = {},
        paymentResultLoading = false,
      },
      location: {
        query: { orderNo, errorCode },
      },
    } = this.props;

    const title = [{ name: formatMessage({ id: 'REVIEW_ORDER' }) }];

    const titleGrid = { xs: 24, sm: 24, md: 12, lg: 16, xl: 16, xxl: 16 };
    const processGrid = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8, xxl: 8 };
    const orderTitleGrid = { xs: 24, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 };

    return (
      <div className={styles.paymentResultDiv}>
        <Spin spinning={false}>
          <Row gutter={12}>
            <Col {...titleGrid}>
              <MediaQuery minWidth={SCREEN.screenSm}>
                <BreadcrumbCompForPams title={title} />
              </MediaQuery>
            </Col>
            <Col {...processGrid} className={styles.processBarCol}>
              <Steps labelPlacement="vertical" size="small">
                <Steps.Step status="finish" title="Cart&nbsp;&nbsp;" />
                <Steps.Step status="finish" title={formatMessage({ id: 'REVIEW_ORDER' })} />
                <Steps.Step
                  status={this.getOrderProcess(bookDetail)}
                  title={this.getOrderResult(bookDetail)}
                />
              </Steps>
            </Col>
          </Row>
          <Card
            className={styles.orderCardStyles}
            style={{
              minHeight: clientHeight,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
              marginTop: '0',
            }}
          >
            {!this.checkBookingHandleInfo() && (
              <div>
                <Row>
                  <Col span={24} className={styles.successCol}>
                    <Icon className={styles.waitingIcon} type="loading" />
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className={styles.resultCol}>
                    <span className={styles.resultSpan}>Please wait for processing</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className={styles.resultCol}>
                    <Button className={styles.backButton} onClick={this.backToCartEvent}>
                      Back to Cart
                    </Button>
                    <Button
                      type="primary"
                      className={styles.downloadButton}
                      onClick={this.gotoOrderQueryEvent}
                    >
                      Goto Order Query
                    </Button>
                  </Col>
                </Row>
              </div>
            )}
            {this.checkBookingHandleInfo() && (
              <div>
                <Row>
                  <Col span={24} className={styles.successCol}>
                    <img
                      className={styles.successIcon}
                      alt="Success"
                      src={this.getBookingResultIcon()}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className={styles.resultCol}>
                    <span className={styles.resultSpan}>{this.getPaymentResult(bookDetail)}</span>
                  </Col>
                </Row>
                <Row>
                  {bookDetail.status === 'Complete' && (
                    <Col span={24} className={styles.resultCol}>
                      <Button className={styles.backButton} onClick={this.backToCartEvent}>
                        Back to Cart
                      </Button>
                      {companyType === '01' && (
                        <Button
                          type="primary"
                          className={styles.downloadButton}
                          loading={downloadFileLoading}
                          onClick={this.downloadFileEvent}
                        >
                          {this.getDownloadBtnName(bookDetail)}
                        </Button>
                      )}
                    </Col>
                  )}
                  {bookDetail.status !== 'Complete' && (
                    <Col span={24} className={styles.resultCol}>
                      <Button className={styles.downloadButton} onClick={this.backToCartEvent}>
                        Back to Cart
                      </Button>
                      <Button
                        type="primary"
                        className={styles.downloadButton}
                        onClick={this.gotoOrderQueryEvent}
                      >
                        Goto Order Query
                      </Button>
                    </Col>
                  )}
                </Row>
              </div>
            )}

            <Row>
              <Col span={24} className={styles.orderDetailCol}>
                <Row>
                  <Col span={24} className={styles.informationCol}>
                    <span className={styles.informationSpan}>Payment Information</span>
                  </Col>
                </Row>
                <Row className={styles.orderRow}>
                  <Col {...orderTitleGrid} className={styles.informationCol}>
                    <div className={styles.orderKeySpan}>
                      <span>PARTNERS Order No.:</span>
                    </div>
                    <div>
                      <span className={styles.orderValueSpan}>{orderNo || '-'}</span>
                    </div>
                  </Col>
                  <Col {...orderTitleGrid} className={styles.informationCol}>
                    <div className={styles.orderKeySpan}>
                      <span>Status:</span>
                    </div>
                    <div>
                      <span className={styles.orderValueSpan}>{bookDetail.status || '-'}</span>
                    </div>
                  </Col>
                  {companyType === '01' && (
                    <Col {...orderTitleGrid} className={styles.informationCol}>
                      <div className={styles.orderKeySpan}>
                        <span>Total Amount Payable (SGD):</span>
                      </div>
                      <div>
                        <span className={styles.orderValueSpan2}>
                          {this.getTotalAmount(bookDetail)}
                        </span>
                      </div>
                    </Col>
                  )}
                </Row>
                <Row className={styles.orderRow}>
                  <Col {...orderTitleGrid} className={styles.informationCol}>
                    <div className={styles.orderKeySpan}>
                      <span>Order Type:</span>
                    </div>
                    <div>
                      <span className={styles.orderValueSpan}>Booking</span>
                    </div>
                  </Col>
                  <Col {...orderTitleGrid} className={styles.informationCol}>
                    <div className={styles.orderKeySpan}>
                      <span>Order Date:</span>
                    </div>
                    <div>
                      <span className={styles.orderValueSpan}>{this.getOrderDate(bookDetail)}</span>
                    </div>
                  </Col>
                  <Col {...orderTitleGrid} className={styles.informationCol}>
                    <div className={styles.orderKeySpan}>
                      <span>Payment Order No:</span>
                    </div>
                    <div>
                      <span className={styles.orderValueSpan}>{bookDetail.paymentNo || '-'}</span>
                    </div>
                  </Col>
                  {companyType === 'false' && (
                    <Col {...orderTitleGrid} className={styles.informationCol}>
                      <div className={styles.orderKeySpan}>
                        <span>Payment Mode:</span>
                      </div>
                      <div>
                        <span className={styles.orderValueSpan}>
                          {this.getPaymentMode(bookDetail)}
                        </span>
                      </div>
                    </Col>
                  )}
                </Row>
                {!paymentResultLoading &&
                  bookDetail.status !== 'Complete' &&
                  bookDetail.status !== 'PendingApproval' && (
                    <div>
                      <Row className={styles.orderRow}>
                        <Col span={24} className={styles.informationCol}>
                          <div className={styles.orderKeySpan}>
                            <span>Reason for failure:</span>
                          </div>
                          {errorCode && (
                            <div>
                              <span className={styles.orderValueSpan}>
                                Payment failed,You can goto query order page to continue processing.
                              </span>
                            </div>
                          )}
                          {!errorCode && (
                            <div>
                              <span className={styles.orderValueSpan}>
                                {bookDetail.failedReason || '-'}
                              </span>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </div>
                  )}
              </Col>
            </Row>
          </Card>
        </Spin>
      </div>
    );
  }
}

export default PaymentResult;
