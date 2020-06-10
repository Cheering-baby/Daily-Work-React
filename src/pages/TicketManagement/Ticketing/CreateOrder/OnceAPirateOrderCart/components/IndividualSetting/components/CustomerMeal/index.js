import React, { Component } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../../index.less';
import SortSelect from '@/components/SortSelect';

class CustomerMeal extends Component {
  componentDidMount() {}

  mealsChangeEvent = value => {
    const { offerIndex, offerDetail, customerItemIndex, itemValueChangeEvent } = this.props;

    offerDetail.orderInfo.individualSettingList[customerItemIndex].meals = value;
    itemValueChangeEvent(offerIndex, offerDetail);
  };

  remarksChangeEvent = valueList => {
    const { offerIndex, offerDetail, customerItemIndex, itemValueChangeEvent } = this.props;

    offerDetail.orderInfo.individualSettingList[customerItemIndex].remarks = valueList;
    itemValueChangeEvent(offerIndex, offerDetail);
  };

  updateAllEvent = () => {
    const { offerIndex, offerDetail, itemValueChangeEvent } = this.props;

    offerDetail.orderInfo.individualSettingList = offerDetail.orderInfo.individualSettingList.map(
      () => {
        return Object.assign({}, { ...offerDetail.orderInfo.individualSettingList[0] });
      }
    );

    itemValueChangeEvent(offerIndex, offerDetail, 'updateAll');
  };

  getMealsContent = () => {
    const { offerDetail, customerItem } = this.props;

    const {
      offerInfo: { voucherProductList = [] },
    } = offerDetail;

    let resultContent = '';

    voucherProductList.forEach(voucherProduct => {
      if (voucherProduct.productNo === customerItem.meals) {
        if (voucherProduct.productContentList && voucherProduct.productContentList.length > 0) {
          voucherProduct.productContentList.forEach(productContent => {
            if (
              productContent.contentType === 'productDescription' &&
              productContent.contentLanguage === 'en-us'
            ) {
              resultContent = productContent.contentValue;
            }
          });
        }
      }
    });

    return resultContent;
  };

  getAvailableVoucherList = () => {
    const { queryInfo, offerDetail } = this.props;
    const {
      offerInfo: { voucherProductList = [] },
    } = offerDetail;

    const dateOfVisit = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');

    const newVoucherList = [];
    voucherProductList.forEach(voucherProduct => {
      let maxAvailable = 0;
      const needChoiceCount = voucherProduct.needChoiceCount || 1;
      voucherProduct.priceRule.forEach(priceRule => {
        if (priceRule.priceRuleName === 'DefaultPrice') {
          priceRule.productPrice.forEach(productPrice => {
            if (productPrice.priceDate === dateOfVisit) {
              maxAvailable =
                productPrice.productInventory === -1 ? 2147483647 : productPrice.productInventory;
              // eslint-disable-next-line radix
              maxAvailable = parseInt(maxAvailable / needChoiceCount);
              if (maxAvailable > 0) {
                newVoucherList.push(Object.assign({}, { ...voucherProduct }));
              }
            }
          });
        }
      });
    });
    return newVoucherList;
  };

  mealsDisabled = selectValue => {
    const { queryInfo, offerDetail, customerItem } = this.props;
    const {
      offerInfo: { voucherProductList = [] },
    } = offerDetail;

    const dateOfVisit = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
    let chooseAmount = 0;
    let mealsDisabled = false;

    // check amount
    if (customerItem.meals && customerItem.meals === selectValue.productNo) {
      mealsDisabled = false;
    } else {
      offerDetail.orderInfo.individualSettingList.forEach(item => {
        if (item.meals && item.meals === selectValue.productNo) {
          chooseAmount += 1;
        }
      });
      voucherProductList.forEach(voucherProduct => {
        let maxAvailable = 0;
        const needChoiceCount = voucherProduct.needChoiceCount || 1;
        if (voucherProduct.productNo === selectValue.productNo) {
          voucherProduct.priceRule.forEach(priceRule => {
            if (priceRule.priceRuleName === 'DefaultPrice') {
              priceRule.productPrice.forEach(productPrice => {
                if (productPrice.priceDate === dateOfVisit) {
                  maxAvailable =
                    productPrice.productInventory === -1
                      ? 2147483647
                      : productPrice.productInventory;
                  // eslint-disable-next-line radix
                  maxAvailable = parseInt(maxAvailable / needChoiceCount);
                  if (maxAvailable <= chooseAmount) {
                    mealsDisabled = true;
                  }
                }
              });
            }
          });
        }
      });
    }

    return mealsDisabled;
  };

  render() {
    const { form, offerDetail, customerItemIndex, customerItem } = this.props;

    const voucherProductList = this.getAvailableVoucherList();
    const { getFieldDecorator } = form;

    const gridOpts = { xs: 24, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 };
    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 9 },
        md: { span: 8 },
        lg: { span: 8 },
        xl: { span: 8 },
        xxl: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 15 },
        md: { span: 16 },
        lg: { span: 16 },
        xl: { span: 16 },
        xxl: { span: 16 },
      },
      colon: false,
    };

    return (
      <div>
        <Row>
          <Col span={2} style={{ padding: '8px 0' }}>
            <div className={styles.pricingSettingTier}>
              {`Customer ${customerItemIndex === 0 ? `` : customerItemIndex}`}
            </div>
          </Col>
          <Col {...gridOpts} className={styles.basicInfoContent}>
            <Form.Item label={formatMessage({ id: 'MEALS' })} {...formItemLayout}>
              {getFieldDecorator(
                `customerMeals_${offerDetail.offerInfo.offerNo}_${customerItemIndex}`,
                {
                  rules: [{ required: true, message: 'Required' }],
                  initialValue: customerItem.meals === null ? undefined : customerItem.meals,
                }
              )(
                <SortSelect
                  key={`customerMeal_${customerItemIndex}`}
                  showSearch
                  allowClear
                  placeholder="Please Select"
                  onChange={this.mealsChangeEvent}
                  options={
                    voucherProductList &&
                    voucherProductList.map(item => (
                      <Select.Option
                        key={`customer_${offerDetail.offerInfo.offerNo}_meals_${Math.random()}`}
                        value={item.productNo}
                        disabled={this.mealsDisabled(item)}
                      >
                        {item.productName}
                      </Select.Option>
                    ))
                  }
                />
              )}
            </Form.Item>
          </Col>
          {/* <Col {...gridOpts} className={styles.basicInfoContent}>
            <Form.Item
              label={formatMessage({ id:'REMARK' })}
              {...formItemLayout}
            >
              {getFieldDecorator(`customerRemark_${offerDetail.offerInfo.offerNo}_${customerItemIndex}`, {
                rules: [
                  { required: false, message: 'Required' },
                ],
                initialValue: !customerItem.remarks || customerItem.remarks.length===0 ? undefined : customerItem.remarks,
              })(
                <Select
                  key={'customerRemark_'+customerItemIndex}
                  allowClear
                  mode="tags"
                  placeholder='Please Select'
                  onChange={this.remarksChangeEvent}
                >
                </Select>
              )
              }
            </Form.Item>
          </Col> */}
          {offerDetail.orderInfo.individualSettingList.length > 1 && customerItemIndex === 0 && (
            <Col span={2} offset={2}>
              <Button
                type="link"
                size="large"
                className={styles.addSpanStyle}
                onClick={this.updateAllEvent}
              >
                Update ALL
              </Button>
            </Col>
          )}
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Col span={16} offset={4}>
            <span>{this.getMealsContent()}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CustomerMeal;
