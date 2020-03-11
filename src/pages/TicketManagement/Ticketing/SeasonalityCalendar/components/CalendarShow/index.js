import React, { Component } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default class CalendarShow extends Component {
  componentDidMount() {
    const week = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const weeks = document.getElementsByClassName('ant-fullcalendar-column-header-inner');
    for (let i = 0; i < weeks.length; i += 1) {
      weeks[i].textContent = week[i];
    }
  }

  render() {
    const { month } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.month}>{moment(month).format('MMM')}</div>
        <div>
          <Calendar fullscreen={false} />
        </div>
      </div>
    );
  }
}
