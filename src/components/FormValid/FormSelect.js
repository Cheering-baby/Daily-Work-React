import React from 'react';
import { Form, Select } from 'antd';
import BaseElement from './BaseElement';

const { Option } = Select;
const FormItem = Form.Item;
const assign = require('object-assign');

const merge = Object.assign || assign;

class FormSelect extends BaseElement {
  constructor(props) {
    super(props);
    const onChange = this.props.onChange
      ? val => {
          this.props.onChange(val);
          this.formChange(val);
        }
      : val => {
          this.formChange(val);
        };
    const onBlur = this.props.onBlur
      ? e => {
          const val = e.target.value;
          this.props.onBlur(val);
          this.formChange(val);
        }
      : e => {
          this.formChange(e);
        };
    const ps = { onChange, onBlur };
    this.state = { props: ps, errorMsg: undefined };
  }

  doWitchDefaultValue(defaultValue, validFlag = true) {
    const { number = false } = this.props;
    let value = defaultValue;
    if (value !== null && value !== undefined) {
      if (!number) {
        value += '';
      }
    }
    this.formChange(value, validFlag);
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

  renderFormItem() {
    let ps = merge({}, this.props, this.state.props);
    ps = this.filterProps(ps);
    const {
      labelCol = { span: 2 },
      wrapperCol = { span: 8 },
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
    let { errorMsg } = this.state;
    if (this.props.disabled && this.state.value !== undefined && this.state.value !== null) {
      validateStatus = 'success';
      errorMsg = '';
    } else if (this.props.disabled) {
      validateStatus = '';
      errorMsg = '';
    }
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [this.props.children];
    }
    const { style = { width: '100%' } } = this.props;
    if (this.props.tip) {
      return (
        <div>
          <div style={{ float: 'left', width: '94%' }}>
            <FormItem
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              hasFeedback
              help={errorMsg}
              validateStatus={validateStatus}
              label={label}
              required={rules.includes('required') ? !false : false}
            >
              <Select
                {...ps}
                showSearch
                placeholder={placeholder || label}
                optionFilterProp="children"
                value={this.state.value}
                style={style}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {children.map(ch => (
                  <Option
                    key={`${this.props.name}_option_${ch.props.value}`}
                    disabled={ch.props.disabled}
                    value={ch.props.value}
                  >
                    {ch.props.children}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </div>
          <div style={{ float: 'left', position: 'relative', right: '1rem', top: '0.47rem' }}>
            {this.props.tip}
          </div>
          <div style={{ clear: 'both' }} />
        </div>
      );
    }

    return (
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        hasFeedback
        help={errorMsg}
        validateStatus={validateStatus}
        label={label}
        required={rules.includes('required') ? !false : false}
      >
        <Select
          {...ps}
          showSearch
          placeholder={placeholder || label}
          optionFilterProp="children"
          value={this.state.value}
          style={style}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {children.map(ch => (
            <Option
              key={`${this.props.name}_option_${ch.props.value}`}
              disabled={ch.props.disabled}
              value={ch.props.value}
            >
              {ch.props.children}
            </Option>
          ))}
        </Select>
      </FormItem>
    );
  }
}

FormSelect.displayName = 'FormSelect';
export default FormSelect;
