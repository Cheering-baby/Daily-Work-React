import React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  InputNumber,
  message,
  Checkbox,
  Radio,
} from 'antd';
import { formatMessage } from 'umi/locale';
import classNames from 'classnames';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import detailStyles from './MappingDetail.less';
import { commonConfirm } from '@/components/CommonModal';
import {
  AR_ACCOUNT_PRIVILEGE,
  hasAllPrivilege,
  SALES_SUPPORT_PRIVILEGE,
} from '@/utils/PrivilegeUtil';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 14,
  },
};

const ColProps = {
  xs: 8,
  sm: 8,
  md: 12,
  xl: 12,
};

@Form.create()
@connect(({ mappingDetails, mapping }) => ({
  mappingDetails,
  mapping,
}))
class MappingDetailList extends React.PureComponent {
  async componentDidMount() {
    const { dispatch, taId } = this.props;
    await dispatch({
      type: 'mappingDetails/queryMappingDetail',
      payload: {
        taId,
      },
    });
    await dispatch({
      type: 'mappingDetails/querySalePerson',
      payload: {
        taId,
      },
    });
    await dispatch({
      type: 'mappingDetails/fetchqueryDictionary',
    });
  }

  cancel = () => {
    router.push({
      pathname: '/TAManagement/Mapping',
    });
  };

  handleInitVal = key => {
    const {
      mappingDetails: { queryMappingInfo },
      mapping: { type },
    } = this.props;
    if (type === 'edit' && queryMappingInfo && Object.keys(queryMappingInfo).length > 0) {
      let val = queryMappingInfo[key];
      if (key === 'salesManager') {
        val = typeof val === 'string' ? val.split(',').filter(_ => _) : [];
      } else if (key === 'arAccountCommencementDate') {
        val = val ? moment(val) : '';
      } else if (key === 'arAccountEndDate') {
        val = val ? moment(val) : '';
      } else if (key === 'guaranteeExpiryDate') {
        val = val ? moment(val) : '';
      } else if (key === 'productName') {
        val = typeof val === 'string' ? val.split(',').filter(_ => _) : [];
      }
      return val;
    }
  };

