import React from 'react';
import {
  Button,
  Col,
  Form,
  Checkbox,
  Input,
  Row,
  Select,
  DatePicker,
  InputNumber,
  message,
} from 'antd';
import { formatMessage } from 'umi/locale';
import classNames from 'classnames';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import detailStyles from './MappingDetail.less';
import { commonConfirm } from '@/components/CommonModal';

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
        val = moment(val, 'YYYY-MM-DD');
      } else if (key === 'arAccountEndDate') {
        val = moment(val, 'YYYY-MM-DD');
      } else if (key === 'guaranteeExpiryDate') {
        val = moment(val, 'YYYY-MM-DD');
      } else if (key === 'product') {
        val = typeof val === 'string' ? val.split(',').filter(_ => _) : [];
      }
      return val;
    }
  };

  jumpToMapping = () => {
    const {
      mappingDetails: { type },
    } = this.props;

    if (type === 'block') {
      router.push(`/TAManagement/Mapping`);
    } else if (type === 'edit') {
      router.push(`/TAManagement/Mapping`);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      mapping: { type },
    } = this.props;
    const resCb = response => {
      if (response === 'SUCCESS') {
        message.success(type === 'edit' ? 'Modified successfully.' : 'Added successfully.');
        this.jumpToMapping();
      } else if (response === 'ERROR') {
        message.error(type === 'edit' ? 'Failed to modify.' : 'Failed to add.');
      }
    };
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      commonConfirm({
        content: `Confirm to ${type === 'edit' ? 'Modify' : 'New'} ?`,
        onOk: () => {
          Object.entries(values).forEach(([k, v]) => {
            if (k === 'arAccountCommencementDate' && v) {
              values[k] = v.format('YYYY-MM-DD');
            } else if (k === 'arAccountEndDate' && v) {
              values[k] = v.format('YYYY-MM-DD');
            }
            if (k === 'salesManager' && Array.isArray(v)) {
              values[k] = v.join();
            }
            if (k === 'product' && Array.isArray(v)) {
              values[k] = v.join();
            } else {
              values[k] = v;
            }
          });
          if (type === 'edit') {
            dispatch({
              type: 'mappingDetails/editMappingList',
              payload: {
                params: values,
              },
            }).then(resCb);
          } else {
            dispatch({
              type: 'mappingDetails/addMappingList',
              payload: {
                params: values,
              },
            }).then(resCb);
          }
        },
      });
    });
  };

  changeArAccountDate = (date, dateString) => {
    const { form } = this.props;
    form.resetFields({ arAccountCommencementDate: date });
    if (date) {
      form.setFieldsValue({ arAccountEndDate: moment(dateString).add(1, 'years') });
    }
  };

  render() {
    const {
      companyName,
      form: { getFieldDecorator },
    } = this.props;
    const checkOptions = [
      { label: 'Rooms', value: 'Rooms' },
      { label: 'Attractions', value: 'Attractions' },
    ];
    return (
      <Col lg={24} md={24}>
        <div className="has-shadow no-border">
          <div className={detailStyles.titleHeader}>
            <span>{formatMessage({ id: 'MAPPING_FOR_COMPANY_NAME' })}</span>
          </div>
          <div className={classNames(detailStyles.searchDiv, 'has-shadow', 'no-border')}>
            <Form onSubmit={this.handleSubmit}>
              <Row gutter={24}>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_MAIN_TA_PROFILE' })}
                  >
                    {getFieldDecorator('idOrName', {
                      initialValue: companyName || '',
                      rules: [
                        {
                          required: true,
                          msg: 'Required',
                        },
                      ],
                    })(<Input placeholder={formatMessage({ id: 'PLEASE_ENTER' })} disabled />)}
                  </FormItem>
                </Col>
                <Col span={24}> </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_OPERA_EWALLET' })}
                  >
                    {getFieldDecorator('operaEwallet', {
                      initialValue: this.handleInitVal('operaEwallet'),
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_OPERA_AR_CREDIT' })}
                  >
                    {getFieldDecorator('operaArCredit', {
                      initialValue: this.handleInitVal('operaArCredit'),
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_GALAXY_EWALLET' })}
                  >
                    {getFieldDecorator('galaxyEwallet', {
                      initialValue: this.handleInitVal('galaxyEwallet'),
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_GALAXY_CREDIT' })}
                  >
                    {getFieldDecorator('galaxyArCredit', {
                      initialValue: this.handleInitVal('galaxyArCredit'),
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_PEOPLESOFR_EWALLET_ID' })}
                  >
                    {getFieldDecorator('peoplesoftEwalletId', {
                      initialValue: this.handleInitVal('peoplesoftEwalletId'),
                      rules: [
                        {
                          required: true,
                          msg: 'Required',
                        },
                      ],
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_PEOPLESOFR_AR_ACCOUNT_ID' })}
                  >
                    {getFieldDecorator('peoplesoftArAccountId', {
                      initialValue: this.handleInitVal('peoplesoftArAccountId'),
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
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
                          required: true,
                          msg: 'Required',
                        },
                      ],
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_CREDIT_LIMIT' })}
                  >
                    {getFieldDecorator('creditLimit', {
                      initialValue: this.handleInitVal('creditLimit'),
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_EWALLET_FIXED_THRESHOLD' })}
                  >
                    {getFieldDecorator('ewalletFixedThreshold', {
                      initialValue: this.handleInitVal('ewalletFixedThreshold'),
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_AR_FIXED_THRESHOLD' })}
                  >
                    {getFieldDecorator('arFixedThreshold', {
                      initialValue: this.handleInitVal('arFixedThreshold'),
                    })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
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
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_AMOUNT' })}
                  >
                    {getFieldDecorator('guaranteeAmount ', {
                      initialValue: this.handleInitVal('guaranteeAmount'),
                    })(
                      <InputNumber
                        type="text"
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        style={{ width: '100%' }}
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
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem {...formItemLayout} label={formatMessage({ id: 'MAPPING_CURRENCY' })}>
                    {getFieldDecorator('currency', {
                      initialValue: this.handleInitVal('currency'),
                    })(
                      <Select placeholder={formatMessage({ id: 'PLEASE_SELECT' })} mode="multiple">
                        <Option value="SGD">SGD</Option>
                      </Select>
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
                    })(<Select placeholder={formatMessage({ id: 'PLEASE_SELECT' })} />)}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem {...formItemLayout} label={formatMessage({ id: 'MAPPING_PRODUCT' })}>
                    {getFieldDecorator('product', {
                      initialValue: this.handleInitVal('product'),
                    })(<Checkbox.Group options={checkOptions} />)}
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
