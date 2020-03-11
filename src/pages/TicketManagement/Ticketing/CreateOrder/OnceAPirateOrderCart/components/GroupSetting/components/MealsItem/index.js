import React, { Component } from 'react';
import { Form, Row, Col, Select, InputNumber, Tooltip, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../../index.less';

class MealsItem extends Component {

  componentDidMount() {

  }

  mealsChangeEvent = (value) => {

    const {
      offerIndex,
      offerDetail,
      mealItemIndex,
      itemValueChangeEvent
    } = this.props;

    offerDetail.orderInfo.groupSettingList[mealItemIndex].meals = value;
    itemValueChangeEvent(offerIndex,offerDetail);

  };

  mealsDisabled = (selectValue) => {

    const {
      offerDetail,
      mealItem,
    } = this.props;

    let result = false;

    if (mealItem.meals && mealItem.meals===selectValue.productNo) {
      result = false;
    } else {
      offerDetail.orderInfo.groupSettingList.map(item=>{
        if (item.meals && item.meals === selectValue.productNo) {
          result = true;
        }
      })
    }

    return result;
  };

  remarksChangeEvent = (value) => {

    const {
      offerIndex,
      offerDetail,
      mealItemIndex,
      itemValueChangeEvent
    } = this.props;

    offerDetail.orderInfo.groupSettingList[mealItemIndex].remarks = value;
    itemValueChangeEvent(offerIndex,offerDetail);

  };

  numberChangeEvent = (value) => {
    const {
      offerIndex,
      offerDetail,
      mealItemIndex,
      itemValueChangeEvent
    } = this.props;

    offerDetail.orderInfo.groupSettingList[mealItemIndex].number = value;
    itemValueChangeEvent(offerIndex,offerDetail);
  };

  deleteItemEvent = () => {
    const {
      offerIndex,
      offerDetail,
      mealItemIndex,
      itemValueChangeEvent
    } = this.props;

    offerDetail.orderInfo.groupSettingList.splice(mealItemIndex, 1);
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

    const { getFieldDecorator } = form;

    const {
      offerInfo: {
        voucherProductList
      }
    } = offerDetail;

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
    const formItemLayout2 = {
      labelCol: {
        xs: {span: 12},
        sm: {span: 12},
        md: {span: 12},
        lg: {span: 12},
        xl: {span: 12},
        xxl: {span: 12},
      },
      wrapperCol: {
        xs: {span: 12},
        sm: {span: 12},
        md: {span: 12},
        lg: {span: 12},
        xl: {span: 12},
        xxl: {span: 12},
      },
      colon: false,
    };

    return (
      <div>
        <Row>
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
                        disabled={this.mealsDisabled(item)}
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
          <Col {...gridOpts} className={styles.basicInfoContent}>
            <Row>
              <Col span={16}>
                <Form.Item
                  label={formatMessage({ id:'NUMBER' })}
                  {...formItemLayout2}
                >
                  {getFieldDecorator(`${offerDetail.offerInfo.offerNo}_${mealItemIndex}_number`, {
                    rules: [
                      { required: true, message: 'Required' },
                    ],
                    initialValue: mealItem.number,
                  })(
                    <InputNumber onChange={this.numberChangeEvent} allowClear min={0}  />
                  )}
                </Form.Item>
              </Col>
              {
                offerDetail.orderInfo.groupSettingList.length>1 && (
                  <Col span={8} style={{ fontSize: 20 }}>
                    <Tooltip placement='top' title='Delete'>
                      <Button type="link" onClick={this.deleteItemEvent}>
                        <span className='iconfont icon-trash'> </span>
                      </Button>
                    </Tooltip>
                  </Col>
                )
              }
            </Row>
          </Col>
        </Row>
        <Row style={{marginBottom:'10px'}}>
          <Col span={8}>
            <Row>
              <Col span={8}> </Col>
              <Col span={16}>
                <span>Slightly Spicy pork strips in a mushroom, garlic, ginger and pepper sauce.</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default MealsItem;
