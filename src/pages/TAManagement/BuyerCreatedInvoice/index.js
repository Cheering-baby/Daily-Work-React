import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Col, Row, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import MediaQuery from 'react-responsive';
import styles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import InvoiceFilterBanner from '@/pages/TAManagement/BuyerCreatedInvoice/components/InvoiceFilterBanner';
import InvoiceTableBanner from '@/pages/TAManagement/BuyerCreatedInvoice/components/InvoiceTableBanner';
import { PAGE_SIZE } from '@/pages/TAManagement/BuyerCreatedInvoice/consts/buyerCreatedInvoice';
import useLoading from '@/pages/ReportCenter/PamsReport/hooks/useLoading';
import useMobileDetector from '@/pages/TAManagement/BuyerCreatedInvoice/hooks/useMobileDetector';

const breadcrumbArr = [
  { breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }) },
  {
    breadcrumbName: formatMessage({ id: 'BUYER_CREATED_INVOICE' }),
    url: '/TAManagement/BuyerCreatedInvoice',
  },
];

const mapStateToProps = ({ buyerCreatedInvoice, loading }) => ({
  buyerCreatedInvoice,
  loadingFlag:
    loading.effects['buyerCreatedInvoice/fetchBuyerCreatedInvoiceList'] ||
    loading.effects['buyerCreatedInvoice/fetchPreviewOfPdf'],
  fetchTaNameListLoadingFlag: loading.effects['buyerCreatedInvoice/fetchTaNameList'],
  fetchFixedCommissionListLoadingFlag:
    loading.effects['buyerCreatedInvoice/fetchFixedCommissionList'],
});

const BuyerCreatedInvoice = props => {
  const {
    dispatch,
    loadingFlag = false,
    fetchTaNameListLoadingFlag = false,
    location: {
      query: { fileName },
    },
  } = props;
  useEffect(() => {
    (async function asyncFunction() {
      dispatch({ type: 'buyerCreatedInvoice/fetchTaNameList' });
      const taxInvoiceList = await dispatch({
        type: 'buyerCreatedInvoice/fetchBuyerCreatedInvoiceList',
        payload: { fileName },
      });
      const findTarget = fileName ? taxInvoiceList.find(i => i.filename === fileName) : null;
      if (findTarget) {
        await dispatch({
          type: 'buyerCreatedInvoice/fetchPreviewOfPdf',
          payload: { id: findTarget.id },
        });
        dispatch({
          type: 'buyerCreatedInvoice/updateState',
          payload: {
            invoiceDetailModalVisible: true,
            selectedInvoice: findTarget,
          },
        });
      }
    })();
  }, [dispatch]);

  const [downloadLoadingFlag, open, close] = useLoading();
  const [isMobile] = useMobileDetector(window.innerWidth);

  const handleSearch = filterOptions => {
    dispatch({
      type: 'buyerCreatedInvoice/fetchBuyerCreatedInvoiceList',
      payload: {
        filterOptions,
      },
    });
  };

  const handleReset = () => {
    dispatch({
      type: 'buyerCreatedInvoice/fetchBuyerCreatedInvoiceList',
      payload: {
        filterOptions: {},
        currentPage: 1,
        pageSize: PAGE_SIZE,
      },
    });
  };

  return (
    <>
      <Row>
        <Col span={24} className={styles.pageHeaderTitle}>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
        </Col>
        <Col span={24} style={{ marginTop: '10px' }}>
          <Spin spinning={loadingFlag}>
            <InvoiceFilterBanner
              {...props}
              handleSearch={handleSearch}
              handleReset={handleReset}
              fetchTaNameListLoadingFlag={fetchTaNameListLoadingFlag}
            />
          </Spin>
        </Col>
        <Col span={24} style={{ marginTop: '10px' }}>
          <Spin spinning={loadingFlag || downloadLoadingFlag}>
            <InvoiceTableBanner {...props} loading={{ open, close }} isMobile={isMobile} />
          </Spin>
        </Col>
      </Row>
    </>
  );
};

export default connect(mapStateToProps)(BuyerCreatedInvoice);
