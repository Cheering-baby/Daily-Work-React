import React, { PureComponent } from 'react';
import { Select } from 'antd';

export default class SortSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;
  }

  sortOptions = options => {
    function sortData(a, b) {
      let val1 = '0';
      let val2 = '0';
      if (a && b) {
        if (typeof a.props.children === 'string') {
          val1 = a.props.children.toLowerCase();
          val2 = b.props.children.toLowerCase();
        } else {
          val1 = a.props.children.props.children.toLowerCase();
          val2 = b.props.children.props.children.toLowerCase();
        }
        if (val1 < val2) {
          return -1;
        }
        if (val1 > val2) {
          return 1;
        }
      }
      return 0;
    }
    options.sort(sortData);
    return options;
  };

  render() {
    const { placeholder, optionFilterProp, allowClear, options, ...otherProps } = this.props;

    const optionList = options ? this.sortOptions(options) : [];

    return (
      <Select
        placeholder={placeholder}
        optionFilterProp={optionFilterProp}
        allowClear={allowClear}
        {...otherProps}
      >
        {optionList}
      </Select>
    );
  }
}
