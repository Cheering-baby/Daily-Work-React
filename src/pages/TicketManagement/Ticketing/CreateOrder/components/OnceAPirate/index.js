import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Form, Button, Card, message } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

import SitMapPanel from './components/SitMapPanel';
import OfferListPanel from './components/OfferListPanel';
import moment from 'moment';

@Form.create()
@connect(({ ticketMgr,onceAPirateTicketMgr }) => ({
  ticketMgr,onceAPirateTicketMgr
}))
class OnceAPirate extends Component {

  constructor(props) {
    super(props);
    const clientHeight = document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight - 50;
    this.state = {
      clientHeight,
    };
  }

  reset = () => {

  };

  addToCart = () => {

    const {
      dispatch,
      ticketMgr: {
        activeGroupSelectData,
        orderIndex,
        onceAPirateOrder,
      },
      onceAPirateTicketMgr: {
        onceAPirateOfferData = [],
      }
    } = this.props;

    const onceAPirateOrderData = [];
    let orderQuantity = 0;
    for (const onceAPirateOffer of onceAPirateOfferData) {
      orderQuantity+=onceAPirateOffer.orderQuantity;
      if (onceAPirateOffer.orderQuantity>0) {
        onceAPirateOrderData.push(onceAPirateOffer);
      }
    }
    if (orderQuantity>activeGroupSelectData.numOfGuests) {
      message.warn('Offer order quantity more than No. of Guests.');
      return ;
    }

    if (orderQuantity===0) {
      message.warn("Please choose offer order quantity.");
      return ;
    }

    // todo accessible seat
    if (activeGroupSelectData.accessibleSeat && orderQuantity>8) {
      message.warn("The accessible seat order quantity don't more than 8.");
      return ;
    }

    if(orderQuantity !== activeGroupSelectData.numOfGuests) {
      message.warn("The offer order quantity not equals No. of Guests.");
      return ;
    }

    // todo sessionTime compare with now, if less then 30 min, have not ding voucher.
    const dateOfVisitTime = moment(activeGroupSelectData.dateOfVisit, 'x');
    let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
    if (activeGroupSelectData.sessionTime) {
      dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${activeGroupSelectData.sessionTime}`;
      const dateOfVisitTimeMoment =  moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
      const du = moment.duration(dateOfVisitTimeMoment - moment(), 'ms');
      const diffMinutes = du.get('hour');
      dispatch({
        type: 'onceAPirateTicketMgr/addToCartSaveOrderData',
        payload: {
          orderIndex,
          onceAPirateOrder,
          onceAPirateOrderData,
          diffMinutesLess: diffMinutes < 3,
        },
      });
    } else {
      router.push(`/TicketManagement/Ticketing/CreateOrder/OnceAPirateOrderCart`);
    }

  };


  render() {

    const {
      clientHeight,
    } =  this.state;

    return (
      <Card
        className={styles.marginTop4}
        title={null}
        style={{ minHeight: clientHeight }}
      >
        <div className={styles.sitMapPanel}>
          <SitMapPanel />
        </div>
        <div className={styles.offerPanel}>
          <OfferListPanel />
        </div>
        <div className={styles.formControl}>
          <Button type="primary" onClick={this.addToCart}>
            {formatMessage({ id: 'ADD_TO_CART' })}
          </Button>
        </div>
      </Card>
    );
  }
}

export default OnceAPirate;
