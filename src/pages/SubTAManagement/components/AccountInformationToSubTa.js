import React, { PureComponent } from 'react';
import { Card, Col, Form, Input, Row, Select, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { colLayOut, rowLayOut } from '../utils/pubUtils';
import SortSelect from '@/components/SortSelect';
import styles from './SubTaInfoCommon.less';

const addressLayOut = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  xxl: 24,
  style: {
    height: '75px',
  },
};

@Form.create()
class AccountInformationToSubTa extends PureComponent {
  render() {
    const {
      form,
      subTaInfo = {},
      countryList = [],
      phoneCountryList = [],
      mobileCountryList = [],
      onHandleChange,
      viewId,
      hasSubTaWithEmail,
    } = this.props;
    const { getFieldDecorator } = form;
    const numFormat = formatMessage({ id: 'SUB_TA_INPUT_MAX_NUM' });
    let isDisabled = false;
    if (hasSubTaWithEmail) {
      isDisabled = true;
    }
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card title={formatMessage({ id: 'SUB_TA_ACCOUNT_INFORMATION' })}>
              <Row {...rowLayOut}>
                <Col {...colLayOut}>
                  <Form.Item label={formatMessage({ id: 'SUB_TA_MAIN_TA_NAME' })}>
                    {getFieldDecorator('mainCompanyName', {
                      initialValue: subTaInfo.mainCompanyName || null,
                      rules: [
                        { required: true, message: formatMessage({ id: 'SUB_TA_REQUIRED' }) },
                      ],
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'SUB_TA_PLEASE_ENTER' })}
                        onChange={e =>
                          onHandleChange('mainCompanyName', e.target.value, 'mainCompanyName')
                        }
                        onPressEnter={e =>
                          onHandleChange('mainCompanyName', e.target.value, 'mainCompanyName')
                        }
                        disabled
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row {...rowLayOut}>
                <Col {...colLayOut}>
                  <Form.Item label={formatMessage({ id: 'SUB_TA_FULL_NAME' })}>
                    {getFieldDecorator('fullName', {
                      initialValue: subTaInfo.fullName || null,
                      rules: [
                        { required: true, message: formatMessage({ id: 'SUB_TA_REQUIRED' }) },
                        { max: 200, message: numFormat },
                      ],
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'SUB_TA_PLEASE_ENTER' })}
                        onChange={e => onHandleChange('fullName', e.target.value, 'fullName')}
                        onPressEnter={e => onHandleChange('fullName', e.target.value, 'fullName')}
                        disabled={isDisabled}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...colLayOut}>
                  <Form.Item label={formatMessage({ id: 'SUB_TA_EMAIL' })}>
                    {getFieldDecorator('email', {
                      initialValue: subTaInfo.email || null,
                      rules: [
                        { required: true, message: formatMessage({ id: 'SUB_TA_REQUIRED' }) },
                        { type: 'email', message: formatMessage({ id: 'SUB_TA_INPUT_EMAIL' }) },
                        { max: 200, message: numFormat },
                      ],
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        onChange={e => onHandleChange('email', e.target.value, 'email')}
                        onPressEnter={e => onHandleChange('email', e.target.value, 'email')}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...colLayOut}>
                  <Form.Item label={formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}>
                    {getFieldDecorator('companyName', {
                      initialValue: subTaInfo.companyName || null,
                      rules: [
                        { required: true, message: formatMessage({ id: 'SUB_TA_REQUIRED' }) },
                        {
                          pattern: /^[^\u4e00-\u9fa5]+$/g,
                          message: formatMessage({ id: 'INPUT_ONLY_ENGLISH' }),
                        },
                        { max: 200, message: numFormat },
                      ],
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'SUB_TA_PLEASE_ENTER' })}
                        onChange={e => onHandleChange('companyName', e.target.value, 'companyName')}
                        onPressEnter={e =>
                          onHandleChange('companyName', e.target.value, 'companyName')
                        }
                        disabled={isDisabled}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...colLayOut}>
                  <Form.Item label={formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}>
                    {getFieldDecorator('country', {
                      initialValue: subTaInfo.country || [],
                      rules: [
                        { required: true, message: formatMessage({ id: 'SUB_TA_REQUIRED' }) },
                      ],
                    })(
                      <Select
                        showSearch
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        optionFilterProp="children"
                        getPopupContainer={() => document.getElementById(`${viewId}`)}
                        onChange={value => onHandleChange('country', value, 'country')}
                        style={{ width: '100%' }}
                        disabled={isDisabled}
                      >
                        {countryList && countryList.length > 0
                          ? countryList.map(item => (
                            <Select.Option
                              key={`countryList${item.dictId}`}
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
                <Col {...colLayOut}>
                  <Form.Item
                    label={formatMessage({ id: 'SUB_TA_TEL' })}
                    colon={false}
                    className={styles.telItem}
                  >
                    <Input.Group compact>
                      <Form.Item colon={false} style={{ width: '35%' }}>
                        {getFieldDecorator('phoneCountry', {
                          initialValue: subTaInfo.phoneCountry || [],
                          rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                        })(
                          <SortSelect
                            showSearch
                            placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                            optionFilterProp="label"
                            getPopupContainer={() => document.getElementById(`${viewId}`)}
                            onChange={value =>
                              onHandleChange('phoneCountry', value, 'phoneCountry')
                            }
                            disabled={isDisabled}
                            options={
                              phoneCountryList && phoneCountryList.length > 0
                                ? phoneCountryList.map(item => (
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
                                  ))
                                : null
                            }
                          />
                        )}
                      </Form.Item>
                      <Form.Item colon={false} style={{ width: '65%' }}>
                        {getFieldDecorator('phone', {
                          initialValue: subTaInfo.phone || null,
                          rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                        })(
                          <Input
                            placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                            onChange={e => onHandleChange('phone', e.target.value, 'phone')}
                            onPressEnter={e => onHandleChange('phone', e.target.value, 'phone')}
                            disabled={isDisabled}
                          />
                        )}
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col {...colLayOut}>
                  <Form.Item
                    label={formatMessage({ id: 'SUB_TA_MOBILE_NO' })}
                    colon={false}
                    className={styles.telItem}
                  >
                    <Input.Group compact>
                      <Form.Item colon={false} style={{ width: '35%' }}>
                        {getFieldDecorator('mobileCountry', {
                          initialValue: subTaInfo.mobileCountry || [],
                          rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                        })(
                          <SortSelect
                            showSearch
                            placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                            optionFilterProp="label"
                            getPopupContainer={() => document.getElementById(`${viewId}`)}
                            onChange={value =>
                              onHandleChange('mobileCountry', value, 'mobileCountry')
                            }
                            disabled={isDisabled}
                            options={
                              mobileCountryList && mobileCountryList.length > 0
                                ? mobileCountryList.map(item => (
                                  <Select.Option
                                    key={`mobileCountryList${item.dictId}`}
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
                                : null
                            }
                          />
                        )}
                      </Form.Item>
                      <Form.Item colon={false} style={{ width: '65%' }}>
                        {getFieldDecorator('mobileNumber', {
                          initialValue: subTaInfo.mobileNumber || null,
                          rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                        })(
                          <Input
                            placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                            onChange={e =>
                              onHandleChange('mobileNumber', e.target.value, 'mobileNumber')
                            }
                            onPressEnter={e =>
                              onHandleChange('mobileNumber', e.target.value, 'mobileNumber')
                            }
                            disabled={isDisabled}
                          />
                        )}
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col {...addressLayOut}>
                  <Form.Item label={formatMessage({ id: 'SUB_TA_COMPANY_ADDRESS' })}>
                    {getFieldDecorator('address', {
                      initialValue: subTaInfo.address || null,
                      rules: [
                        { required: true, message: formatMessage({ id: 'SUB_TA_REQUIRED' }) },
                        { max: 200, message: numFormat },
                      ],
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'SUB_TA_PLEASE_ENTER' })}
                        onChange={e => onHandleChange('address', e.target.value, 'address')}
                        onPressEnter={e => onHandleChange('address', e.target.value, 'address')}
                        disabled={isDisabled}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default AccountInformationToSubTa;
