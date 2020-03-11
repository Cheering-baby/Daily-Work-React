import React, { Component } from 'react';
import { Icon, Collapse, Form } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

@Form.create()
@connect(({ ticketOrderCartMgr }) => ({
  ticketOrderCartMgr,
}))
class OnceAPirateCollapse extends Component {

  constructor(props) {
    super(props);
  }

  operateButtonEvent = (opType, orderIndex, onceAPirateOrder) => {
    const {
      dispatch,
      ticketOrderCartMgr: { onceAPirateOrderData = [] },
    } = this.props;
    if (opType === 'delete' && orderIndex !== null) {
      onceAPirateOrderData.splice(orderIndex, 1);
      dispatch({
        type: 'ticketOrderCartMgr/save',
        payload: {
          onceAPirateOrderData,
        },
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
      ticketOrderCartMgr: { onceAPirateOrderData = [] },
      form,
      form: { getFieldDecorator },
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
                key={`OrderItemCollapse_${orderIndex}`}
                form={form}
                orderIndex={orderIndex}
                onceAPirateOrder={onceAPirateOrder}
                changeOrderCheck={(orderIndex, onceAPirateOrder) => {
                  this.changeOrderCheck(orderIndex, onceAPirateOrder);
                }}
                operateButtonEvent={(opType, orderIndex, onceAPirateOrder) => {
                  this.operateButtonEvent(opType, orderIndex, onceAPirateOrder);
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
