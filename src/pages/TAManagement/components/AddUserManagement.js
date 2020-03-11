import React, { Component } from 'react';
// import { connect } from 'dva';
import { Col, DatePicker, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import CommonModal from '@/components/CommonModal/index';
import styles from './AddUserManagement.less';

const { TextArea } = Input;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
const ColProps = {
  xs: 8,
  md: 12,
};
const ColProps1 = {
  xs: 24,
};
const formItemLayout1 = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create({})
// @connect(({}) => ({}))
class AddUserManagement extends Component {
  static defaultProps = {
    onOk: () => {},
  };

  componentDidMount() {
    // const { dispatch, data = {}, type } = this.props;
    //
    // dispatch({
    //   type: 'newRole/workgroupSearch',
    // });
    //
    // dispatch({
    //   type: 'newRole/roleSearch',
    //   payload: {
    //     roleCode: data.roleCode,
    //     types: type,
    //   },
    // });
  }

  handleSubmit = () => {
    // const {
    //   form,
    //   newRole: { workgroupSearchList },
    // } = this.props;
    // form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     Object.keys(values).forEach(key => {
    //       const value = values[key];
    //       if (!values[key]) {
    //         Object.assign(values, {
    //           [key]: key === 'workgroupList' ? [] : '',
    //         });
    //       } else if (moment.isMoment(value)) {
    //         values[key] = value.format('YYYY-MM-DD');
    //       } else if (key === 'workgroupList') {
    //         values[key] = workgroupSearchList.filter(item => value.includes(item.code));
    //       } else if (key === 'reportRole') {
    //         values[key] = { roleCode: value };
    //       } else {
    //         values[key] = value;
    //       }
    //     });
    //     if (!values.reportRole) values.reportRole = { roleCode: null };
    //     const { onOk } = this.props;
    //     onOk(values);
    //   }
    // });
  };

  handleOk = () => {
    this.handleSubmit();
  };

  disabledDate = current => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  render() {
    const {
      form: { getFieldDecorator },
      // newRole: { workgroupSearchList, roleSearchList },
      type,
      ...modalProps
    } = this.props;
    const modalOpts = {
      ...modalProps,
      width: 862,
      onOk: () => {
        // this.handleOk();
      },
    };

    return (
      <CommonModal modalOpts={modalOpts}>
        <Row gutter={24}>
          <Form onSubmit={this.handleSubmit} className={styles.userForm}>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_USER_LOGIN' })}>
                {getFieldDecorator('userLogin', {
                  rules: [
                    {
                      // validator: this.filterCode,
                    },
                    {
                      required: true,
                      message: 'User Login is required',
                    },
                  ],
                })(<Input type="text" disabled={type === 'edit'} placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_USER_ROLE' })}>
                {getFieldDecorator('role', {
                  rules: [
                    {
                      required: true,
                      message: 'Role is required',
                    },
                  ],
                })(<Input type="text" placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_USER_FULL_NAME' })}>
                {getFieldDecorator('fullName', {
                  rules: [
                    {
                      required: true,
                      message: 'Full Name is required',
                    },
                  ],
                })(<Input type="text" placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem
                {...formItemLayout}
                label={formatMessage({ id: 'ADD_USER_EFFECTIVE_DATE' })}
              >
                {getFieldDecorator('EffectiveDate', {
                  rules: [
                    {
                      required: true,
                      message: 'Full Name is required',
                    },
                  ],
                })(
                  <DatePicker
                    disabledDate={this.disabledDate}
                    format="YYYY-MM-DD"
                    placeholder="Please Select"
                  />
                )}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_END_DATE' })}>
                {getFieldDecorator('endDate', {
                  rules: [
                    {
                      message: 'End Date is required',
                    },
                  ],
                })(
                  <DatePicker
                    style={{ width: 'initial' }}
                    format="YYYY-MM-DD"
                    placeholder="Please Select"
                  />
                )}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_COMPANY_NAME' })}>
                {getFieldDecorator('campanyName', {
                  rules: [
                    {
                      required: true,
                      message: 'Campany Name is required',
                    },
                  ],
                })(<Input type="text" placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_CATEGORY' })}>
                {getFieldDecorator('category', {
                  rules: [
                    {
                      required: true,
                      message: 'Category is required',
                    },
                  ],
                })(<Input type="text" placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_SALES_PERSON' })}>
                {getFieldDecorator(
                  'category',
                  {}
                )(<Input type="text" placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_EMAIL' })}>
                {getFieldDecorator('email', {})(<Input type="text" placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'ADD_PHONE' })}>
                {getFieldDecorator('phone', {})(<Input type="text" placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps1} style={{ paddingLeft: '6px' }}>
              <FormItem {...formItemLayout1} label={formatMessage({ id: 'ADD_ADDRESS' })}>
                {getFieldDecorator('address', {})(<Input type="text" placeholder="Please Enter" />)}
              </FormItem>
            </Col>
            <Col {...ColProps1}>
              <FormItem {...formItemLayout1} label={formatMessage({ id: 'ADD_REMARKS' })}>
                {getFieldDecorator(
                  'remarks',
                  {}
                )(
                  <TextArea
                    // autosize
                    placeholder={formatMessage({ id: 'ADD_REMARKS' })}
                  />
                )}
              </FormItem>
            </Col>
          </Form>
        </Row>
      </CommonModal>
    );
  }
}

export default AddUserManagement;
