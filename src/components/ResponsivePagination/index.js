import React from 'react';
import { Pagination } from 'antd';
import MediaQuery from 'react-responsive';
import SCREEN from '@/utils/screen';

const ResponsivePagination = props => {
  const { totalSize, pageSize, currentPage, onPageChange } = props;
  const pageOpts = {
    size: 'small',
    showSizeChanger: true,
    showQuickJumper: true,
    total: totalSize,
    current: currentPage,
    pageSize,
    showTotal: () => `Total ${totalSize} items`,
    onChange: (page, size) => onPageChange(page, size),
    onShowSizeChange: (page, size) => onPageChange(page, size),
  };
  return (
    <>
      <MediaQuery maxWidth={SCREEN.screenMd - 1}>
        <Pagination simple {...pageOpts} />
      </MediaQuery>
      <MediaQuery minWidth={SCREEN.screenMd}>
        <Pagination {...pageOpts} />
      </MediaQuery>
    </>
  );
};

export default ResponsivePagination;
