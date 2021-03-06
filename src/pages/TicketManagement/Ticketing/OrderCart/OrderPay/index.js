import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Button, Card, Col, Form, Icon, message, Modal, Row, Spin, Steps } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import router from 'umi/router';
import { isNullOrUndefined } from 'util';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import styles from './index.less';
import PaymentMode from './components/PaymentMode';
import BOCAOfferCollapse from '@/pages/TicketManagement/components/BOCAOfferCollapse';
import {
  getOrderProductServiceTax,
  toThousandsByRound,
  transBookingToPayTotalPrice,
} from '@/pages/TicketManagement/utils/orderCartUtil';
import ShoppingCartOffer from '@/pages/TicketManagement/components/ShoppingCartOffer';

let confirmEventSubmitTime = 0;
const { confirm } = Modal;

@Form.create()
@connect(({ global, ticketBookingAndPayMgr }) => ({
  global,
  ticketBookingAndPayMgr,
}))
class OrderPay extends Component {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      300 -
      70 -
      97;
    this.state = {
      clientHeight,
    };
  }

  offerPrice = (products = []) => {
    let totalPrice = 0;
    for (let i = 0; i < products.length; i += 1) {
      const { quantity, price } = products[i];
      for (let j = 0; j < price.length; j += 1) {
        const { discountUnitPrice } = price[j];
        totalPrice += discountUnitPrice * quantity;
      }
    }
    return totalPrice;
  };

  confirmBooking = () => {
    const {
      dispatch,
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: { bookingNo },
    } = this.props;
    if (bookingNo === null) {
      if (companyType === '01') {
        confirm({
          title:
            'Please note that system will help to hold the order for 30 minutes, make sure to do payment within 30 minutes, otherwise you might need to re-submit a new order.',
          content: '',
          className: 'confirmClassName',
          icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
          okText: 'Confirm',
          onOk: this.createBooking,
          onCancel() {},
        });
      } else {
        this.createBooking();
      }
    } else {
      this.queryBookingStatus();
    }
  };

  createBooking = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/orderBooking',
    }).then(resultCode => {
      if (resultCode === '0') {
        this.queryBookingStatus();
      }
    });
  };

  queryBookingStatus = () => {
    const {
      dispatch,
      ticketBookingAndPayMgr: { bookingNo },
    } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/queryBookingStatusNext',
    }).then(status => {
      if (status === 'WaitingForPaying') {
        this.confirmEvent();
      } else {
        router.push(`/TicketManagement/Ticketing/OrderCart/PaymentResult?orderNo=${bookingNo}`);
      }
    });
  };

  confirmEvent = () => {
    if (confirmEventSubmitTime !== 0) {
      return;
    }

    const {
      dispatch,
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: { bookingNo, payModeList, accountInfo, bookDetail },
    } = this.props;

    if (companyType === '02') {
      message.success('Your request has been submitted.');
      router.push(`/TicketManagement/Ticketing/OrderCart/PaymentResult?orderNo=${bookingNo}`);
      return;
    }

    confirmEventSubmitTime = 1;
    const payMode = payModeList.find(payModeItem => payModeItem.check);
    if (payMode.label === 'e-Wallet') {
      if (accountInfo.eWallet.balance >= bookDetail.totalPrice) {
        dispatch({
          type: 'ticketBookingAndPayMgr/confirmEvent',
          payload: {},
        }).then(() => {
          confirmEventSubmitTime = 0;
        });
      }
    } else if (payMode.label === 'Credit Card') {
      dispatch({
        type: 'ticketBookingAndPayMgr/sendTransactionPaymentOrder',
        payload: {},
      }).then(result => {
        confirmEventSubmitTime = 0;
        if (result && result.url) {
          try {
            // window.location.replace(result.url);
            window.pamsLocation.href = result.url;
          } catch (e) {
            console.log(e);
            message.error('window location replace error!');
          }
        }
      });
    } else if (payMode.label === 'AR') {
      if (accountInfo.ar.balance >= bookDetail.totalPrice) {
        dispatch({
          type: 'ticketBookingAndPayMgr/confirmEvent',
          payload: {},
        }).then(() => {
          confirmEventSubmitTime = 0;
        });
      }
    }
    setTimeout(() => {
      confirmEventSubmitTime = 0;
    }, 1000);
  };

  getConfirmEventStatus = () => {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: { payModeList, accountInfo, bookDetail },
    } = this.props;

    if (companyType === '02') {
      return true;
    }

    let active = false;
    if (!payModeList) {
      return false;
    }
    const payMode = payModeList.find(payModeItem => payModeItem.check);
    if (payMode.label === 'Credit Card') {
      return true;
    }
    if (!accountInfo) {
      return false;
    }

    if (payMode.label === 'e-Wallet') {
      if (accountInfo.eWallet && accountInfo.eWallet.balance >= bookDetail.totalPrice) {
        active = true;
      }
    } else if (payMode.label === 'Credit Card') {
      // check balance
      active = true;
    } else if (payMode.label === 'AR') {
      if (accountInfo.ar && accountInfo.ar.balance >= bookDetail.totalPrice) {
        active = true;
      }
    }
    return active;
  };

  payTotal = () => {
    const {
      ticketBookingAndPayMgr: {
        deliveryMode,
        bocaFeePax,
        packageOrderData = [],
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
      },
    } = this.props;
    let payTotal = 0;
    if (deliveryMode === 'BOCA') {
      payTotal = transBookingToPayTotalPrice(
        packageOrderData,
        generalTicketOrderData,
        onceAPirateOrderData,
        bocaFeePax
      );
    } else {
      payTotal = transBookingToPayTotalPrice(
        packageOrderData,
        generalTicketOrderData,
        onceAPirateOrderData,
        null
      );
    }

    return Number(payTotal).toFixed(2);
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

  handleOkEvent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/save',
      payload: {
        payModelShow: false,
      },
    });
    router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);
  };

  getDownloadBtnName = () => {
    const {
      ticketBookingAndPayMgr: { deliveryMode },
    } = this.props;
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

  getBlob = url => {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      };
      xhr.send();
    });
  };

  getProductFeeExclude = (bocaFeePax, ticketAmount) => {
    const {
      ticketBookingAndPayMgr: {
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
        deliveryMode,
      },
    } = this.props;
    const serviceTax = getOrderProductServiceTax(generalTicketOrderData, onceAPirateOrderData);
    let bocaPrice = bocaFeePax * ticketAmount;
    if (deliveryMode !== 'BOCA') {
      bocaPrice = 0;
    }
    const sumPrice = this.payTotal() - serviceTax - bocaPrice;
    return toThousandsByRound(Number(sumPrice).toFixed(2));
  };

  getBocaFeeExclude = (bocaFeePax, ticketAmount, bocaFeeGst) => {
    let sourceBocaPrice = bocaFeePax / (bocaFeeGst / 100 + 1);
    sourceBocaPrice = Number(sourceBocaPrice).toFixed(2);
    const sumPrice = sourceBocaPrice * ticketAmount;
    return toThousandsByRound(Number(sumPrice).toFixed(2));
  };

  getServiceTax = (bocaFeePax, ticketAmount, bocaFeeGst) => {
    const {
      ticketBookingAndPayMgr: {
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
        deliveryMode,
      },
    } = this.props;
    const serviceTax = getOrderProductServiceTax(generalTicketOrderData, onceAPirateOrderData);
    let bocaGst = 0;
    if (deliveryMode !== 'BOCA') {
      bocaGst = 0;
    } else {
      let sourceBocaPrice = bocaFeePax / (bocaFeeGst / 100 + 1);
      sourceBocaPrice = Number(sourceBocaPrice).toFixed(2);
      const sumBocaPrice = sourceBocaPrice * ticketAmount;
      bocaGst = bocaFeePax * ticketAmount - sumBocaPrice;
    }
    return toThousandsByRound(Number(serviceTax + bocaGst).toFixed(2));
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      form,
      ticketBookingAndPayMgr: {
        bookingNo,
        downloadFileLoading = false,
        payPageLoading = false,
        deliveryMode,
        collectionDate,
        ticketAmount,
        bocaFeePax,
        bocaFeeGst,
        payModelShow,
        bookDetail: { totalPrice },
      },
    } = this.props;

    const { clientHeight } = this.state;

    const title = [{ name: formatMessage({ id: 'REVIEW_ORDER' }) }];

    const titleGrid = { xs: 24, sm: 24, md: 12, lg: 16, xl: 16, xxl: 16 };
    const processGrid = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8, xxl: 8 };
    const priceGrid = { xs: 0, sm: 0, md: 12, lg: 12, xl: 14, xxl: 16 };
    const priceGrid2 = { xs: 24, sm: 24, md: 12, lg: 12, xl: 10, xxl: 8 };
    const priceGrid3 = { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 };
    const priceGrid4 = { xs: 23, sm: 23, md: 23, lg: 23, xl: 23, xxl: 23 };

    return (
      <Spin spinning={payPageLoading}>
        <Row gutter={12}>
          <Col {...titleGrid}>
            <MediaQuery minWidth={SCREEN.screenSm}>
              <BreadcrumbCompForPams title={title} />
            </MediaQuery>
          </Col>
          <Col {...processGrid} className={styles.processBarCol}>
            <Steps labelPlacement="vertical" size="small">
              <Steps.Step status="finish" title="Cart&nbsp;&nbsp;" />
              <Steps.Step status="process" title={formatMessage({ id: 'REVIEW_ORDER' })} />
              <Steps.Step status="wait" title="Complete" />
            </Steps>
          </Col>
        </Row>

        {companyType && (
          <Card className={styles.cardDeliverStyles}>
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={24} className={styles.titleBlack}>
                    {formatMessage({ id: 'DELIVER_INFORMATION' })}
                  </Col>
                </Row>
                <Row style={{ padding: '10px 24px 20px 24px' }}>
                  <Col xs={24} md={8} lg={6} className={styles.basicInfoContent}>
                    <Col span={24}>
                      <span className={styles.deliveryModeSpan}>
                        {formatMessage({ id: 'DELIVERY_MODE' })}
                      </span>
                    </Col>
                    <Col span={24}>
                      {deliveryMode === 'BOCA' && (
                        <span>BOCA (Ticket / Voucher Collection Letter)</span>
                      )}
                      {deliveryMode === 'VID' && <span>EVID (Visual ID)</span>}
                      {deliveryMode === 'e-Ticket' && <span>e-Ticket</span>}
                    </Col>
                  </Col>
                  <Col xs={0} md={2} lg={2} />
                  {deliveryMode && deliveryMode === 'BOCA' && (
                    <Col xs={24} md={8} lg={6} className={styles.basicInfoContent}>
                      <Col span={24}>
                        <span className={styles.deliveryModeSpan}>
                          {formatMessage({ id: 'COLLECTION_DATE' })}
                        </span>
                      </Col>
                      <Col span={24}>{moment(collectionDate, 'x').format('DD-MMM-YYYY')}</Col>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
            {deliveryMode === 'BOCA' && companyType !== '02' && !isNullOrUndefined(bocaFeePax) && (
              <Row>
                <Col style={{ padding: '0 15px 15px 15px' }}>
                  <BOCAOfferCollapse
                    form={form}
                    companyType={companyType}
                    quantity={ticketAmount}
                    pricePax={bocaFeePax}
                  />
                </Col>
              </Row>
            )}
          </Card>
        )}

        {companyType === '01' && Number.parseFloat(totalPrice) !== Number.parseFloat(0) && (
          <Card
            className={styles.cardDeliverStyles}
            style={{
              marginTop: '10px',
            }}
          >
            <Row>
              <Col style={{ padding: '15px' }}>
                <PaymentMode form={form} />
              </Col>
            </Row>
          </Card>
        )}

        <Card
          className={styles.orderCardStyles}
          style={{
            minHeight: clientHeight,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
            marginTop: '10px',
          }}
        >
          <Row>
            <Col span={24}>
              <Row>
                <Col span={24} className={styles.titleBlack}>
                  PRODUCTS LIST
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={styles.shoppingCartOfferRow}>
            <Col span={24} className={styles.shoppingCartOffer}>
              <ShoppingCartOffer editModal={false} />
            </Col>
          </Row>
        </Card>

        <Row>
          <Col {...priceGrid} />
          <Col {...priceGrid2}>
            <Card className={styles.cardStyles} style={{ marginTop: '12px', marginBottom: '20px' }}>
              {companyType !== '02' && (
                <Row className={styles.priceRow}>
                  <Col {...priceGrid3} />
                  <Col {...priceGrid4}>
                    <Row className={styles.priceCol}>
                      <Col span={16}>
                        <span className={styles.priceKeySpan}>Offer Price (Before 7% GST):</span>
                      </Col>
                      <Col span={8}>
                        <span className={styles.priceValueSpan}>
                          {this.getProductFeeExclude(bocaFeePax, ticketAmount)}
                        </span>
                      </Col>
                    </Row>
                    {companyType !== '02' &&
                      deliveryMode === 'BOCA' &&
                      !isNullOrUndefined(bocaFeePax) && (
                        <Row className={styles.priceCol}>
                          <Col span={16}>
                            <span className={styles.priceKeySpan}>BOCA Fee (Before 7% GST):</span>
                          </Col>
                          <Col span={8}>
                            <span className={styles.priceValueSpan}>
                              {this.getBocaFeeExclude(bocaFeePax, ticketAmount, bocaFeeGst)}
                            </span>
                          </Col>
                        </Row>
                      )}
                    <Row className={styles.priceCol2}>
                      <Col span={16}>
                        <span className={styles.priceKeySpan}>Goods & Services Tax (7% GST):</span>
                      </Col>
                      <Col span={8}>
                        <span className={styles.priceValueSpan}>
                          {this.getServiceTax(bocaFeePax, ticketAmount, bocaFeeGst)}
                        </span>
                      </Col>
                    </Row>
                    <Row className={styles.priceCol3}>
                      <Col span={16}>
                        <span className={styles.priceKeySpan}>
                          Total Amount Payable (After 7% GST):
                        </span>
                      </Col>
                      <Col span={8}>
                        <span className={styles.priceValueSpan2}>
                          {toThousandsByRound(this.payTotal())}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
              <Row className={styles.checkOut}>
                <Col xs={1} md={1} lg={1} className={styles.checkOutCheckBox} />
                <Col xs={23} md={23} lg={23} className={styles.checkOutBtn}>
                  <Button
                    size="large"
                    htmlType="button"
                    onClick={() =>
                      router.push(
                        `/TicketManagement/Ticketing/OrderCart/CheckOrder${
                          bookingNo === null ? '?operateType=goBack' : ''
                        }`
                      )
                    }
                  >
                    {formatMessage({ id: 'COMMON_BACK' })}
                  </Button>
                  <Button
                    className={
                      !this.getConfirmEventStatus() ? styles.checkOutButton2 : styles.checkOutButton
                    }
                    htmlType="button"
                    size="large"
                    onClick={this.confirmBooking}
                    disabled={!this.getConfirmEventStatus()}
                  >
                    {companyType !== '02' ? 'Confirm' : 'Submit'}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Modal
          visible={payModelShow}
          closable={false}
          title={null}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className={styles.payModelIconDiv}>
            <Icon
              className={styles.payModelIcon}
              type="check-circle"
              theme="twoTone"
              twoToneColor="#52c41a"
            />
          </div>
          <p className={styles.payModelP}>Payment Successfully</p>
          <Row className={styles.payModelBtnRow}>
            <Col>
              <Button className={styles.payModelOneBtn} key="back" onClick={this.handleOkEvent}>
                OK
              </Button>
              <Button
                className={styles.payModelTwoBtn}
                key="submit"
                type="primary"
                loading={downloadFileLoading}
                onClick={this.downloadFileEvent}
              >
                {this.getDownloadBtnName()}
              </Button>
            </Col>
          </Row>
        </Modal>
      </Spin>
    );
  }
}

export default OrderPay;
