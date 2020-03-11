import React from 'react';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import BaseElement from './BaseElement';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const assign = require('object-assign');

const merge = Object.assign || assign;

class FormRangeDate extends BaseElement {
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
    this.state = { props: ps, errorMsg: undefined, value: [] };
  }

  doWitchDefaultValue(defaultValue, validFlag = true) {
    const { format = 'YYYY-MM-DD' } = this.props;
    const values = [];
    defaultValue.map(v => {
      if (typeof v === 'number') {
        values.push(moment(v).format(format));
      } else values.push(v);
      return null;
    });
    this.formChange(values, validFlag);
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
      placeholder = [
        formatMessage({ id: 'COMMON_RANGE_START_PLACE' }),
        formatMessage({ id: 'COMMON_RANGE_END_PLACE' }),
      ],
      rules = [],
    } = this.props;
    const { value, errorMsg } = this.state;
    const otherProps = { format, showTime, ...this.props };
    if (format.indexOf(' ') > -1 && format.split(' ').length === 2) {
      otherProps.showTime = true;
    }
    let ps = merge(this.state.props, this.props, otherProps);
    ps = this.filterProps(ps);
    const { labelCol = { span: 2 }, wrapperCol = { span: 4 } } = this.props;
    let validateStatus;
    if (errorMsg !== undefined && errorMsg !== null) {
      validateStatus = 'error';
    } else if (value.length > 0 && value[0] && value[1]) {
      validateStatus = 'success';
    }
    const newValue = [];
    if (value.length > 0) {
      value.map(v => {
        if (v && v !== undefined && v !== '') {
          newValue.push(moment(v));
        }
        return null;
      });
    }
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
        <RangePicker {...ps} value={newValue} placeholder={placeholder} />
      </FormItem>
    );
  }
}

FormRangeDate.displayName = 'FormRangeDate';
export default FormRangeDate;
