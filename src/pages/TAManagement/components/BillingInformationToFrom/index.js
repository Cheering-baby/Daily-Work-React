import React, { PureComponent } from 'react';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { getBillingInfo } from '../../utils/pubUtils';
import { isNvl } from '@/utils/utils';

class BillingInformationToFrom extends PureComponent {
  render() {
    const {
      form,
      formItemLayout,
      formItemRowLayout,
      viewId,
      isMainTaRoleFlag,
      isAccountingArRoleFlag,
      salutationList = [],
      countryList = [],
      bilCityList = [],
      otherInfo = {},
      customerInfo = {},
      bilCityLoadingFlag = false,
      isBilCheckBox,
      onHandleChange,
      onHandleToBilCheckBox,
    } = this.props;
    const { getFieldDecorator } = form;
    const billingInfo = getBillingInfo(otherInfo, customerInfo, isBilCheckBox) || {};
    let isAllDisabled = false;
    let isCountryDisabled = false;
    if (isAccountingArRoleFlag) {
      isAllDisabled = true;
      isCountryDisabled = true;
    }
    if (isMainTaRoleFlag) {
      isCountryDisabled = true;
    }
    const numFormat = formatMessage({ id: 'INPUT_MAX_NUM' });
    const prefixPhoneSelector = getFieldDecorator('phoneCountry', {
      initialValue: !isNvl(billingInfo.phoneCountry) ? billingInfo.phoneCountry : [],
      rules: [{ required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) }],
    })(
      <Select
        showSearch
        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
        optionFilterProp="children"
        getPopupContainer={() => document.getElementById(`${viewId}`)}
        onChange={value => onHandleChange('phoneCountry', value, 'phoneCountry')}
        disabled={isAllDisabled}
      >
        {countryList && countryList.length > 0
          ? countryList.map(item => (
            <Select.Option key={`bilCountryPhoneList${item.dictId}`} value={`${item.dictId}`}>
              {`${item.dictName} +${item.dictId}`}
            </Select.Option>
            ))
          : null}
      </Select>
    );
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Form.Item label={' '} colon={false} {...formItemRowLayout}>
              {getFieldDecorator('isBilCheckBox', {
                valuePropName: 'checked',
                initialValue: isBilCheckBox,
              })(
                <Checkbox onChange={e => onHandleToBilCheckBox(e)} disabled={isAllDisabled}>
                  <span className={styles.bilCheckBoxDiv}>
                    {formatMessage({ id: 'BIL_CHECKBOX' })}
                  </span>
                </Checkbox>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'BIL_COMPANY_NAME' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('bilCompanyName', {
                initialValue: billingInfo.companyName || null,
                rules: [
                  { required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) },
                  {
                    pattern: /^[^\u4e00-\u9fa5]+$/g,
                    message: formatMessage({ id: 'INPUT_ONLY_ENGLISH' }),
                  },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('companyName', e.target.value, 'bilCompanyName')}
                  onPressEnter={e =>
                    onHandleChange('companyName', e.target.value, 'bilCompanyName')
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
              label={formatMessage({ id: 'BIL_COUNTRY_AND_CITY_STATE' })}
              colon={false}
              {...formItemLayout}
              className={!isBilCheckBox ? styles.bilCountryAndCityItem : null}
            >
              <Input.Group compact>
                <Form.Item colon={false} className={styles.bilCountryItem}>
                  {getFieldDecorator('bilCountry', {
                    initialValue: billingInfo.country || [],
                    rules: [
                      { required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="children"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value => onHandleChange('country', value, 'bilCountry')}
                      disabled={isCountryDisabled || false}
                    >
                      {countryList && countryList.length > 0
                        ? countryList.map(item => (
                          <Select.Option
                            key={`bilCountryList${item.dictId}`}
                            value={`${item.dictId}`}
                          >
                            {item.dictName}
                          </Select.Option>
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item colon={false} className={styles.bilCityItem}>
                  {getFieldDecorator('bilCity', {
                    initialValue: billingInfo.city || null,
                    rules: [
                      { required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) },
                      { max: 200, message: numFormat },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="children"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value => onHandleChange('city', value, 'bilCity')}
                      loading={bilCityLoadingFlag}
                      disabled={isAllDisabled}
                    >
                      {bilCityList && bilCityList.length > 0
                        ? bilCityList.map(item => (
                          <Select.Option
                            key={`bilCityList${item.dictId}`}
                            value={`${item.dictId}`}
                          >
                            {item.dictName}
                          </Select.Option>
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'BIL_ZIP_POSTAL_CODE' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('bilPostalCode', {
                initialValue: billingInfo.postalCode || null,
                rules: [
                  { required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('postalCode', e.target.value, 'bilPostalCode')}
                  onPressEnter={e => onHandleChange('postalCode', e.target.value, 'bilPostalCode')}
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'BIL_ADDRESS' })}
              colon={false}
              {...formItemRowLayout}
            >
              {getFieldDecorator('bilAddress', {
                initialValue: billingInfo.address || null,
                rules: [{ required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) }],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('address', e.target.value, 'bilAddress')}
                  onPressEnter={e => onHandleChange('address', e.target.value, 'bilAddress')}
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label={formatMessage({ id: 'BIL_EMAIL' })} colon={false} {...formItemLayout}>
              {getFieldDecorator('bilEmail', {
                initialValue: billingInfo.email || null,
                rules: [
                  { required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) },
                  { type: 'email', message: formatMessage({ id: 'INPUT_EMAIL' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('email', e.target.value, 'bilEmail')}
                  onPressEnter={e => onHandleChange('email', e.target.value, 'bilEmail')}
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'BIL_TEL' })}
              colon={false}
              {...formItemLayout}
              className={!isBilCheckBox ? styles.bilTelItem : null}
            >
              <Input.Group compact>
                <Form.Item colon={false} className={styles.bilPhoneCountryItem}>
                  {prefixPhoneSelector}
                </Form.Item>
                <Form.Item colon={false} className={styles.bilPhoneItem}>
                  {getFieldDecorator('bilPhone', {
                    initialValue: billingInfo.phone || null,
                    rules: [
                      { required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) },
                      { max: 200, message: numFormat },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e => onHandleChange('phone', e.target.value, 'bilPhone')}
                      onPressEnter={e => onHandleChange('phone', e.target.value, 'bilPhone')}
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
              label={formatMessage({ id: 'BIL_CONTACT_PERSON_SALUTATION' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('bilSalutation', {
                initialValue: billingInfo.salutation || [],
                rules: [{ required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) }],
              })(
                <Select
                  showSearch
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  optionFilterProp="children"
                  getPopupContainer={() => document.getElementById(`${viewId}`)}
                  onChange={value => onHandleChange('salutation', value, 'bilSalutation')}
                  disabled={isAllDisabled}
                >
                  {salutationList && salutationList.length > 0
                    ? salutationList.map(item => (
                      <Select.Option
                        key={`salutationList${item.dictId}`}
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
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
            &nbsp;
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'BIL_CONTACT_PERSON_FIRST_NAME' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('bilFirstName', {
                initialValue: billingInfo.firstName || null,
                rules: [
                  { required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('firstName', e.target.value, 'bilFirstName')}
                  onPressEnter={e => onHandleChange('firstName', e.target.value, 'bilFirstName')}
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'BIL_CONTACT_PERSON_LAST_NAME' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('bilLastName', {
                initialValue: billingInfo.lastName || null,
                rules: [
                  { required: !isBilCheckBox, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('lastName', e.target.value, 'bilLastName')}
                  onPressEnter={e => onHandleChange('lastName', e.target.value, 'bilLastName')}
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default BillingInformationToFrom;
