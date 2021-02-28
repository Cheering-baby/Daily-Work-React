import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../components/BreadcrumbComp';
import ResultPanel from './components/ResultPanel';
import SearchPanel from './components/SearchPanel';

@connect(({ seasonalityCalendarMgr }) => ({
  seasonalityCalendarMgr,
}))
class seasonalityCalendar extends Component {
  render() {
    const title = [{ name: 'Ticketing' }, { name: 'Seasonality Calendar' }];
    const searchPanelGrid = { xs: 24, sm: 24, md: 9, lg: 8, xl: 6, xxl: 6 };
    const infoPanelGrid = { xs: 24, sm: 24, md: 15, lg: 16, xl: 18, xxl: 18 };
    return (
      <div>
        <MediaQuery minWidth={SCREEN.screenSm}>
          <div style={{ height: 34 }}>
            <BreadcrumbComp title={title} />
          </div>
        </MediaQuery>
        <Row>
          <Col
            {...searchPanelGrid}
            style={{ paddingLeft: '6px', paddingRight: '6px', marginTop: '10px' }}
          >
            <SearchPanel />
          </Col>
          <Col
            {...infoPanelGrid}
            style={{ paddingLeft: '6px', paddingRight: '6px', marginTop: '10px' }}
          >
            <ResultPanel />
          </Col>
        </Row>
      </div>
    );
  }
}

export default seasonalityCalendar;
