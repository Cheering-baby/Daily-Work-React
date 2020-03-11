import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './index.less';
import CustomerMeal from './components/CustomerMeal';

@connect(({ ticketMgr, onceAPirateTicketMgr }) => ({
  ticketMgr, onceAPirateTicketMgr
}))
class IndividualSetting extends Component {

  componentDidMount() {

  }

  itemValueChangeEvent = (index,offerDetail) => {
    const {
      dispatch,
      onceAPirateTicketMgr: {
        onceAPirateOrderData = [],
      }
    } = this.props;
    Object.assign(onceAPirateOrderData, {
      [index]: {
        ...offerDetail,
      }
    });
    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        onceAPirateOrderData,
      },
    });
  };

  render() {

    const {
      onceAPirateTicketMgr: {
        onceAPirateOrderData = [],
        diningRemarkList
      },
      form
    } = this.props;

    return (
      <div>
        {
          onceAPirateOrderData && onceAPirateOrderData.map((item, index) => (
            <div key={index}>
              <Row>
                <Col span={24} className={styles.titleBlack}>
                  {item.offerInfo.offerName}
                </Col>
              </Row>
              {
                item.orderInfo.individualSettingList && item.orderInfo.individualSettingList.map((mealItem,mealItemIndex)=>(
                  <CustomerMeal
                    key={index+'s'+mealItemIndex}
                    form={form}
                    offerIndex={index}
                    offerDetail={item}
                    mealItemIndex={mealItemIndex}
                    diningRemarkList={diningRemarkList}
                    mealItem={mealItem}
                    itemValueChangeEvent={(index,offerDetail)=>this.itemValueChangeEvent(index,offerDetail)}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

export default IndividualSetting;
