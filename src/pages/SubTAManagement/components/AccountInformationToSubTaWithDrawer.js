import React, { PureComponent } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import SortSelect from '@/components/SortSelect';
import {isNvl} from "@/utils/utils";

@Form.create()
class AccountInformationToSubTaWithDrawer extends PureComponent {
  render() {
    const {
      form,
      subTaInfo = {},
      countryList = [],
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
                  {!isNvl(subTaInfo.relativeTaList) && subTaInfo.relativeTaList.length > 0 &&
                  subTaInfo.relativeTaList.map(name => {
                    return(
                      <Input
                        placeholder={formatMessage({ id: 'SUB_TA_PLEASE_ENTER' })}
                        value={!isNvl(name) ? name.mainCompanyName : null}
                        disabled
                      />
                    );
                  })
                  }
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
