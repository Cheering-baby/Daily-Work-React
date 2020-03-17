import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import {Card, Form, Button, Col, Row, Spin, Modal, Icon, message} from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import styles from './index.less';
import PackageTicketCollapse from './components/PackageTicketCollapse';
import GeneralTicketingCollapse from './components/GeneralTicketingCollapse';
import OnceAPirateCollapse from './components/OnceAPirateCollapse';
import PaymentMode from './components/PaymentMode';
import BOCAOfferCollapse from '@/pages/TicketManagement/components/BOCAOfferCollapse';
import router from "umi/router";

@Form.create()
@connect(({ global, ticketBookingAndPayMgr }) => ({
  global, ticketBookingAndPayMgr,
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
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/initPage',
      payload: {
      },
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

    const {
      dispatch,
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: {
        payModeList,
        accountInfo,
        bookDetail
      },
    } = this.props;

    if (companyType==="02") {
      message.success('Your request has been submitted.');
      router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);
      return;
    }

    const payMode = payModeList.find(payMode=>payMode.check);
    if (payMode.label==='eWallet') {
      if (accountInfo.eWallet.balance>=bookDetail.totalPrice) {
        dispatch({
          type: 'ticketBookingAndPayMgr/confirmEvent',
          payload: {
          },
        });
      }
    } else if (payMode.label==='Credit Card') {
      dispatch({
        type: 'ticketBookingAndPayMgr/sendTransactionPaymentOrder',
        payload: {
        },
      }).then((result)=>{
        if (result && result.url) {
          const w = window.open('about:blank');
          w.location.href = result.url;
        }
      });
    } else if (payMode.label==='AR') {
      if (accountInfo.ar.balance>=bookDetail.totalPrice) {
        dispatch({
          type: 'ticketBookingAndPayMgr/confirmEvent',
          payload: {
          },
        });
      }
    }

  };

  getConfirmEventStatus = () => {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: {
        payModeList,
        accountInfo,
        bookDetail
      },
    } = this.props;

    if (companyType==="02") {
      return true;
    }

    if (!accountInfo) {
      return false;
    }

    let active = true;
    const payMode = payModeList.find(payMode=>payMode.check);
    if (payMode.label==='eWallet') {
      if (accountInfo.eWallet.balance<bookDetail.totalPrice) {
        active = false;
      }
    } else if (payMode.label==='Credit Card') {

    } else if (payMode.label==='AR') {
      if (accountInfo.ar.balance<bookDetail.totalPrice) {
        active = false;
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
    let ticketAmount = 0;
    generalTicketOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        orderOffer.orderInfo.forEach(orderInfo => {
          if (orderInfo.orderCheck) {
            payTotal += orderInfo.pricePax * orderInfo.quantity;
            ticketAmount += orderInfo.quantity;
          }
        });
      });
    });
    packageOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        orderOffer.orderInfo.forEach(orderInfo => {
          if (orderInfo.orderCheck) {
            payTotal += orderInfo.pricePax * orderInfo.quantity;
            ticketAmount += orderInfo.quantity;
          }
        });
      });
    });
    onceAPirateOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        if (orderOffer.orderCheck) {
          payTotal += orderOffer.orderInfo.offerSumPrice;
          ticketAmount += orderOffer.orderInfo.orderQuantity;
        }
      });
    });
    if (deliveryMode==='BOCA') {
      payTotal += ticketAmount * bocaFeePax;
    }
    return Number(payTotal).toFixed(2);
  };

  downloadFileEvent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/fetchTicketDownload',
      payload: {
      },
    }).then((result)=>{
      // console.log(result);
      window.open(result);
    });
    // handleDownFile();
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
      ticketBookingAndPayMgr: {
        deliveryMode,
      },
    } = this.props;
    if (deliveryMode==='BOCA') {
      return 'Download Collection Letter';
    } else if (deliveryMode==='VID') {
      return 'Export VID';
    } else if (deliveryMode==='eTicket') {
      return 'Download e-Ticket';
    }

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

    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 9 },
        md: { span: 8 },
        lg: { span: 8 },
        xl: { span: 8 },
        xxl: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 15 },
        md: { span: 16 },
        lg: { span: 16 },
        xl: { span: 16 },
        xxl: { span: 16 },
      },
      colon: false,
    };

    const gridOpts = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

    return (
      <Spin spinning={payPageLoading} >
        <MediaQuery minWidth={SCREEN.screenSm}>
          <div style={{ height: 34 }}>
            <BreadcrumbComp title={title} />
          </div>
        </MediaQuery>

        {
          companyType!=='02' && (
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
                      <Col span={8}><span>{formatMessage({ id: 'DELIVERY_MODE' })}</span></Col>
                      <Col span={16}>
                        {
                          deliveryMode === 'BOCA' && (
                            <span>BOCA</span>
                          )
                        }
                        {
                          deliveryMode === 'VID' && (
                            <span>VID</span>
                          )
                        }
                        {
                          deliveryMode === 'eTicket' && (
                            <span>e-Ticket</span>
                          )
                        }
                      </Col>
                    </Col>
                    {deliveryMode && deliveryMode === 'BOCA' && (
                      <Col {...gridOpts} className={styles.basicInfoContent}>
                        <Col span={8}><span>{formatMessage({ id: 'COLLECTION_DATE' })}</span></Col>
                        <Col span={16}>{moment(collectionDate, 'x').format('DD-MMM-YYYY')}</Col>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </Card>
          )
        }



        <Card style={{ minHeight: clientHeight, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}>
          {packageOrderData.length > 0 && <PackageTicketCollapse form={form} />}
          {generalTicketOrderData.length > 0 && <GeneralTicketingCollapse form={form} />}
          {onceAPirateOrderData.length > 0 && <OnceAPirateCollapse form={form} />}
          {
            (deliveryMode==='BOCA' && companyType!=='02') && (
              <BOCAOfferCollapse
                form={form}
                companyType={companyType}
                quantity={ticketAmount}
                pricePax={bocaFeePax}
              />
            )
          }
          {
            companyType!=='02' && (
              <PaymentMode form={form} />
            )
          }
        </Card>

        <Card
          className={styles.cardStyles}
          style={{ marginTop: '0', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}
        >
          <div className={styles.checkOut}>
            {
              companyType === "01" && (
                <div className={styles.checkOutPayDiv}>
                  <div className={styles.payFont}>
                    TOTAL PAY: <span className={styles.priceFont}>${this.payTotal()}</span>
                  </div>
                </div>
              )
            }
            <Button
              className={styles.checkOutButton}
              htmlType="button"
              size="large"
              onClick={this.confirmEvent}
              disabled={!this.getConfirmEventStatus()}
            >
              {
                companyType!=='02' ? "Confirm" : "Submit"
              }
            </Button>
          </div>
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
            <Icon className={styles.payModelIcon} type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          </div>
          <p className={styles.payModelP}>Payment Successful ！</p>
          <Row className={styles.payModelBtnRow}>
            <Col  >
              <Button className={styles.payModelOneBtn} key="back" onClick={this.handleOkEvent}>
                OK
              </Button>
              <Button className={styles.payModelTwoBtn} key="submit" type="primary" loading={downloadFileLoading} onClick={this.downloadFileEvent}>
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
