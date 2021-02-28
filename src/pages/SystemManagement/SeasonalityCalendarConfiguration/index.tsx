import React from 'react';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import { Row, Col, Spin } from 'antd';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import LegendConfigure from './components/LegendConfigure';
import BookingCategory from './components/BookingCategory';
import styles from './index.less';

const title = [
  { name: formatMessage({ id: 'SYSTEM_MANAGEMENT' }) },
  { name: "Seasonality Calendar Configuration" },
];

const PeakPeriod = ({ searchLoading }) => {
  return (
    <Row>
      <MediaQuery minWidth={SCREEN.screenSm}>
        <BreadcrumbCompForPams title={title} />
      </MediaQuery>
      <Spin spinning={!!searchLoading}>
        <Col span={24} className={styles.container}>
          <LegendConfigure />
          <BookingCategory />
        </Col>
      </Spin>
    </Row>
  );
};

export default connect(({ loading }: { loading: any }) => ({
  searchLoading:
    loading.effects['peakPeriod/queryLegendColor'] ||
    loading.effects['peakPeriod/queryLegendConfigList'] ||
    loading.effects['peakPeriod/settingLegendConfigs'] ||
    loading.effects['peakPeriod/settingPeakPeriods'],
}))(PeakPeriod);
