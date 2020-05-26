import { Col, Row, Table, Tooltip } from 'antd';
import React from 'react';
import styles from './index.less';
import ResponsivePagination from '@/pages/ReportCenter/components/ResponsivePagination';
import { EMPTY_ARR, PAGE_SIZE } from '@/pages/ReportCenter/consts/pamsReport';

export const renderContent = text => {
  return (
    <Tooltip title={text} placement="topLeft">
      <div className={styles.ellipsis}>{text}</div>
    </Tooltip>
  );
};

const TableComponent = ({
  adhocReports: {
    basicTable: { columns = EMPTY_ARR, totalSize, pageSize = PAGE_SIZE, currentPage, dataList },
  },
  handlePageChange,
}) => {
  return (
    <>
      <Row style={{ marginTop: '10px' }}>
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={dataList}
          scroll={{ x: true }}
          pagination={false}
          className={styles.tableStyles}
          rowKey={(_, index) => index}
        />
      </Row>
      <Row style={{ marginTop: '10px', textAlign: 'right' }}>
        <ResponsivePagination
          totalSize={totalSize}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(current, size) => {
            handlePageChange(current, size);
          }}
        />
      </Row>
    </>
  );
};

const BasicTableBanner = props => {
  return (
    <>
      <Row>
        <Col span={24}>
          <TableComponent {...props} />
        </Col>
      </Row>
    </>
  );
};
export default BasicTableBanner;
