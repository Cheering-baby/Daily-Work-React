import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Card, Form, message, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';

import SitMapPanel from './components/SitMapPanel';
import OfferListPanel from './components/OfferListPanel';

@Form.create()
@connect(({ ticketMgr, onceAPirateTicketMgr }) => ({
  ticketMgr,
  onceAPirateTicketMgr,
}))
class OnceAPirate extends Component {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      50;
    this.state = {
      clientHeight,
    };
  }

  reset = () => {};

  addToCart = () => {
    const {
      dispatch,
      ticketMgr: { orderIndex, onceAPirateOrder },
      onceAPirateTicketMgr: { queryInfo, onceAPirateOfferData = [] },
    } = this.props;

    const onceAPirateOrderData = [];
    let orderQuantity = 0;
    for (const onceAPirateOffer of onceAPirateOfferData) {
      orderQuantity += onceAPirateOffer.orderQuantity;
      if (onceAPirateOffer.orderQuantity > 0) {
        onceAPirateOrderData.push(onceAPirateOffer);
        if (onceAPirateOffer.orderQuantity < onceAPirateOffer.offerMinQuantity) {
          message.warn(
            `${onceAPirateOffer.offerName} minimum quantity less than ${onceAPirateOffer.offerMinQuantity}.`
          );
          return;
        }
      }
    }
    if (orderQuantity > queryInfo.numOfGuests) {
      message.warn('Offer total quantity more than No. of Guests.');
      return;
    }

    if (orderQuantity === 0) {
      message.warn('Please input offer order quantity.');
      return;
    }

    if (orderQuantity !== queryInfo.numOfGuests) {
      message.warn('The offer order quantity not equals No. of Guests.');
      return;
    }

    // sessionTime compare with now, if less then 3 hour, have not ding voucher.
    const dateOfVisitTime = moment(queryInfo.dateOfVisit, 'x');
    let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
    if (queryInfo.sessionTime) {
      dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${queryInfo.sessionTime}`;
      const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
      const du = moment.duration(dateOfVisitTimeMoment - moment(), 'ms');
      const diffMinutes = du.asHours();
      if (diffMinutes < 3) {
        dispatch({
          type: 'onceAPirateTicketMgr/addToCartByDiffMinutesLess',
          payload: {
            orderIndex,
            onceAPirateOrder,
            onceAPirateOrderData,
            diffMinutesLess: true,
          },
        });
      } else {
        dispatch({
          type: 'onceAPirateTicketMgr/addToCartSaveOrderData',
          payload: {
            orderIndex,
            onceAPirateOrder,
            onceAPirateOrderData,
            diffMinutesLess: false,
          },
        });
      }
    } else {
      router.push(`/TicketManagement/Ticketing/CreateOrder/OnceAPirateOrderCart`);
    }
  };

  render() {
    const { clientHeight } = this.state;

    const {
      ticketMgr: { onceAPirateLoading = false, functionActive },
    } = this.props;

    return (
      <Spin spinning={onceAPirateLoading}>
        <Card
          className={styles.marginTop4}
          title={null}
          style={{ minHeight: clientHeight, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}
        >
          <div className={styles.sitMapPanel}>
            <SitMapPanel />
          </div>
          <div className={styles.offerPanel}>
            <OfferListPanel />
          </div>
          <div className={styles.formControl}>
            <Button type="primary" onClick={this.addToCart} disabled={!functionActive}>
              {formatMessage({ id: 'ADD_TO_CART' })}
            </Button>
          </div>
        </Card>
      </Spin>
    );
  }
}

export default OnceAPirate;
