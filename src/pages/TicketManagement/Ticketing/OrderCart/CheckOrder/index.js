import React, {Component} from 'react';
import MediaQuery from 'react-responsive';
import {Button, Card, Checkbox, Col, DatePicker, Form, List, message, Row, Select, Spin,} from 'antd';
import {connect} from 'dva';
import {formatMessage} from 'umi/locale';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import styles from './index.less';
import PackageTicketCollapse from './components/PackageTicketCollapse';
import OnceAPirateCollapse from './components/OnceAPirateCollapse';
import GeneralTicketingCollapse from './components/GeneralTicketingCollapse';
import BOCAOfferCollapse from '@/pages/TicketManagement/components/BOCAOfferCollapse';

import {
  getCheckOapOrderData,
  getCheckPackageOrderData,
  getCheckTicketAmount,
  transBookingToPayTotalPrice,
} from '@/pages/TicketManagement/utils/orderCartUtil';

const FormItem = Form.Item;

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
      50 -
      80 -
      97;
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
      type: 'ticketOrderCartMgr/queryPluAttribute',
      payload: {
        attributeItem: 'BOCA_PLU',
      },
    });
    dispatch({
      type: 'ticketOrderCartMgr/queryCountry',
      payload: {
        tableName: 'CUST_PROFILE',
        columnName: 'NOTIONALITY',
      },
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
        });
      });
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/resetData',
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
    const { dispatch, form } = this.props;
    form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'ticketOrderCartMgr/orderCheckOut',
          payload: {},
        });
      }
    });
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

    this.checkCollectionWithVisitOfDate(collectionDate);
  };

  checkCollectionWithVisitOfDate = collectionDate => {
    // compare CollectionDate with visit of date
    const {
      ticketOrderCartMgr: {
        packageOrderData = [],
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
      },
    } = this.props;

    let isMoreThan = false;
    generalTicketOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        if (orderOffer.queryInfo.dateOfVisit < collectionDate) {
          if (!isMoreThan) {
            isMoreThan = true;
            message.warn('The collection date is later than date of visit!');
          }
        }
      });
    });
    packageOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        if (orderOffer.queryInfo.dateOfVisit < collectionDate) {
          if (!isMoreThan) {
            isMoreThan = true;
            message.warn('The collection date is later than date of visit!');
          }
        }
      });
    });
    onceAPirateOrderData.forEach(orderData => {
      if (orderData.queryInfo.dateOfVisit < collectionDate) {
        if (!isMoreThan) {
          isMoreThan = true;
          message.warn('The collection date is later than date of visit!');
        }
      }
    });
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
        checkOutLoading = false,
        selectAllOrder,
        selectAllIndeterminate,
        packageOrderData = [],
        generalTicketOrderData,
        onceAPirateOrderData = [],
      },
    } = this.props;

    const { clientHeight } = this.state;

    const title = [
      { name: 'Ticketing' },
      { name: 'Create Order', href: '#/TicketManagement/Ticketing/CreateOrder?operateType=goBack' },
      { name: 'Check Order' },
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

    return (
      <Spin spinning={checkOutLoading}>
        <MediaQuery minWidth={SCREEN.screenSm}>
          <div style={{ height: 34 }}>
            <BreadcrumbComp title={title} />
          </div>
        </MediaQuery>
        <Card className={styles.cardDeliverStyles}>
          <Row style={{ padding: '15px' }}>
            <Col span={24}>
              <Row>
                <Col span={24} className={styles.titleBlack}>
                  {formatMessage({ id: 'DELIVER_INFORMATION' })}
                </Col>
              </Row>
              <Row>
                <Col offer={2} xs={24} md={12} lg={10}>
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
                      <Select
                        placeholder="Please Select"
                        allowClear
                        showSearch
                        style={{ width: '100%' }}
                        onChange={this.changeDeliveryMode}
                      >
                        <Select.Option value="BOCA">BOCA</Select.Option>
                        <Select.Option value="VID">VID</Select.Option>
                        <Select.Option value="e-Ticket">e-Ticket</Select.Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col offer={2} xs={24} md={12} lg={10}>
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
        </Card>
        <Card style={{ minHeight: clientHeight, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}>
          {packageOrderData.length > 0 && <PackageTicketCollapse form={form} />}
          {generalTicketOrderData.length > 0 && <GeneralTicketingCollapse form={form} />}
          {onceAPirateOrderData.length > 0 && <OnceAPirateCollapse form={form} />}
          {companyType !== '02' && deliveryMode === 'BOCA' && this.getOrderAmount() !== 0 && (
            <BOCAOfferCollapse
              form={form}
              companyType={companyType}
              quantity={this.getTicketAmount()}
              pricePax={bocaFeePax}
            />
          )}
          {this.getOrderAmount() === 0 && (
            <div>
              <List style={{ marginTop: 100 }} />
              <div className={styles.emptyListFont}>{formatMessage({ id: 'EMPTY_ORDER_TIP' })}</div>
            </div>
          )}
        </Card>
        <Card className={styles.cardStyles} style={{ marginTop: '0', marginBottom: '20px' }}>
          <Row className={styles.checkOut}>
            <Col xs={24} md={8} lg={4} className={styles.checkOutCheckBox}>
              <Checkbox
                value="SelectAll"
                style={{ position: 'absolute', left: 34 }}
                onChange={this.clickSelectAll}
                checked={selectAllOrder}
                indeterminate={selectAllIndeterminate}
              >
                Select All
              </Checkbox>
            </Col>
            <Col xs={24} md={16} lg={20} className={styles.checkOutBtn}>
              <div className={styles.checkOutPayDiv}>
                {companyType === '01' && (
                  <div className={styles.payFont}>
                    Pay Today: <span className={styles.priceFont}>${this.payTotal()}</span>
                  </div>
                )}
              </div>
              <Button
                disabled={this.payTotal() <= 0}
                className={styles.checkOutButton}
                htmlType="button"
                size="large"
                onClick={this.checkOutEvent}
              >
                Check Out
              </Button>
            </Col>
          </Row>
        </Card>
      </Spin>
    );
  }
}

export default CheckOrder;
