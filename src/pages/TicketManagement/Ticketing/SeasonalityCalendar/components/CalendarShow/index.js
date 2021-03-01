import React, { Component } from 'react';
import { Calendar, Popover } from 'antd';
import moment from 'moment';
import styles from './index.less';

class CalendarShow extends Component {
  dateFullCellRender = data => {
    const { peakPeriodConfigs } = this.props;
    const date = data.format('YYYY-MM-DD');
    const day = data.format('DD');

    let showTotalContent;
    let peakItems = peakPeriodConfigs.filter(
      item => moment(item.startDate) <= data && moment(item.endDate) >= data
    );

    if (peakItems.length > 0) {
      showTotalContent = peakItems.map((item, index) => (
        <div
          style={{
            borderBottom: index + 1 !== peakItems.length ? '1px solid #fff' : null,
            opacity: 0.7,
            paddingBottom: 5,
            marginTop: index !== 0 ? 5 : 0,
            color: '#fff',
          }}
        >
          <div style={{ minWidth: 50, maxWidth: 450, display: 'flex', alignItems: 'center' }}>
            <span
              className={styles.color}
              style={{ marginRight: 5, backgroundColor: item.attractionValue }}
            ></span>
            <span className={styles.legendName}>{item.legendName}</span>
          </div>
          <div className={styles.remarks}>{item.remarks}</div>
        </div>
      ));
    }

    return (
      <div className={styles.day}>
        {peakItems.length > 0 ? (
          <Popover
            placement="bottom"
            content={showTotalContent}
            // visible
            overlayClassName={styles.popover}
          >
            <div className={styles.dayShow}>{day}</div>
          </Popover>
        ) : (
          <>
            <div className={styles.dayShow}>{day}</div>
          </>
        )}
        <div className={styles.colorContainer}>
          {peakItems.map(item => (
            <div className={styles.colorItem}>
              <span
                className={styles.color}
                style={{ backgroundColor: item.attractionValue || 'rgb(255, 86, 1)' }}
              ></span>
            </div>
          ))}
        </div>
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
