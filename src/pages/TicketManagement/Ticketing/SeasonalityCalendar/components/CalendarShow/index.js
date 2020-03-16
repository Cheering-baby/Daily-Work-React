import React, { Component } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import styles from './index.less';

class CalendarShow extends Component {
  dateFullCellRender = data => {
    const { peakPeriods = [] } = this.props;
    const date = data.format('YYYY-MM-DD');
    const day = data.format('DD');

    let peak = false;
    if (peakPeriods.indexOf(date) !== -1) {
      peak = true;
    }
    return (
      <div className={peak ? styles.dayPeak : styles.day}>
        <span className={peak ? styles.peak : styles.day}>{day}</span>
      </div>
    );
  };

  render() {
    const { month } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.month}>{moment(month).format('MMMM')}</div>
        <div>
          <Calendar
            fullscreen={false}
            style={{ width: '100%' }}
            dateFullCellRender={this.dateFullCellRender}
            value={moment(month)}
          />
        </div>
      </div>
    );
  }
}

export default CalendarShow;
