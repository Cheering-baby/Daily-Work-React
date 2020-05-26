import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Row, List, Spin } from 'antd';
import CalendarShow from '../CalendarShow';
import styles from './index.less';

const infoPanelGrid = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8, xxl: 8 };
@connect(({ seasonalityCalendarMgr, loading }) => ({
  seasonalityCalendarMgr,
  searchLoading: loading.effects['seasonalityCalendarMgr/queryPeakDateList'],
}))
class ResultPanel extends Component {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      50;
    this.state = {
      clientHeight,
    };
  }

  render() {
    const {
      seasonalityCalendarMgr: { peakPeriods = [], showYear },
      searchLoading,
    } = this.props;
    const { clientHeight } = this.state;
    if (showYear) {
      const month = [];
      for (let i = 1; i < 13; i += 1) {
        if (i < 10) {
          month.push(`${showYear}-0${i}`);
        } else {
          month.push(`${showYear}-${i}`);
        }
      }
      return (
        <Spin spinning={!!searchLoading} style={{ heigth: '100%' }}>
          <div className={styles.container}>
            <Row>
              {month.map(item => (
                <Col
                  {...infoPanelGrid}
                  style={{ marginBottom: '10px', paddingRight: '10px' }}
                  key={item}
                >
                  <CalendarShow month={item} peakPeriods={peakPeriods} key={item} />
                </Col>
              ))}
            </Row>
          </div>
        </Spin>
      );
    }
    return (
      <Spin spinning={!!searchLoading}>
        <div className={styles.container} style={{ minHeight: clientHeight }}>
          <List style={{ marginTop: 100 }} />
        </div>
      </Spin>
    );
  }
}

export default ResultPanel;