  jumpToMapping = () => {
    router.push({
      pathname: '/TAManagement/Mapping',
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      mapping: { type },
      taId,
    } = this.props;
    const resCb = response => {
      this.jumpToMapping();
      if (response === 'SUCCESS') {
        message.success(type === 'edit' ? 'Modified successfully.' : 'Mapping successfully.');
      } else if (response === 'ERROR') {
        message.error(type === 'edit' ? 'Failed to modify.' : 'Failed to mapping.');
      }
    };
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      commonConfirm({
        content: `Confirm to ${type === 'edit' ? 'Modify' : 'Mapping'} ?`,
        onOk: () => {
          Object.keys(values).forEach(k => {
            const value = values[k];
            if (k === 'arAccountCommencementDate' && value) {
              values[k] = value ? value.format('YYYY-MM-DD') : '';
            } else if (k === 'arAccountEndDate' && value) {
              values[k] = value ? value.format('YYYY-MM-DD') : '';
            } else if (k === 'salesManager' && Array.isArray(value)) {
              values[k] = value.join();
            } else if (k === 'product' && Array.isArray(value)) {
              values[k] = value.join();
            } else if (k === 'guaranteeExpiryDate' && value) {
              values[k] = value ? value.format('YYYY-MM-DD') : '';
            } else if (k === 'guaranteeAmount' && value) {
              values[k] = value;
            }
          });
          if (type === 'edit') {
            dispatch({
              type: 'mappingDetails/editMappingList',
              payload: {
                params: values,
                taId,
              },
            }).then(resCb);
          } else {
            dispatch({
              type: 'mappingDetails/addMappingList',
              payload: {
                params: values,
                taId,
              },
            }).then(resCb);
          }
        },
      });
    });
  };

  changeArAccountDate = (date, dateString) => {
    const {
      form,
      mappingDetails: { time },
    } = this.props;
    time.forEach(item => {
      form.resetFields({ arAccountCommencementDate: date });
      if (date) {
        form.setFieldsValue({ arAccountEndDate: moment(dateString).add(item.dictName, 'months') });
      }
    });
  };

  render() {
    const {
      companyName,
      arAllowed,
      form: { getFieldDecorator },
      mappingDetails: { userProfiles },
    } = this.props;
    const isAccountingArRoleFlag = hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]);
    const isSaleSupportRoleFlag = hasAllPrivilege([SALES_SUPPORT_PRIVILEGE]);
    return (
      <Col lg={24} md={24}>
        <div className="has-shadow no-border">
          <div className={classNames(detailStyles.searchDiv, 'has-shadow', 'no-border')}>
            <Form onSubmit={this.handleSubmit}>
              <div className={detailStyles.titleHeader}>
                <span>{formatMessage({ id: 'MAPPING' })}</span>
              </div>
              <Row gutter={24}>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_MAIN_TA_PROFILE' })}
                  >
                    {getFieldDecorator('idOrName', {
                      initialValue: companyName || '',
                    })(<Input placeholder={formatMessage({ id: 'PLEASE_ENTER' })} disabled />)}
                  </FormItem>
                </Col>
                <Col span={24}> </Col>
              </Row>
              <div className={detailStyles.DetailTitle}>
                <span>{formatMessage({ id: 'BY_SALES_SUPPORT' })}</span>
              </div>
              <Row gutter={24}>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_OPERA_EWALLET' })}
                  >
                    {getFieldDecorator('operaEwallet', {
                      initialValue: this.handleInitVal('operaEwallet'),
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isSaleSupportRoleFlag !== true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_OPERA_AR_CREDIT' })}
                  >
                    {getFieldDecorator('operaArCredit', {
                      initialValue: this.handleInitVal('operaArCredit'),
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isSaleSupportRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_GALAXY_EWALLET' })}
                  >
                    {getFieldDecorator('galaxyEwallet', {
                      initialValue: this.handleInitVal('galaxyEwallet'),
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isSaleSupportRoleFlag !== true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_GALAXY_CREDIT' })}
                  >
                    {getFieldDecorator('galaxyArCredit', {
                      initialValue: this.handleInitVal('galaxyArCredit'),
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isSaleSupportRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_SALES_MANAGER' })}
                  >
                    {getFieldDecorator('salesManager', {
                      initialValue: this.handleInitVal('salesManager'),
                    })(
                      <Select
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        disabled={isSaleSupportRoleFlag !== true}
                      >
                        {userProfiles.map(user => (
                          <Option key={`option_${user.id}`} value={user.userCode}>
                            {user.userCode}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem {...formItemLayout} label={formatMessage({ id: 'MAPPING_PRODUCT' })}>
                    {getFieldDecorator('product', {
                      initialValue: this.handleInitVal('productName'),
                    })(
                      <Checkbox.Group disabled={isSaleSupportRoleFlag !== true}>
                        <Checkbox value="attractions">Attractions</Checkbox>
                        <Checkbox value="hotel">Hotel</Checkbox>
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <div className={detailStyles.DetailTitle}>
                <span>{formatMessage({ id: 'BY_ACCOUNTING_AR' })}</span>
              </div>
              <Row gutter={24}>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_PEOPLESOFR_EWALLET_ID' })}
                  >
                    {getFieldDecorator('peoplesoftEwalletId', {
                      initialValue: this.handleInitVal('peoplesoftEwalletId'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true,
                          msg: 'Required',
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_PEOPLESOFR_AR_ACCOUNT_ID' })}
                  >
                    {getFieldDecorator('peoplesoftArAccountId', {
                      initialValue: this.handleInitVal('peoplesoftArAccountId'),
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_CREDIT_TERM' })}
                  >
                    {getFieldDecorator('creditTerm', {
                      initialValue: this.handleInitVal('creditTerm'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true || arAllowed === true,
                          msg: 'Required',
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_CREDIT_LIMIT' })}
                  >
                    {getFieldDecorator('creditLimit', {
                      initialValue: this.handleInitVal('creditLimit'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true || arAllowed === true,
                          msg: 'Required',
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_EWALLET_FIXED_THRESHOLD' })}
                  >
                    {getFieldDecorator('ewalletFixedThreshold', {
                      initialValue: this.handleInitVal('ewalletFixedThreshold'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true,
                          msg: 'Required',
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_AR_FIXED_THRESHOLD' })}
                  >
                    {getFieldDecorator('arFixedThreshold', {
                      initialValue: this.handleInitVal('arFixedThreshold'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true || arAllowed === true,
                          msg: 'Required',
                        },
                      ],
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_ACCOUNT_COMMENCEMENT_DATE' })}
                  >
                    {getFieldDecorator('arAccountCommencementDate', {
                      initialValue: this.handleInitVal('arAccountCommencementDate'),
                    })(
                      <DatePicker
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        style={{ width: '100%' }}
                        onChange={this.changeArAccountDate}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_AR_ACCOUNT_END_DATE' })}
                  >
                    {getFieldDecorator('arAccountEndDate', {
                      initialValue: this.handleInitVal('arAccountEndDate'),
                    })(
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_SECURITY_DEPOSIT_AMOUNT' })}
                  >
                    {getFieldDecorator('securityDepositAmount', {
                      initialValue: this.handleInitVal('securityDepositAmount'),
                    })(
                      <InputNumber
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{ width: '100%' }}
                        parser={value => {
                          value = value.replace(/[^\d]/g, '');
                          return value;
                        }}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_AMOUNT' })}
                  >
                    {getFieldDecorator('guaranteeAmount', {
                      initialValue: this.handleInitVal('guaranteeAmount'),
                    })(
                      <InputNumber
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{ width: '100%' }}
                        parser={value => {
                          value = value.replace(/[^\d]/g, '');
                          return value;
                        }}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_EXPIRY_DATE' })}
                  >
                    {getFieldDecorator('guaranteeExpiryDate', {
                      initialValue: this.handleInitVal('guaranteeExpiryDate'),
                    })(
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem {...formItemLayout} label={formatMessage({ id: 'MAPPING_CURRENCY' })}>
                    {getFieldDecorator('currency', {
                      initialValue: this.handleInitVal('currency'),
                    })(
                      <Radio.Group>
                        <Radio
                          value="SGD"
                          disabled={isAccountingArRoleFlag !== true || arAllowed === false}
                        >
                          SGD
                        </Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <div className={detailStyles.cancelOk}>
                    <Button className={detailStyles.cancel} onClick={this.cancel}>
                      Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" className={detailStyles.ok}>
                      OK
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Col>
    );
  }
}

export default MappingDetailList;
