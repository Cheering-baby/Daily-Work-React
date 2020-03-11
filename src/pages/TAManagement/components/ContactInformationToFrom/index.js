import React, { PureComponent } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

class ContactInformationToFrom extends PureComponent {
  render() {
    const {
      form,
      formItemLayout,
      viewId,
      isAccountingArRoleFlag,
      salutationList = [],
      countryList = [],
      customerInfo = {},
      onHandleChange,
    } = this.props;
    const { getFieldDecorator } = form;
    const { contactInfo = {} } = customerInfo || {};
    const numFormat = formatMessage({ id: 'INPUT_MAX_NUM' });
    let isDisabled = false;
    if (isAccountingArRoleFlag) {
      isDisabled = true;
    }
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'CONTACT_PERSON_SALUTATION' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('salutation', {
                initialValue: contactInfo.salutation || [],
                rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
              })(
                <Select
                  showSearch
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  optionFilterProp="children"
                  getPopupContainer={() => document.getElementById(`${viewId}`)}
                  onChange={value => onHandleChange('salutation', value, 'salutation')}
                  disabled={isDisabled}
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
              label={formatMessage({ id: 'CONTACT_PERSON_FIRST_NAME' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('firstName', {
                initialValue: contactInfo.firstName || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('firstName', e.target.value, 'firstName')}
                  onPressEnter={e => onHandleChange('firstName', e.target.value, 'firstName')}
                  disabled={isDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'CONTACT_PERSON_LAST_NAME' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('lastName', {
                initialValue: contactInfo.lastName || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('lastName', e.target.value, 'lastName')}
                  onPressEnter={e => onHandleChange('lastName', e.target.value, 'lastName')}
                  disabled={isDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'CHIEF_EXECUTIVE_DIRECTOR_NAME' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('chiefExecutiveName', {
                initialValue: contactInfo.chiefExecutiveName || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange('chiefExecutiveName', e.target.value, 'chiefExecutiveName')
                  }
                  onPressEnter={e =>
                    onHandleChange('chiefExecutiveName', e.target.value, 'chiefExecutiveName')
                  }
                  disabled={isDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label={formatMessage({ id: 'EMAIL' })} colon={false} {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: contactInfo.email || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { type: 'email', message: formatMessage({ id: 'INPUT_EMAIL' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('email', e.target.value, 'email')}
                  onPressEnter={e => onHandleChange('email', e.target.value, 'email')}
                  disabled={isDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'TEL' })}
              colon={false}
              {...formItemLayout}
              className={styles.telItem}
            >
              <Input.Group compact>
                <Form.Item colon={false} className={styles.phoneCountryItem}>
                  {getFieldDecorator('phoneCountry', {
                    initialValue: contactInfo.country || [],
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      optionFilterProp="children"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      onChange={value => onHandleChange('country', value, 'phoneCountry')}
                      disabled={isDisabled}
                    >
                      {countryList && countryList.length > 0
                        ? countryList.map(item => (
                          <Select.Option
                            key={`countryPhoneList${item.dictId}`}
                            value={`${item.dictId}`}
                          >
                            {`${item.dictName} +${item.dictId}`}
                          </Select.Option>
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item colon={false} className={styles.contactPhoneItem}>
                  {getFieldDecorator('contactPhone', {
                    initialValue: contactInfo.phone || null,
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e => onHandleChange('phone', e.target.value, 'contactPhone')}
                      onPressEnter={e => onHandleChange('phone', e.target.value, 'contactPhone')}
                      disabled={isDisabled}
                    />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
            &nbsp;
          </Col>
        </Row>
      </Col>
    );
  }
}

export default ContactInformationToFrom;
