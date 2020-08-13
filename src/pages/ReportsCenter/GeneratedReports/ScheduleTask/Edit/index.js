import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from 'antd';
import { formatMessage } from 'umi/locale';
import MediaQuery from 'react-responsive';
import ScheduleForm from '../../../components/ScheduleForm';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import SCREEN from '@/utils/screen';

@Form.create()
@connect(({ scheduleTransaction, reportCenter, scheduleTask, loading }) => ({
  scheduleTransaction,
  reportCenter,
  scheduleTask,
  displayLoading: loading.effects['reportCenter/fetchDisplay'],
}))
class ScheduleTransaction extends Component {
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { jobCode },
      },
    } = this.props;
    dispatch({
      type: 'scheduleTask/fetchScheduleTaskDetail',
      payload: { jobCode },
    });
  }

  cancel = () => {
    router.push({
      pathname: '/ReportsCenter/Reports',
    });
  };

  render() {
    const {
      location: {
        query: { reportType, jobCode },
      },
      scheduleTask: { detailList },
    } = this.props;

    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'REPORT_CENTER' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_REPORTS' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'SCHEDULE_TASK' }),
        url: '/ReportsCenter/GeneratedReports/ScheduleTask',
      },
      {
        breadcrumbName: 'Edit',
        url: null,
      },
    ];
    return (
      <div>
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
        <ScheduleForm
          reportType={reportType}
          reportType2={reportType}
          jobCode={jobCode}
          sourcePage="scheduleTask"
          type="edit"
          detailList={detailList}
        />
      </div>
    );
  }
}

export default ScheduleTransaction;
