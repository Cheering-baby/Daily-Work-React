import React, { PureComponent } from 'react';
import { Checkbox, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getFinanceType } from '../../utils/pubUtils';

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
            &nbsp;
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_NO' })}
              colon={false}
              {...formItemLayout}
            >
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
            &nbsp;
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TA_FINANCE_CONTACT_NO' })}
              colon={false}
              {...formItemLayout}
            >
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
                  initialValue: mappingInfo.securityDepositAmount || null,
                  rules: [{ max: 200, message: numFormat }],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={e =>
                      onMappingHandleChange(
                        'securityDepositAmount',
                        e.target.value,
                        'securityDepositAmount'
                      )
                    }
                    onPressEnter={e =>
                      onMappingHandleChange(
                        'securityDepositAmount',
                        e.target.value,
                        'securityDepositAmount'
                      )
                    }
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
                    optionFilterProp="children"
                    getPopupContainer={() => document.getElementById(`${viewId}`)}
                    onChange={value => onMappingHandleChange('currency', value, 'currency')}
                    disabled={isMappingDisabled}
                  >
                    {currencyList && currencyList.length > 0
                      ? currencyList.map(item => (
                        <Select.Option
                          key={`currencyList${item.dictId}`}
                          value={`${item.dictId}`}
                        >
                          {item.dictName}
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
                  initialValue: mappingInfo.ewalletFixedThreshold || null,
                  rules: [
                    {
                      required: isAllInformationToRws || false,
                      message: formatMessage({ id: 'REQUIRED' }),
                    },
                    { max: 200, message: numFormat },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={e =>
                      onMappingHandleChange(
                        'ewalletFixedThreshold',
                        e.target.value,
                        'ewalletFixedThreshold'
                      )
                    }
                    onPressEnter={e =>
                      onMappingHandleChange(
                        'ewalletFixedThreshold',
                        e.target.value,
                        'ewalletFixedThreshold'
                      )
                    }
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
                  initialValue: mappingInfo.arFixedThreshold || null,
                  rules: [
                    {
                      required: isAllInformationToRws || false,
                      message: formatMessage({ id: 'REQUIRED' }),
                    },
                    { max: 200, message: numFormat },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={e =>
                      onMappingHandleChange('arFixedThreshold', e.target.value, 'arFixedThreshold')
                    }
                    onPressEnter={e =>
                      onMappingHandleChange('arFixedThreshold', e.target.value, 'arFixedThreshold')
                    }
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
                    initialValue: mappingInfo.guaranteeAmount || null,
                    rules: [{ max: 200, message: numFormat }],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e =>
                        onMappingHandleChange('guaranteeAmount', e.target.value, 'guaranteeAmount')
                      }
                      onPressEnter={e =>
                        onMappingHandleChange('guaranteeAmount', e.target.value, 'guaranteeAmount')
                      }
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
                    <DatePicker
                      format="DD/MM/YYYY"
                      onChange={date =>
                        onMappingHandleChange(
                          'guaranteeExpiryDate',
                          isNvl(date) ? date : date.format('YYYYMMDD'),
                          'guaranteeExpiryDate'
                        )
                      }
                      getCalendarContainer={() => document.getElementById(`${viewId}`)}
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      style={{ width: '100%' }}
                      disabled={isMappingDisabled}
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
                    initialValue: mappingInfo.creditTerm || null,
                    rules: [{ max: 200, message: numFormat }],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e =>
                        onMappingHandleChange('creditTerm', e.target.value, 'creditTerm')
                      }
                      onPressEnter={e =>
                        onMappingHandleChange('creditTerm', e.target.value, 'creditTerm')
                      }
                      disabled={isMappingDisabled}
                    />
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
                    initialValue: mappingInfo.creditLimit || null,
                    rules: [{ max: 200, message: numFormat }],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e =>
                        onMappingHandleChange('creditLimit', e.target.value, 'creditLimit')
                      }
                      onPressEnter={e =>
                        onMappingHandleChange('creditLimit', e.target.value, 'creditLimit')
                      }
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
                    <span className={styles.isAllInformationToRwsCheckbox}>
                      {formatMessage({ id: 'TA_IS_ALL_INFORMATION_TO_RWS' })}
                    </span>
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
