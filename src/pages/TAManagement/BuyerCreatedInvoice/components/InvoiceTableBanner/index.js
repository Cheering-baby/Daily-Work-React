import { Button, Card, Col, Empty, Icon, message, Modal, Row, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import { Document, Page } from 'react-pdf';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import 'isomorphic-fetch';
import DownloadButton from '@/pages/TAManagement/BuyerCreatedInvoice/components/DownloadButton';
import { downloadBuyerCreatedInvoiceUrl } from '@/pages/TAManagement/BuyerCreatedInvoice/services/buyerCreatedInvoiceService';
import ResponsivePagination from '@/pages/TAManagement/BuyerCreatedInvoice/components/ResponsivePagination';
import { PAGE_SIZE } from '@/pages/TAManagement/BuyerCreatedInvoice/consts/buyerCreatedInvoice';
import FixedCommissionDetail from '@/pages/TAManagement/BuyerCreatedInvoice/components/FixedCommissionDetail';
import download from '@/pages/ReportCenter/PamsReport/utils/downloadUtils';
import { exportReportUrl } from '@/pages/ReportCenter/PamsReport/services/adhocReportsService';
import PremiumDownloadButton from '@/pages/TAManagement/BuyerCreatedInvoice/components/PremiumDownloadButton';

const CommissionDetailModal = ({
  loading,
  visible,
  setVisible,
  selectedInvoice,
  dataList = [],
}) => {
  const handleCancel = () => {
    setVisible(false);
  };
  const { accountBookId, transactionDateFrom, transactionDateTo, filename } = selectedInvoice;

  const downloadBody = {
    filterList: [
      { key: 'accountBookId', value: accountBookId },
      { key: 'transactionDateFrom', value: transactionDateFrom },
      { key: 'transactionDateTo', value: transactionDateTo },
      { key: 'bciNo', value: filename },
    ],
    reportType: 'FixedCommissionReport',
    fileSuffixType: 'xlsx',
  };
  const disabled = !dataList || dataList.length === 0;
  return (
    <>
      <Modal
        title={<span className={styles.modalTitle}>Fixed Commission Report</span>}
        width={920}
        visible={visible}
        onCancel={() => handleCancel()}
        footer={
          <div style={{ float: 'right' }}>
            <PremiumDownloadButton
              url={exportReportUrl}
              body={downloadBody}
              method="POST"
              loading={loading}
              disabled={disabled}
            />
          </div>
        }
      >
        <FixedCommissionDetail selectedInvoice={selectedInvoice} />
      </Modal>
    </>
  );
};

const InvoiceDetailModal = ({
  loading,
  isMobile,
  dispatch,
  visible,
  setVisible,
  selectedInvoice,
  previewOfPdfBase64,
  dataList = [],
}) => {
  const [commissionDetailModalVisible, setCommissionDetailModalVisible] = useState(false);

  useEffect(() => {
    if (selectedInvoice.id) {
      dispatch({
        type: 'buyerCreatedInvoice/fetchPreviewOfPdf',
        payload: { id: selectedInvoice.id },
      });
    }
  }, [dispatch, selectedInvoice]);

  const modalWidth = 800;
  return (
    <>
      <Modal
        title={<span className={styles.modalTitle}>BUYER CREATED INVOICE</span>}
        className={styles.modalDetail}
        visible={visible}
        width={modalWidth}
        onCancel={() => setVisible(false)}
        footer={
          <div>
            {!isMobile && (
              <DownloadButton
                url={`${downloadBuyerCreatedInvoiceUrl}?id=${selectedInvoice &&
                  selectedInvoice.id}`}
                method="GET"
                defFileName="BuyerCreatedInvoice.pdf"
                disabled={!previewOfPdfBase64}
              />
            )}
            <Button
              type="primary"
              style={{ width: 80 }}
              htmlType="button"
              onClick={() => {
                setCommissionDetailModalVisible(true);
              }}
            >
              Detail
            </Button>
          </div>
        }
      >
        <Row>
          <Col span={24} style={{ userSelect: 'none' }}>
            <Document
              file={previewOfPdfBase64}
              error={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              noData={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            >
              <Page
                width={window.innerWidth < modalWidth ? window.innerWidth - 20 : modalWidth}
                pageNumber={1}
              />
            </Document>
          </Col>
        </Row>
      </Modal>
      <CommissionDetailModal
        loading={loading}
        visible={commissionDetailModalVisible}
        setVisible={setCommissionDetailModalVisible}
        selectedInvoice={selectedInvoice}
        dataList={dataList}
      />
    </>
  );
};

export const renderContent = text => {
  return (
    <Tooltip title={text} placement="topLeft">
      <div className={styles.ellipsis}>{text || <Icon type="minus" />}</div>
    </Tooltip>
  );
};

const TableComponent = ({
  loading,
  isMobile,
  dispatch,
  selectedRowKeys,
  setSelectedRowKeys,
  buyerCreatedInvoice: {
    table: { totalSize, pageSize = PAGE_SIZE, currentPage, dataList = [] },
    previewOfPdfBase64,
    commissionTable: { dataList: commissionDataList = [] },
  },
}) => {
  const [invoiceDetailModalVisible, setInvoiceDetailModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState({});

  const columns = [
    {
      key: 'id',
      title: formatMessage({ id: 'INVOICE_NO' }),
      dataIndex: 'id',
      render: renderContent,
    },
    {
      key: 'filename',
      title: formatMessage({ id: 'FILE_NAME' }),
      dataIndex: 'filename',
      render: renderContent,
    },
    {
      key: 'taName',
      title: formatMessage({ id: 'TA_NAME' }),
      dataIndex: 'taName',
      render: renderContent,
    },
    {
      key: 'invoiceDate',
      title: formatMessage({ id: 'INVOICE_DATE' }),
      dataIndex: 'invoiceDate',
      render: renderContent,
    },
    {
      key: 'agentCode',
      title: formatMessage({ id: 'AGENT_CODE' }),
      dataIndex: 'agentCode',
      render: renderContent,
    },
    {
      key: 'operation',
      title: formatMessage({ id: 'OPERATION' }),
      render: (text, row) => (
        <>
          <Tooltip placement="top" title="View Detail">
            <Icon
              type="eye"
              onClick={() => {
                setInvoiceDetailModalVisible(true);
                setSelectedInvoice(row);
              }}
            />
          </Tooltip>
          {!isMobile && (
            <Tooltip placement="top" title="Download File">
              <Icon
                type="download"
                onClick={() => {
                  download({
                    url: `${downloadBuyerCreatedInvoiceUrl}?id=${row.id}`,
                    method: 'GET',
                    defFileName: 'BuyerCreatedInvoice.pdf',
                    loading,
                  });
                }}
              />
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  const onSelectChange = keys => {
    setSelectedRowKeys(keys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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
          rowSelection={!isMobile && rowSelection}
          rowKey={record => record.id}
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
              type: 'buyerCreatedInvoice/fetchBuyerCreatedInvoiceList',
              payload: {
                currentPage: current,
                pageSize: size,
              },
            });
          }}
        />
      </Row>
      <InvoiceDetailModal
        dispatch={dispatch}
        isMobile={isMobile}
        loading={loading}
        visible={invoiceDetailModalVisible}
        setVisible={setInvoiceDetailModalVisible}
        selectedInvoice={selectedInvoice}
        setSelectedInvoice={setSelectedInvoice}
        previewOfPdfBase64={previewOfPdfBase64}
        dataList={commissionDataList}
      />
    </>
  );
};

const HeaderComponent = ({ selectedRowIds = [], loading, isMobile }) => {
  return (
    <div>
      {!isMobile && (
        <Tooltip title="Download Invoice Report">
          <Button
            type="primary"
            style={{ width: 80 }}
            htmlType="button"
            onClick={() => {
              if (selectedRowIds instanceof Array && selectedRowIds.length > 0) {
                selectedRowIds.forEach(id => {
                  download({
                    url: `${downloadBuyerCreatedInvoiceUrl}?id=${id}`,
                    method: 'GET',
                    defFileName: 'BuyerCreatedInvoice.pdf',
                    loading,
                    handleStatusIsNot200: () => message.warn(`Download pdf No.${id} failed.`),
                  });
                });
              } else {
                message.warn('Please select one invoice report at least.');
              }
            }}
          >
            {formatMessage({ id: 'BUTTON_DOWNLOAD' })}
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

const InvoiceTableBanner = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  return (
    <>
      <Card className={styles.card}>
        <Row>
          <Col span={24}>
            <MediaQuery minWidth={SCREEN.screenSm}>
              <HeaderComponent {...props} selectedRowIds={selectedRowKeys} />
            </MediaQuery>
          </Col>
          <Col span={24}>
            <TableComponent
              {...props}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default InvoiceTableBanner;
