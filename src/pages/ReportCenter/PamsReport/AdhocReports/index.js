import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Col, message, Row, Spin } from 'antd';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';
import BreadcrumbComp from '@/pages/ReportCenter/components/BreadcrumbComp';

import SCREEN from '@/utils/screen';
import {
  PATH_PAMS_REPORT_ADHOC_REPORTS_BASIC_PAGE,
  REPORT_COLOR_LIST,
} from '@/pages/ReportCenter/consts/pamsReport';
import ReportCard from '@/pages/ReportCenter/PamsReport/AdhocReports/components/ReportCard';
import download from '@/pages/ReportCenter/PamsReport/utils/downloadUtils';
import { exportReportUrl } from '@/pages/ReportCenter/PamsReport/services/adhocReportsService';
import FetchReportRequestProcessor from '@/pages/ReportCenter/PamsReport/utils/Processor/Fetch/FetchReportRequestProcessor';
import useLoading from '@/pages/ReportCenter/PamsReport/hooks/useLoading';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';
import REPORT_AUTHORITY_MAP from '@/pages/ReportCenter/PamsReport/consts/authority';

const mapStateToProps = ({ adhocReports, loading }) => ({
  adhocReports,
  loadingFlag:
    loading.effects['adhocReports/fetchAdhocReportList'] ||
    loading.effects['adhocReports/fetchReportByFilter'] ||
    loading.effects['adhocReports/fetchReportFilterList'],
});

const breadcrumbArr = [
  { breadcrumbName: formatMessage({ id: 'REPORT_CENTER' }) },
  { breadcrumbName: formatMessage({ id: 'PAMS' }) },
  {
    breadcrumbName: formatMessage({ id: 'ADHOC_REPORTS' }),
  },
];

const AdhocReports = props => {
  const {
    dispatch,
    loadingFlag = false,
    history,
    adhocReports: { reportList = [], filterOptions, filterList },
  } = props;

  const [loading, open, close] = useLoading();

  useEffect(() => {
    dispatch({ type: 'adhocReports/fetchAdhocReportList' });
  }, [dispatch]);

  const handleClick = _reportType => {
    history.push({
      pathname: PATH_PAMS_REPORT_ADHOC_REPORTS_BASIC_PAGE,
      query: { _reportType },
    });
  };

  const handleDownload = (_reportType, updateTime) => {
    if (!updateTime) {
      message.info('There is no data to be downloaded in the report.');
      return;
    }
    const body = FetchReportRequestProcessor.transform2DownloadReqParams({
      filterOptions: { ...filterOptions, reportType: _reportType },
      filterList,
    });
    body.filterList.push({
      key: 'updateTimeFrom',
      value: moment(updateTime)
        .startOf('date')
        .valueOf(),
    });
    body.filterList.push({
      key: 'updateTimeTo',
      value: moment(updateTime)
        .endOf('date')
        .valueOf(),
    });
    download({
      url: exportReportUrl,
      method: 'POST',
      body,
      loading: { open, close },
    });
  };

  const colSpan = window.innerWidth >= SCREEN.screenSm ? 6 : 24;

  return (
    <>
      <Row>
        <Col span={20} xs={24} sm={24} md={20} className={styles.pageHeaderTitle}>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
        </Col>
        <Col span={24} style={{ marginTop: '10px' }}>
          <Spin spinning={loadingFlag || loading}>
            <Card className={styles.card}>
              <Row>
                <Col span={24} className={styles.title}>
                  Report
                </Col>
              </Row>
              <Row gutter={20}>
                {reportList.map((item, index) => {
                  return (
                    hasAllPrivilege([REPORT_AUTHORITY_MAP[item.reportType]]) && (
                      <Col span={colSpan} className={styles.reportCard} key={item.reportType}>
                        <ReportCard
                          onClick={handleClick}
                          onDownload={handleDownload}
                          reportType={item.reportType}
                          reportName={item.reportName}
                          updateDate={item.updateDate}
                          updateTime={item.updateTime}
                          color={REPORT_COLOR_LIST[index % REPORT_COLOR_LIST.length]}
                        />
                      </Col>
                    )
                  );
                })}
              </Row>
            </Card>
          </Spin>
        </Col>
      </Row>
    </>
  );
};

export default connect(mapStateToProps)(AdhocReports);
