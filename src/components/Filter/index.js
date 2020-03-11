import React, { Component } from 'react';
import { Button, Col, DatePicker, Form, Icon, Input, Row, Select, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { getTimeDistance } from '@/utils/utils';
import styles from './index.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;
const tags = [
  formatMessage({ id: 'COMMON_DAY' }),
  formatMessage({ id: 'COMMON_WEEK' }),
  formatMessage({ id: 'COMMON_MONTH' }),
  formatMessage({ id: 'COMMON_LAST_WEEK' }),
  formatMessage({ id: 'COMMON_LAST_MONTH' }),
];
const rangeValues = [
  getTimeDistance('today'),
  getTimeDistance('week'),
  getTimeDistance('month'),
  getTimeDistance('lastWeek'),
  getTimeDistance('lastMonth'),
];
const RANGE_MAP = {};
tags.forEach((item, index) => {
  RANGE_MAP[item] = rangeValues[index];
});
const MOMENT_TIME = {
  0: '00:00:00',
  1: '23:59:59',
};

const colProp = {
  md: 8,
  sm: 24,
};

const commonFormat = 'YYYY-MM-DD HH:mm:ss';
const handleDate = time => {
  if (time && time !== undefined && time !== '' && typeof time === 'string') return moment(time);
  return time;
};
const judgeShowTime = format => {
  if (format.indexOf(' ') > -1 && format.split(' ').length === 2) return true;
  return false;
};

@Form.create()
class Filter extends Component {
  static defaultProps = {
    onChange: () => {},
    onBtnClick: () => {},
  };

  state = {
    expandForm: false,
    endOpen: false,
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, onChange } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const query = {};
      Object.keys(fieldsValue).forEach(key => {
        let value = fieldsValue[key];
        if (Array.isArray(value) && value.length === 2) {
          // 格式化所有moment
          value = value.map((val, idx) => {
            if (moment.isMoment(val)) {
              const time = MOMENT_TIME[idx];
              return `${val.format('YYYY-MM-DD')} ${time}`;
            }
            return val;
          });
        }
        if (moment.isMoment(value)) {
          value = value.format(commonFormat);
        }
        if (key.indexOf('&&') > -1) {
          const newKey = key.split('&&');
          newKey.forEach((item, index) => {
            query[item] = value[index];
          });
        } else query[key] = value;
      });
      onChange(query);
    });
  };

  handleFormReset = () => {
    const { form, onChange } = this.props;
    const fields = form.getFieldsValue();
    Object.keys(fields).forEach(key => {
      if ({}.hasOwnProperty.call(fields, key)) {
        if (fields[key] instanceof Array) {
          fields[key] = [];
        } else {
          fields[key] = undefined;
        }
      }
    });
    form.resetFields();
    onChange(fields);
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  renderInput = item => {
    const { key, placeholder } = item;
    const {
      form: { getFieldDecorator },
      initialValue = {},
    } = this.props;
    return getFieldDecorator(key, { initialValue: initialValue[key] })(
      <Input placeholder={placeholder} />
    );
  };

  renderSelect = item => {
    const { key, placeholder, source, sourceKey = 'key', sourceValue = 'value' } = item;
    const {
      form: { getFieldDecorator },
      initialValue = {},
    } = this.props;
    return getFieldDecorator(key, { initialValue: initialValue[key] })(
      <Select placeholder={placeholder} allowClear style={{ width: '100%' }}>
        {source.map(iem => (
          <Option value={iem[sourceKey]} key={`${iem[sourceKey]}_${iem[sourceValue]}`}>
            {iem[sourceValue]}
          </Option>
        ))}
      </Select>
    );
  };

  renderDatePicker = item => {
    const { key, placeholder, format = commonFormat } = item;
    const {
      form: { getFieldDecorator },
      initialValue = {},
    } = this.props;
    return getFieldDecorator(key, { initialValue: handleDate(initialValue[key]) })(
      <DatePicker
        style={{ width: '100%' }}
        placeholder={placeholder}
        format={format}
        showTime={judgeShowTime(format)}
      />
    );
  };

  renderDateGroupPicker = item => {
    const { key = [], colLayout = colProp } = item;
    return key.map((v, index) => (
      <Col {...colLayout} key={`filter_${item.key[index]}`}>
        <FormItem>{index === 0 ? this.renderStartDate(item) : this.renderEndDate(item)}</FormItem>
      </Col>
    ));
  };

  onChange = (param, item) => {
    const { onChange } = item;
    onChange(param);
  };

  onStartChange = (value, item) => {
    const { key } = item;
    this.onChange({ [key[0]]: value }, item);
  };

  onEndChange = (value, item) => {
    const { key } = item;
    this.onChange({ [key[1]]: value }, item);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  renderStartDate = item => {
    const {
      form: { getFieldDecorator },
      initialValue = {},
    } = this.props;
    const { key = [], placeholder = [], format = commonFormat } = item;
    const disabledStartDate = startValue => {
      const endValue = handleDate(initialValue[key[1]]);
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    };
    return getFieldDecorator(key[0], { initialValue: handleDate(initialValue[key[0]]) })(
      <DatePicker
        disabledDate={disabledStartDate}
        style={{ width: '100%' }}
        placeholder={placeholder[0]}
        onChange={value => {
          this.onStartChange(value, item);
        }}
        // onOpenChange={this.handleStartOpenChange}
        format={format}
        showTime={judgeShowTime(format)}
      />
    );
  };

  renderEndDate = item => {
    const {
      form: { getFieldDecorator },
      initialValue = {},
    } = this.props;
    const { key = [], placeholder = [], format = commonFormat } = item;
    const { endOpen } = this.state;
    const disabledEndDate = endValue => {
      const startValue = handleDate(initialValue[key[0]]);
      if (!endValue || !startValue) {
        return false;
      }
      return endValue.valueOf() <= startValue.valueOf();
    };
    return getFieldDecorator(key[1], { initialValue: handleDate(initialValue[key[1]]) })(
      <DatePicker
        disabledDate={disabledEndDate}
        style={{ width: '100%' }}
        placeholder={placeholder[1]}
        open={endOpen}
        onChange={value => {
          this.onEndChange(value, item);
        }}
        onOpenChange={this.handleEndOpenChange}
        format={format}
        showTime={judgeShowTime(format)}
      />
    );
  };

  renderRangePicker = item => {
    const { key = [], placeholder = [], format = commonFormat } = item;
    const {
      form: { getFieldDecorator },
      initialValue = {},
    } = this.props;
    return getFieldDecorator(key.join('&&'), {
      initialValue:
        initialValue[key] && initialValue[key].length > 0
          ? initialValue[key].map(v => handleDate(v))
          : [],
    })(
      <RangePicker
        style={{ width: '100%' }}
        ranges={RANGE_MAP}
        placeholder={[placeholder[0], placeholder[1]]}
        format={format}
        showTime={judgeShowTime(format)}
      />
    );
  };

  renderInputGroup = item => {
    const { key, placeholder, onBtnClick } = item;
    const {
      form: { getFieldDecorator },
      initialValue = {},
    } = this.props;
    return (
      <span className="popedit">
        {getFieldDecorator(key, { initialValue: initialValue[key] })(
          <Input placeholder={placeholder} />
        )}
        <Icon
          type="export"
          onClick={() => {
            onBtnClick();
          }}
        />
      </span>
    );
  };

  renderItem = (item, index) => {
    const { type, colLayout = colProp } = item;
    let renderFunc = null;
    switch (type) {
      case 'input':
        renderFunc = this.renderInput;
        break;
      case 'select':
        renderFunc = this.renderSelect;
        break;
      case 'datePicker':
        renderFunc = this.renderDatePicker;
        break;
      case 'dateGroupPicker':
        renderFunc = this.renderDateGroupPicker;
        break;
      case 'rangePicker':
        renderFunc = this.renderRangePicker;
        break;
      case 'inputBtnGroup':
        renderFunc = this.renderInputGroup;
        break;
      default:
        break;
    }
    return type !== 'dateGroupPicker' ? (
      <Col key={`filter_${item.key}`} {...colLayout}>
        <FormItem>{renderFunc(item, index)}</FormItem>
      </Col>
    ) : (
      renderFunc(item, index)
    );
  };

  renderForm = () => {
    const { layout, loading } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {layout.map(this.renderItem)}
          <Col {...colProp}>
            <Button loading={loading} type="primary" htmlType="submit">
              {formatMessage({ id: 'BTN_SEARCH' })}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {formatMessage({ id: 'BTN_RESET' })}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return (
      <Spin wrapperClassName={styles.tableListForm} spinning={false}>
        {this.renderForm()}
      </Spin>
    );
  }
}

export default Filter;
