import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Spin,
  Table,
} from 'antd';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
import { reBytesStr, toThousands } from '@/utils/utils';
import { calculateAllProductPrice } from '../../../../utils/utils';
import styles from './index.less';
import SortSelect from '@/components/SortSelect';

const priceItemKey = ['price', 'subTotalPrice'];
const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
@connect(({ global, ticketMgr }) => ({
  userCompanyInfo: global.userCompanyInfo,
  countrys: ticketMgr.countrys,
  ticketTypesEnums: ticketMgr.ticketTypesEnums,
}))
class ToCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndCondition: false,
      checkTermsAndCondition: false,
      loading: false,
    };
  }

  componentDidMount() {
    const { modify } = this.props;
    if (modify) {
      this.setState({
        checkTermsAndCondition: true,
      });
    }
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
    const { offers = [] } = this.props;
    const originalValue = offers[index].ticketNumber;
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (value === '' || testZero.test(value) || testReg.test(value)) {
      return value;
    }
    return originalValue;
  };

  calculateTotalPrice = () => {
    const { offers = [] } = this.props;
    let totalPrice = 0;
    offers.forEach(item => {
      const {
        attractionProduct,
        detail,
        detail: { priceRuleId },
        ticketNumber,
      } = item;
      if (!isNullOrUndefined(ticketNumber) && ticketNumber !== '') {
        totalPrice +=
          calculateAllProductPrice(attractionProduct, priceRuleId, null, detail) * ticketNumber;
      }
    });
    return `${toThousands(Number(totalPrice).toFixed(2))}`;
  };

  order = () => {
    const { checkTermsAndCondition } = this.state;
    const {
      dispatch,
      form,
      order,
      offers = [],
      numOfGuests,
      deliverInformation: {
        country,
        birth,
        address,
        gender,
        cardDisplayName,
        customerEmailAddress,
        guestFirstName,
        guestLastName,
        customerContactNo,
      },
      modify,
    } = this.props;
    let allTicketNumbers = 0;
    let data = {};
    let validFields = ['country'];
    const hasApspTicket = this.hasApspTicket();
    data.country = country;
    if (hasApspTicket) {
      data = Object.assign(data, {
        birth,
        address,
        gender,
        cardDisplayName,
        guestFirstName,
        guestLastName,
        customerContactNo,
      });
      validFields = validFields.concat([
        'birth',
        'address',
        'gender',
        'cardDisplayName',
        'guestFirstName',
        'guestLastName',
        'customerContactNo',
      ]);
    }
    offers.forEach((item, index) => {
      const { ticketNumber } = item;
      const ticketNumberLabel = `offer${index}`;
      data[ticketNumberLabel] = ticketNumber;
      if (ticketNumber) {
        allTicketNumbers += ticketNumber;
      }
    });
    if (!modify && allTicketNumbers !== numOfGuests) {
      message.warning(`Total quantity must be ${numOfGuests}.`);
      return false;
    }
    if (allTicketNumbers === 0) {
      message.warning('Please select one product at least.');
      return false;
    }
    form.setFieldsValue(data);
    form.validateFields(validFields, async err => {
      if (!err) {
        // eslint-disable-next-line no-useless-escape
        const emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (customerEmailAddress && !emailReg.test(customerEmailAddress)) {
          message.warning('Customer email address is invalid.');
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
        this.setState({
          loading: true,
        });
        for (let i = 0; i < offers.length; i += 1) {
          const {
            ticketNumber,
            attractionProduct = [],
            detail: {
              dateOfVisit,
              offerBasicInfo: { offerNo },
            },
          } = offers[i];
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
              orderProducts,
            },
            // eslint-disable-next-line no-loop-func
          }).then(res => {
            if (hasInventory) {
              hasInventory = res;
            }
          });
        }
        this.setState({
          loading: false,
        });
        if (hasInventory) {
          order();
        } else {
          message.warning('There is not enough stock to book.');
        }
      }
    });
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
    const arr = ['guestLastName', 'guestFirstName', 'taNo', 'cardDisplayName', 'address'];
    let transferValue = value;
    if (
      type === 'customerEmailAddress' &&
      value &&
      value.replace(/[\u0391-\uFFE5]/g, 'aa').length > 50
    ) {
      transferValue = reBytesStr(value, 50);
    }
    if (arr.indexOf(type) !== -1 && value && value.replace(/[\u0391-\uFFE5]/g, 'aa').length > 64) {
      transferValue = reBytesStr(value, 64);
    }
    if (
      type === 'customerContactNo' &&
      value &&
      value.replace(/[\u0391-\uFFE5]/g, 'aa').length > 32
    ) {
      transferValue = reBytesStr(value, 32);
    }
    const data = {};
    data[type] = transferValue;
    form.setFieldsValue(data);
    changeDeliveryInformation(type, transferValue);
  };

  hasApspTicket = () => {
    const { offers = [] } = this.props;
    return offers.some(({ attractionProduct = [], ticketNumber }) => {
      return attractionProduct.some(
        ({ attractionProduct: { ticketSubType } }) => ticketNumber && ticketSubType === 'ApSp'
      );
    });
  };

  bookingInfoColumns = getFieldDecorator => {
    const {
      userCompanyInfo: { companyType },
    } = this.props;
    let columns = [
      {
        title: 'Session',
        dataIndex: 'sessionTime',
        key: 'Session',
        width: '15%',
        className: styles.session,
        render: () => {
          return <div>-</div>;
        },
      },
      {
        title: 'Ticket Type',
        dataIndex: 'ticketType',
        key: 'ticketType',
        width: '25%',
        render: text => <div className={styles.tableText}>{text} * 1</div>,
      },
      {
        title: 'Price(SGD)',
        dataIndex: 'price',
        align: 'right',
        width: '25%',
        key: 'price',
        render: text => <div className={styles.tableText}>{text}</div>,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '20%',
        render: (text, record) => {
          return (
            <FormItem>
              {getFieldDecorator(record.ticketNumberLabel, {
                initialValue: text,
                validateTrigger: '',
                rules: [
                  {
                    required: true,
                    message: 'Required',
                  },
                ],
              })(
                <div>
                  <InputNumber
                    max={record.offerMaxQuantity}
                    min={record.offerMinQuantity}
                    value={text}
                    onChange={value =>
                      this.changeTicketNumber(record.index, value, record.priceShow)
                    }
                    parser={value => this.formatInputValue(record.index, value)}
                  />
                </div>
              )}
            </FormItem>
          );
        },
      },
      {
        title: 'Sub-Total (SGD)',
        dataIndex: 'subTotalPrice',
        align: 'right',
        width: '25%',
        key: 'subTotalPrice',
        render: text => <div className={styles.tableText}>{text}</div>,
      },
    ];
    if (companyType === '02') {
      columns = columns.filter(({ key }) => priceItemKey.indexOf(key) === -1);
    }
    return columns;
  };

  render() {
    const bodyWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const { showTermsAndCondition, checkTermsAndCondition, loading } = this.state;
    const {
      form: { getFieldDecorator },
      dateOfVisit,
      onClose,
      ticketTypesEnums = [],
      countrys = [],
      offers,
      bundleName,
      deliverInformation: {
        country,
        taNo,
        guestFirstName,
        guestLastName,
        customerContactNo,
        customerEmailAddress,
        birth,
        address,
        gender,
        cardDisplayName,
      },
      userCompanyInfo: { companyType },
    } = this.props;
    const description = [];
    const hasApspTicket = this.hasApspTicket();
    const termsAndConditionItems = [];
    const ticketType = [];
    offers.forEach(item => {
      const {
        attractionProduct = [],
        detail: { offerContentList = [] },
      } = item;
      attractionProduct.forEach(itemProduct => {
        if (itemProduct.attractionProduct.ticketType) {
          const matchTicketTypes = ticketTypesEnums.filter(
            ({ itemValue }) => itemValue === itemProduct.attractionProduct.ticketType
          );
          if (matchTicketTypes.length > 0) {
            ticketType.push(matchTicketTypes[0].itemName);
          } else {
            ticketType.push(`${itemProduct.attractionProduct.ticketType}`);
          }
        } else {
          ticketType.push(`-`);
        }
      });
      offerContentList.forEach(item2 => {
        const { contentLanguage, contentType, contentValue } = item2;
        if (contentLanguage === 'en-us') {
          switch (contentType) {
            case 'termsAndConditions':
              termsAndConditionItems.push(contentValue);
              break;
            case 'shortDescription':
              description.push(contentValue);
              break;
            default:
              break;
          }
        }
      });
    });

    const bookingInfo = [];
    offers.forEach((item, index) => {
      const {
        ticketNumber,
        attractionProduct = [],
        detail,
        detail: {
          priceRuleId,
          offerBasicInfo: { offerMinQuantity, offerMaxQuantity },
          offerBundle = [{}],
        },
      } = item;
      const priceShow = calculateAllProductPrice(attractionProduct, priceRuleId, null, detail);
      const ticketNumberLabel = `offer${index}`;
      bookingInfo.push({
        ticketType: offerBundle[0].bundleLabel,
        price: `${toThousands(priceShow)}/Package`,
        quantity: ticketNumber,
        ticketNumberLabel,
        priceShow,
        offerMinQuantity,
        offerMaxQuantity,
        subTotalPrice: `${toThousands((priceShow * (ticketNumber || 0)).toFixed(2))}`,
        index,
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
          getContainer={false}
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
          getContainer={false}
          width={bodyWidth < 720 ? bodyWidth : 720}
          bodyStyle={{
            position: 'relative',
            height: 'calc(100% - 55px)',
            padding: 0,
          }}
          className={styles.container}
          onClose={() => onClose()}
        >
          <div className={styles.bodyContainer}>
            <Spin spinning={loading}>
              <div>
                <Row>
                  <Row className={styles.orderInformation}>
                    <Col style={{ height: '35px' }} className={styles.title}>
                      ORDER INFORMATION
                    </Col>
                    <Col span={24} className={styles.orderInformationItem}>
                      <Col span={24}>
                        <span className={styles.detailLabel}>Offer Name :</span>
                      </Col>
                      <Col span={24}>
                        <span className={styles.detailText}>{bundleName || '-'}</span>
                      </Col>
                    </Col>
                    <Col span={24} className={styles.orderInformationItem}>
                      <Col span={24}>
                        <span className={styles.detailLabel}>Description :</span>
                      </Col>
                      <Col span={24}>
                        <span className={styles.detailText}>
                          {description.length > 0
                            ? description.map(item => <div>{item || '-'}</div>)
                            : '-'}
                        </span>
                      </Col>
                    </Col>
                    <Col span={24} className={styles.orderInformationItem}>
                      <Col span={24}>
                        <span className={styles.detailLabel}>
                          Visit Date (Ticket Validity Start Date) :
                        </span>
                      </Col>
                      <Col span={24}>
                        <span className={styles.detailText}>
                          {moment(dateOfVisit, 'x').format('DD-MMM-YYYY')}
                        </span>
                      </Col>
                    </Col>
                  </Row>
                  <Col
                    span={24}
                    style={{ marginTop: 24, marginBottom: 10 }}
                    className={styles.title}
                  >
                    BOOKING INFORMATION
                  </Col>
                  <div className={styles.tableFormStyle}>
                    <Form hideRequiredMark colon={false}>
                      <Table
                        size="small"
                        className={`tabs-no-padding ${styles.searchTitle}`}
                        columns={this.bookingInfoColumns(getFieldDecorator)}
                        dataSource={bookingInfo}
                        pagination={false}
                        scroll={{ x: 600 }}
                        rowKey={record => record.index}
                        footer={() => {
                          if (companyType === '02') {
                            return null;
                          }
                          return (
                            <div className={styles.tableFooterDiv}>
                              <div>
                                <span className={styles.tableFooterSpan}>
                                  Total Amount Payable (SGD):
                                </span>
                                <span className={styles.tableTotalPrice}>
                                  {this.calculateTotalPrice()}
                                </span>
                              </div>
                            </div>
                          );
                        }}
                      />
                    </Form>
                  </div>
                </Row>
              </div>
              <Col
                span={24}
                style={{ height: '25px', marginTop: '24px', paddingLeft: '0' }}
                className={styles.title}
              >
                GUEST INFORMATION
              </Col>
              <Col span={24} style={{ marginTop: '5px', paddingLeft: '0' }}>
                <div style={{ color: '#171b21' }}>
                  Kindly ensure that all COMPULSORY fields (guest name, contact number and email
                  address) are completed below for VIP Experiences, Dolphin Island, Special
                  Experiences at ACW and Ocean Dreams.
                </div>
              </Col>
              {hasApspTicket ? (
                <Form>
                  <Col span={24} className={styles.deliverColInline} style={{ marginTop: '10px' }}>
                    <FormItem className={styles.label} label="Guest Gender" colon={false}>
                      {getFieldDecorator('gender', {
                        initialValue: gender,
                        validateTrigger: '',
                        rules: [
                          {
                            required: true,
                            message: 'Required',
                          },
                        ],
                      })(
                        <div>
                          <Radio.Group
                            value={gender}
                            onChange={e => {
                              this.changeDeliveryInformation('gender', e.target.value);
                            }}
                          >
                            <Radio value="Male">Male</Radio>
                            <Radio value="Female">Female</Radio>
                          </Radio.Group>
                        </div>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} className={styles.deliverColInline}>
                    <FormItem className={styles.label} label="Guest Birth" colon={false}>
                      {getFieldDecorator('birth', {
                        initialValue: birth,
                        validateTrigger: '',
                        rules: [
                          {
                            required: true,
                            message: 'Required',
                          },
                        ],
                      })(
                        <div>
                          <DatePicker
                            value={birth ? moment(birth) : null}
                            showToday={false}
                            format={['DD-MMM-YYYY', 'DDMMYYYY']}
                            placeholder="Select Date"
                            onChange={date => {
                              this.changeDeliveryInformation('birth', date);
                            }}
                          />
                        </div>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} className={styles.deliverCol}>
                    <FormItem className={styles.label} label="Guest Address" colon={false}>
                      {getFieldDecorator('address', {
                        initialValue: address,
                        validateTrigger: '',
                        rules: [
                          {
                            required: true,
                            message: 'Required',
                          },
                        ],
                      })(
                        <div>
                          <Input
                            value={address}
                            placeholder="Please Enter"
                            onChange={e => {
                              this.changeDeliveryInformation('address', e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24} className={styles.deliverCol}>
                    <FormItem className={styles.label} label="Card Display Name" colon={false}>
                      {getFieldDecorator('cardDisplayName', {
                        initialValue: cardDisplayName,
                        validateTrigger: '',
                        rules: [
                          {
                            required: true,
                            message: 'Required',
                          },
                        ],
                      })(
                        <div>
                          <Input
                            value={cardDisplayName}
                            placeholder="Please Enter"
                            onChange={e => {
                              this.changeDeliveryInformation('cardDisplayName', e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </FormItem>
                  </Col>
                </Form>
              ) : null}
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
                        <SortSelect
                          value={country}
                          showSearch
                          allowClear
                          placeholder="Please Select"
                          style={{ width: '100%' }}
                          onChange={value => this.changeDeliveryInformation('country', value)}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          options={countrys.map((item, index) => {
                            const key = `country_${index}`;
                            const { lookupName } = item;
                            return (
                              <Option key={key} value={lookupName}>
                                {lookupName}
                              </Option>
                            );
                          })}
                        />
                      </div>
                    )}
                  </FormItem>
                </Col>
                <Col span={24} className={styles.deliverCol}>
                  <FormItem
                    className={styles.label}
                    label="Travel Agent Reference No."
                    colon={false}
                  >
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
                            required: hasApspTicket,
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
                            required: hasApspTicket,
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
                          required: hasApspTicket,
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
                />{' '}
                <span className={styles.termsAndConditionIconText}>*</span>
                <span>
                  Please tick (<Icon type="check" />) to accept
                </span>
                <span className={styles.TC} onClick={() => this.toShowTermsAndCondition(true)}>
                  Terms and Conditions &gt;
                </span>
              </div>
            </Spin>
          </div>
          <div className={styles.formControl}>
            <Button onClick={() => onClose()} style={{ marginRight: 8, width: 60 }}>
              Cancel
            </Button>
            <Button onClick={this.order} type="primary" style={{ minWidth: 60 }} loading={loading}>
              {formatMessage({ id: 'ADD_TO_MY_SHOPPING_CART' })}
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default ToCart;
