import React from 'react';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from 'antd';
import { formatMessage } from 'umi/locale';
import classNames from 'classnames';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import detailStyles from './MappingDetail.less';
import { colLayOut, rowLayOut, getFormLayout } from '../../utils/pubUtils';
import { commonConfirm } from '@/components/CommonModal';
import {
  AR_ACCOUNT_PRIVILEGE,
  hasAllPrivilege,
  SALES_SUPPORT_PRIVILEGE,
} from '@/utils/PrivilegeUtil';

const detailOpt = getFormLayout();
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
    await dispatch({
      type: 'mappingDetails/fetchQueryLintNum',
    });
    await dispatch({
      type: 'mappingDetails/fetchQueryCreateTeam',
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
    } = this.props;
    if (queryMappingInfo && Object.keys(queryMappingInfo).length > 0) {
      let val = queryMappingInfo[key];
      if (key === 'salesManager') {
        val = typeof val === 'string' ? val.split(',').filter(_ => _) : [];
      } else if (key === 'arAccountCommencementDate') {
        val = val ? moment(val) : '';
      } else if (key === 'arAccountEndDate') {
        val = val ? moment(val) : '';
      } else if (key === 'guaranteeExpiryDate') {
        val = val ? moment(val) : '';
      } else if (
        key === 'creditLimit' ||
        key === 'ewalletFixedThreshold' ||
        key === 'arFixedThreshold'
      ) {
        val = val ? Number(val) : '';
        val = isNaN(val) ? '' : val;
      } else if (key === 'productName') {
        val = typeof val === 'string' ? val.split(',').filter(_ => _) : [];
        // val = val ? JSON.stringify(val) : {}
        const toStr = {
          hotel: '01',
          attractions: '02',
        };
        val = val.map(element => {
          const a = element;
          element = toStr[a] ? toStr[a] : element;
          return element;
        });
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
      if (response === true) {
        this.jumpToMapping();
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
            } else if (k === 'creditTerm' && Array.isArray(value)) {
              values[k] = value.join();
            } else if (k === 'product') {
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
      mappingDetails: { createTeamList, lintNum },
    } = this.props;
    const isAccountingArRoleFlag = hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]);
    const isSaleSupportRoleFlag = hasAllPrivilege([SALES_SUPPORT_PRIVILEGE]);
    const viewId = 'mappingViewId';
    const numFormat = formatMessage({ id: 'LIMIT_TEN' });
    const ruleArr = [{ len: Number(lintNum || '10'), message: numFormat.replace('10', lintNum) }];
    return (
      <Col lg={24} md={24} id={`${viewId}`} className={detailStyles.detailContainer}>
        <div
          className="has-shadow no-border"
          style={{ padding: '15px 24px', backgroundColor: '#fff' }}
        >
          <div>
            <Form onSubmit={this.handleSubmit}>
              <div
                className={detailStyles.titleHeader}
                style={{ padding: '0', marginBottom: '8px' }}
              >
                <span>{formatMessage({ id: 'MAPPING' })}</span>
              </div>
              <Row style={{ marginBottom: '8px' }} gutter={16}>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_MAIN_TA_PROFILE' })}>
                    {getFieldDecorator('idOrName', {
                      initialValue: companyName || '',
                    })(<Input placeholder={formatMessage({ id: 'PLEASE_ENTER' })} disabled />)}
                  </FormItem>
                </Col>
              </Row>
              <div className={detailStyles.DetailTitle}>
                <span>{formatMessage({ id: 'BY_SALES_SUPPORT' })}</span>
              </div>
              <Row gutter={16}>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_OPERA_EWALLET' })}>
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
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_GALAXY_EWALLET' })}>
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
              </Row>
              <Row gutter={16}>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_OPERA_AR_CREDIT' })}>
                    {getFieldDecorator('operaArCredit', {
                      initialValue: this.handleInitVal('operaArCredit'),
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isSaleSupportRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_GALAXY_CREDIT' })}>
                    {getFieldDecorator('galaxyArCredit', {
                      initialValue: this.handleInitVal('galaxyArCredit'),
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isSaleSupportRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_PRODUCT' })}>
                    {getFieldDecorator('product', {
                      initialValue: this.handleInitVal('productName'),
                    })(
                      <Checkbox.Group disabled={isSaleSupportRoleFlag !== true}>
                        <Checkbox value="02">Attractions</Checkbox>
                        <Checkbox value="01">Hotel</Checkbox>
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <div className={detailStyles.DetailTitle}>
                <span>{formatMessage({ id: 'BY_ACCOUNTING_AR' })}</span>
              </div>
              <Row gutter={16}>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_PEOPLESOFR_EWALLET_ID' })}>
                    {getFieldDecorator('peoplesoftEwalletId', {
                      initialValue: this.handleInitVal('peoplesoftEwalletId'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true,
                          message: 'Required',
                        },
                        ...ruleArr,
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
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_EWALLET_FIXED_THRESHOLD' })}>
                    {getFieldDecorator('ewalletFixedThreshold', {
                      initialValue: this.handleInitVal('ewalletFixedThreshold'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true,
                          message: 'Required',
                        },
                      ],
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
                        disabled={isAccountingArRoleFlag !== true}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_PEOPLESOFR_AR_ACCOUNT_ID' })}>
                    {getFieldDecorator('peoplesoftArAccountId', {
                      initialValue: this.handleInitVal('peoplesoftArAccountId'),
                      rules: [...ruleArr],
                    })(
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_AR_FIXED_THRESHOLD' })}>
                    {getFieldDecorator('arFixedThreshold', {
                      initialValue: this.handleInitVal('arFixedThreshold'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true && arAllowed,
                          message: 'Required',
                        },
                      ],
                    })(
                      <InputNumber
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => {
                          value = value.replace(/[^\d]/g, '');
                          return value;
                        }}
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_ACCOUNT_COMMENCEMENT_DATE' })}>
                    {getFieldDecorator('arAccountCommencementDate', {
                      initialValue: this.handleInitVal('arAccountCommencementDate'),
                    })(
                      <DatePicker
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        style={{ width: '100%' }}
                        onChange={this.changeArAccountDate}
                        format="YYYY-MM-DD"
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_AR_ACCOUNT_END_DATE' })}>
                    {getFieldDecorator('arAccountEndDate', {
                      initialValue: this.handleInitVal('arAccountEndDate'),
                    })(
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_CREDIT_TERM' })}>
                    {getFieldDecorator('creditTerm', {
                      initialValue: this.handleInitVal('creditTerm'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true && arAllowed,
                          message: 'Required',
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        optionFilterProp="children"
                        getPopupContainer={() => document.getElementById(`${viewId}`)}
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                      >
                        {createTeamList && createTeamList.length > 0
                          ? createTeamList.map(item => (
                            <Select.Option
                              key={`createTeamList${item.dictId}`}
                              value={`${item.dictId}`}
                            >
                              {item.dictName}
                            </Select.Option>
                            ))
                          : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_CREDIT_LIMIT' })}>
                    {getFieldDecorator('creditLimit', {
                      initialValue: this.handleInitVal('creditLimit'),
                      rules: [
                        {
                          required: isAccountingArRoleFlag === true && arAllowed,
                          message: 'Required',
                        },
                      ],
                    })(
                      <InputNumber
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{ width: '100%' }}
                        parser={value => {
                          value = value.replace(/[^\d]/g, '');
                          return value;
                        }}
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_SECURITY_DEPOSIT_AMOUNT' })}>
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
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_AMOUNT' })}>
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
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_CURRENCY' })}>
                    {getFieldDecorator('currency', {
                      initialValue: this.handleInitVal('currency'),
                    })(
                      <Radio.Group>
                        <Radio value="SGD" disabled={isAccountingArRoleFlag !== true || !arAllowed}>
                          SGD
                        </Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
                <Col {...colLayOut}>
                  <FormItem label={formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_EXPIRY_DATE' })}>
                    {getFieldDecorator('guaranteeExpiryDate', {
                      initialValue: this.handleInitVal('guaranteeExpiryDate'),
                    })(
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        disabled={isAccountingArRoleFlag !== true || !arAllowed}
                        format="YYYY-MM-DD"
                      />
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
