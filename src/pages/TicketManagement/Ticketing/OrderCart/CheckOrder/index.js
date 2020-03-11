import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Spin, Card, Checkbox, Form, Button, List } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import styles from './index.less';
import PackageTicketCollapse from './components/PackageTicketCollapse';
import OnceAPirateCollapse from './components/OnceAPirateCollapse';
import GeneralTicketingCollapse from './components/GeneralTicketingCollapse';

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
      70;
    this.state = {
      clientHeight,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/queryCountry',
      payload: {
        tableName: 'CUST_PROFILE',
        columnName: 'NOTIONALITY',
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
        packageOrderData = [],
        generalTicketOrderData = [],
        onceAPirateOrderData = [],
      },
    } = this.props;
    let payTotal = 0;
    generalTicketOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        orderOffer.orderInfo.forEach(orderInfo => {
          if (orderInfo.orderCheck) {
            payTotal += orderInfo.pricePax * orderInfo.quantity;
          }
        });
      });
    });
    packageOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        orderOffer.orderInfo.forEach(orderInfo => {
          if (orderInfo.orderCheck) {
            payTotal += orderInfo.pricePax * orderInfo.quantity;
          }
        });
      });
    });
    onceAPirateOrderData.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        if (orderOffer.orderCheck) {
          payTotal += orderOffer.orderInfo.offerSumPrice * orderOffer.orderInfo.orderQuantity;
        }
      });
    });
    return payTotal;
  };

  checkOutEvent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/orderCheckOut',
      payload: {},
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
        orderCartDataAmount += orderData.orderOfferList.length;
      });
    });
    return orderCartDataAmount;
  };

  render() {
    const {
      global: { userCompanyInfo },
      form,
      ticketOrderCartMgr: {
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

    console.log(userCompanyInfo);

    return (
      <Spin spinning={checkOutLoading}>
        <MediaQuery minWidth={SCREEN.screenSm}>
          <div style={{ height: 34 }}>
            <BreadcrumbComp title={title} />
          </div>
        </MediaQuery>
        <Card style={{ minHeight: clientHeight }}>
          {packageOrderData.length > 0 && <PackageTicketCollapse form={form} />}
          {generalTicketOrderData.length > 0 && <GeneralTicketingCollapse form={form} />}
          {onceAPirateOrderData.length > 0 && <OnceAPirateCollapse form={form} />}
          {this.getOrderAmount() === 0 && (
            <div>
              <List style={{ marginTop: 100 }} />
              <div className={styles.emptyListFont}>{formatMessage({ id: 'EMPTY_ORDER_TIP' })}</div>
            </div>
          )}
        </Card>

        <Card className={styles.cardStyles} style={{ marginTop: '0' }}>
          <div className={styles.checkOut}>
            <Checkbox
              value="SelectAll"
              style={{ position: 'absolute', left: 34 }}
              onChange={this.clickSelectAll}
              checked={selectAllOrder}
              indeterminate={selectAllIndeterminate}
            >
              Select All
            </Checkbox>
            <div className={styles.checkOutPayDiv}>
              <div className={styles.payFont}>
                Pay Today: <span className={styles.priceFont}>${this.payTotal()}</span>
              </div>
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
          </div>
        </Card>
      </Spin>
    );
  }
}

export default CheckOrder;
