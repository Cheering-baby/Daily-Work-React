import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import MealsItem from './components/MealsItem';

@connect(({ ticketMgr, onceAPirateTicketMgr }) => ({
  ticketMgr,
  onceAPirateTicketMgr,
}))
class GroupSetting extends Component {
  componentDidMount() {}

  addMenuScheme = (index, offerDetail) => {
    const {
      dispatch,
      onceAPirateTicketMgr: { onceAPirateOrderData = [] },
    } = this.props;
    offerDetail.orderInfo.groupSettingList.push({
      meals: null,
      remarks: [],
      number: 1,
    });
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

  showAddMenuScheme = offerDetail => {
    let show = false;
    if (offerDetail.offerInfo.voucherProductList.length !== 1) {
      if (
        offerDetail.offerInfo.voucherProductList.length !==
        offerDetail.orderInfo.groupSettingList.length
      ) {
        show = true;
      }
    }
    if (offerDetail.offerInfo.offerProfile && offerDetail.offerInfo.offerProfile.productGroup) {
      const productGroupList = offerDetail.offerInfo.offerProfile.productGroup;
      productGroupList.forEach(productGroup => {
        if (productGroup.productType === 'Voucher') {
          productGroup.productGroup.forEach(productGroupItem => {
            if (productGroupItem.choiceConstrain === 'Single') {
              show = false;
            }
          });
        }
      });
    }
    return show;
  };

  render() {
    const {
      onceAPirateTicketMgr: { queryInfo, onceAPirateOrderData = [], diningRemarkList },
      form,
    } = this.props;

    return (
      <div>
        {onceAPirateOrderData &&
          onceAPirateOrderData.map((item, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index}>
                <Row>
                  <Col span={24} className={styles.titleBlack}>
                    {item.offerInfo.offerName}
                  </Col>
                </Row>
                {item.orderInfo.groupSettingList &&
                  item.orderInfo.groupSettingList.map((mealItem, mealItemIndex) => (
                    <MealsItem
                      key={`groupSettingList_${Math.random()}`}
                      form={form}
                      queryInfo={queryInfo}
                      offerIndex={index}
                      offerDetail={item}
                      mealItemIndex={mealItemIndex}
                      diningRemarkList={diningRemarkList}
                      mealItem={mealItem}
                      itemValueChangeEvent={(orderIndex, offerDetail) =>
                        this.itemValueChangeEvent(orderIndex, offerDetail)
                      }
                    />
                  ))}
                {this.showAddMenuScheme(item) && (
                  <Row>
                    <Col span={8}>
                      <Row>
                        <Col span={8}> </Col>
                        <Col span={16}>
                          <Button
                            type="link"
                            size="large"
                            className={styles.addSpanStyle}
                            onClick={() => {
                              this.addMenuScheme(index, item);
                            }}
                          >
                            {formatMessage({ id: 'ADD_MENU_SCHEME' })}
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              </div>
            );
          })}
      </div>
    );
  }
}

export default GroupSetting;
