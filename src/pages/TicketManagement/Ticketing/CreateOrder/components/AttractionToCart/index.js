import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
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
  Tooltip,
} from 'antd';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
import { reBytesStr, toThousands } from '@/utils/utils';
import {
  calculateAllProductPrice,
  calculateProductPrice,
  getProductLimitInventory,
  sessionTimeToWholeDay,
} from '../../../../utils/utils';
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
  ticketConfig: ticketMgr.ticketConfig,
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

  changeTicketNumber = (index, value, offerConstrain) => {
    const { form, changeTicketNumber, attractionProduct } = this.props;

    if (offerConstrain === 'Single') {
      const hasTicketNumbers = attractionProduct.find(
        (item, itemIndex) => itemIndex !== index && item.ticketNumber
      );

      if (hasTicketNumbers) {
        value = 0;
      }
    }

    changeTicketNumber(index, value, offerConstrain).then(res => {
      const data = {};
      const ticketNumberLabel = `attractionProduct${index}`;

      if (res !== '') {
        data[ticketNumberLabel] = res;
        form.setFieldsValue(data);
      }
    });
  };

  formatInputValue = (index, value) => {
    const { attractionProduct = [] } = this.props;
    const originalValue = attractionProduct[index].ticketNumber;
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (value === '' || testZero.test(value) || testReg.test(value)) {
      return value;
    }
    return originalValue;
  };

  calculateTotalPrice = () => {
    const {
      attractionProduct = [],
      detail: { priceRuleId },
    } = this.props;
    let totalPrice = 0;
    attractionProduct.forEach(item => {
      const { ticketNumber } = item;
      if (!isNullOrUndefined(ticketNumber) && ticketNumber !== '') {
        totalPrice += calculateProductPrice(item, priceRuleId, item.sessionTime) * ticketNumber;
      }
    });
    return `${toThousands(Number(totalPrice).toFixed(2))}`;
  };

  order = offerConstrain => {
    const { checkTermsAndCondition } = this.state;
    const {
      dispatch,
      form,
      order,
      modify,
      attractionProduct = [],
      detail,
      detail: {
        offerQuantity,
        dateOfVisit,
        numOfGuests,
        productGroup = [],
        offerBasicInfo: { offerNo, offerMinQuantity, offerMaxQuantity },
      },
      deliverInformation: {
        country,
        customerEmailAddress,
        customerContactNo,
        guestLastName,
        guestFirstName,
        birth,
        address,
        gender,
        cardDisplayName,
        customerContactNoCountry,
      },
    } = this.props;
    let data = {
      country,
      customerEmailAddress,
      customerContactNo,
      guestLastName,
      guestFirstName,
    };
    let allTicketNumbers = 0;
    let validFields = ['country'];
    const [minProductQuantity, maxProductQuantity] = getProductLimitInventory(detail);
    const hasApspTicket = this.hasApspTicket(offerConstrain);
    if (hasApspTicket) {
      validFields = validFields.concat([
        'birth',
        'address',
        'gender',
        'cardDisplayName',
        'guestLastName',
        'guestFirstName',
        'customerContactNo',
        'customerContactNoCountry',
      ]);
      data = Object.assign(data, {
        birth,
        address,
        gender,
        cardDisplayName,
        guestLastName,
        guestFirstName,
        customerContactNo,
        customerContactNoCountry,
      });
    }
    if (offerConstrain === 'Single' || offerConstrain === 'Multiple') {
      const hasTickets = attractionProduct.some(item => {
        return (
          !isNullOrUndefined(item.ticketNumber) &&
          item.ticketNumber !== 0 &&
          item.ticketNumber !== ''
        );
      });
      if (!hasTickets) {
        attractionProduct.forEach((item, index) => {
          const ticketNumberLabel = `attractionProduct${index}`;
          validFields.push(ticketNumberLabel);
        });
      }
    }
    const orderProducts = [];
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
    attractionProduct.forEach((item, index) => {
      const { ticketNumber, productNo, sessionTime: session } = item;
      const ticketNumberLabel = `attractionProduct${index}`;
      data[ticketNumberLabel] = ticketNumber;
      orderProducts.push({
        ticketNumber: offerConstrain === 'Fixed' ? offerQuantity : ticketNumber || 0,
        productNo,
        session,
      });
      if (item.attractionProduct.ageGroup) {
        ageGroups.push(item.attractionProduct.ageGroup);
      } else {
        ageGroups.push('-');
      }
      if (ticketNumber) {
        allTicketNumbers += ticketNumber;
      }
    });
    if (!modify && allTicketNumbers !== numOfGuests && offerConstrain !== 'Fixed') {
      message.warning(`Total quantity must be ${numOfGuests}.`);
      return false;
    }
    if (offerConstrain === 'Fixed') {
      if (offerQuantity < offerMinQuantity) {
        message.warning(`Total quantity cannot be less then ${offerMinQuantity}.`);
        return false;
      }
      if (offerQuantity > offerMaxQuantity) {
        message.warning(`Total quantity cannot be greater then ${offerMaxQuantity}.`);
        return false;
      }
    } else {
      if (allTicketNumbers < minProductQuantity) {
        message.warning(`Total quantity cannot be less then ${minProductQuantity}.`);
        return false;
      }
      if (allTicketNumbers > maxProductQuantity) {
        message.warning(`Total quantity cannot be greater then ${maxProductQuantity}.`);
        return false;
      }
    }
    if (
      (offerConstrain !== 'Fixed' && allTicketNumbers === 0) ||
      (offerConstrain === 'Fixed' && offerQuantity === 0)
    ) {
      message.warning('Total quantity is at least 1.');
      return false;
    }
    form.setFieldsValue(data);
    form.validateFields(validFields, err => {
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
        this.setState({
          loading: true,
        });
        dispatch({
          type: 'ticketMgr/checkInventory',
          payload: {
            offerNo,
            dateOfVisit,
            orderProducts,
          },
        }).then(res => {
          this.setState({
            loading: false,
          });
          if (res) {
            order();
          } else {
            message.warning('There is not enough stock to book.');
          }
        });
      }
    });
  };

  toShowTermsAndCondition = value => {
    this.setState({
      showTermsAndCondition: value,
    });
  };

  toShowDataProtectionPolicy = () => {
    const { ticketConfig = [] } = this.props;
    const dataProtectionPolicy = ticketConfig.find(
      ticketConfigItem => ticketConfigItem.item === 'DataProtectionPolicy'
    );
    if (dataProtectionPolicy) {
      const openWindow = window.open(dataProtectionPolicy.itemValue);
      if (!openWindow) {
        message.error('Open window error!');
      }
    } else {
      message.error('This data not config.');
    }
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
      if (!isNullOrUndefined(ticketNumber) && ticketNumber !== '' && ticketNumber !== 0) {
        hasTicketNumbers = true;
      }
    });
    return (
      (isNullOrUndefined(attractionProduct[index].ticketNumber) ||
        attractionProduct[index].ticketNumber === '') &&
      hasTicketNumbers
    );
  };

  hasApspTicket = offerConstrain => {
    const { attractionProduct = [] } = this.props;
    if (offerConstrain === 'Fixed') {
      return attractionProduct.some(
        ({ attractionProduct: { ticketSubType } }) => ticketSubType === 'ApSp'
      );
    }
    if (offerConstrain === 'Single' || offerConstrain === 'Multiple') {
      return attractionProduct.some(
        ({ attractionProduct: { ticketSubType }, ticketNumber }) =>
          ticketNumber && ticketSubType === 'ApSp'
      );
    }
  };

  bookingInformationColumns = (offerConstrain, modify, numOfGuests, getFieldDecorator) => {
    const {
      userCompanyInfo: { companyType },
    } = this.props;
    let columns = [
      {
        title: 'Session',
        dataIndex: 'sessionTime',
        key: 'Session',
        width: '15%',
        render: text => (
          <div className={styles.tableText}>{sessionTimeToWholeDay(text) || '-'}</div>
        ),
      },
      {
        title: 'Ticket Type',
        dataIndex: 'ticketType',
        key: 'ticketType',
        width: '18%',
        render: text => <div className={styles.tableText}>{text}</div>,
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
                validateTrigger: '',
                initialValue: text,
                rules: [
                  {
                    required: true,
                    message: 'Required',
                  },
                ],
              })(
                <div>
                  <InputNumber
                    disabled={this.disabledProduct(record.index, offerConstrain)}
                    value={text}
                    onChange={value => this.changeTicketNumber(record.index, value, offerConstrain)}
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
        key: 'subTotalPrice',
        width: '25%',
        render: text => <div className={styles.tableText}>{text}</div>,
      },
    ];
    if (companyType === '02') {
      columns = columns.filter(({ key }) => priceItemKey.indexOf(key) === -1);
    }
    return columns;
  };

  packageBookingInfoColumns = (getFieldDecorator, modify) => {
    const {
      userCompanyInfo: { companyType },
    } = this.props;
    let columns = [
      {
        title: 'Session',
        dataIndex: 'sessionTime',
        key: 'Session',
        width: '15%',
        render: (_, record) => {
          return (
            <div>
              {record.attractionProduct.map(({ sessionTime }) => (
                <div key={Math.random()}>
                  {sessionTime ? sessionTimeToWholeDay(sessionTime) : '-'}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        title: 'Ticket Type',
        dataIndex: 'ticketType',
        key: 'ticketType',
        width: '18%',
        render: (_, record) => {
          return (
            <div>
              {record.attractionProduct.map(itemProduct => (
                <div key={Math.random()} className={styles.tableText}>
                  {`${itemProduct.attractionProduct.ageGroup || 'General'} * ${
                    itemProduct.needChoiceCount
                  }`}
                </div>
              ))}
            </div>
          );
        },
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
        width: '22%',
        render: text => {
          return (
            <FormItem>
              {getFieldDecorator('offerNumbers', {
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
                    value={text}
                    disabled={!modify}
                    onChange={value => this.changeFixedOfferNumbers(value)}
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
        key: 'subTotalPrice',
        width: '25%',
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
      modify,
      form: { getFieldDecorator },
      attractionProduct = [],
      detail,
      detail: {
        numOfGuests,
        priceRuleId,
        dateOfVisit,
        offerContentList = [],
        productGroup = [],
        offerQuantity,
        offerBasicInfo: { offerName, offerMinQuantity, offerMaxQuantity },
      },
      onClose,
      countrys = [],
      ticketTypesEnums = [],
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
        customerContactNoCountry,
      },
      userCompanyInfo: { companyType },
    } = this.props;
    let termsAndCondition;
    let offerConstrain;
    const ageGroups = [];
    let description;
    const ticketType = [];
    offerContentList.forEach(({ contentLanguage, contentType, contentValue }) => {
      if (contentLanguage === 'en-us' && contentType === 'shortDescription') {
        description = contentValue;
      }
    });
    productGroup.forEach(item => {
      if (item.productType === 'Attraction') {
        item.productGroup.forEach(item2 => {
          if (item2.groupName === 'Attraction') {
            offerConstrain = item2.choiceConstrain;
          }
        });
      }
    });
    const hasApspTicket = this.hasApspTicket(offerConstrain);
    offerContentList.forEach(item => {
      const { contentType, contentLanguage, contentValue } = item;
      if (contentLanguage === 'en-us' && contentType === 'termsAndConditions') {
        termsAndCondition = contentValue;
      }
    });
    attractionProduct.forEach(item => {
      if (item.attractionProduct.ageGroup) {
        ageGroups.push(`${item.attractionProduct.ageGroup}`);
      } else {
        ageGroups.push(`-`);
      }
      if (item.attractionProduct.ticketType) {
        const matchTicketTypes = ticketTypesEnums.filter(
          ({ itemValue }) => itemValue === item.attractionProduct.ticketType
        );
        if (matchTicketTypes.length > 0) {
          ticketType.push(matchTicketTypes[0].itemName);
        } else {
          ticketType.push(`${item.attractionProduct.ticketType}`);
        }
      } else {
        ticketType.push(`-`);
      }
    });

    const bookingInformation = [];
    attractionProduct.forEach((item, index) => {
      const priceShow = calculateProductPrice(item, priceRuleId, item.sessionTime);
      const priceTag = item.onlyVoucher ? 'Voucher' : 'Ticket';
      bookingInformation.push({
        index,
        ticketType: `${item.attractionProduct.ageGroup || 'General'} * ${item.needChoiceCount}`,
        price: `${toThousands(priceShow.toFixed(2))}/${priceTag}`,
        quantity: item.ticketNumber,
        ticketNumberLabel: `attractionProduct${index}`,
        subTotalPrice: `${toThousands((priceShow * (item.ticketNumber || 0)).toFixed(2))}`,
        sessionTime: item.sessionTime,
        minProductQuantity: item.minProductQuantity,
        maxProductQuantity: item.maxProductQuantity,
      });
    });

    const packageBookingInfo =
      offerConstrain === 'Fixed'
        ? [
            {
              id: 1,
              price: `${toThousands(
                calculateAllProductPrice(attractionProduct, priceRuleId, null, detail)
              )}/Package`,
              quantity: offerQuantity,
              subTotalPrice: `${toThousands(
                calculateAllProductPrice(attractionProduct, priceRuleId, null, detail) *
                  (offerQuantity || 0).toFixed(2)
              )}`,
              attractionProduct,
              offerMinQuantity,
              offerMaxQuantity,
            },
          ]
        : [];
    return (
      <div>
        <Drawer
          visible={showTermsAndCondition}
          title={<div className={styles.title}>TERMS AND CONDITIONS</div>}
          placement="right"
          destroyOnClose
          maskClosable={false}
          getContainer={false}
          width={bodyWidth < 720 ? bodyWidth : 720}
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
          title={
            <div className={styles.title}>
              {formatMessage({ id: modify ? 'MODIFY_TO_CART' : 'ADD_TO_CART' }).toUpperCase()}
            </div>
          }
          placement="right"
          destroyOnClose
          getContainer={false}
          maskClosable={false}
          width={bodyWidth < 720 ? bodyWidth : 720}
          className={styles.container}
          bodyStyle={{
            position: 'relative',
            height: 'calc(100% - 55px)',
            padding: 0,
          }}
          onClose={() => onClose()}
        >
          <div className={styles.bodyContainer}>
            <Spin spinning={loading} wrapperClassName="AttractionToCart">
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
                        <span className={styles.detailText}>{offerName || '-'}</span>
                      </Col>
                    </Col>
                    <Col span={24} className={styles.orderInformationItem}>
                      <Col span={24}>
                        <span className={styles.detailLabel}>Description :</span>
                      </Col>
                      <Col span={24}>
                        <span className={styles.detailText}>{description || '-'}</span>
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
                  {offerConstrain === 'Fixed' ? (
                    <div className={styles.tableFormStyle}>
                      <Form hideRequiredMark colon={false}>
                        <Table
                          size="small"
                          className={`tabs-no-padding ${styles.searchTitle}`}
                          columns={this.packageBookingInfoColumns(getFieldDecorator, modify)}
                          dataSource={packageBookingInfo}
                          pagination={false}
                          scroll={{ x: 600 }}
                          rowKey={record => record.id}
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
                                    {`${toThousands(
                                      (
                                        offerQuantity *
                                        calculateAllProductPrice(
                                          attractionProduct,
                                          priceRuleId,
                                          null,
                                          detail
                                        )
                                      ).toFixed(2)
                                    )}`}
                                  </span>
                                </div>
                              </div>
                            );
                          }}
                        />
                      </Form>
                    </div>
                  ) : (
                    <div className={styles.tableFormStyle}>
                      <Form hideRequiredMark colon={false}>
                        <Table
                          className={`tabs-no-padding ${styles.searchTitle}`}
                          size="small"
                          columns={this.bookingInformationColumns(
                            offerConstrain,
                            modify,
                            numOfGuests,
                            getFieldDecorator
                          )}
                          rowKey={record => record.index}
                          dataSource={bookingInformation}
                          pagination={false}
                          scroll={{ x: 600 }}
                          footer={() => {
                            if (companyType === '02') {
                              return null;
                            }
                            return (
                              <div className={styles.tableFooterDiv}>
                                <div>
                                  <span className={styles.tableFooterSpan}>
                                    Total Amount Payable:
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
                  )}
                </Row>
              </div>
              <Col
                span={24}
                style={{ height: '25px', marginTop: '20px', paddingLeft: '0' }}
                className={styles.title}
              >
                GUEST INFORMATION
              </Col>
              <Col span={24} style={{ marginTop: '5px', paddingLeft: '0' }}>
                <div style={{ color: '#8C8C8C' }}>
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
                          getPopupContainer={() =>
                            document.getElementsByClassName('AttractionToCart')[0]
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
                  <FormItem
                    className={styles.customerContactNo}
                    label="Customer Contact No."
                    colon={false}
                    required={hasApspTicket}
                  >
                    <FormItem colon={false} className={styles.phoneCountryItem}>
                      {getFieldDecorator('customerContactNoCountry', {
                        initialValue: customerContactNoCountry || [],
                        rules: [
                          { required: hasApspTicket, message: formatMessage({ id: 'REQUIRED' }) },
                        ],
                      })(
                        <div style={{ width: '100%' }}>
                          <SortSelect
                            allowClear
                            showSearch
                            value={customerContactNoCountry}
                            placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                            optionFilterProp="label"
                            onChange={value => {
                              this.changeDeliveryInformation('customerContactNoCountry', value);
                            }}
                            getPopupContainer={() =>
                              document.getElementsByClassName('AttractionToCart')[0]
                            }
                            options={countrys.map(item => (
                              <Select.Option
                                key={`countryPhoneList${item.dictId}`}
                                value={`${item.dictId}`}
                                label={`${item.dictName} +${item.dictId}`}
                              >
                                <Tooltip
                                  placement="topLeft"
                                  title={
                                    <span style={{ whiteSpace: 'pre-wrap' }}>
                                      {`${item.dictName} +${item.dictId}`}
                                    </span>
                                  }
                                >
                                  {`${item.dictName} +${item.dictId}`}
                                </Tooltip>
                              </Select.Option>
                            ))}
                          />
                        </div>
                      )}
                    </FormItem>
                    <FormItem colon={false} className={styles.contactPhoneItem}>
                      {getFieldDecorator('customerContactNo', {
                        initialValue: customerContactNo || null,
                        rules: [
                          { required: hasApspTicket, message: formatMessage({ id: 'REQUIRED' }) },
                        ],
                      })(
                        <div style={{ width: '100%' }}>
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
                  Please tick (<Icon type="check" />) to accept{' '}
                </span>
                <span className={styles.TC} onClick={() => this.toShowTermsAndCondition(true)}>
                  Terms and Conditions
                </span>
                <span> and </span>
                <span className={styles.TC} onClick={() => this.toShowDataProtectionPolicy()}>
                  Data Protection Policy.
                </span>
              </div>
            </Spin>
          </div>
          <div className={styles.formControl}>
            <Button onClick={() => onClose()} style={{ marginRight: 8, width: 60 }}>
              Cancel
            </Button>
            <Button
              onClick={() => this.order(offerConstrain)}
              type="primary"
              style={{ minWidth: 60 }}
              loading={loading}
            >
              {formatMessage({ id: modify ? 'MODIFY_TO_CART' : 'ADD_TO_CART' })}
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default ToCart;
