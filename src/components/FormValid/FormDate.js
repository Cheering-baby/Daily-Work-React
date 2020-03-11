import React from 'react';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import BaseElement from './BaseElement';

const FormItem = Form.Item;
const assign = require('object-assign');

const merge = Object.assign || assign;

class FormDate extends BaseElement {
  constructor(props) {
    super(props);
    const onChange = this.props.onChange
      ? (dateMoment, dateString) => {
          this.props.onChange(dateMoment, dateString);
          this.formChange(dateString);
        }
      : (dateMoment, dateString) => {
          this.formChange(dateString);
        };
    const ps = { onChange };
    this.state = { props: ps, errorMsg: undefined };
  }

  doWitchDefaultValue(defaultValue, validFlag = true) {
    let value = defaultValue;
    const { format = 'YYYY-MM-DD' } = this.props;
    if (typeof value === 'number') {
      value = moment(value).format(format);
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
    const {
      format = 'YYYY-MM-DD',
      showTime = false,
      placeholder = formatMessage({ id: 'COMMON_DATE_PLACE' }),
      rules = [],
    } = this.props;
    const otherProps = { format, showTime, ...this.props };
    if (format.indexOf(' ') > -1 && format.split(' ').length === 2) {
      otherProps.showTime = true;
    }
    let ps = merge(this.state.props, this.props, otherProps);
    ps = this.filterProps(ps);
    const { labelCol = { span: 2 }, wrapperCol = { span: 4 } } = this.props;
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
    const value =
      this.state.value == null || this.state.value === '' ? null : moment(this.state.value);
    return (
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        hasFeedback
        help={this.state.errorMsg}
        validateStatus={validateStatus}
        label={this.props.label}
        required={rules.includes('required') ? !false : false}
      >
        <DatePicker {...ps} value={value} placeholder={placeholder} style={{ width: '100%' }} />
      </FormItem>
    );
  }
}

FormDate.displayName = 'FormDate';
export default FormDate;
