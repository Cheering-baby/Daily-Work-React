import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from 'antd';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import SCREEN from '@/utils/screen';
import ScheduleForm from '../../../components/ScheduleForm';
import BreadcrumbComp from '../../../components/BreadcrumbComp';

@Form.create()
@connect(({ scheduleTask }) => ({
  scheduleTask,
}))
class ScheduleTransaction extends Component {
  cancel = () => {
    router.push({
      pathname: '/ReportsCenter/GeneratedReports/ScheduleTask',
    });
  };

  render() {
    const {
      location: {
        query: { reportType },
      },
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
        breadcrumbName: 'New',
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
        <ScheduleForm reportType={reportType} sourcePage="scheduleTask" type="new" />
      </div>
    );
  }
}

export default ScheduleTransaction;
