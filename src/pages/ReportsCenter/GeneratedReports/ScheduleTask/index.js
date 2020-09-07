import React from 'react';
import { connect } from 'dva';
import { Row, Spin } from 'antd';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import ScheduleTaskFilterBanner from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskFilterBanner';
import ScheduleTaskDisplayBanner from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskDisplayBanner';
import BreadcrumbComp from '../../components/BreadcrumbComp';

const breadcrumbArr = [
  {
    breadcrumbName: formatMessage({ id: 'REPORT_CENTER' }),
    url: null,
  },
  {
    breadcrumbName: formatMessage({ id: 'MENU_GENERATED_REPORTS' }),
    url: null,
  },
  {
    breadcrumbName: formatMessage({ id: 'SCHEDULE_TASK' }),
    url: null,
  },
];

const waterMarkProps = {
  id: 'watermark',
  style: { width: '100%', height: '100%' },
  className: styles['watermark-box'],
};

const mapStateToProps = ({ scheduleTask, loading, user }) => ({
  scheduleTask,
  userAuthorities: user.userAuthorities,
  loadingFlag:
    loading.effects['scheduleTask/fetchScheduleTaskLogList'] ||
    loading.effects['scheduleTask/disableScheduleTask'] ||
    loading.effects['scheduleTask/fetchScheduleTaskDetail'] ||
    loading.effects['scheduleTask/fetchDictionary'],
  fetchReportNameListDataLoadingFlag: loading.effects['scheduleTask/fetchReportNameListData'],
});

const ScheduleTask = props => {
  const { dispatch, loadingFlag = false } = props;

  const fetchDataList = payload => {
    dispatch({
      type: 'scheduleTask/fetchScheduleTaskLogList',
      payload,
    });
  };

  return (
    <>
      <Spin spinning={loadingFlag}>
        <div {...waterMarkProps}>
          <Row>
            <MediaQuery
              maxWidth={SCREEN.screenMdMax}
              minWidth={SCREEN.screenSmMin}
              minHeight={SCREEN.screenSmMin}
            >
              <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
            </MediaQuery>
            <MediaQuery minWidth={SCREEN.screenLgMin}>
              <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
            </MediaQuery>
          </Row>
          <Row style={{ marginTop: '10px', marginLeft: 10, marginRight: 10 }}>
            <ScheduleTaskFilterBanner {...props} fetchDataList={fetchDataList} />
          </Row>
          <Row style={{ marginTop: '10px', marginBottom: '10px', marginLeft: 10, marginRight: 10 }}>
            <ScheduleTaskDisplayBanner {...props} fetchDataList={fetchDataList} />
          </Row>
        </div>
      </Spin>
    </>
  );
};

export default connect(mapStateToProps)(ScheduleTask);
