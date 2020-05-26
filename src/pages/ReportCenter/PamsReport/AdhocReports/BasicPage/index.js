import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Row, Spin } from 'antd';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

import SCREEN from '@/utils/screen';
import { PAGE_SIZE, PATH_PAMS_REPORT_ADHOC_REPORTS } from '@/pages/ReportCenter/consts/pamsReport';
import BasicFilterBanner from '@/pages/ReportCenter/PamsReport/AdhocReports/components/BasicFilterBanner';
import BasicTableBanner from '@/pages/ReportCenter/PamsReport/AdhocReports/components/BasicTableBanner';
import download from '@/pages/ReportCenter/PamsReport/utils/downloadUtils';
import { exportReportUrl } from '@/pages/ReportCenter/PamsReport/services/adhocReportsService';
import BreadcrumbComp from '@/pages/ReportCenter/components/BreadcrumbComp';
import FetchReportRequestProcessor
  from '@/pages/ReportCenter/PamsReport/utils/Processor/Fetch/FetchReportRequestProcessor';
import useLoading from '@/pages/ReportCenter/PamsReport/hooks/useLoading';

const mapStateToProps = ({ adhocReports, loading }) => ({
  adhocReports,
  loadingFlag:
    loading.effects['adhocReports/fetchReportByFilter'] ||
    loading.effects['adhocReports/fetchReportFilterList'],
});

const BasicPage = props => {
  const {
    dispatch,
    loadingFlag = false,
    location: {
      query: { _reportType = '' },
    },
    adhocReports: { reportTypeMapping = {}, filterOptions, filterList = [] },
  } = props;

  useEffect(() => {
    dispatch({
      type: 'adhocReports/fetchReportFilterList',
      payload: {
        reportType: _reportType,
      },
    }).then(() => {
      dispatch({
        type: 'adhocReports/fetchReportByFilter',
        payload: {
          reportType: _reportType,
          filterOptions: { reportType: _reportType },
        },
      });
    });
  }, [_reportType, dispatch]);

  useEffect(() => {
    if (Object.keys(reportTypeMapping).length === 0) {
      dispatch({ type: 'adhocReports/fetchAdhocReportList' });
    }
  }, [dispatch, reportTypeMapping]);

  const breadcrumbArr = useMemo(
    () => [
      { breadcrumbName: formatMessage({ id: 'REPORT_CENTER' }) },
      { breadcrumbName: formatMessage({ id: 'PAMS' }) },
      {
        breadcrumbName: formatMessage({ id: 'ADHOC_REPORTS' }),
        url: PATH_PAMS_REPORT_ADHOC_REPORTS,
      },
      {
        breadcrumbName: reportTypeMapping[_reportType],
      },
    ],
    [_reportType, reportTypeMapping],
  );

  const handleSearch = (_filterOptions = {}) => {
    dispatch({
      type: 'adhocReports/fetchReportByFilter',
      payload: {
        filterOptions: { ..._filterOptions, reportType: _reportType },
      },
    });
  };

  const handleReset = useCallback(() => {
    dispatch({
      type: 'adhocReports/fetchReportByFilter',
      payload: {
        filterOptions: { reportType: _reportType },
        currentPage: 1,
        pageSize: PAGE_SIZE,
      },
    });
  }, [_reportType, dispatch]);

  const handlePageChange = useCallback(
    (_current, _size) => {
      dispatch({
        type: 'adhocReports/fetchReportByFilter',
        payload: {
          currentPage: _current,
          pageSize: _size,
        },
      });
    },
    [dispatch],
  );

  const [loading, open, close] = useLoading();

  return (
    <>
      <Row>
        <Col span={20} xs={24} sm={24} md={20} className={styles.pageHeaderTitle}>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
        </Col>
        <Col span={4} xs={24} sm={24} md={4} className={styles.right}>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <Button
              type="primary"
              onClick={() => {
                download({
                  url: exportReportUrl,
                  method: 'POST',
                  body: FetchReportRequestProcessor.transform2DownloadReqParams({
                    filterOptions,
                    filterList,
                  }),
                  loading: { open, close },
                });
              }}
            >
              Download
            </Button>
          </MediaQuery>
        </Col>
        <Col span={24} style={{ marginTop: '10px' }}>
          <Card
            className={styles.card}
            title={
              <div style={{ fontWeight: 600, marginLeft: 5 }}>{reportTypeMapping[_reportType]}</div>
            }
          >
            <Row>
              {filterList.length > 0 && (
                <Col span={24}>
                  <Spin spinning={loadingFlag || loading}>
                    <BasicFilterBanner
                      {...props}
                      reportType={_reportType}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  </Spin>
                </Col>
              )}
              <Col span={24} style={{ marginTop: '10px' }}>
                <Spin spinning={loadingFlag || loading}>
                  <BasicTableBanner {...props} handlePageChange={handlePageChange} />
                </Spin>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default connect(mapStateToProps)(BasicPage);
