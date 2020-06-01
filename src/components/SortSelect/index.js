import React, { PureComponent } from 'react';
import { Select } from 'antd';

export default class SortSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;
  }

  sortOptions = options => {
    function sortData(a, b) {
      const val1 = a.props.children.toLowerCase();
      const val2 = b.props.children.toLowerCase();
      if (val1 < val2) {
        return -1;
      }
      if (val1 > val2) {
        return 1;
      }
      return 0;
    }
    options.sort(sortData);
    return options;
  };

  render() {
    const { placeholder, optionFilterProp, allowClear, options, ...otherProps } = this.props;

    const optionList = this.sortOptions(options);

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
