import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Icon,
  List,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Steps,
} from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import styles from './index.less';
import BOCAOfferCollapse from '@/pages/TicketManagement/components/BOCAOfferCollapse';
import ShoppingCartOffer from '@/pages/TicketManagement/components/ShoppingCartOffer';

import {
  getCheckOapOrderData,
  getCheckPackageOrderData,
  getCheckTicketAmount,
  getOrderProductServiceTax,
  toThousandsByRound,
  transBookingToPayTotalPrice,
} from '@/pages/TicketManagement/utils/orderCartUtil';
import SortSelect from '@/components/SortSelect';

const FormItem = Form.Item;

let checkOutSubmitTime = 0;

const { confirm } = Modal;

@Form.create()
@connect(({ global, ticketOrderCartMgr }) => ({
  global,
  ticketOrderCartMgr,
}))
class CheckOrder extends Component {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      100 -
      80 -
      97 -
      100;
    this.state = {
      clientHeight,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      ticketOrderCartMgr: { cartId },
      global: {
        userCompanyInfo: { companyType },
      },
    } = this.props;
    dispatch({
      type: 'ticketMgr/fetchQueryAgentOpt',
      payload: {},
    });
    dispatch({
      type: 'ticketMgr/queryPluAttribute',
      payload: {
        attributeItem: 'TICKET_TYPE',
      },
    });
    dispatch({
      type: 'ticketMgr/queryTicketConfig',
      payload: {
        attributeItem: 'TICKET_TYPE',
      },
    });
    dispatch({
      type: 'ticketOrderCartMgr/queryPluAttribute',
      payload: {
        attributeItem: 'BOCA_PLU',
      },
    });
    dispatch({
      type: 'ticketOrderCartMgr/fetchQueryAgentOpt',
      payload: {},
    });
    if (companyType === '02') {
      dispatch({
        type: 'ticketOrderCartMgr/fetchQuerySubTaDetail',
        payload: {},
      });
    } else {
      dispatch({
        type: 'ticketOrderCartMgr/fetchQueryTaDetail',
        payload: {},
      });
    }
    if (cartId === null) {
      dispatch({
        type: 'ticketOrderCartMgr/createShoppingCart',
        payload: {},
      }).then(() => {
        dispatch({
          type: 'ticketOrderCartMgr/queryShoppingCart',
          payload: {},
        }).then(() => {
          dispatch({
            type: 'ticketOrderCartMgr/checkShoppingCart',
            payload: {},
          });
        });
      });
    } else {
      dispatch({
        type: 'ticketOrderCartMgr/checkShoppingCart',
        payload: {},
      });
    }
    dispatch({
      type: 'ticketOrderCartMgr/save',
      payload: {
        functionActive: this.checkTAStatus(),
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/resetData',
    });
  }

  checkTAStatus = () => {
    const {
      global: {
        currentUser: { userType },
        userCompanyInfo,
      },
    } = this.props;
    let taStatus = false;
    if (userType === '02') {
      if (userCompanyInfo.status === '0') {
        taStatus = true;
      }
    } else if (userType === '03') {
      if (userCompanyInfo.status === '0') {
        taStatus = true;
      }
      if (userCompanyInfo.mainTAInfo && userCompanyInfo.mainTAInfo.status !== '0') {
        taStatus = false;
      }
    }
    return taStatus;
  };

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

