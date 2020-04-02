import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import styles from './index.less';
import CustomerMeal from './components/CustomerMeal';

@connect(({ ticketMgr, onceAPirateTicketMgr }) => ({
  ticketMgr,
  onceAPirateTicketMgr,
}))
class IndividualSetting extends Component {
  itemValueChangeEvent = (index, offerDetail) => {
    const {
      dispatch,
      onceAPirateTicketMgr: { onceAPirateOrderData = [] },
    } = this.props;
    Object.assign(onceAPirateOrderData, {
      [index]: {
        ...offerDetail,
      },
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
      onceAPirateTicketMgr: { queryInfo, onceAPirateOrderData = [], diningRemarkList },
      form,
    } = this.props;

    return (
      <div>
        {onceAPirateOrderData &&
          onceAPirateOrderData.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <Row>
                <Col span={24} className={styles.titleBlack}>
                  {item.offerInfo.offerName}
                </Col>
              </Row>
              {item.orderInfo.individualSettingList &&
                item.orderInfo.individualSettingList.map((customerItem, customerItemIndex) => (
                  <CustomerMeal
                    key={`individualSetting_${Math.random()}`}
                    form={form}
                    queryInfo={queryInfo}
                    offerIndex={index}
                    offerDetail={item}
                    customerItemIndex={customerItemIndex}
                    diningRemarkList={diningRemarkList}
                    customerItem={customerItem}
                    itemValueChangeEvent={(offerIndex, offerDetail, opType) =>
                      this.itemValueChangeEvent(offerIndex, offerDetail, opType)
                    }
                  />
                ))}
            </div>
          ))}
      </div>
    );
  }
}

export default IndividualSetting;
