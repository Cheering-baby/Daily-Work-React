import React from 'react';
import { Form, Input } from 'antd';
import BaseElement from './BaseElement';

const assign = require('object-assign');

const FormItem = Form.Item;

const merge = Object.assign || assign;

class FormTextArea extends BaseElement {
  constructor(props) {
    super(props);
    const onChange = this.props.onChange
      ? e => {
          const val = e.target.value;
          this.props.onChange(val);
          this.formChange(val);
        }
      : e => {
          const val = e.target.value;
          this.formChange(val);
        };
    const onBlur = this.props.onBlur
      ? e => {
          const val = e.target.value;
          this.props.onBlur(val);
          this.formChange(val);
        }
      : e => {
          const val = e.target.value;
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
    if (this.props.tip) {
      return (
        <div>
          <div style={{ float: 'left', width: '94%' }}>
            <FormItem
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              hasFeedback
              help={this.state.errorMsg}
              validateStatus={validateStatus}
              label={label}
              required={rules.includes('required') ? !false : false}
            >
              <Input.TextArea
                {...ps}
                autosize={{ minRows: 1.5, maxRows: 6 }}
                value={this.state.value}
              />
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
        help={this.state.errorMsg}
        validateStatus={validateStatus}
        label={label}
        required={rules.includes('required') ? !false : false}
      >
        <Input.TextArea
          {...ps}
          placeholder={placeholder || label}
          autosize={{ minRows: 1.5, maxRows: 6 }}
          value={this.state.value}
        />
      </FormItem>
    );
  }
}

FormTextArea.displayName = 'FormTextArea';
export default FormTextArea;
