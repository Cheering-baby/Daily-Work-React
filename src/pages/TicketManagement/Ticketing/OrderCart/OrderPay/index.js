import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Icon, Card, Checkbox, Collapse, Form, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import styles from './index.less';
import OnceAPirateCollapse from "./components/OnceAPirateCollapse";
import GeneralTicketingCollapse from "./components/GeneralTicketingCollapse";
import PaymentMode from "./components/PaymentMode";

@Form.create()
@connect(({ ticketOrderCartMgr }) => ({
  ticketOrderCartMgr,
}))
class OrderPay extends Component {

  constructor(props) {
    super(props);
    const clientHeight = document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight - 50 - 70;
    this.state = {
      clientHeight,
    };
  }

  offerPrice = (products = []) => {
    let totalPrice = 0;
    for (let i = 0; i < products.length ; i += 1) {
      const { quantity, price } = products[i];
      for (let j = 0; j < price.length ; j += 1) {
        const { discountUnitPrice } = price[j];
        totalPrice += (discountUnitPrice * quantity);
      }
    }
    return totalPrice;
  };

  clickSelectAll = (e) => {
    const { checked } = e.target;
    const { form } = this.props;
    if(checked) {
      form.resetFields();
    } else {
      const data = form.getFieldsValue();
      const keys = Object.keys(data);
      const param = {};
      for (let i = 0; i < keys.length ; i += 1) {
        Object.assign(param,{
          [`${keys[i]}`]: undefined,
        });
      }
      form.setFieldsValue(param);
    }
  };

  payTotal = () => {
    return '$0.00';
  };

  checkOutEvent = () => {

  };

  render() {
    const {
      form,
      ticketOrderCartMgr: {
        attractionBookingList,
        onceAPirateOrderData,
        onceAPirateBookingData,
      },
    } = this.props;

    const {
      clientHeight,
    } =  this.state;

    const title = [{ name: 'Ticketing' }, { name: 'Create Order', href: '#/TicketManagement/Ticketing/CreateOrder' }, { name: 'Order' }];

    return (
      <div>
        <MediaQuery minWidth={SCREEN.screenSm}>
          <div style={{ height: 34 }}>
            <BreadcrumbComp title={title} />
          </div>
        </MediaQuery>
        <Card style={{ minHeight: clientHeight }}>
          <GeneralTicketingCollapse
            form={form}
            onceAPirateOrderData={onceAPirateBookingData}
          />
          <OnceAPirateCollapse
            form={form}
            onceAPirateOrderData={onceAPirateBookingData}
          />
          <PaymentMode
            form={form}
          />
        </Card>

        <Card className={styles.cardStyles} style={{marginTop:'0'}}>
          <div className={styles.checkOut}>
            <div className={styles.checkOutPayDiv}>
              <div className={styles.payFont}>Total Pay:<span className={styles.priceFont}>{this.payTotal()}</span></div>
            </div>
            <Button
              className={styles.checkOutButton}
              htmlType='button'
              size='large'
              onClick={this.checkOutEvent}
            >
              Confirm
            </Button>
          </div>
        </Card>

      </div>
    );
  }
}

export default OrderPay;
