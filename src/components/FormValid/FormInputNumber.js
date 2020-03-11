// 数字输入框
// https://ant.design/components/input-number-cn
import React from 'react';
import { Form, InputNumber } from 'antd';
import BaseElement from './BaseElement';

const FormItem = Form.Item;
const assign = require('object-assign');

const merge = Object.assign || assign;

class FormInputNumber extends BaseElement {
  constructor(props) {
    super(props);
    const onChange = this.props.onChange
      ? val => {
          this.formChange(val);
          this.props.onChange(val);
        }
      : val => {
          this.formChange(val);
        };
    const onBlur = this.props.onBlur
      ? e => {
          let val = e.target.value;
          const { addOnAfter } = this.props;
          if (addOnAfter) {
            val = parseInt(val.replace(addOnAfter, ''), 10);
          }
          this.props.onBlur(val);
          this.formChange(val);
        }
      : e => {
          let val = e.target.value;
          const { addOnAfter } = this.props;
          if (addOnAfter) {
            val = parseInt(val.replace(addOnAfter, ''), 10);
          }
          this.formChange(val);
        };
    const ps = { onChange, onBlur };
    this.state = { props: ps, errorMsg: undefined };
  }

  doWitchDefaultValue(defaultValue, validFlag = true) {
    this.formChange(defaultValue, validFlag);
  }

  formChange(val, validFlag = true) {
    const { disabled = false } = this.props;
    if (validFlag) {
      if (!disabled) {
        this.valid(val);
      }
    } else this.resetMsg();
    this.setState({ value: val });
  }

  resetMsg = () => {
    this.setState({ errorMsg: null });
  };

  valid(value) {
    let newValue = value;
    if (value === undefined) {
      newValue = this.state.value;
    }
    const result = this.props.formChange(this.props.name, newValue);
    this.setState({ errorMsg: result });
    return result;
  }

  /**
   *过滤props属性
   * */
  filterProps(props) {
    let filter = props;
    filter = super.filterProps(props);
    delete filter.addOnAfter;
    return filter;
  }

  renderFormItem() {
    let ps = merge({}, this.props, this.state.props);
    ps = this.filterProps(ps);
    const {
      labelCol = { span: 2 },
      wrapperCol = { span: 4 },
      rules = [],
      label,
      placeholder = null,
    } = this.props;
    let validateStatus;
    if (this.state.errorMsg !== undefined && this.state.errorMsg !== null) {
      validateStatus = 'error';
    } else if (
      this.state.value !== undefined &&
      this.state.value !== null &&
      this.state.value !== ''
    ) {
      validateStatus = 'success';
    }
    const { addOnAfter } = this.props;
    if (addOnAfter) {
      ps.formatter = value => `${value}${addOnAfter}`;
      ps.parser = value => value.replace(addOnAfter, '');
    }
    return (
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        hasFeedback
        help={this.state.errorMsg}
        validateStatus={validateStatus}
        label={label}
        required={rules.includes('required') ? !false : false}
      >
        <InputNumber {...ps} placeholder={placeholder || label} value={this.state.value} />
      </FormItem>
    );
  }
}

FormInputNumber.displayName = 'FormInputNumber';
export default FormInputNumber;
