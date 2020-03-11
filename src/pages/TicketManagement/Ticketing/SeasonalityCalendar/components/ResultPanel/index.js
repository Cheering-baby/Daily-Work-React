import React, { Component } from 'react';
import { connect } from 'dva';
import CalendarShow from '../CalendarShow';
import styles from './index.less';

@connect(({ seasonalityCalendarMgr }) => ({
  seasonalityCalendarMgr,
}))
class ResultPanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        <CalendarShow month="2020-03" />
      </div>
    );
  }
}

export default ResultPanel;
