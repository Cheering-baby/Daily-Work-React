import React from 'react';
import { Icon, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import ResponsivePagination from '@/pages/ReportCenter/components/ResponsivePagination';

const ReceiverTable = ({
                         onPageChange,
                         currentPage,
                         pageSize,
                         totalSize,
                         dataList = [],
                         handleAdd,
                         handleDel,
                         rowSelection,
                         fetchReceiverListLoadingFlag,
                       }) => {
  const renderCol = (text, row, index, col) => {
    if (row.type === 'ADD' && index === 0 && handleAdd) {
      if (col === 0)
        return {
          children: (
            <a
              onClick={() => {
                handleAdd();
              }}
            >
              + Add
            </a>
          ),
          props: { colSpan: 4 },
        };
      return {
        props: { colSpan: 0 },
      };
    }
    if (col === 0) {
      const no = index + (currentPage - 1) * pageSize;
      return handleAdd ? no : no + 1;
    }
    if (col === 4) {
      return (
        <Tooltip placement="top" title="Delete">
          <Icon
            type="delete"
            onClick={() => {
              handleDel(row);
            }}
          />
        </Tooltip>
      );
    }
    return (
      <Tooltip title={text}>
        <span>{text}</span>
      </Tooltip>
    );
  };

  const columns = [
    {
      key: 'no',
      title: formatMessage({ id: 'NO' }),
      dataIndex: 'no',
      render: (...args) => renderCol(...args, 0),
    },
    {
      key: 'userCode',
      title: formatMessage({ id: 'USER_CODE' }),
      dataIndex: 'userCode',
      render: (...args) => renderCol(...args, 1),
    },
    {
      key: 'userType',
      title: formatMessage({ id: 'USER_TYPE' }),
      dataIndex: 'userTypeName',
      render: (...args) => renderCol(...args, 2),
    },
  ];

  if (handleAdd)
    columns.push({
      key: 'operation',
      title: formatMessage({ id: 'OPERATION' }),
      render: (...args) => renderCol(...args, 4),
    });

  // TODO optimize
  let hasSelected = false;
  if (rowSelection) {
    const { selectedRowKeys } = rowSelection;
    hasSelected = selectedRowKeys && selectedRowKeys.length >= 0;
  }

  return (
    <>
      <Row>
        {hasSelected && (
          <div style={{ marginBottom: 10, marginLeft: 3 }}>
            Selected {rowSelection.selectedRowKeys.length} receivers
          </div>
        )}
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={dataList}
          scroll={{ x: true }}
          pagination={false}
          className={styles.tableStyles}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          loading={fetchReceiverListLoadingFlag}
        />
      </Row>
      <Row style={{ marginTop: 10, textAlign: 'right' }}>
        <ResponsivePagination
          totalSize={totalSize}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </Row>
    </>
  );
};

export default ReceiverTable;
