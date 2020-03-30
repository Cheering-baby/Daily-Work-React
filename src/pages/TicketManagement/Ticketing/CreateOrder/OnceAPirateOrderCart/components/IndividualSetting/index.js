import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './index.less';
import CustomerMeal from './components/CustomerMeal';

@connect(({ ticketMgr, onceAPirateTicketMgr }) => ({
  ticketMgr,
  onceAPirateTicketMgr,
}))
class IndividualSetting extends Component {
  componentDidMount() {}

  itemValueChangeEvent = (index, offerDetail, opType) => {
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
    if (opType && opType === 'updateAll') {
      /* const diningRemarkList = offerDetail.orderInfo.individualSettingList[0].remarks.map(remark=>{
        return Object.assign({},{
          label: remark
        })
      });
      dispatch({
        type: 'onceAPirateTicketMgr/save',
        payload: {
          diningRemarkList,
        },
      }); */
    }
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
            <div key={index}>
              <Row>
                <Col span={24} className={styles.titleBlack}>
                  {item.offerInfo.offerName}
                </Col>
              </Row>
              {item.orderInfo.individualSettingList &&
                item.orderInfo.individualSettingList.map((customerItem, customerItemIndex) => (
                  <CustomerMeal
                    key={`${index  }_individualSetting_${  customerItemIndex}`}
                    form={form}
                    queryInfo={queryInfo}
                    offerIndex={index}
                    offerDetail={item}
                    customerItemIndex={customerItemIndex}
                    diningRemarkList={diningRemarkList}
                    customerItem={customerItem}
                    itemValueChangeEvent={(index, offerDetail, opType) =>
                      this.itemValueChangeEvent(index, offerDetail, opType)
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
