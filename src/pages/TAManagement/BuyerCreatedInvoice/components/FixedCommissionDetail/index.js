import { Row, Spin, Table } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import ResponsivePagination from '../ResponsivePagination';
import { PAGE_SIZE } from '@/pages/TAManagement/BuyerCreatedInvoice/consts/buyerCreatedInvoice';

const mapStateToProps = ({ buyerCreatedInvoice, loading }) => ({
  buyerCreatedInvoice,
  fetchFixedCommissionListLoadingFlag:
    loading.effects['buyerCreatedInvoice/fetchFixedCommissionList'],
});

const FixedCommissionDetail = ({
  dispatch,
  selectedInvoice: { transactionDateFrom, transactionDateTo, accountBookId, filename },
  buyerCreatedInvoice: {
    commissionTable: { totalSize, pageSize = PAGE_SIZE, currentPage, dataList, columns },
  },
  fetchFixedCommissionListLoadingFlag = false,
}) => {
  useEffect(() => {
    if (accountBookId) {
      dispatch({
        type: 'buyerCreatedInvoice/fetchFixedCommissionList',

        payload: { transactionDateFrom, transactionDateTo, accountBookId, bciNo: filename },
      });
    }
  }, [dispatch, transactionDateFrom, transactionDateTo, accountBookId, filename]);

  return (
    <>
      <Spin spinning={fetchFixedCommissionListLoadingFlag}>
        <Row>
          <Table
            bordered
            size="small"
            columns={columns}
            dataSource={dataList}
            scroll={{ x: true }}
            pagination={false}
            className={styles.tableStyles}
          />
        </Row>
        <Row style={{ marginTop: '10px', textAlign: 'right' }}>
          <ResponsivePagination
            totalSize={totalSize}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={(current, size) => {
              dispatch({
                type: 'buyerCreatedInvoice/fetchFixedCommissionList',
                payload: {
                  transactionDateFrom,
                  transactionDateTo,
                  accountBookId,
                  bciNo: filename,
                  currentPage: current,
                  pageSize: size,
                },
              });
            }}
          />
        </Row>
      </Spin>
    </>
  );
};

export default connect(mapStateToProps)(FixedCommissionDetail);
