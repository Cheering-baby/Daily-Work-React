import React from 'react';
import PropTypes from 'prop-types';

class BaseElement extends React.Component {
  /**
   * 验证参数格式
   * */
  static valid() {}

  /**
   * 默认值处理
   * */
  static doWitchDefaultValue() {}

  static defaultProps = {
    addValidField: () => {},
    clearFormField: () => {},
    clearFormValid: () => {},
    name: '',
    defaultValue: '',
    renderDefaultValue: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      defaultValue: undefined, // 默认值
    };
    this.filterProps = this.filterProps.bind(this);
  }

  /**
   *返回formItem元素包裹
   * */
  static renderFormItem() {}

  componentDidMount() {
    const { clearFormValid, addValidField, name, defaultValue } = this.props;
    // 首先清除form valid,再进行新一轮的form valid赋值
    if (clearFormValid) clearFormValid(name);
    if (addValidField) {
      addValidField(name, this.valid.bind(this));
    }
    if (defaultValue !== undefined && defaultValue !== null) {
      this.setState({ defaultValue });
      this.doWitchDefaultValue(defaultValue, false);
    }
  }

  /**
   * 设置默认值到state中
   *
   * 由于 默认值defaultValue 不是同步传过来的 有延迟
   * 所以会在这里接受
   * */
  componentWillReceiveProps(nextProps) {
    // 向组件传递属性render为true时，default可重新渲染组件
    const { renderDefaultValue, value } = this.props;
    const { defaultValue: stateDefaultValue, fileList: stateFileList } = this.state;
    if (
      renderDefaultValue &&
      nextProps.defaultValue !== undefined &&
      nextProps.defaultValue !== value
    ) {
      const { defaultValue } = nextProps;
      let validFlag = true;
      if (Array.isArray(defaultValue)) {
        defaultValue.forEach(v => {
          if (!v || v === '') validFlag = false;
        });
      }
      if (typeof defaultValue === 'string') {
        if (defaultValue === '') validFlag = false;
      }
      this.setState({ defaultValue });
      this.doWitchDefaultValue(defaultValue, validFlag);
      return;
    }
    if (stateDefaultValue === undefined && nextProps.defaultValue !== undefined) {
      const { defaultValue } = nextProps;
      this.setState({ defaultValue });
      this.doWitchDefaultValue(defaultValue);
    }
    if (stateFileList && nextProps.fileList && stateFileList.length !== nextProps.fileList.length) {
      const { fileList } = nextProps;
      this.setState({ fileList });
      this.doWitchDefaultValue(fileList);
    }
  }

  /**
   * 移除挂载  清除form valid
   * */
  componentWillUnmount() {
    const { clearFormField, name } = this.props;
    if (clearFormField) clearFormField(name);
  }

  /**
   *过滤props属性
   * */
  filterProps(props) {
    this.funcName = 'filterProps';
    const newProps = props;
    delete newProps.defaultValue;
    delete newProps.renderDefaultValue;
    delete newProps.addValidField;
    delete newProps.clearFormField;
    delete newProps.clearFormValid;
    delete newProps.formChange;
    delete newProps.formValid;
    delete newProps.rules;
    delete newProps.label;
    delete newProps.name;
    delete newProps.labelCol;
    delete newProps.wrapperCol;
    delete newProps.showInput;
    return newProps;
  }

  render() {
    return this.renderFormItem();
  }
}

BaseElement.propTypes = {
  addValidField: PropTypes.func,
  name: PropTypes.string,
  defaultValue: PropTypes.node,
  renderDefaultValue: PropTypes.bool,
  clearFormField: PropTypes.func,
  clearFormValid: PropTypes.func,
};

export default BaseElement;
