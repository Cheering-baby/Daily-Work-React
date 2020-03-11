import React, { PureComponent } from 'react';
import { isEqual } from 'lodash';
import { Table } from 'antd';
import NoDataTemplate from '../NoDataTemplate';

const COMMON_CONFIG = {
  size: 'small',
  bordered: true,
  locale: {
    emptyText: NoDataTemplate,
  },
};

const treeToArray = (tree, array) => {
  tree.forEach(item => {
    if (!item.children) {
      array.push(item);
    } else {
      const obj = {};
      Object.keys(item).forEach(key => {
        if (key !== 'children') {
          obj[key] = item[key];
        }
      });
      array.push(obj);
      treeToArray(item.children, array);
    }
  });
};

const handleSelectRow = (props, state = {}) => {
  const {
    selectItem,
    data: { list },
    rowKey = 'key',
  } = props;
  if (selectItem) return selectItem;
  const { selectRow } = state;
  if (selectRow) {
    if (list.length > 0) {
      const listArray = [];
      treeToArray(list, listArray);
      const index = listArray.findIndex(v => v[rowKey] === selectRow[rowKey]);
      if (index > -1) return selectRow;
      return list[0];
    }
    return {};
  }
  return {};
};

class BasicTable extends PureComponent {
  static defaultProps = {
    onClick: () => {},
    onRowExpand: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      selectRow: handleSelectRow(props),
    };
  }

  componentDidMount() {
    this.reset();
  }

  componentDidUpdate(prevProps) {
    const {
      data: { list },
    } = prevProps;
    const {
      data: { list: listNow },
    } = this.props;
    const { selectRow } = this.state;
    if (listNow.length > 0 && (!isEqual(list, listNow) || JSON.stringify(selectRow) === '{}')) {
      this.refresh(this.props, this.state);
    }
  }

  reset = () => {
    this.setState({
      selectRow: {},
    });
  };

  refresh = (props, state) => {
    const {
      data: { list },
      onClick,
    } = props;
    const { selectRow } = state;
    if (Object.keys(selectRow).length <= 0) onClick(list[0]);
    this.setState({
      selectRow: handleSelectRow(props, state),
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  handleClickRow = record => {
    this.setState({
      selectRow: record,
    });
    const { onClick } = this.props;
    onClick(record);
  };

  setClassName = record => {
    const { selectRow } = this.state;
    const { rowKey = 'key' } = this.props;
    if (JSON.stringify(selectRow) !== '{}')
      return record[rowKey] === selectRow[rowKey]
        ? `portal-table-row-selected row-key-${record[rowKey]}`
        : `row-key-${record[rowKey]}`;
  };

  handleExpand = (expanded, record) => {
    const { selectRow } = this.state;
    const { onRowExpand, onClick } = this.props;
    if (!isEqual(selectRow, record)) {
      this.setState({
        selectRow: record,
      });
      onClick(record);
    }
    onRowExpand(expanded, record);
  };

  handleMouseEnter = record => {
    const { rowKey = 'key' } = this.props;
    const row = document.getElementsByClassName(`row-key-${record[rowKey]}`)[0].children;
    for (let i = 0; i < row.length; i += 1) {
      row[i].style.overflow = 'visible';
      row[i].style.whiteSpace = 'normal';
    }
  };

  handleMouseLeave = record => {
    const { rowKey = 'key' } = this.props;
    const row = document.getElementsByClassName(`row-key-${record[rowKey]}`)[0].children;
    for (let i = 0; i < row.length; i += 1) {
      row[i].style.overflow = 'hidden';
      row[i].style.whiteSpace = 'nowrap';
    }
  };

  render() {
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey = 'key', // 用户指定rowKey，若未指定则为'key'
      expand = false,
      expandedRowKeys = [],
      className,
      ...otherProps
    } = this.props;
    const paginationProps =
      typeof pagination === 'boolean'
        ? pagination
        : {
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '30', '50'],
            ...pagination,
          };

    return (
      <div className={className || 'full-height'}>
        {expand ? (
          <Table
            {...COMMON_CONFIG}
            loading={loading}
            dataSource={list}
            pagination={paginationProps}
            columns={columns}
            onChange={this.handleTableChange}
            onRow={record => ({
              onClick: () => {
                this.handleClickRow(record);
              },
              onMouseEnter: () => {
                this.handleMouseEnter(record);
              },
              onMouseLeave: () => {
                this.handleMouseLeave(record);
              },
            })}
            onExpand={this.handleExpand}
            defaultExpandedRowKeys={expandedRowKeys}
            rowKey={rowKey}
            rowClassName={this.setClassName}
            {...otherProps}
          />
        ) : (
          <Table
            {...COMMON_CONFIG}
            loading={loading}
            dataSource={list}
            pagination={paginationProps}
            columns={columns}
            onChange={this.handleTableChange}
            onRow={record => ({
              onClick: () => {
                this.handleClickRow(record);
              },
              onMouseEnter: () => {
                this.handleMouseEnter(record);
              },
              onMouseLeave: () => {
                this.handleMouseLeave(record);
              },
            })}
            rowKey={rowKey}
            rowClassName={this.setClassName}
            {...otherProps}
          />
        )}
      </div>
    );
  }
}

export default BasicTable;
