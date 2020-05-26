import React, { PureComponent } from 'react';
import { Checkbox, Col, Form, Input, InputNumber, Row, Select, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getFinanceType } from '../../utils/pubUtils';
import FriendlyDatePicker from '@/components/FriendlyDatePicker';

class TAFinanceContactToFrom extends PureComponent {
  render() {
    const {
      form,
      formItemLayout,
      viewId,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      currencyList = [],
      countryList = [],
      createTeamList = [],
      otherInfo = {},
      mappingInfo = {},
      isAllInformationToRws,
      onMappingHandleChange,
      onHandleChange,
      onHandleToTAFinanceCheckBoxEdit,
    } = this.props;
    const { getFieldDecorator } = form;
    const financeContactList = (otherInfo || {}).financeContactList || [];
    const { financeTypeOne, financeTypeTwo } = getFinanceType() || {};
    const numFormat = formatMessage({ id: 'INPUT_MAX_NUM' });
    let financeInfoOne = {};
    if (financeContactList && financeContactList.length > 0) {
      financeInfoOne =
        financeContactList.find(
          item => String(item.financeType).toLowerCase() === financeTypeOne
        ) || {};
    }
    let financeInfoTwo = {};
    if (financeContactList && financeContactList.length > 0) {
      financeInfoTwo =
        financeContactList.find(
          item => String(item.financeType).toLowerCase() === financeTypeTwo
        ) || {};
    }
    let isAllDisabled = false;
    let isMappingDisabled = false;
    if (isSaleSupportRoleFlag) {
      isAllDisabled = true;
      isMappingDisabled = true;
    }
    if (isMainTaRoleFlag) {
      isMappingDisabled = true;
    }
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <span className={styles.financeConcatTitle}>
              {formatMessage({ id: 'PRIMARY_FINANCE' })}
            </span>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_PERSON' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('contactPersonOne', {
                initialValue: financeInfoOne.contactPerson || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange(
                      'contactPerson',
                      e.target.value,
                      'contactPersonOne',
                      financeTypeOne
                    )
                  }
                  onPressEnter={e =>
                    onHandleChange(
                      'contactPerson',
                      e.target.value,
                      'contactPersonOne',
                      financeTypeOne
                    )
                  }
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_MOBILE_NO' })}
              colon={false}
              {...formItemLayout}
              className={styles.taFinanceTelItem}
            >
              <Input.Group compact>
                <Form.Item colon={false} className={styles.taCountryItem}>
                  {getFieldDecorator('mobileCountryOne', {
                    initialValue: financeInfoOne.mobileCountry || [],
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="label"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value =>
                        onHandleChange('mobileCountry', value, 'mobileCountryOne', financeTypeOne)
                      }
                      disabled={isAllDisabled}
                    >
                      {countryList && countryList.length > 0
                        ? countryList.map(item => (
                          <Select.Option
                            key={`mobileCountryListOne${item.dictId}`}
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
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item colon={false} className={styles.taPhoneItem}>
                  {getFieldDecorator('mobileNumberOne', {
                    initialValue: financeInfoOne.mobileNumber || null,
                    rules: [
                      { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                      { max: 200, message: numFormat },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e =>
                        onHandleChange(
                          'mobileNumber',
                          e.target.value,
                          'mobileNumberOne',
                          financeTypeOne
                        )
                      }
                      onPressEnter={e =>
                        onHandleChange(
                          'mobileNumber',
                          e.target.value,
                          'mobileNumberOne',
                          financeTypeOne
                        )
                      }
                      disabled={isAllDisabled}
                    />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_NO' })}
              colon={false}
              {...formItemLayout}
              className={styles.taFinanceTelItem}
            >
              <Input.Group compact>
                <Form.Item colon={false} className={styles.taCountryItem}>
                  {getFieldDecorator('countryOne', {
                    initialValue: financeInfoOne.country || [],
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="label"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value =>
                        onHandleChange('country', value, 'countryOne', financeTypeOne)
                      }
                      disabled={isAllDisabled}
                    >
                      {countryList && countryList.length > 0
                        ? countryList.map(item => (
                          <Select.Option
                            key={`countryListOne${item.dictId}`}
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
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item colon={false} className={styles.taPhoneItem}>
                  {getFieldDecorator('contactNoOne', {
                    initialValue: financeInfoOne.contactNo || null,
                    rules: [
                      { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                      { max: 200, message: numFormat },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e =>
                        onHandleChange('contactNo', e.target.value, 'contactNoOne', financeTypeOne)
                      }
                      onPressEnter={e =>
                        onHandleChange('contactNo', e.target.value, 'contactNoOne', financeTypeOne)
                      }
                      disabled={isAllDisabled}
                    />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_EMAIL' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('contactEmailOne', {
                initialValue: financeInfoOne.contactEmail || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { type: 'email', message: formatMessage({ id: 'INPUT_EMAIL' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange(
                      'contactEmail',
                      e.target.value,
                      'contactEmailOne',
                      financeTypeOne
                    )
                  }
                  onPressEnter={e =>
                    onHandleChange(
                      'contactEmail',
                      e.target.value,
                      'contactEmailOne',
                      financeTypeOne
                    )
                  }
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <span className={styles.financeConcatTitle}>
              {formatMessage({ id: 'SECONDARY_FINANCE' })}
            </span>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_PERSON' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('contactPersonTwo', {
                initialValue: financeInfoTwo.contactPerson || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange(
                      'contactPerson',
                      e.target.value,
                      'contactPersonTwo',
                      financeTypeTwo
                    )
                  }
                  onPressEnter={e =>
                    onHandleChange(
                      'contactPerson',
                      e.target.value,
                      'contactPersonTwo',
                      financeTypeTwo
                    )
                  }
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_MOBILE_NO' })}
              colon={false}
              {...formItemLayout}
              className={styles.taFinanceTelItem}
            >
              <Input.Group compact>
                <Form.Item colon={false} className={styles.taCountryItem}>
                  {getFieldDecorator('mobileCountryTwo', {
                    initialValue: financeInfoTwo.mobileCountry || [],
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="label"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value =>
                        onHandleChange('mobileCountry', value, 'mobileCountryTwo', financeTypeTwo)
                      }
                      disabled={isAllDisabled}
                    >
                      {countryList && countryList.length > 0
                        ? countryList.map(item => (
                          <Select.Option
                            key={`mobileCountryListTwo${item.dictId}`}
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
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item colon={false} className={styles.taPhoneItem}>
                  {getFieldDecorator('mobileNumberTwo', {
                    initialValue: financeInfoTwo.mobileNumber || null,
                    rules: [
                      { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                      { max: 200, message: numFormat },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e =>
                        onHandleChange(
                          'mobileNumber',
                          e.target.value,
                          'mobileNumberTwo',
                          financeTypeTwo
                        )
                      }
                      onPressEnter={e =>
                        onHandleChange(
                          'mobileNumber',
                          e.target.value,
                          'mobileNumberTwo',
                          financeTypeTwo
                        )
                      }
                      disabled={isAllDisabled}
                    />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_NO' })}
              colon={false}
              {...formItemLayout}
              className={styles.taFinanceTelItem}
            >
              <Input.Group compact>
                <Form.Item colon={false} className={styles.taCountryItem}>
                  {getFieldDecorator('countryTwo', {
                    initialValue: financeInfoTwo.country || [],
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="label"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value =>
                        onHandleChange('country', value, 'countryTwo', financeTypeTwo)
                      }
                      disabled={isAllDisabled}
                    >
                      {countryList && countryList.length > 0
                        ? countryList.map(item => (
                          <Select.Option
                            key={`countryListTwo${item.dictId}`}
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
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item colon={false} className={styles.taPhoneItem}>
                  {getFieldDecorator('contactNoTwo', {
                    initialValue: financeInfoTwo.contactNo || null,
                    rules: [
                      { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                      { max: 200, message: numFormat },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e =>
                        onHandleChange('contactNo', e.target.value, 'contactNoTwo', financeTypeTwo)
                      }
                      onPressEnter={e =>
                        onHandleChange('contactNo', e.target.value, 'contactNoTwo', financeTypeTwo)
                      }
                      disabled={isAllDisabled}
                    />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_EMAIL' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('contactEmailTwo', {
                initialValue: financeInfoTwo.contactEmail || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { type: 'email', message: formatMessage({ id: 'INPUT_EMAIL' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange(
                      'contactEmail',
                      e.target.value,
                      'contactEmailTwo',
                      financeTypeTwo
                    )
                  }
                  onPressEnter={e =>
                    onHandleChange(
                      'contactEmail',
                      e.target.value,
                      'contactEmailTwo',
                      financeTypeTwo
                    )
                  }
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {(isMainTaRoleFlag || isAccountingArRoleFlag) && (
          <Row type="flex" justify="space-around">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item
                label={formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_AMOUNT' })}
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('securityDepositAmount', {
                  initialValue: !isNvl(mappingInfo.securityDepositAmount)
                    ? Number(String(mappingInfo.securityDepositAmount))
                    : null,
                  rules: [
                    {
                      required: false,
                      message: formatMessage({ id: 'INPUT_ONLY_NUMBER' }),
                      pattern: /^(([1-9]{1}\d{0,100})|(0{1}))(\.\d{1,2})?$/g,
                    },
                  ],
                })(
                  <InputNumber
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => {
                      if (!isNvl(value)) {
                        return value.replace(/\$\s?|(,*)/g, '');
                      }
                      return null;
                    }}
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={value =>
                      onMappingHandleChange('securityDepositAmount', value, 'securityDepositAmount')
                    }
                    onPressEnter={e =>
                      onMappingHandleChange(
                        'securityDepositAmount',
                        e.target.value,
                        'securityDepositAmount'
                      )
                    }
                    style={{ width: '100%' }}
                    disabled={isMappingDisabled}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item
                label={formatMessage({ id: 'TA_FINANCE_CURRENCY' })}
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('currency', {
                  initialValue: mappingInfo.currency || [],
                })(
                  <Select
                    showSearch
                    placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                    optionFilterProp="label"
                    getPopupContainer={() => document.getElementById(`${viewId}`)}
                    onChange={value => onMappingHandleChange('currency', value, 'currency')}
                    disabled={isMappingDisabled}
                  >
                    {currencyList && currencyList.length > 0
                      ? currencyList.map(item => (
                        <Select.Option
                          key={`currencyList${item.dictId}`}
                          value={`${item.dictId}`}
                          label={`${item.dictName}`}
                        >
                          <Tooltip
                            placement="topLeft"
                            title={
                              <span style={{ whiteSpace: 'pre-wrap' }}>{`${item.dictName}`}</span>
                              }
                          >
                            {`${item.dictName}`}
                          </Tooltip>
                        </Select.Option>
                        ))
                      : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
        {isAccountingArRoleFlag && (
          <Row type="flex" justify="space-around">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item
                label={formatMessage({ id: 'TA_FINANCE_E_WALLET_FIXED_THRESHOLD' })}
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('ewalletFixedThreshold', {
                  initialValue: !isNvl(mappingInfo.ewalletFixedThreshold)
                    ? Number(String(mappingInfo.ewalletFixedThreshold))
                    : null,
                  rules: [
                    {
                      required: isAllInformationToRws || false,
                      message: formatMessage({ id: 'REQUIRED' }),
                    },
                    {
                      required: false,
                      message: formatMessage({ id: 'INPUT_ONLY_NUMBER' }),
                      pattern: /^(([1-9]{1}\d{0,100})|(0{1}))(\.\d{1,2})?$/g,
                    },
                  ],
                })(
                  <InputNumber
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => {
                      if (!isNvl(value)) {
                        return value.replace(/\$\s?|(,*)/g, '');
                      }
                      return null;
                    }}
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={value =>
                      onMappingHandleChange('ewalletFixedThreshold', value, 'ewalletFixedThreshold')
                    }
                    onPressEnter={e =>
                      onMappingHandleChange(
                        'ewalletFixedThreshold',
                        e.target.value,
                        'ewalletFixedThreshold'
                      )
                    }
                    style={{ width: '100%' }}
                    disabled={isMappingDisabled}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item
                label={formatMessage({ id: 'TA_FINANCE_AR_FIXED_THRESHOLD' })}
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('arFixedThreshold', {
                  initialValue: !isNvl(mappingInfo.arFixedThreshold)
                    ? Number(String(mappingInfo.arFixedThreshold))
                    : null,
                  rules: [
                    {
                      required: isAllInformationToRws || false,
                      message: formatMessage({ id: 'REQUIRED' }),
                    },
                    {
                      required: false,
                      message: formatMessage({ id: 'INPUT_ONLY_NUMBER' }),
                      pattern: /^(([1-9]{1}\d{0,100})|(0{1}))(\.\d{1,2})?$/g,
                    },
                  ],
                })(
                  <InputNumber
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => {
                      if (!isNvl(value)) {
                        return value.replace(/\$\s?|(,*)/g, '');
                      }
                      return null;
                    }}
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={value =>
                      onMappingHandleChange('arFixedThreshold', value, 'arFixedThreshold')
                    }
                    onPressEnter={e =>
                      onMappingHandleChange('arFixedThreshold', e.target.value, 'arFixedThreshold')
                    }
                    style={{ width: '100%' }}
                    disabled={isMappingDisabled}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
        {(isMainTaRoleFlag || isAccountingArRoleFlag) && (
          <React.Fragment>
            <Row type="flex" justify="space-around">
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  label={formatMessage({ id: 'TA_FINANCE_BANKER_GUARANTEE_AMOUNT' })}
                  colon={false}
                  {...formItemLayout}
                >
                  {getFieldDecorator('guaranteeAmount', {
                    initialValue: !isNvl(mappingInfo.guaranteeAmount)
                      ? Number(String(mappingInfo.guaranteeAmount))
                      : null,
                    rules: [
                      {
                        required: false,
                        message: formatMessage({ id: 'INPUT_ONLY_NUMBER' }),
                        pattern: /^(([1-9]{1}\d{0,100})|(0{1}))(\.\d{1,2})?$/g,
                      },
                    ],
                  })(
                    <InputNumber
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => {
                        if (!isNvl(value)) {
                          return value.replace(/\$\s?|(,*)/g, '');
                        }
                        return null;
                      }}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={value =>
                        onMappingHandleChange('guaranteeAmount', value, 'guaranteeAmount')
                      }
                      onPressEnter={e =>
                        onMappingHandleChange('guaranteeAmount', e.target.value, 'guaranteeAmount')
                      }
                      style={{ width: '100%' }}
                      disabled={isMappingDisabled}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  label={formatMessage({ id: 'TA_FINANCE_BANKER_GUARANTEE_EXPIRY_DATE' })}
                  colon={false}
                  {...formItemLayout}
                >
                  {getFieldDecorator('guaranteeExpiryDate', {
                    initialValue: !isNvl(mappingInfo.guaranteeExpiryDate)
                      ? moment(mappingInfo.guaranteeExpiryDate, 'YYYY-MM-DD')
                      : null,
                  })(
                    <FriendlyDatePicker
                      onChange={date =>
                        onMappingHandleChange(
                          'guaranteeExpiryDate',
                          isNvl(date) ? date : date.format('YYYY-MM-DD'),
                          'guaranteeExpiryDate'
                        )
                      }
                      getCalendarContainer={() => document.getElementById(`${viewId}`)}
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      style={{ width: '100%' }}
                      disabled={isMappingDisabled}
                      displayFormat="DD/MM/YYYY"
                      searchFormat="DDMMYYYY"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row type="flex" justify="space-around">
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  label={formatMessage({ id: 'TA_FINANCE_CREDIT_TERM' })}
                  colon={false}
                  {...formItemLayout}
                >
                  {getFieldDecorator('creditTerm', {
                    initialValue: mappingInfo.creditTerm || [],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="label"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      disabled={isMappingDisabled}
                      onChange={value => onMappingHandleChange('creditTerm', value, 'creditTerm')}
                    >
                      {createTeamList && createTeamList.length > 0
                        ? createTeamList.map(item => (
                          <Select.Option
                            key={`createTeamList${item.dictId}`}
                            value={`${item.dictId}`}
                            label={`${item.dictName}`}
                          >
                            <Tooltip
                              placement="topLeft"
                              title={
                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                  {`${item.dictName}`}
                                </span>
                                }
                            >
                              {`${item.dictName}`}
                            </Tooltip>
                          </Select.Option>
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  label={formatMessage({ id: 'TA_FINANCE_CREDIT_LIMIT' })}
                  colon={false}
                  {...formItemLayout}
                >
                  {getFieldDecorator('creditLimit', {
                    initialValue: !isNvl(mappingInfo.creditLimit)
                      ? Number(String(mappingInfo.creditLimit))
                      : null,
                    rules: [
                      {
                        required: false,
                        message: formatMessage({ id: 'INPUT_ONLY_NUMBER' }),
                        pattern: /^(([1-9]{1}\d{0,100})|(0{1}))(\.\d{1,2})?$/g,
                      },
                    ],
                  })(
                    <InputNumber
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => {
                        if (!isNvl(value)) {
                          return value.replace(/\$\s?|(,*)/g, '');
                        }
                        return null;
                      }}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={value => onMappingHandleChange('creditLimit', value, 'creditLimit')}
                      onPressEnter={e =>
                        onMappingHandleChange('creditLimit', e.target.value, 'creditLimit')
                      }
                      style={{ width: '100%' }}
                      disabled={isMappingDisabled}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </React.Fragment>
        )}
        {!(isSaleSupportRoleFlag || isAccountingArRoleFlag) && (
          <Row type="flex" justify="space-around">
            <Col span={24} className={styles.isAllInformationToRwsCheckboxCol}>
              <Form.Item colon={false}>
                {getFieldDecorator('isAllInformationToRws', {
                  valuePropName: 'checked',
                  initialValue: isAllInformationToRws || null,
                  rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                })(
                  <Checkbox
                    onChange={e => onHandleToTAFinanceCheckBoxEdit(e)}
                    disabled={isAllDisabled}
                  >
                    <span
                      className={styles.isAllInformationToRwsCheckbox}
                      dangerouslySetInnerHTML={{
                        __html: formatMessage({ id: 'TA_IS_ALL_INFORMATION_TO_RWS' }),
                      }}
                    />
                  </Checkbox>
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
      </Col>
    );
  }
}

export default TAFinanceContactToFrom;