  clickSelectAll = e => {
    const { checked } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/changeSelectAllOrder',
      payload: {
        selectAllOrder: checked,
        selectAllIndeterminate: false,
      },
    });
  };

  payTotal = () => {
    const {
      ticketOrderCartMgr: {
        deliveryMode,
        bocaFeePax,
        packageOrderData = [],
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
      },
    } = this.props;
    const packageOrderDataNew = getCheckPackageOrderData(packageOrderData);
    const generalTicketOrderDataNew = getCheckPackageOrderData(generalTicketOrderData);
    const onceAPirateOrderDataNew = getCheckOapOrderData(onceAPirateOrderData);
    let payTotal = 0;
    if (deliveryMode === 'BOCA') {
      payTotal = transBookingToPayTotalPrice(
        packageOrderDataNew,
        generalTicketOrderDataNew,
        onceAPirateOrderDataNew,
        bocaFeePax
      );
    } else {
      payTotal = transBookingToPayTotalPrice(
        packageOrderDataNew,
        generalTicketOrderDataNew,
        onceAPirateOrderDataNew,
        null
      );
    }
    return Number(payTotal).toFixed(2);
  };

  checkOutEvent = () => {
    if (checkOutSubmitTime !== 0) {
      return;
    }
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      form,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (values && values.deliveryMode === 'BOCA' && values.collectionDate) {
          const disabledCollectionDate = this.checkCollectionWithVisitOfDate(values.collectionDate);
          if (disabledCollectionDate) {
            message.warn('The collection date is later than date of visit!');
            return;
          }
        }
        if (companyType === '01') {
          confirm({
            title:
              'Please note that system will help to hold the order for 30 minutes, make sure to do payment within 30 minutes, otherwise you might need to re-submit a new order.',
            content: '',
            className: 'confirmClassName',
            icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
            okText: 'Confirm',
            onOk: this.orderCheckOutSubmit,
            onCancel() {},
          });
        } else {
          this.orderCheckOutSubmit();
        }
      }
    });
  };

  orderCheckOutSubmit = () => {
    if (checkOutSubmitTime !== 0) {
      return;
    }
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (values && !values.deliveryMode) {
        message.warn('Delivery mode is required!');
      }
      if (values && values.deliveryMode === 'BOCA' && !values.collectionDate) {
        message.warn('Collection date is required!');
      }
      if (!err) {
        checkOutSubmitTime = 1;
        dispatch({
          type: 'ticketOrderCartMgr/orderCheckOut',
          payload: {},
        }).then(() => {
          checkOutSubmitTime = 0;
        });
      }
    });
    setTimeout(() => {
      checkOutSubmitTime = 0;
    }, 1000);
  };

  getOrderAmount = () => {
    const {
      ticketOrderCartMgr: {
        packageOrderData = [],
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
      },
    } = this.props;
    let orderCartDataAmount = 0;
    const orderList = [generalTicketOrderData, packageOrderData, onceAPirateOrderData];
    orderList.forEach(orderItem => {
      orderItem.forEach(orderData => {
        orderCartDataAmount += orderData.orderOfferList ? orderData.orderOfferList.length : 0;
      });
    });
    return orderCartDataAmount;
  };

  changeCollectionDate = value => {
    const { dispatch, form } = this.props;
    const collectionDate = value ? value.format('x') : value;
    dispatch({
      type: 'ticketOrderCartMgr/save',
      payload: {
        collectionDate,
      },
    });
    const data = {
      collectionDate,
    };
    form.setFieldsValue(data);
    form.validateFields(['collectionDate']);

    // this.checkCollectionWithVisitOfDate(collectionDate);
  };

  checkCollectionWithVisitOfDate = collectionDate => {
    // compare CollectionDate with visit of date
    const {
      ticketOrderCartMgr: { generalTicketOrderData = [], onceAPirateOrderData = [] },
    } = this.props;

    let isMoreThan = false;
    const collectionDateMoment = moment(collectionDate, 'x');
    const collectionDateNum = Number.parseInt(collectionDateMoment.format('YYYYMMDD'), 10);
    generalTicketOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        const dateOfVisitMoment = moment(orderOffer.queryInfo.dateOfVisit, 'x');
        const dateOfVisitNum = Number.parseInt(dateOfVisitMoment.format('YYYYMMDD'), 10);
        if (dateOfVisitNum < collectionDateNum) {
          if (!isMoreThan && orderOffer.orderAll) {
            isMoreThan = true;
            // message.warn('The collection date is later than date of visit!');
          }
        }
      });
    });
    if (!isMoreThan) {
      onceAPirateOrderData.forEach(orderData => {
        const dateOfVisitMoment = moment(orderData.queryInfo.dateOfVisit, 'x');
        const dateOfVisitNum = Number.parseInt(dateOfVisitMoment.format('YYYYMMDD'), 10);
        if (dateOfVisitNum < collectionDateNum) {
          if (!isMoreThan && orderData.orderAll) {
            isMoreThan = true;
            // message.warn('The collection date is later than date of visit!');
          }
        }
      });
    }

    return isMoreThan;
  };

  disabledCollectionDate = current => {
    // Can not select days before today and today
    return (
      current &&
      current <
        moment(new Date())
          .add(2, 'days')
          .endOf('day')
    );
  };

  changeDeliveryMode = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/save',
      payload: {
        deliveryMode: value,
      },
    });
  };

  getTicketAmount = () => {
    const {
      ticketOrderCartMgr: {
        packageOrderData = [],
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
      },
    } = this.props;

    const ticketAmount = getCheckTicketAmount(
      packageOrderData,
      generalTicketOrderData,
      onceAPirateOrderData
    );
    return ticketAmount || 0;
  };

  checkoutBtnDisabled = () => {
    let disabled = true;
    const {
      ticketOrderCartMgr: { functionActive },
    } = this.props;
    const ticketAmount = this.getTicketAmount();
    if (ticketAmount > 0) {
      disabled = false;
    }
    if (!functionActive) {
      disabled = true;
    }
    return disabled;
  };

  deliveryModeDisabled = () => {
    let disabled = true;
    const ticketAmount = this.getTicketAmount();
    if (ticketAmount > 0) {
      disabled = false;
    }
    return disabled;
  };

  bocaOptionDisabled = () => {
    // eslint-disable-next-line new-cap
    return this.checkCollectionWithVisitOfDate(new moment().add(3, 'days').format('x'));
  };

  pageDataCheck = () => {
    const {
      dispatch,
      form,
      ticketOrderCartMgr: { deliveryMode },
    } = this.props;
    const ticketAmount = this.getTicketAmount();
    const bocaOptionDisabled = this.checkCollectionWithVisitOfDate(
      // eslint-disable-next-line new-cap
      new moment().add(3, 'days').format('x')
    );
    if ((ticketAmount === 0 && deliveryMode) || (bocaOptionDisabled && deliveryMode === 'BOCA')) {
      dispatch({
        type: 'ticketOrderCartMgr/save',
        payload: {
          collectionDate: undefined,
          deliveryMode: undefined,
        },
      });
      form.resetFields(['collectionDate', 'deliveryMode']);
    }
  };

  getProductFeeExclude = (bocaFeePax, ticketAmount) => {
    const {
      ticketOrderCartMgr: { generalTicketOrderData = [], onceAPirateOrderData = [], deliveryMode },
    } = this.props;
    const generalTicketOrderDataNew = getCheckPackageOrderData(generalTicketOrderData);
    const onceAPirateOrderDataNew = getCheckOapOrderData(onceAPirateOrderData);
    const serviceTax = getOrderProductServiceTax(
      generalTicketOrderDataNew,
      onceAPirateOrderDataNew
    );
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
      ticketOrderCartMgr: { generalTicketOrderData = [], onceAPirateOrderData = [], deliveryMode },
    } = this.props;
    const generalTicketOrderDataNew = getCheckPackageOrderData(generalTicketOrderData);
    const onceAPirateOrderDataNew = getCheckOapOrderData(onceAPirateOrderData);
    const serviceTax = getOrderProductServiceTax(
      generalTicketOrderDataNew,
      onceAPirateOrderDataNew
    );
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

  deleteAllCart = () => {
    const {
      dispatch,
      ticketOrderCartMgr: { generalTicketOrderData = [], onceAPirateOrderData = [] },
    } = this.props;
    const offerInstances = [];
    generalTicketOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderItem => {
        if (orderItem.orderType === 'offerBundle') {
          const { orderInfo } = orderItem;
          orderInfo.forEach(orderInfoItem => {
            offerInstances.push({
              offerNo: orderInfoItem.offerInfo.offerNo,
              offerInstanceId: orderInfoItem.offerInstanceId,
            });
          });
        } else {
          offerInstances.push({
            offerNo: orderItem.offerInfo.offerNo,
            offerInstanceId: orderItem.offerInstanceId,
          });
        }
      });
    });
    onceAPirateOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(offerDetail => {
        offerInstances.push({
          offerNo: offerDetail.offerInfo.offerNo,
          offerInstanceId: offerDetail.offerInstanceId,
        });
      });
    });
    if (offerInstances.length < 1) {
      message.success('No Data.');
    } else {
      dispatch({
        type: 'ticketOrderCartMgr/removeShoppingCart',
        payload: {
          offerInstances,
          callbackFn: null,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          message.success('Deleted successfully.');
        }
      });
    }
  };

  deleteSelectItemOnCart = () => {
    const {
      dispatch,
      ticketOrderCartMgr: {
        packageOrderData = [],
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
      },
    } = this.props;
    const ticketAmount = getCheckTicketAmount(
      packageOrderData,
      generalTicketOrderData,
      onceAPirateOrderData
    );
    if (ticketAmount < 1) {
      message.warn('Please select one item.');
    } else {
      const generalTicketOrderDataNew = getCheckPackageOrderData(generalTicketOrderData);
      const onceAPirateOrderDataNew = getCheckOapOrderData(onceAPirateOrderData);
      const offerInstances = [];
      generalTicketOrderDataNew.forEach(orderData => {
        orderData.orderOfferList.forEach(orderItem => {
          if (orderItem.orderType === 'offerBundle') {
            const { orderInfo } = orderItem;
            orderInfo.forEach(orderInfoItem => {
              offerInstances.push({
                offerNo: orderInfoItem.offerInfo.offerNo,
                offerInstanceId: orderInfoItem.offerInstanceId,
              });
            });
          } else {
            offerInstances.push({
              offerNo: orderItem.offerInfo.offerNo,
              offerInstanceId: orderItem.offerInstanceId,
            });
          }
        });
      });
      onceAPirateOrderDataNew.forEach(orderData => {
        orderData.orderOfferList.forEach(offerDetail => {
          offerInstances.push({
            offerNo: offerDetail.offerInfo.offerNo,
            offerInstanceId: offerDetail.offerInstanceId,
          });
        });
      });
      dispatch({
        type: 'ticketOrderCartMgr/removeShoppingCart',
        payload: {
          offerInstances,
          callbackFn: null,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          message.success('Deleted successfully.');
        }
      });
    }
  };

  deleteClickEvent = (e, methodType) => {
    e.stopPropagation();
    const {
      ticketOrderCartMgr: {
        packageOrderData = [],
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
      },
    } = this.props;
    if (methodType === 'all') {
      if (generalTicketOrderData.length < 1 && onceAPirateOrderData.length < 1) {
        message.warn('No data to delete.');
        return;
      }
    } else {
      const ticketAmount = getCheckTicketAmount(
        packageOrderData,
        generalTicketOrderData,
        onceAPirateOrderData
      );
      if (ticketAmount < 1) {
        message.warn('Please select one item.');
        return;
      }
    }
    confirm({
      title: 'Are you sure you want to delete?',
      content: '',
      onOk: () => {
        if (methodType === 'all') {
          this.deleteAllCart();
        } else {
          this.deleteSelectItemOnCart();
        }
      },
      onCancel() {},
    });
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      form,
      form: { getFieldDecorator },
      ticketOrderCartMgr: {
        deliveryMode,
        collectionDate,
        bocaFeePax,
        bocaFeeGst,
        checkOutLoading = false,
        selectAllOrder,
        selectAllIndeterminate,
      },
    } = this.props;

    const { clientHeight } = this.state;

    const title = [
      { name: formatMessage({ id: 'TICKETING' }) },
      {
        name: formatMessage({ id: 'ORDER_CREATION' }),
        href: '#/TicketManagement/Ticketing/CreateOrder?operateType=goBack',
      },
      { name: formatMessage({ id: 'MY_ORDER' }) },
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 24 },
        xxl: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 24 },
        xxl: { span: 24 },
      },
      colon: false,
    };

    const titleGrid = { xs: 24, sm: 24, md: 12, lg: 16, xl: 16, xxl: 16 };
    const processGrid = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8, xxl: 8 };
    const priceGrid = { xs: 0, sm: 0, md: 12, lg: 12, xl: 14, xxl: 16 };
    const priceGrid2 = { xs: 24, sm: 24, md: 12, lg: 12, xl: 10, xxl: 8 };
    const priceGrid3 = { xs: 0, sm: 0, md: 2, lg: 2, xl: 2, xxl: 2 };
    const priceGrid4 = { xs: 24, sm: 24, md: 22, lg: 22, xl: 22, xxl: 22 };

    this.pageDataCheck();

    return (
      <Spin spinning={checkOutLoading}>
        <MediaQuery minWidth={SCREEN.screenSm}>
          <BreadcrumbCompForPams title={title} />
        </MediaQuery>

        <Row gutter={12}>
          <Col {...titleGrid}>
            <Row gutter={12} style={{ paddingLeft: '5px' }}>
              <Col span={24}>
                <span className={styles.cartItemsSpan}>Cart ({this.getOrderAmount()} items)</span>
              </Col>
              <Col span={24} style={{ paddingTop: '8px' }}>
                <span className={styles.noteItemsSpan}>
                  NOTE:{formatMessage({ id: 'ORDER_TITLE_TIP' })}
                </span>
              </Col>
            </Row>
          </Col>
          <Col {...processGrid} className={styles.processBarCol}>
            <Steps labelPlacement="vertical" size="small">
              <Steps.Step status="process" title="Cart&nbsp;&nbsp;" />
              <Steps.Step status="wait" title={formatMessage({ id: 'REVIEW_ORDER' })} />
              <Steps.Step status="wait" title="Complete" />
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
          {this.getOrderAmount() === 0 && (
            <div>
              <List style={{ marginTop: 100 }} />
              <div className={styles.emptyListFont}>{formatMessage({ id: 'EMPTY_ORDER_TIP' })}</div>
            </div>
          )}
          {this.getOrderAmount() > 0 && <ShoppingCartOffer editModal />}
        </Card>
        <Card className={styles.cardStyles} style={{ marginTop: '0' }}>
          <Row className={styles.selectAll}>
            <Col xs={24} md={8} lg={4} className={styles.checkOutCheckBox}>
              <Checkbox
                value="SelectAll"
                onChange={this.clickSelectAll}
                checked={selectAllOrder}
                indeterminate={selectAllIndeterminate}
                className={styles.checkOutCheckStyle}
              >
                Select All
              </Checkbox>
            </Col>
            <Col xs={24} md={8} lg={4} className={styles.checkOutCheckBox}>
              <Button
                type="link"
                onClick={e => {
                  this.deleteClickEvent(e, 'select');
                }}
              >
                Delete the select Items
              </Button>
            </Col>
            <Col xs={24} md={8} lg={4} className={styles.checkOutCheckBox}>
              <Button
                type="link"
                onClick={e => {
                  this.deleteClickEvent(e, 'all');
                }}
              >
                Delete All Items
              </Button>
            </Col>
          </Row>
        </Card>
        <div className={styles.bocaFont}>
          <span className={styles.bocaStar}>*</span>
          {formatMessage({ id: 'BOCA_ORDER_TIP' })}
        </div>
        <Card className={styles.cardDeliverStyles}>
          <Row>
            <Col span={24}>
              <Row>
                <Col span={24} className={styles.titleBlack}>
                  {formatMessage({ id: 'DELIVER_INFORMATION' })}
                </Col>
              </Row>
              <Row style={{ padding: '10px 24px 20px 24px' }}>
                <Col xs={24} md={8} lg={6}>
                  <FormItem {...formItemLayout} label={formatMessage({ id: 'DELIVERY_MODE' })}>
                    {getFieldDecorator('deliveryMode', {
                      initialValue: deliveryMode,
                      rules: [
                        {
                          required: true,
                          message: 'Required',
                        },
                      ],
                    })(
                      <SortSelect
                        placeholder="Please Select"
                        allowClear
                        showSearch
                        style={{ width: '100%' }}
                        onChange={this.changeDeliveryMode}
                        disabled={this.deliveryModeDisabled()}
                        options={[
                          <Select.Option
                            key="deliveryMode1"
                            value="BOCA"
                            disabled={this.bocaOptionDisabled()}
                          >
                            BOCA (Ticket / Voucher Collection Letter)
                          </Select.Option>,
                          <Select.Option key="deliveryMode2" value="e-Ticket">
                            e-Ticket
                          </Select.Option>,
                          <Select.Option key="deliveryMode3" value="VID">
                            EVID (Visual ID)
                          </Select.Option>,
                        ]}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col xs={0} md={2} lg={2} />
                <Col xs={24} md={8} lg={6}>
                  {deliveryMode && deliveryMode === 'BOCA' && (
                    <FormItem {...formItemLayout} label={formatMessage({ id: 'COLLECTION_DATE' })}>
                      {getFieldDecorator('collectionDate', {
                        initialValue: collectionDate,
                        rules: [
                          {
                            required: true,
                            message: 'Required',
                          },
                        ],
                      })(
                        <div
                          className={`${styles.formatTime} ${
                            collectionDate ? styles.formatPadding : null
                          }`}
                        >
                          <DatePicker
                            allowClear
                            value={collectionDate ? moment(collectionDate, 'x') : null}
                            style={{ width: '100%' }}
                            placeholder="Select Date"
                            showToday={false}
                            format="DD-MMM-YYYY"
                            onChange={this.changeCollectionDate}
                            disabledDate={this.disabledCollectionDate}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          {companyType !== '02' && deliveryMode === 'BOCA' && this.getOrderAmount() !== 0 && (
            <Row>
              <Col style={{ padding: '0px 15px 25px 15px' }}>
                <BOCAOfferCollapse
                  form={form}
                  companyType={companyType}
                  quantity={this.getTicketAmount()}
                  pricePax={bocaFeePax}
                />
              </Col>
            </Row>
          )}
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
                        <span className={styles.priceKeySpan}>Offer Price (Before GST):</span>
                      </Col>
                      <Col span={8}>
                        <span className={styles.priceValueSpan}>
                          {this.getProductFeeExclude(bocaFeePax, this.getTicketAmount())}
                        </span>
                      </Col>
                    </Row>
                    {companyType !== '02' &&
                      deliveryMode === 'BOCA' &&
                      this.getOrderAmount() !== 0 && (
                        <Row className={styles.priceCol}>
                          <Col span={16}>
                            <span className={styles.priceKeySpan}>BOCA Fee (Before GST):</span>
                          </Col>
                          <Col span={8}>
                            <span className={styles.priceValueSpan}>
                              {this.getBocaFeeExclude(
                                bocaFeePax,
                                this.getTicketAmount(),
                                bocaFeeGst
                              )}
                            </span>
                          </Col>
                        </Row>
                      )}
                    <Row className={styles.priceCol2}>
                      <Col span={16}>
                        <span className={styles.priceKeySpan}>Goods & Service Tax (GST):</span>
                      </Col>
                      <Col span={8}>
                        <span className={styles.priceValueSpan}>
                          {this.getServiceTax(bocaFeePax, this.getTicketAmount(), bocaFeeGst)}
                        </span>
                      </Col>
                    </Row>
                    <Row className={styles.priceCol3}>
                      <Col span={16}>
                        <span className={styles.priceKeySpan}>
                          Total Amount Payable (After GST):
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
                <Col xs={0} md={8} lg={1} className={styles.checkOutCheckBox} />
                <Col xs={24} md={16} lg={23} className={styles.checkOutBtn}>
                  <Button
                    disabled={this.checkoutBtnDisabled()}
                    className={
                      this.checkoutBtnDisabled() ? styles.checkOutButton2 : styles.checkOutButton
                    }
                    htmlType="button"
                    size="large"
                    onClick={this.checkOutEvent}
                  >
                    Check Out
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default CheckOrder;
