import React, { PureComponent } from 'react';
import { Col, Form, Icon, Input, Radio, Row, Select, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { colLayOut, rowLayOut } from '../../utils/pubUtils';
import { isNvl } from '@/utils/utils';
import styles from './index.less';
import FriendlyDatePicker from '@/components/FriendlyDatePicker';
import SortSelect from '@/components/SortSelect';

class CompanyInformationToFrom extends PureComponent {
  getTravelAgentNoLabel = country => {
    if (String(country).toUpperCase() === '65') {
      return formatMessage({ id: 'STB_TRAVEL_AGENT_LICENSE_NUMBER' });
    }
    return formatMessage({ id: 'TRAVEL_AGENT_REGISTRATION_NUMBER' });
  };

  getTravelAgentNoRules = country => {
    const numFormat = formatMessage({ id: 'INPUT_MAX_NUM' });
    if (String(country).toUpperCase() === '65') {
      return [
        { required: true, message: formatMessage({ id: 'REQUIRED' }) },
        { max: 200, message: numFormat },
      ];
    }
    return [{ max: 200, message: numFormat }];
  };

  getGstRegNoRules = gstRegYesOrNo => {
    if (String(gstRegYesOrNo).toLowerCase() === '1') {
      return [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }];
    }
    return [];
  };

  compareToRegistrationNo = (rule, value, callback) => {
    const { onCheckRegistrationNo } = this.props;
    onCheckRegistrationNo(value).then(data => {
      if (!isNvl(value) && data) {
        callback(formatMessage({ id: 'UEN_BUSINESS_REGISTRATION_NUMBER_ERROR' }));
      } else callback();
    });
  };

  render() {
    const {
      editCondition,
      form,
      formItemLayout,
      formItemRowLayout,
      viewId,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      organizationRoleList = [],
      countryList = [],
      cityList = [],
      categoryList = [],
      customerGroupList = [],
      customerInfo = {},
      cityLoadingFlag = false,
      customerGroupLoadingFlag = false,
      onHandleChange,
      isTaDeActivationFlag,
    } = this.props;
    const { getFieldDecorator } = form;
    const companyInfo = (customerInfo || {}).companyInfo || {};
    const numFormat = formatMessage({ id: 'INPUT_MAX_NUM' });
    let isAllDisabled = false;
    let isRoleDisabled = false;
    if (isMainTaRoleFlag || isAccountingArRoleFlag) {
      isAllDisabled = true;
    }
    if (isAccountingArRoleFlag || isTaDeActivationFlag) {
      isRoleDisabled = true;
    }
    return (
      <Col span={24}>
        <Row {...rowLayOut}>
          <Col {...colLayOut}>
            <Form.Item
              label={formatMessage({ id: 'COMPANY_NAME' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('companyName', {
                initialValue: companyInfo.companyName || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  {
                    pattern: /^[^\u4e00-\u9fa5]+$/g,
                    message: formatMessage({ id: 'INPUT_ONLY_ENGLISH' }),
                  },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('companyName', e.target.value, 'companyName')}
                  onPressEnter={e => onHandleChange('companyName', e.target.value, 'companyName')}
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...colLayOut}>
            <Form.Item
              label={formatMessage({ id: 'UEN_BUSINESS_REGISTRATION_NUMBER' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('registrationNo', {
                initialValue: companyInfo.registrationNo || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                  { validator: this.compareToRegistrationNo },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'UEN_BUSINESS_REGISTRATION_NUMBER' })}
                  onChange={e => onHandleChange('registrationNo', e.target.value, 'registrationNo')}
                  onPressEnter={e =>
                    onHandleChange('registrationNo', e.target.value, 'registrationNo')
                  }
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...colLayOut}>
            <Form.Item
              label={formatMessage({ id: 'ORGANISATION_ROLE' })}
              colon={false}
              {...formItemRowLayout}
            >
              {getFieldDecorator('organizationRole', {
                initialValue: companyInfo.organizationRole,
                rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
              })(
                <Select
                  showSearch
                  onChange={value => onHandleChange('organizationRole', value, 'organizationRole')}
                  disabled={isRoleDisabled}
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                >
                  {organizationRoleList &&
                    organizationRoleList.length > 0 &&
                    organizationRoleList.map(item => (
                      <Select.Option key={`roleList${item.dictId}`} value={`${item.dictId}`}>
                        {item.dictName}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...colLayOut}>
            <Form.Item
              label={formatMessage({ id: 'COUNTRY_AND_CITY_STATE' })}
              colon={false}
              {...formItemLayout}
              className={styles.countryAndCityItem}
            >
              <Input.Group compact>
                <Form.Item colon={false} className={styles.countryItem}>
                  {getFieldDecorator('country', {
                    initialValue: companyInfo.country || [],
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <SortSelect
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="label"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value => onHandleChange('country', value, 'country')}
                      disabled={isAllDisabled}
                      options={
                        countryList && countryList.length > 0
                          ? countryList.map(item => (
                            <Select.Option
                              key={`countryList${item.dictId}`}
                              value={`${item.dictId}`}
                              label={item.dictName}
                            >
                              <Tooltip
                                placement="topLeft"
                                title={
                                  <span style={{ whiteSpace: 'pre-wrap' }}>{item.dictName}</span>
                                }
                              >
                                {item.dictName}
                              </Tooltip>
                            </Select.Option>
                          ))
                          : null
                      }
                    />
                  )}
                </Form.Item>
                <Form.Item colon={false} className={styles.cityItem}>
                  {getFieldDecorator('city', {
                    initialValue: !isNvl(companyInfo.city) ? companyInfo.city : [],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'REQUIRED' }),
                      },
                    ],
                  })(
                    <SortSelect
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="label"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value => onHandleChange('city', value, 'city')}
                      loading={cityLoadingFlag}
                      disabled={isAllDisabled}
                      options={
                        cityList && cityList.length > 0
                          ? cityList.map(item => (
                            <Select.Option
                              key={`cityList${item.dictId}`}
                              value={`${item.dictId}`}
                              label={item.dictName}
                            >
                              <Tooltip
                                placement="topLeft"
                                title={
                                  <span style={{ whiteSpace: 'pre-wrap' }}>{item.dictName}</span>
                                }
                              >
                                {item.dictName}
                              </Tooltip>
                            </Select.Option>
                          ))
                          : null
                      }
                    />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col {...colLayOut}>
            <Form.Item
              label={formatMessage({ id: 'ZIP_POSTAL_CODE' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('postalCode', {
                initialValue: companyInfo.postalCode || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('postalCode', e.target.value, 'postalCode')}
                  onPressEnter={e => onHandleChange('postalCode', e.target.value, 'postalCode')}
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...colLayOut}>
            <Form.Item
              label={formatMessage({ id: 'COMPANY_ADDRESS' })}
              colon={false}
              {...formItemRowLayout}
            >
              {getFieldDecorator('address', {
                initialValue: companyInfo.address || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('address', e.target.value, 'address')}
                  onPressEnter={e => onHandleChange('address', e.target.value, 'address')}
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...colLayOut}>
            <Form.Item
              label={formatMessage({ id: 'DATE_OF_INCORPORATION' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('incorporationDate', {
                initialValue: !isNvl(companyInfo.incorporationDate)
                  ? moment(companyInfo.incorporationDate, 'YYYY-MM-DD')
                  : null,
                rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
              })(
                <FriendlyDatePicker
                  onChange={date =>
                    onHandleChange(
                      'incorporationDate',
                      isNvl(date) ? date : date.format('YYYY-MM-DD'),
                      'incorporationDate'
                    )
                  }
                  disabledDate={value => value.valueOf() > moment().valueOf()}
                  getCalendarContainer={() => document.getElementById(`${viewId}`)}
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  style={{ width: '100%' }}
                  disabled={isAllDisabled}
                  displayFormat="DD/MM/YYYY"
                  searchFormat="DDMMYYYY"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...colLayOut}>
            <Form.Item
              label={this.getTravelAgentNoLabel(companyInfo.country)}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('travelAgentNo', {
                initialValue: companyInfo.travelAgentNo || null,
                rules: this.getTravelAgentNoRules(companyInfo.country),
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('travelAgentNo', e.target.value, 'travelAgentNo')}
                  onPressEnter={e =>
                    onHandleChange('travelAgentNo', e.target.value, 'travelAgentNo')
                  }
                  disabled={isAllDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...colLayOut}>
            <Form.Item
              label={formatMessage({ id: 'GST_REG_YES_OR_NO' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('isGstRegIndicator', {
                initialValue: companyInfo.isGstRegIndicator || null,
                rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
              })(
                <Radio.Group
                  onChange={e =>
                    onHandleChange('isGstRegIndicator', e.target.value, 'isGstRegIndicator')
                  }
                  disabled={editCondition && String(companyInfo.country).toUpperCase() !== '65'}
                >
                  <Radio value="1">{formatMessage({ id: 'GST_REG_YES' })}</Radio>
                  <Radio value="0">{formatMessage({ id: 'GST_REG_NOT' })}</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          {!isNvl(companyInfo.isGstRegIndicator) ? (
            <Col {...colLayOut}>
              <Form.Item
                label={formatMessage({ id: 'GST_REG_NO' })}
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('gstRegNo', {
                  initialValue: companyInfo.gstRegNo || null,
                  rules: this.getGstRegNoRules(companyInfo.isGstRegIndicator),
                })(
                  <Input
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={e => onHandleChange('gstRegNo', e.target.value, 'gstRegNo')}
                    onPressEnter={e => onHandleChange('gstRegNo', e.target.value, 'gstRegNo')}
                    disabled={String(companyInfo.isGstRegIndicator) !== '1' || (editCondition && String(companyInfo.country).toUpperCase() !== '65')}
                    suffix={
                      <Tooltip
                        title={formatMessage({ id: 'APPLICATION_TO_SINGAPORE' })}
                        placement="topRight"
                      >
                        <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                  />
                )}
              </Form.Item>
            </Col>
          ) : (
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
                &nbsp;
              </Col>
            )}
          {!isNvl(companyInfo.isGstRegIndicator) ? (
            <Col {...colLayOut}>
              <Form.Item
                label={formatMessage({ id: 'GST_EFFECTIVE_DATE' })}
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('gstEffectiveDate', {
                  initialValue: !isNvl(companyInfo.gstEffectiveDate)
                    ? moment(
                      companyInfo.gstEffectiveDate,
                      companyInfo.gstEffectiveDate.includes('-') ? 'YYYY-MM-DD' : 'DD/MM/YYYY'
                    )
                    : null,
                  rules: this.getGstRegNoRules(companyInfo.isGstRegIndicator),
                })(
                  <FriendlyDatePicker
                    onChange={date =>
                      onHandleChange(
                        'gstEffectiveDate',
                        isNvl(date) ? date : date.format('YYYY-MM-DD'),
                        'gstEffectiveDate'
                      )
                    }
                    getCalendarContainer={() => document.getElementById(`${viewId}`)}
                    placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                    style={{ width: '100%' }}
                    disabled={String(companyInfo.isGstRegIndicator) !== '1' || (editCondition && String(companyInfo.country).toUpperCase() !== '65')}
                    displayFormat="DD/MM/YYYY"
                    searchFormat="DDMMYYYY"
                  />
                )}
              </Form.Item>
            </Col>
          ) : (
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
                &nbsp;
              </Col>
            )}
          {isSaleSupportRoleFlag || isAccountingArRoleFlag ? (
            <Col {...colLayOut}>
              <Form.Item
                label={formatMessage({ id: 'CATEGORY_AND_CUSTOMER_GROUP' })}
                colon={false}
                {...formItemLayout}
              >
                <Input.Group compact>
                  {getFieldDecorator('category', {
                    initialValue: companyInfo.category || [],
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <SortSelect
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="children"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value => onHandleChange('category', value, 'category')}
                      style={{ width: '50%', marginTop: '4px' }}
                      disabled={isAllDisabled}
                      options={
                        categoryList && categoryList.length > 0
                          ? categoryList.map(item => (
                            <Select.Option
                              key={`categoryList${item.dictId}`}
                              value={`${item.dictId}`}
                            >
                              {item.dictName}
                            </Select.Option>
                          ))
                          : null
                      }
                    />
                  )}
                  {getFieldDecorator('customerGroup', {
                    initialValue: !isNvl(companyInfo.customerGroup)
                      ? companyInfo.customerGroup
                      : [],
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <SortSelect
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="children"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value => onHandleChange('customerGroup', value, 'customerGroup')}
                      style={{ width: '50%', marginTop: '4px' }}
                      loading={customerGroupLoadingFlag}
                      disabled={isAllDisabled}
                      options={
                        customerGroupList && customerGroupList.length > 0
                          ? customerGroupList.map(item => (
                            <Select.Option
                              key={`customerGroupList${item.dictId}`}
                              value={`${item.dictId}`}
                            >
                              {item.dictName}
                            </Select.Option>
                          ))
                          : null
                      }
                    />
                  )}
                </Input.Group>
              </Form.Item>
            </Col>
          ) : (
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
                &nbsp;
              </Col>
            )}
        </Row>
      </Col>
    );
  }
}

export default CompanyInformationToFrom;
