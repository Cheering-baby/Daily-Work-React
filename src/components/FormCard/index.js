import React, { Fragment, PureComponent } from 'react';
import { cloneDeep, isEqual } from 'lodash';
import { Button, Card, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import FormValid from '../FormValid';
import IconTab from '../IconTab';
import styles from './index.less';

const { FormData } = FormValid;
const FormItem = Form.Item;
const formData = new FormData();

const resetProps = {
  editState: '',
  disabled: true,
};
const submitFormat = 'YYYY-MM-DD';
const includes = (item, sonItem) => {
  let flag = true;
  Object.keys(sonItem).forEach(v => {
    if (item[v] && sonItem[v] !== item[v]) flag = false;
  });
  return flag;
};
const commonCol = {
  xs: 24,
  md: 12,
};
const commonForm = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};
const footerBtnGroup = [
  {
    key: 'new',
    value: formatMessage({ id: 'COMMON_NEW' }),
  },
  {
    key: 'edit',
    value: formatMessage({ id: 'COMMON_EDIT' }),
  },
];

let iconUrl = '';

@Form.create()
class FormCard extends PureComponent {
  static defaultProps = {
    onOk: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      editState: '', // 当前编辑状态 new edit
      selectItem: cloneDeep(props.formItem || {}),
    };
  }

  componentWillReceiveProps(nextPorps) {
    const { formItem = {} } = nextPorps;
    const { formItem: nowFormItem = {} } = this.props;
    if (!isEqual(formItem, nowFormItem)) {
      this.reset(nextPorps);
    } else {
      const { editState, selectItem } = this.state;
      if (includes(formItem, selectItem) && editState === 'edit') {
        this.reset(nextPorps);
      }
    }
  }

  reset = nextProps => {
    this.setState({
      ...resetProps,
    });
    if (nextProps) this.setState({ selectItem: nextProps.formItem });
    iconUrl = '';
  };

  renderFooter = () => {
    const { editState } = this.state;
    const { loading, footer = footerBtnGroup } = this.props;
    if (editState === '') {
      return (
        <Fragment>
          {footer.map(item => (
            <Button
              key={item.key}
              data-comp-code="maintain_read_only"
              type="primary"
              onClick={item.key === 'new' ? this.newForm : this.editForm}
            >
              {item.value}
            </Button>
          ))}
          {/* <Button data-comp-code={'maintain_read_only'} type="primary" onClick={this.newForm}>
            {formatMessage({ id: 'COMMON_NEW' })}
          </Button>
          {Object.keys(selectItem).length > 0 && (
            <Button type="primary" onClick={this.editForm} data-comp-code={'maintain_read_only'}>
              {formatMessage({ id: 'COMMON_EDIT' })}
            </Button>
          )} */}
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Button
          data-comp-code="portal_read_only"
          loading={loading}
          type="primary"
          onClick={this.handleOk}
        >
          {formatMessage({ id: 'COMMON_OK' })}
        </Button>
        <Button id="form-cancel-btn" data-comp-code="portal_read_only" onClick={this.cancelEdit}>
          {formatMessage({ id: 'COMMON_CANCEL' })}
        </Button>
      </Fragment>
    );
  };

  newForm = () => {
    const { selectItem } = this.state;
    const item = cloneDeep(selectItem);
    const keys = formData.getKeyNameMap();
    Object.keys(keys).forEach(key => {
      if (key.indexOf('&&') > -1) {
        const rangeKeys = key.split('&&');
        rangeKeys.forEach(v => {
          item[v] = '';
        });
      }
      item[key] = '';
    });
    if (item.iconUrl) item.iconUrl = '';
    this.setState({ disabled: false, editState: 'new', selectItem: item });
  };

  editForm = () => {
    this.setState({ disabled: false, editState: 'edit' });
  };

  handleOk = () => {
    if (formData.isValid()) {
      const params = formData.getFormData();
      const query = {};
      Object.keys(params).forEach(key => {
        let value = params[key];
        if (Array.isArray(value) && value.length === 2) {
          // 格式化所有moment
          let newFormat = submitFormat;
          if (value[0].indexOf(' ') > -1 && value[0].split(' ').length === 2)
            newFormat = `${newFormat} HH:mm:ss`;
          value = value.map(val => {
            if (moment.isMoment(val)) {
              return val.format(newFormat);
            }
            return moment(val).format(newFormat);
          });
        }
        if (key.indexOf('&&') > -1) {
          const newKey = key.split('&&');
          newKey.forEach((item, index) => {
            query[item] = value[index];
          });
        } else query[key] = value;
      });
      const { onOk, formList } = this.props;
      const { editState, selectItem } = this.state;
      // 判断是否存在图标
      const index = formList.findIndex(m => m.type === 'iconTab');
      if (index > -1) {
        query.iconUrl = iconUrl !== '' ? iconUrl : selectItem.iconUrl;
      }
      this.setState(
        {
          selectItem: query,
        },
        () => {
          onOk(query, editState);
        }
      );
    }
  };

  cancelEdit = () => {
    const { formItem = {} } = this.props;
    this.setState({
      ...resetProps,
      selectItem: formItem,
    });
  };

  renderCommonProps = item => {
    const { disabled } = this.state;
    const { formItemLayout = commonForm, type } = item;
    let commonProps = {
      ...formItemLayout,
      disabled,
      renderDefaultValue: true,
    };
    if (type === 'datePicker' || type === 'rangePicker') {
      const { format, showTime } = item;
      commonProps = {
        ...commonProps,
        format,
        showTime,
      };
    }
    return commonProps;
  };

  renderCommonRangeProps = item => {
    const { disabled } = this.state;
    const { formItemLayout = commonForm, type } = item;
    let commonProps = {
      ...formItemLayout,
      disabled,
      renderDefaultValue: true,
    };
    if (type === 'rangePicker' || type === 'datePicker') {
      const { format, showTime } = item;
      commonProps = {
        ...commonProps,
        format,
        showTime,
      };
    }
    return commonProps;
  };

  renderInput = item => {
    const { name, label, rules = [], placeholder } = item;
    const { selectItem } = this.state;
    return (
      <FormValid.FormInput
        {...formData.createField({
          name,
          label,
          rules,
        })}
        defaultValue={selectItem[name]}
        {...this.renderCommonProps(item)}
        placeholder={placeholder}
      />
    );
  };

  renderSelect = item => {
    const { name, label, rules = [], source = [], placeholder } = item;
    const { selectItem } = this.state;
    return (
      <FormValid.FormSelect
        {...formData.createField({
          name,
          label,
          rules,
        })}
        defaultValue={selectItem[name]}
        placeholder={placeholder}
        {...this.renderCommonProps(item)}
      >
        {source.map(d => (
          <option key={`option_${name}_${d.value}`} value={d.value}>
            {d.label}
          </option>
        ))}
      </FormValid.FormSelect>
    );
  };

  renderTextArea = item => {
    const { name, label, rules = [], placeholder } = item;
    const { selectItem } = this.state;
    return (
      <FormValid.FormTextArea
        {...formData.createField({
          name,
          label,
          rules,
        })}
        defaultValue={selectItem[name]}
        placeholder={placeholder}
        {...this.renderCommonProps(item)}
      />
    );
  };

  renderDatePicker = item => {
    const { name, label, rules = [], placeholder } = item;
    const { selectItem } = this.state;
    return (
      <FormValid.FormDate
        {...formData.createField({
          name,
          label,
          rules,
        })}
        defaultValue={selectItem[name]}
        placeholder={placeholder}
        {...this.renderCommonProps(item)}
      />
    );
  };

  renderRangePicker = item => {
    const { name = [], label, rules = [], placeholder } = item;
    const { selectItem } = this.state;
    const values = [];
    name.map(v => values.push(selectItem[v] || null));
    return (
      <FormValid.FormRangeDate
        {...formData.createField({
          name: name.join('&&'),
          label,
          rules,
        })}
        defaultValue={values}
        placeholder={placeholder}
        {...this.renderCommonRangeProps(item)}
      />
    );
  };

  handleChangeIcon = url => {
    iconUrl = url;
  };

  renderIconTab = item => {
    const { iconArr, name, label, formItemLayout = commonForm } = item;
    const { disabled, selectItem } = this.state;
    const iconProps = {
      iconUrl: selectItem[name],
      disabled,
      iconArr,
    };
    return (
      <FormItem key={`icon_manage_${item.key}`} label={label} hasFeedback {...formItemLayout}>
        <IconTab {...iconProps} iconClick={this.handleChangeIcon} />
      </FormItem>
    );
  };

  renderForm = item => {
    const { type = 'input', colLayout = commonCol } = item;
    let renderFunc = null;
    switch (type) {
      case 'input':
        renderFunc = this.renderInput;
        break;
      case 'select':
        renderFunc = this.renderSelect;
        break;
      case 'textarea':
        renderFunc = this.renderTextArea;
        break;
      case 'datePicker':
        renderFunc = this.renderDatePicker;
        break;
      case 'rangePicker':
        renderFunc = this.renderRangePicker;
        break;
      case 'iconTab':
        renderFunc = this.renderIconTab;
        break;
      default:
        break;
    }
    return renderFunc ? (
      <Col key={`formCard_${item.name}`} {...colLayout}>
        {renderFunc(item)}
      </Col>
    ) : null;
  };

  renderFormItem = () => {
    const { formList = [], tailColLayout, tailFormItemLayout } = this.props;
    return (
      <Row>
        {formList.map(this.renderForm)}
        <Col {...tailColLayout}>
          <FormItem {...tailFormItemLayout}>{this.renderFooter()}</FormItem>
        </Col>
      </Row>
    );
  };

  render() {
    const { title } = this.props;
    const { selectItem } = this.state;
    return (
      <Card title={title} bordered={false} className="has-shadow">
        <Form className={styles.marginBottom}>
          {[selectItem].map(item => (
            <FormItem key={item.key || 'key'}>{this.renderFormItem(item)}</FormItem>
          ))}
        </Form>
      </Card>
    );
  }
}

export default FormCard;
