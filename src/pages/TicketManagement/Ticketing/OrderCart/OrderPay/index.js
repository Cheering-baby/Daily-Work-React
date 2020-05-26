import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Button, Card, Col, Form, Icon, message, Modal, Row, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import router from 'umi/router';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import styles from './index.less';
import PackageTicketCollapse from './components/PackageTicketCollapse';
import GeneralTicketingCollapse from './components/GeneralTicketingCollapse';
import OnceAPirateCollapse from './components/OnceAPirateCollapse';
import PaymentMode from './components/PaymentMode';
import BOCAOfferCollapse from '@/pages/TicketManagement/components/BOCAOfferCollapse';
import { transBookingToPayTotalPrice } from '@/pages/TicketManagement/utils/orderCartUtil';

let confirmEventSubmitTime = 0;

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
      50 -
      70 -
      97;
    this.state = {
      clientHeight,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      global: {
        userCompanyInfo: { companyType },
      },
    } = this.props;
    if (companyType === '01') {
      dispatch({
        type: 'ticketBookingAndPayMgr/initPage',
        payload: {},
      });
      dispatch({
        type: 'ticketBookingAndPayMgr/fetchAccountDetail',
        payload: {},
      });
      dispatch({
        type: 'ticketBookingAndPayMgr/fetchQueryTaDetail',
        payload: {},
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/resetData',
    });
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

  confirmEvent = () => {
    if (confirmEventSubmitTime !== 0) {
      return;
    }

    const {
      dispatch,
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: { payModeList, accountInfo, bookDetail },
    } = this.props;

    if (companyType === '02') {
      message.success('Your request has been submitted.');
      router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);
      return;
    }

    confirmEventSubmitTime = 1;
    const payMode = payModeList.find(payModeItem => payModeItem.check);
    if (payMode.label === 'eWallet') {
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
          const openWindow = window.open('about:blank');
          if (openWindow) {
            openWindow.location.href = result.url;
          } else {
            message.error('Open window error!');
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

    if (payMode.label === 'eWallet') {
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

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      form,
      ticketBookingAndPayMgr: {
        downloadFileLoading = false,
        payPageLoading = false,
        deliveryMode,
        collectionDate,
        ticketAmount,
        bocaFeePax,
        payModelShow,
        packageOrderData,
        onceAPirateOrderData,
        generalTicketOrderData,
      },
    } = this.props;

    const { clientHeight } = this.state;

    const title = [
      { name: 'Ticketing' },
      { name: 'Create Order', href: '#/TicketManagement/Ticketing/CreateOrder?operateType=goBack' },
      { name: 'Order' },
    ];

    const gridOpts = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

    return (
      <Spin spinning={payPageLoading}>
        <MediaQuery minWidth={SCREEN.screenSm}>
          <BreadcrumbCompForPams title={title} />
        </MediaQuery>

        {companyType && (
          <Card className={styles.cardDeliverStyles}>
            <Row style={{ padding: '15px' }}>
              <Col span={24}>
                <Row>
                  <Col span={24} className={styles.titleBlack}>
                    {formatMessage({ id: 'DELIVER_INFORMATION' })}
                  </Col>
                </Row>
                <Row>
                  <Col {...gridOpts} className={styles.basicInfoContent}>
                    <Col span={8}>
                      <span>{formatMessage({ id: 'DELIVERY_MODE' })}</span>
                    </Col>
                    <Col span={16}>
                      {deliveryMode === 'BOCA' && <span>BOCA</span>}
                      {deliveryMode === 'VID' && <span>VID</span>}
                      {deliveryMode === 'e-Ticket' && <span>e-Ticket</span>}
                    </Col>
                  </Col>
                  {deliveryMode && deliveryMode === 'BOCA' && (
                    <Col {...gridOpts} className={styles.basicInfoContent}>
                      <Col span={8}>
                        <span>{formatMessage({ id: 'COLLECTION_DATE' })}</span>
                      </Col>
                      <Col span={16}>{moment(collectionDate, 'x').format('DD-MMM-YYYY')}</Col>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Card>
        )}

        <Card style={{ minHeight: clientHeight, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}>
          {packageOrderData.length > 0 && <PackageTicketCollapse form={form} />}
          {generalTicketOrderData.length > 0 && <GeneralTicketingCollapse form={form} />}
          {onceAPirateOrderData.length > 0 && <OnceAPirateCollapse form={form} />}
          {deliveryMode === 'BOCA' && companyType !== '02' && (
            <BOCAOfferCollapse
              form={form}
              companyType={companyType}
              quantity={ticketAmount}
              pricePax={bocaFeePax}
            />
          )}
          {companyType !== '02' && this.payTotal() > 0 && <PaymentMode form={form} />}
        </Card>

        <Card
          className={styles.cardStyles}
          style={{
            marginTop: '0',
            marginBottom: '20px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Row className={styles.checkOut}>
            <Col xs={24} md={8} lg={4} className={styles.checkOutCheckBox} />
            <Col xs={24} md={16} lg={20} className={styles.checkOutBtn}>
              {companyType === '01' && (
                <div className={styles.checkOutPayDiv}>
                  <div className={styles.payFont}>
                    TOTAL PAY: <span className={styles.priceFont}>${this.payTotal()}</span>
                  </div>
                </div>
              )}
              <Button
                className={styles.checkOutButton}
                htmlType="button"
                size="large"
                onClick={this.confirmEvent}
                disabled={!this.getConfirmEventStatus()}
              >
                {companyType !== '02' ? 'Confirm' : 'Submit'}
              </Button>
            </Col>
          </Row>
        </Card>

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
