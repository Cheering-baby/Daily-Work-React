import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Drawer,
  Row,
  Col,
  Form,
  Button,
  InputNumber,
  Select,
  Input,
  Checkbox,
  message,
} from 'antd';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
import { calculateProductPrice, calculateAllProductPrice } from '../../../../utils/utils';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
@connect(({ global, loading }) => ({
  global,
  checkLoading: loading.effects['ticketMgr/checkInventory'],
}))
class ToCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndCondition: false,
      checkTermsAndCondition: false,
    };
  }

  changeTicketNumber = (index, value, productPrice) => {
    const { form, changeTicketNumber } = this.props;
    changeTicketNumber(index, value, productPrice).then(res => {
      const data = {};
      const ticketNumberLabel = `attractionProduct${index}`;
      if (res !== '') {
        data[ticketNumberLabel] = res;
        form.setFieldsValue(data);
      }
    });
  };

  formatInputValue = (index, value, productInventory) => {
    const { formatInputValue } = this.props;
    if (isNullOrUndefined(formatInputValue(index, value, productInventory))) {
      return '';
    }
    return formatInputValue(index, value, productInventory);
  };

  calculateTotalPrice = () => {
    const { attractionProduct = [] } = this.props;
    let totalPrice = 0;
    attractionProduct.forEach(item => {
      const { price } = item;
      if (!isNullOrUndefined(price) && price !== '') {
        totalPrice += Number(price);
      }
    });
    return `$ ${Number(totalPrice).toFixed(2)}`;
  };

  order = () => {
    const { checkTermsAndCondition } = this.state;
    const {
      dispatch,
      form,
      order,
      attractionProduct = [],
      detail: {
        offerQuantity,
        dateOfVisit,
        numOfGuests,
        productGroup = [],
        offerBasicInfo: { offerNo },
      },
      deliverInformation: {
        country,
        customerEmailAddress,
        customerContactNo,
        guestLastName,
        guestFirstName,
      },
    } = this.props;
    const data = {
      country,
      customerEmailAddress,
      customerContactNo,
      guestLastName,
      guestFirstName,
    };
    let offerConstrain;
    const orderProducts = [];
    productGroup.forEach(item => {
      if (item.productType === 'Attraction') {
        item.productGroup.forEach(item2 => {
          if (item2.groupName === 'Attraction') {
            offerConstrain = item2.choiceConstrain;
          }
        });
      }
    });
    attractionProduct.forEach((item, index) => {
      const { ticketNumber, productNo } = item;
      const ticketNumberLabel = `attractionProduct${index}`;
      data[ticketNumberLabel] = ticketNumber;
      if (!isNullOrUndefined(ticketNumber)) {
        orderProducts.push({
          ticketNumber,
          productNo,
        });
      }
    });
    form.setFieldsValue(data);
    form.validateFields(err => {
      if (!err) {
        let allTicketNumbers = 0;
        attractionProduct.forEach(item => {
          const { ticketNumber } = item;
          allTicketNumbers += ticketNumber;
        });
        if (allTicketNumbers !== numOfGuests && offerConstrain !== 'Fixed') {
          message.warning(`Total quantity must be ${numOfGuests}.`);
          return false;
        }
        if (!checkTermsAndCondition) {
          message.warning('Please accept the terms and condition before adding to cart.');
          return false;
        }
        dispatch({
          type: 'ticketMgr/checkInventory',
          payload: {
            offerNo,
            dateOfVisit,
            offerQuantity,
            orderProducts,
          },
        }).then(res => {
          if (res) {
            order();
          } else {
            message.warning('Out of stock.');
          }
        });
      }
    });
  };

  calculateMaxTickets = (index, productInventory, offerConstrain) => {
    const {
      attractionProduct = [],
      detail: { productGroup = [], inventories = [], numOfGuests },
    } = this.props;
    if (offerConstrain === 'Single') return numOfGuests;
    let allOtherTickets = 0;
    let max = 0;
    const { available } = inventories[0];
    let nowAvailable = available !== -1 ? available : 100000000;
    productGroup.forEach(a => {
      const { productType } = a;
      if (productType === 'Attraction') {
        a.productGroup.forEach(b => {
          if (b.groupName === 'Attraction') {
            max = b.maxProductQuantity;
          }
        });
      }
    });
    attractionProduct.forEach((item2, index2) => {
      const { ticketNumber, needChoiceCount } = item2;
      if (index !== index2 && !isNullOrUndefined(ticketNumber) && ticketNumber !== '') {
        allOtherTickets += ticketNumber;
        nowAvailable -= ticketNumber * needChoiceCount;
      }
    });
    const { needChoiceCount } = attractionProduct[index];
    const max2 =
      nowAvailable > productInventory
        ? parseInt(productInventory / needChoiceCount, 10)
        : parseInt(nowAvailable / needChoiceCount, 10);
    if (max2 < max - allOtherTickets) {
      return max2;
    }
    return max - allOtherTickets;
  };

  toShowTermsAndCondition = value => {
    this.setState({
      showTermsAndCondition: value,
    });
  };

  changeCheckTermsAndCondtion = e => {
    this.setState({
      checkTermsAndCondition: e.target.checked,
    });
  };

  changeDeliveryInformation = (type, value) => {
    const { form, changeDeliveryInformation } = this.props;
    const data = {};
    data[type] = value;
    form.setFieldsValue(data);
    changeDeliveryInformation(type, value);
  };

  changeFixedOfferNumbers = value => {
    const { changeFixedOfferNumbers } = this.props;
    changeFixedOfferNumbers(value);
  };

  disabledProduct = (index, offerConstrain) => {
    if (offerConstrain !== 'Single') return false;
    const { attractionProduct } = this.props;
    let hasTicketNumbers = false;
    attractionProduct.forEach(item => {
      const { ticketNumber } = item;
      if (!isNullOrUndefined(ticketNumber)) {
        hasTicketNumbers = true;
      }
    });
    return isNullOrUndefined(attractionProduct[index].ticketNumber) && hasTicketNumbers;
  };

  render() {
    const bodyWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const { showTermsAndCondition, checkTermsAndCondition } = this.state;
    const {
      modify,
      form: { getFieldDecorator },
      attractionProduct = [],
      detail: {
        numOfGuests,
        priceRuleId,
        dateOfVisit,
        offerContentList = [],
        offerTagList = [],
        productGroup = [],
        offerQuantity,
      },
      onClose,
      countrys = [],
      ticketType,
      description,
      eventSession,
      deliverInformation: {
        country,
        taNo,
        guestFirstName,
        guestLastName,
        customerContactNo,
        customerEmailAddress,
      },
      global: {
        userCompanyInfo: { companyType },
      },
    } = this.props;
    let termsAndCondition;
    let offerConstrain;
    const ageGroups = [];
    productGroup.forEach(item => {
      if (item.productType === 'Attraction') {
        item.productGroup.forEach(item2 => {
          if (item2.groupName === 'Attraction') {
            offerConstrain = item2.choiceConstrain;
          }
        });
      }
    });
    offerContentList.forEach(item => {
      const { contentType, contentLanguage, contentValue } = item;
      if (contentLanguage === 'en-us' && contentType === 'termsAndConditions') {
        termsAndCondition = contentValue;
      }
    });
    let nameAndEmailRequired = false;
    const arr = ['USS', 'SEA'];
    attractionProduct.forEach(item => {
      if (arr.indexOf(item.attractionProduct.themePark) !== -1) {
        nameAndEmailRequired = true;
      }
      if (item.attractionProduct.ageGroup) {
        ageGroups.push(`${item.attractionProduct.ageGroup}`);
      } else {
        ageGroups.push(`-`);
      }
    });
    offerTagList.forEach(item => {
      if (item.tagName === 'VIP Tour') {
        nameAndEmailRequired = true;
      }
    });
    return (
      <div>
        <Drawer
          visible={showTermsAndCondition}
          title={<div className={styles.title}>TERMS AND CONDITIONS</div>}
          placement="right"
          destroyOnClose
          maskClosable={false}
          width={bodyWidth < 480 ? bodyWidth : 480}
          drawerStyle={{ position: 'relative' }}
          bodyStyle={{
            padding: '20px',
            overflow: 'auto',
          }}
          className={styles.container}
          onClose={() => this.toShowTermsAndCondition(false)}
        >
          <div className={styles.termsAndConditionTitle}>Terms and Condition</div>
          <div className={styles.termsAndConditionText}>{termsAndCondition}</div>
        </Drawer>
        <Drawer
          visible={!showTermsAndCondition}
          title={<div className={styles.title}>ADD TO CART</div>}
          placement="right"
          destroyOnClose
          maskClosable={false}
          width={bodyWidth < 480 ? bodyWidth : 480}
          className={styles.container}
          bodyStyle={{
            position: 'relative',
            height: 'calc(100% - 55px)',
            padding: 0,
          }}
          onClose={() => onClose()}
        >
          <div className={styles.bodyContainer}>
            <div>
              <Row>
                <Col style={{ height: '35px' }} className={styles.title}>
                  TICKET INFORMATION
                </Col>
                <Col span={24} style={{ marginBottom: '10px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Ticket Type</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{ticketType || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '10px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Description</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{description || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '10px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Date of Visit</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>
                      {moment(dateOfVisit, 'x').format('DD-MMM-YYYY')}
                    </span>
                  </Col>
                </Col>
                {eventSession ? (
                  <Col span={24} style={{ marginBottom: '10px' }}>
                    <Col span={9} style={{ height: '30px' }}>
                      <span className={styles.detailLabel}>Event Session</span>
                    </Col>
                    <Col span={15}>
                      <span className={styles.detailText}>{eventSession}</span>
                    </Col>
                  </Col>
                ) : null}
                <Col span={24} style={{ marginTop: '15px' }} className={styles.title}>
                  BOOKING INFORMATION
                </Col>
                {offerConstrain === 'Fixed' ? (
                  <Col span={24} style={{ marginTop: '10px' }}>
                    <div>
                      <div className={styles.productDes}>
                        <div>{ageGroups.join('; ')}</div>
                        <div>
                          <Form layout="inline">
                            <FormItem className={styles.label}>
                              {getFieldDecorator('offerNumbers', {
                                initialValue: offerQuantity,
                                rules: [
                                  {
                                    required: true,
                                    message: 'Required',
                                  },
                                ],
                              })(
                                <div>
                                  <InputNumber
                                    value={offerQuantity}
                                    disabled={!modify}
                                    onChange={value => this.changeFixedOfferNumbers(value)}
                                  />
                                </div>
                              )}
                            </FormItem>
                          </Form>
                        </div>
                        <div>$ {calculateAllProductPrice(attractionProduct, priceRuleId)}</div>
                      </div>
                      {companyType === '02' ? null : (
                        <Col span={24} className={styles.totalMoney}>
                          <Col span={18} style={{ textAlign: 'right', paddingRight: '10px' }}>
                            Total:
                          </Col>
                          <Col span={6} style={{ textAlign: 'right' }}>
                            ${' '}
                            {(
                              offerQuantity *
                              calculateAllProductPrice(attractionProduct, priceRuleId)
                            ).toFixed(2)}
                          </Col>
                        </Col>
                      )}
                    </div>
                  </Col>
                ) : (
                  <Form className={styles.product}>
                    {attractionProduct.map((item, index) => {
                      const { priceRule = [], productName, ticketNumber } = item;
                      const { productPrice = [] } = priceRule[1];
                      const { productInventory } = productPrice[0];
                      const ticketNumberLabel = `attractionProduct${index}`;
                      const inventory = productInventory !== -1 ? productInventory : 100000000;
                      const maxProductInventory = this.calculateMaxTickets(
                        index,
                        inventory,
                        offerConstrain
                      );
                      const priceShow = calculateProductPrice(item, priceRuleId);
                      return (
                        <Col span={24} className={styles.ageItem} key={productName}>
                          <Col span={18} className={styles.age}>
                            <span style={{ color: '#565656' }}>
                              {item.attractionProduct.ageGroup}
                            </span>
                          </Col>
                          <Col span={6}>
                            <FormItem className={styles.label}>
                              {getFieldDecorator(ticketNumberLabel, {
                                initialValue: ticketNumber,
                                rules: [
                                  {
                                    required: true,
                                    message: 'Required',
                                  },
                                ],
                              })(
                                <div>
                                  <InputNumber
                                    max={maxProductInventory}
                                    min={offerConstrain === 'Single' ? numOfGuests : 0}
                                    disabled={this.disabledProduct(index, offerConstrain)}
                                    value={ticketNumber}
                                    onChange={value =>
                                      this.changeTicketNumber(
                                        index,
                                        value,
                                        priceShow,
                                        maxProductInventory
                                      )
                                    }
                                    parser={value =>
                                      this.formatInputValue(index, value, maxProductInventory)
                                    }
                                  />
                                </div>
                              )}
                            </FormItem>
                          </Col>
                        </Col>
                      );
                    })}
                    {companyType === '02' ? null : (
                      <Col span={24} className={styles.totalMoney}>
                        <Col span={18} style={{ textAlign: 'right', paddingRight: '10px' }}>
                          Total:
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                          {this.calculateTotalPrice()}
                        </Col>
                      </Col>
                    )}
                  </Form>
                )}
              </Row>
            </div>
            <Col
              span={24}
              style={{ height: '25px', marginTop: '24px', paddingLeft: '0' }}
              className={styles.title}
            >
              DELIVERY INFORMATION
            </Col>
            <Form>
              <Col span={24} className={styles.deliverCol}>
                <FormItem className={styles.label} label="Country of Residence" colon={false}>
                  {getFieldDecorator('country', {
                    initialValue: country,
                    validateTrigger: '',
                    rules: [
                      {
                        required: true,
                        message: 'Required',
                      },
                    ],
                  })(
                    <div>
                      <Select
                        value={country}
                        showSearch
                        allowClear
                        placeholder="Please Select"
                        style={{ width: '100%' }}
                        onChange={value => this.changeDeliveryInformation('country', value)}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {countrys.map(item => {
                          const { lookupName } = item;
                          return (
                            <Option key={lookupName} value={lookupName}>
                              {lookupName}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={24} className={styles.deliverCol}>
                <FormItem className={styles.label} label="TA Reference No." colon={false}>
                  {getFieldDecorator('taNo', {
                    initialValue: taNo,
                    validateTrigger: '',
                    rules: [
                      {
                        required: false,
                        message: 'Required',
                      },
                    ],
                  })(
                    <div>
                      <Input
                        allowClear
                        placeholder="Please Enter"
                        style={{ width: '100%' }}
                        value={taNo}
                        onChange={e => {
                          this.changeDeliveryInformation('taNo', e.target.value);
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={24} className={styles.deliverCol}>
                <Col span={12} className={styles.firstName}>
                  <FormItem className={styles.label} label="Guest First Name" colon={false}>
                    {getFieldDecorator('guestFirstName', {
                      initialValue: guestFirstName,
                      validateTrigger: '',
                      rules: [
                        {
                          required: nameAndEmailRequired,
                          message: 'Required',
                        },
                      ],
                    })(
                      <div>
                        <Input
                          allowClear
                          placeholder="Please Enter"
                          style={{ width: '100%' }}
                          value={guestFirstName}
                          onChange={e => {
                            this.changeDeliveryInformation('guestFirstName', e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </FormItem>
                </Col>
                <Col span={12} className={styles.lastName}>
                  <FormItem className={styles.label} label="Guest Last Name" colon={false}>
                    {getFieldDecorator('guestLastName', {
                      initialValue: guestLastName,
                      validateTrigger: '',
                      rules: [
                        {
                          required: nameAndEmailRequired,
                          message: 'Required',
                        },
                      ],
                    })(
                      <div>
                        <Input
                          allowClear
                          placeholder="Please Enter"
                          style={{ width: '100%' }}
                          value={guestLastName}
                          onChange={e => {
                            this.changeDeliveryInformation('guestLastName', e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </FormItem>
                </Col>
              </Col>
              <Col span={24} className={styles.deliverCol}>
                <FormItem className={styles.label} label="Customer Contact No." colon={false}>
                  {getFieldDecorator('customerContactNo', {
                    initialValue: customerContactNo,
                    validateTrigger: '',
                    rules: [
                      {
                        required: nameAndEmailRequired,
                        message: 'Required',
                      },
                    ],
                  })(
                    <div>
                      <Input
                        allowClear
                        placeholder="Please Enter"
                        style={{ width: '100%' }}
                        value={customerContactNo}
                        onChange={e => {
                          this.changeDeliveryInformation('customerContactNo', e.target.value);
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={24} className={styles.deliverCol} style={{ marginBottom: '5px' }}>
                <FormItem className={styles.label} label="Customer Email Address" colon={false}>
                  {getFieldDecorator('customerEmailAddress', {
                    initialValue: customerEmailAddress,
                    validateTrigger: '',
                    rules: [
                      {
                        required: nameAndEmailRequired,
                        message: 'Required',
                      },
                    ],
                  })(
                    <div>
                      <Input
                        allowClear
                        placeholder="Please Enter"
                        style={{ width: '100%' }}
                        value={customerEmailAddress}
                        onChange={e => {
                          this.changeDeliveryInformation('customerEmailAddress', e.target.value);
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              </Col>
            </Form>
            <div className={styles.itemTC}>
              <Checkbox
                checked={checkTermsAndCondition}
                onChange={this.changeCheckTermsAndCondtion}
              />
              <span className={styles.TC} onClick={() => this.toShowTermsAndCondition(true)}>
                Terms and Conditions &gt;
              </span>
            </div>
          </div>
          <div className={styles.formControl}>
            <Button onClick={() => onClose()} style={{ marginRight: 8, width: 60 }}>
              Cancel
            </Button>
            <Button onClick={this.order} type="primary" style={{ width: 60 }}>
              Order
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default ToCart;
