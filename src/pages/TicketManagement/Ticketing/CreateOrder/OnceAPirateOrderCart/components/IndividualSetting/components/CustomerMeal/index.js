import React, { Component } from 'react';
import {  Form, Row, Col, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../../index.less';

class CustomerMeal extends Component {

  componentDidMount() {

  }

  mealsChangeEvent = (value) => {

    const {
      offerIndex,
      offerDetail,
      mealItemIndex,
      itemValueChangeEvent
    } = this.props;

    offerDetail.orderInfo.individualSettingList[mealItemIndex].meals = value;
    itemValueChangeEvent(offerIndex,offerDetail);

  };

  remarksChangeEvent = (value) => {

    const {
      offerIndex,
      offerDetail,
      mealItemIndex,
      itemValueChangeEvent
    } = this.props;

    offerDetail.orderInfo.individualSettingList[mealItemIndex].remarks = value;
    itemValueChangeEvent(offerIndex,offerDetail);

  };

  updateAllEvent = () => {

    const {
      offerIndex,
      offerDetail,
      itemValueChangeEvent
    } = this.props;

    offerDetail.orderInfo.individualSettingList = offerDetail.orderInfo.individualSettingList.map((item,index)=>{
      if (index!==0) {
        item = offerDetail.individualSettingList[0];
      }
      return item;
    });

    itemValueChangeEvent(offerIndex,offerDetail);

  };

  render() {

    const {
      form,
      offerDetail,
      mealItemIndex,
      mealItem,
      diningRemarkList,
    } = this.props;

    const {
      offerInfo: {
        voucherProductList
      }
    } = offerDetail;

    const { getFieldDecorator } = form;

    const gridOpts = { xs: 24, sm: 24, md: 8, lg:8, xl: 8, xxl: 8 };
    const formItemLayout = {
      labelCol: {
        xs: {span: 10},
        sm: {span: 9},
        md: {span: 8},
        lg: {span: 8},
        xl: {span: 8},
        xxl: {span: 8},
      },
      wrapperCol: {
        xs: {span: 14},
        sm: {span: 15},
        md: {span: 16},
        lg: {span: 16},
        xl: {span: 16},
        xxl: {span: 16},
      },
      colon: false,
    };

    return (
      <div>
        <Row>
          <Col span={2} style={{ padding: '8px 0',}}>
            <div className={styles.pricingSettingTier}>
              {`Customer ${mealItemIndex === 0 ? `` : mealItemIndex}`}
            </div>
          </Col>
          <Col {...gridOpts} className={styles.basicInfoContent}>
            <Form.Item
              label={formatMessage({ id:'MEALS' })}
              {...formItemLayout}
            >
              {getFieldDecorator(`${offerDetail.offerInfo.offerNo}_${mealItemIndex}_meals`, {
                rules: [
                  { required: true, message: 'Required' },
                ],
                initialValue: mealItem.meals === null ? undefined : mealItem.meals,
              })(
                <Select
                  showSearch
                  allowClear
                  placeholder='Please Select'
                  onChange={this.mealsChangeEvent}>
                  {
                    voucherProductList && voucherProductList.map((item,index)=>(
                      <Select.Option
                        key={`${offerDetail.offerInfo.offerNo}_${mealItemIndex}_meals_${index}`}
                        value={item.productNo}
                      >{item.productName}</Select.Option>
                    ))
                  }
                </Select>
              )
              }
            </Form.Item>
          </Col>
          <Col {...gridOpts} className={styles.basicInfoContent}>
            <Form.Item
              label={formatMessage({ id:'REMARK' })}
              {...formItemLayout}
            >
              {getFieldDecorator(`${offerDetail.offerInfo.offerNo}_${mealItemIndex}_remark`, {
                rules: [
                  { required: false, message: 'Required' },
                ],
                initialValue: !mealItem.remarks || mealItem.remarks.length===0 ? undefined : mealItem.remarks,
              })(
                <Select
                  allowClear
                  mode="tags"
                  placeholder='Please Select'
                  onChange={this.remarksChangeEvent}
                >
                  {
                    diningRemarkList && diningRemarkList.map((item,index)=>(
                      <Select.Option
                        key={`${offerDetail.offerInfo.offerNo}_${mealItemIndex}_remark_${index}`}
                        value={item.label}>{item.label}</Select.Option>
                    ))
                  }
                </Select>
              )
              }
            </Form.Item>
          </Col>
          {
            (offerDetail.orderInfo.individualSettingList.length > 1 && mealItemIndex === 0) && (
              <Col span={2} offset={2}>
                <Button type="link" size='large' className={styles.addSpanStyle} onClick={this.updateAllEvent}>
                  Update ALL
                </Button>
              </Col>
            )
          }
        </Row>
        <Row style={{marginBottom:'10px'}}>
          <Col span={16} offset={4}>
            <span>Chicken marinated for at least 24 hours in Peri-Peri sauce and flame-grilled to order.</span>
          </Col>
        </Row>
      </div>
    )
  }

}


export default CustomerMeal;
