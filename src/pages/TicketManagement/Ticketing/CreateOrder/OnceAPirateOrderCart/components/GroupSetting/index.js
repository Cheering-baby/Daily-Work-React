import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import MealsItem from './components/MealsItem';

@connect(({ ticketMgr,onceAPirateTicketMgr }) => ({
  ticketMgr,onceAPirateTicketMgr
}))
class GroupSetting extends Component {

  componentDidMount() {

  }

  addMenuScheme = (index,offerDetail) => {

    const {
      dispatch,
      onceAPirateTicketMgr: {
        onceAPirateOrderData = [],
      }
    } = this.props;
    offerDetail.orderInfo.groupSettingList.push({
      meals: null,
      remarks: [],
      number: 0,
    });
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
          onceAPirateOrderData && onceAPirateOrderData.map((item,index)=>{
            return (
              <div key={index}>
                <Row>
                  <Col span={24} className={styles.titleBlack}>
                    {item.offerInfo.offerName}
                  </Col>
                </Row>
                {
                  item.orderInfo.groupSettingList && item.orderInfo.groupSettingList.map((mealItem,mealItemIndex)=>(
                    <MealsItem
                      key={index+'_'+mealItemIndex}
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
                {
                  (item.offerInfo.voucherProductList.length!==1 && item.offerInfo.voucherProductList.length !== item.orderInfo.groupSettingList.length) && (
                    <Row >
                      <Col span={8}>
                        <Row>
                          <Col span={8}> </Col>
                          <Col span={16}>
                            <Button
                              type="link"
                              size='large'
                              className={styles.addSpanStyle}
                              onClick={()=>{this.addMenuScheme(index,item)}}
                            >
                              {formatMessage({ id:'ADD_MENU_SCHEME' })}
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  )
                }

              </div>
            )
          })
        }
      </div>
    );
  }
}

export default GroupSetting;
