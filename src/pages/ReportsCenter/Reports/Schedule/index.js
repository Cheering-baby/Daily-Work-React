import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../components/BreadcrumbComp';
import ScheduleForm from '../../components/ScheduleForm/index';

class ScheduleTransaction extends Component {
  cancel = () => {
    router.push({
      pathname: '/ReportsCenter/Reports',
    });
  };

  render() {
    const {
      location: {
        query: { reportType, reportType2 },
      },
    } = this.props;

    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_REPORTS_CENTER' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_REPORTS' }),
        url: '/ReportsCenter/Reports',
      },
      {
        breadcrumbName: formatMessage({ id: 'SCHEDULE_TRANSACTION' }),
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
        <ScheduleForm reportType={reportType} reportType2={reportType2} sourcePage="reports" />
      </div>
    );
  }
}

export default ScheduleTransaction;
