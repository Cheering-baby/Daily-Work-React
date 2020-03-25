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
    const { form, order, offers = [], numOfGuests } = this.props;
    const data = {};
    offers.forEach((item, index) => {
      const { ticketNumber } = item;
      const ticketNumberLabel = `offer${index}`;
      data[ticketNumberLabel] = ticketNumber;
    });
    form.setFieldsValue(data);
    form.validateFields(err => {
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
        order();
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

  toShowTermsAndCondtion = value => {
    this.setState({
      showTermsAndCondition: value,
    });
  };

  changeCheckTermsAndCondtion = e => {
    this.setState({
      checkTermsAndCondition: e.target.checked,
    });
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
      deliverInfomation: { country, taNo, guestFirstName, guestLastName, customerContactNo },
      changeDeliveryInformation,
      global: {
        userCompanyInfo: { companyType },
      },
    } = this.props;
    let termsAndCondition;
    let offerContentList = [];
    offerContentList.forEach(item => {
      const { contentType, contentLanguage, contentValue } = item;
      if (contentLanguage === 'en-us' && contentType === 'termsAndConditions') {
        termsAndCondition = contentValue;
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
          bodyStyle={{
            padding: '20px',
            overflow: 'auto',
          }}
          className={styles.container}
          onClose={() => this.toShowTermsAndCondtion(false)}
        >
          <div className={styles.termsAndConditionTitle}>Terms and Condition</div>
          <div className={styles.termsAndConditionText}>{termsAndCondition}</div>
        </Drawer>
        <Drawer
          visible={!showTermsAndCondition}
          title={<div className={styles.title}>Add to Cart</div>}
          placement="right"
          destroyOnClose
          maskClosable={false}
          width={bodyWidth < 480 ? bodyWidth : 480}
          bodyStyle={{
            height: 'calc(100% - 55px)',
            padding: '20px 20px 53px 20px',
            overflow: 'auto',
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
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Ticket Type</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{ticketType || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Description</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{description || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Date of Visit</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>
                      {moment(dateOfVisit, 'x').format('DD-MMM-YYYY')}
                    </span>
                  </Col>
                </Col>
                <Col style={{ margin: '5px 0' }} className={styles.title}>
                  BOOKING INFORMATION
                </Col>
                <Form className={styles.product}>
                  {offers.map((item, index) => {
                    const {
                      id,
                      ticketNumber,
                      price,
                      attractionProduct = [],
                      detail: {
                        priceRuleId,
                        offerBasicInfo: { offerName },
                      },
                    } = item;
                    const priceShow = calculateAllProductPrice(attractionProduct, priceRuleId);
                    const ticketNumberLabel = `offer${index}`;
                    const max = 1000000;
                    return (
                      <Col span={24} className={styles.ageItem} key={id}>
                        <Col span={12} className={styles.age}>
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
                                  max={max}
                                  min={0}
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
                        {companyType === '02' ? null : (
                          <Col span={6} className={styles.money}>
                            $ {price ? price.toFixed(2) : '0.00'}
                          </Col>
                        )}
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
            <div style={{ height: '25px', marginTop: '10px' }} className={styles.title}>
              DELIVERY INFORMATION
            </div>
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
                        onChange={this.changeCountry}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {countrys.map((item, index) => {
                          const { lookupName } = item;
                          return (
                            <Option key={'country_' + index} value={lookupName}>
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
                  <Input
                    allowClear
                    placeholder="Please Enter"
                    style={{ width: '100%' }}
                    value={taNo}
                    onChange={e => {
                      changeDeliveryInformation('taNo', e.target.value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={24} className={styles.deliverCol}>
                <Col span={12} className={styles.firstName}>
                  <FormItem className={styles.label} label="Guest First Name" colon={false}>
                    <Input
                      allowClear
                      placeholder="Please Enter"
                      style={{ width: '100%' }}
                      value={guestFirstName}
                      onChange={e => {
                        changeDeliveryInformation('guestFirstName', e.target.value);
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={12} className={styles.lastName}>
                  <FormItem className={styles.label} label="Guest Last Name" colon={false}>
                    <Input
                      allowClear
                      placeholder="Please Enter"
                      style={{ width: '100%' }}
                      value={guestLastName}
                      onChange={e => {
                        changeDeliveryInformation('guestLastName', e.target.value);
                      }}
                    />
                  </FormItem>
                </Col>
              </Col>
              <Col span={24} className={styles.deliverCol}>
                <FormItem className={styles.label} label="Customer Contact No." colon={false}>
                  <Input
                    allowClear
                    placeholder="Please Enter"
                    style={{ width: '100%' }}
                    value={customerContactNo}
                    onChange={e => {
                      changeDeliveryInformation('customerContactNo', e.target.value);
                    }}
                  />
                </FormItem>
              </Col>
            </Form>
            <div className={styles.itemTC}>
              <Checkbox
                checked={checkTermsAndCondition}
                onChange={this.changeCheckTermsAndCondtion}
              />
              <span className={styles.TC} onClick={() => this.toShowTermsAndCondtion(true)}>
                Terms and Conditions &gt;
              </span>
            </div>
            <div className={styles.formControl}>
              <Button onClick={() => onClose()} style={{ marginRight: 8, width: 60 }}>
                Cancel
              </Button>
              <Button onClick={this.order} type="primary" style={{ width: 60 }}>
                Order
              </Button>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default ToCart;
