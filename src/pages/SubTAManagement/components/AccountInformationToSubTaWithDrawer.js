import React, { PureComponent } from 'react';
import { Col, Form, Input, Row, Select, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import SortSelect from '@/components/SortSelect';
import { isNvl } from '@/utils/utils';
import styles from './SubTaInfoCommon.less';

@Form.create()
class AccountInformationToSubTaWithDrawer extends PureComponent {
  render() {
    const {
      form,
      subTaInfo = {},
      countryList = [],
      phoneCountryList = [],
      mobileCountryList = [],
      onHandleChange,
      detailOpt,
      viewId,
    } = this.props;
    const { getFieldDecorator } = form;
    const numFormat = formatMessage({ id: 'SUB_TA_INPUT_MAX_NUM' });
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'SUB_TA_MAIN_TA_NAME' })}
              colon={false}
              {...detailOpt.formItemLayout}
            >
              {getFieldDecorator('mainCompanyName', {
                initialValue: subTaInfo.relativeTaList || [],
                rules: [{ required: true, message: formatMessage({ id: 'SUB_TA_REQUIRED' }) }],
              })(
                <div>
                  {!isNvl(subTaInfo.relativeTaList) &&
                    subTaInfo.relativeTaList.length > 0 &&
                    subTaInfo.relativeTaList.map(name => {
                      return (
                        <Input
                          placeholder={formatMessage({ id: 'SUB_TA_PLEASE_ENTER' })}
                          value={!isNvl(name) ? name.mainCompanyName : null}
                          disabled
                        />
                      );
                    })}
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'SUB_TA_FULL_NAME' })}
              colon={false}
              {...detailOpt.formItemLayout}
            >
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
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'SUB_TA_EMAIL' })}
              colon={false}
              {...detailOpt.formItemLayout}
            >
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
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}
              colon={false}
              {...detailOpt.formItemLayout}
            >
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
                  onPressEnter={e => onHandleChange('companyName', e.target.value, 'companyName')}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}
              colon={false}
              {...detailOpt.formItemLayout}
            >
              {getFieldDecorator('country', {
                initialValue: subTaInfo.country || [],
                rules: [{ required: true, message: formatMessage({ id: 'SUB_TA_REQUIRED' }) }],
              })(
                <SortSelect
                  showSearch
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  optionFilterProp="children"
                  getPopupContainer={() => document.getElementById(`${viewId}`)}
                  onChange={value => onHandleChange('country', value, 'country')}
                  style={{ width: '100%' }}
                  options={
                    countryList && countryList.length > 0
                      ? countryList.map(item => (
                        <Select.Option key={`countryList${item.dictId}`} value={`${item.dictId}`}>
                          {item.dictName}
                        </Select.Option>
                        ))
                      : null
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: '8px' }}>
            <Form.Item
              label={formatMessage({ id: 'SUB_TA_TEL' })}
              colon={false}
              className={styles.telItem}
              {...detailOpt.formItemLayout}
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
                      onChange={value => onHandleChange('phoneCountry', value, 'phoneCountry')}
                      style={{ width: '100%' }}
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
                    />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: '8px' }}>
            <Form.Item
              label={formatMessage({ id: 'SUB_TA_MOBILE_NO' })}
              colon={false}
              className={styles.telItem}
              {...detailOpt.formItemLayout}
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
                      onChange={value => onHandleChange('mobileCountry', value, 'mobileCountry')}
                      style={{ width: '100%' }}
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
                      onChange={e => onHandleChange('mobileNumber', e.target.value, 'mobileNumber')}
                      onPressEnter={e =>
                        onHandleChange('mobileNumber', e.target.value, 'mobileNumber')
                      }
                    />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'SUB_TA_COMPANY_ADDRESS' })}
              colon={false}
              {...detailOpt.formItemRowLayout}
            >
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
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default AccountInformationToSubTaWithDrawer;
