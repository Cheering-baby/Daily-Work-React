import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import SCREEN from '@/utils/screen';
import Card from '../../components/Card';
import BreadcrumbComp from '../../components/BreadcrumbComp';
import styles from './index.less';
import SearchForm from './components/SearchForm';
import DailyMonthlyTable from './components/dailyMonthlyTable';

@connect(({ dailyAndMonthlyReport }) => ({
  dailyAndMonthlyReport,
}))
class DailyAndMonthlyReport extends Component {
  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_REPORTS_CENTER' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_GENERATED_REPORTS' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_DAILY_MONTHLY_REPORTS' }),
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
        <Row type="flex">
          <Col span={24}>
            <Card className={styles.cardStyle}>
              <SearchForm />
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <Row>
                <Col className={styles.inputColStyle} xs={24} sm={24} md={24}>
                  <DailyMonthlyTable />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DailyAndMonthlyReport;
