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
import { calculateAllProductPrice } from '../../../../utils/utils';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
@connect(({ global }) => ({
  global,
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
      const ticketNumberLabel = `offer${index}`;
      if (res !== '') {
        data[ticketNumberLabel] = res;
        form.setFieldsValue(data);
      }
    });
  };

  formatInputValue = (index, value) => {
    const { formatInputValue } = this.props;
    if (isNullOrUndefined(formatInputValue(index, value, 'Bundle'))) {
      return '';
    }
    return formatInputValue(index, value, 'Bundle');
  };

  calculateTotalPrice = () => {
    const { offers = [] } = this.props;
    let totalPrice = 0;
    offers.forEach(item => {
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
      offers = [],
      numOfGuests,
      deliverInformation: { country },
    } = this.props;
    const data = {};
    data.country = country;
    offers.forEach((item, index) => {
      const { ticketNumber } = item;
      const ticketNumberLabel = `offer${index}`;
      data[ticketNumberLabel] = ticketNumber;
    });
    form.setFieldsValue(data);
    form.validateFields(async err => {
      if (!err) {
        let allTicketNumbers = 0;
        offers.forEach(item => {
          const { ticketNumber } = item;
          allTicketNumbers += ticketNumber;
        });
        if (allTicketNumbers !== numOfGuests) {
          message.warning(`Total quantity must be ${numOfGuests}.`);
          return false;
        }
        if (!checkTermsAndCondition) {
          message.warning('Please accept the terms and condition before adding to cart.');
          return false;
        }
        offers.forEach((item, index) => {
          const { ticketNumber } = item;
          const ticketNumberLabel = `offer${index}`;
          data[ticketNumberLabel] = ticketNumber;
        });
        let hasInventory = true;
        for (let i = 0; i < offers.length; i += 1) {
          const {
            ticketNumber,
            attractionProduct = [],
            detail: {
              dateOfVisit,
              offerBasicInfo: { offerNo },
            },
          } = offers[i];
          // eslint-disable-next-line no-loop-func
          const orderProducts = attractionProduct.map(orderProductItem => {
            const { productNo } = orderProductItem;
            return {
              ticketNumber,
              productNo,
            };
          });
          // eslint-disable-next-line no-await-in-loop
          await dispatch({
            type: 'ticketMgr/checkInventory',
            payload: {
              offerNo,
              dateOfVisit,
              offerQuantity: ticketNumber,
              orderProducts,
            },
            // eslint-disable-next-line no-loop-func
          }).then(res => {
            if (hasInventory) {
              hasInventory = res;
            }
          });
        }
        if (hasInventory) {
          order();
        } else {
          message.warning('Out of stock.');
        }
      }
    });
  };

  changeCountry = value => {
    const { form, changeDeliveryInformation } = this.props;
    form.setFieldsValue({
      country: value,
    });
    changeDeliveryInformation('country', value);
  };

  toShowTermsAndCondition = value => {
    this.setState({
      showTermsAndCondition: value,
    });
  };

  changeCheckTermsAndCondition = e => {
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

  render() {
    const bodyWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const { showTermsAndCondition, checkTermsAndCondition } = this.state;
    const {
      form: { getFieldDecorator },
      dateOfVisit,
      onClose,
      countrys = [],
      ticketType,
      description,
      offers,
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
    let nameAndEmailRequired = false;
    const arr = ['USS', 'SEA'];
    const termsAndConditionItems = [];
    offers.forEach(item => {
      const {
        attractionProduct = [],
        detail: { offerContentList = [], offerTagList = [] },
      } = item;
      attractionProduct.forEach(item2 => {
        if (arr.indexOf(item2.attractionProduct.themePark) !== -1) {
          nameAndEmailRequired = true;
        }
      });
      offerTagList.forEach(item2 => {
        if (item2.tagName === 'VIP Tour') {
          nameAndEmailRequired = true;
        }
      });
      offerContentList.forEach(item2 => {
        const { contentLanguage, contentType, contentValue } = item2;
        if (contentLanguage === 'en-us') {
          switch (contentType) {
            case 'termsAndConditions':
              termsAndConditionItems.push(contentValue);
              break;
            default:
              break;
          }
        }
      });
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
          bodyStyle={{
            padding: '20px',
            overflow: 'auto',
          }}
          className={styles.container}
          onClose={() => this.toShowTermsAndCondition(false)}
        >
          <div className={styles.termsAndConditionTitle}>Terms and Condition</div>
          {termsAndConditionItems.map(item => (
            <div className={styles.termsAndConditionText} key={Math.random()}>
              {item}
            </div>
          ))}
        </Drawer>
        <Drawer
          visible={!showTermsAndCondition}
          title={<div className={styles.title}>ADD TO CART</div>}
          placement="right"
          destroyOnClose
          maskClosable={false}
          width={bodyWidth < 480 ? bodyWidth : 480}
          bodyStyle={{
            position: 'relative',
            height: 'calc(100% - 55px)',
            padding: 0,
          }}
          className={styles.container}
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
                <Col span={24} style={{ marginTop: '15px' }} className={styles.title}>
                  BOOKING INFORMATION
                </Col>
                <Form className={styles.product}>
                  {offers.map((item, index) => {
                    const {
                      id,
                      ticketNumber,
                      attractionProduct = [],
                      detail: {
                        priceRuleId,
                        offerBasicInfo: { offerName, offerMinQuantity, offerMaxQuantity },
                      },
                    } = item;
                    const priceShow = calculateAllProductPrice(attractionProduct, priceRuleId);
                    const ticketNumberLabel = `offer${index}`;
                    return (
                      <Col span={24} className={styles.ageItem} key={id}>
                        <Col span={18} className={styles.age}>
                          <span style={{ color: '#565656' }}>{offerName}</span>
                          {companyType === '02' ? null : (
                            <span style={{ color: '#171B21' }}>$ {priceShow}</span>
                          )}
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
                                  max={offerMaxQuantity}
                                  min={offerMinQuantity}
                                  value={ticketNumber}
                                  onChange={value =>
                                    this.changeTicketNumber(index, value, priceShow)
                                  }
                                  parser={value => this.formatInputValue(index, value)}
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
                        {countrys.map((item, index) => {
                          const { lookupName } = item;
                          return (
                            <Option key={`country_${index}`} value={lookupName}>
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
                onChange={this.changeCheckTermsAndCondition}
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
