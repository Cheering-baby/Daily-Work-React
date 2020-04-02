import React, {Component} from 'react';
import {Collapse, Form, Icon, message} from 'antd';
import {connect} from 'dva';
import router from 'umi/router';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

@Form.create()
@connect(({ global, ticketOrderCartMgr }) => ({
  global,
  ticketOrderCartMgr,
}))
class OnceAPirateCollapse extends Component {
  operateButtonEvent = (opType, orderIndex, onceAPirateOrder) => {
    const {
      dispatch,
      ticketOrderCartMgr: { onceAPirateOrderData = [] },
    } = this.props;
    if (opType === 'delete' && orderIndex !== null) {
      const orderItem = onceAPirateOrderData[orderIndex];
      const removeOfferInstanceList = [];
      for (
        let orderOfferIndex = 0;
        orderOfferIndex < orderItem.orderOfferList.length;
        orderOfferIndex += 1
      ) {
        const offerDetail = orderItem.orderOfferList[orderOfferIndex];
        removeOfferInstanceList.push({
          offerNo: offerDetail.offerInfo.offerNo,
          offerInstanceId: offerDetail.offerInstanceId,
        });
      }
      dispatch({
        type: 'ticketOrderCartMgr/removeShoppingCart',
        payload: {
          offerInstances: removeOfferInstanceList,
          callbackFn: null,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          message.success('Delete successfully!');
        }
      });
    } else if (opType === 'edit') {
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          orderIndex,
          onceAPirateOrder,
        },
      });
      router.push({
        pathname: '/TicketManagement/Ticketing/CreateOrder',
        query: {
          operateType: 'editOnceAPirateOrder',
        },
      });
    }
  };

  changeOrderCheck = (orderIndex, onceAPirateOrder) => {
    const {
      dispatch,
      ticketOrderCartMgr: { onceAPirateOrderData = [] },
    } = this.props;
    Object.assign(onceAPirateOrderData, {
      [orderIndex]: {
        ...onceAPirateOrder,
      },
    });
    dispatch({
      type: 'ticketOrderCartMgr/ticketOrderCheckSave',
      payload: {
        onceAPirateOrderData,
      },
    });
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketOrderCartMgr: { onceAPirateOrderData = [] },
      form,
    } = this.props;

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['OnceAPirateCollapsePanel']}
        expandIcon={({ isActive }) => (
          <Icon
            style={{ color: '#FFF', right: 15, textAlign: 'right' }}
            type="up"
            rotate={isActive ? 0 : 180}
          />
        )}
      >
        <Collapse.Panel
          className={styles.collapsePanelStyles}
          key="OnceAPirateCollapsePanel"
          header={<span className={styles.collapsePanelHeaderStyles}>Once A Pirate</span>}
        >
          {onceAPirateOrderData.map((onceAPirateOrder, orderIndex) => {
            return (
              <OrderItemCollapse
                key={`OrderItemCollapse_${Math.random()}`}
                form={form}
                companyType={companyType}
                orderIndex={orderIndex}
                onceAPirateOrder={onceAPirateOrder}
                changeOrderCheck={(orderIndexParam, onceAPirateOrderParam) => {
                  this.changeOrderCheck(orderIndexParam, onceAPirateOrderParam);
                }}
                operateButtonEvent={(opType, orderIndexParam, onceAPirateOrderParam) => {
                  this.operateButtonEvent(opType, orderIndexParam, onceAPirateOrderParam);
                }}
              />
            );
          })}
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default OnceAPirateCollapse;
