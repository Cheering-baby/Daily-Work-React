import React, { useEffect, useState } from 'react';
import { Button, Calendar, Icon, Tag } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import styles from './index.less';
import ScheduleTaskRecordCard from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskRecordCard';
import ScheduleTaskMoreRecordDrawer from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskMoreRecordDrawer';
import { DATE_FORMAT } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/common';
import useMobileDetector from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/hooks/useMobileDetector';

const RecordList = ({ _moment, dataMap = new Map(), operation }) => {
  const recordList = dataMap.get(_moment.format(DATE_FORMAT)) || [];
  const [visible, setVisible] = useState(false);
  const [isMobile] = useMobileDetector(window.innerWidth);
  return (
    <div>
      {isMobile && recordList.length > 0 ? (
        <Icon type="select" style={{ marginLeft: 5 }} onClick={() => setVisible(true)} />
      ) : (
        <div>
          {recordList.map(task => (
            <ScheduleTaskRecordCard
              key={task.jobLogCode}
              task={task}
              isDrawer={false}
              operation={operation}
            />
          ))}
          {recordList.length > 1 && (
            <>
              <Tag color="#87d068" className={styles.more} onClick={() => setVisible(true)}>
                More
              </Tag>
            </>
          )}
        </div>
      )}
      <ScheduleTaskMoreRecordDrawer
        recordList={recordList}
        createDate={_moment && _moment.format(DATE_FORMAT)}
        visible={visible}
        setVisible={setVisible}
        operation={operation}
      />
    </div>
  );
};

const HeaderButton = ({
  year,
  month,
  disableLeft = false,
  disableRight = false,
  handleLeft = () => {},
  handleRight = () => {},
}) => {
  return (
    <Button.Group className={styles.noBorder} style={{ width: 200 }}>
      <Button
        className={styles.noBorder}
        style={{ color: disableLeft ? 'white' : 'grey', backgroundColor: 'white' }}
        onClick={() => handleLeft()}
        disabled={disableLeft}
      >
        <Icon type="left" />
      </Button>
      <div className={styles.noBorder} style={{ width: 80, height: 32 }}>
        {`${year} ${moment()
          .month(month)
          .year(year)
          .format('MMM')}`}
      </div>
      <Button
        className={styles.noBorder}
        style={{ color: disableRight ? 'white' : 'grey', backgroundColor: 'white' }}
        onClick={() => handleRight()}
        disabled={disableRight}
      >
        <Icon type="right" />
      </Button>
    </Button.Group>
  );
};

const calcMonthAndYear = (_month, _year, type) => {
  let month = _month || 0;
  let year = _year || 2020;
  if (type === 'left') {
    if (_month - 1 < 0) {
      year = _year - 1;
      month = 11;
    } else {
      month = _month - 1;
    }
  }
  if (type === 'right') {
    if (_month + 1 > 11) {
      year = _year + 1;
      month = 0;
    } else {
      month = _month + 1;
    }
  }
  return [month, year];
};

const disableLeft = (from, _month, _year) => {
  const leftYear = from ? from.year() : 1970;
  const leftMonth = from ? from.month() : 0;
  const [month, year] = calcMonthAndYear(_month, _year, 'left');
  if (year < leftYear) {
    return true;
  }
  if (year === leftYear) {
    return month < leftMonth;
  }
  return false;
};

const disableRight = (to, _month, _year) => {
  const rightYear = to ? to.year() : 3000;
  const rightMonth = to ? to.month() : 12;
  const [month, year] = calcMonthAndYear(_month, _year, 'right');
  if (year > rightYear) {
    return true;
  }
  if (year === rightYear) {
    return month > rightMonth;
  }
  return false;
};

const ScheduleTaskCalendar = ({
  dispatch,
  scheduleTask: {
    calendarDataMap,
    calendarOptions,
    filterOptions: { processDate = [] },
  },
  operation,
}) => {
  const [processDateFrom, processDateTo] = processDate;
  const initialYear = processDateFrom ? processDateFrom.year() : moment().year();
  const initialMonth = processDateFrom ? processDateFrom.month() : moment().month();
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [isMobile] = useMobileDetector(window.innerWidth);

  useEffect(() => {
    const week = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    const weeks = document.getElementsByClassName('ant-fullcalendar-column-header-inner');
    for (let i = 0; i < weeks.length; i += 1) {
      weeks[i].textContent = week[i];
    }
  }, []);

  useEffect(() => {
    setMonth(initialMonth);
    setYear(initialYear);
  }, [initialMonth, initialYear]);

  useEffect(() => {
    dispatch({
      type: 'scheduleTask/fetchScheduleTaskLogList',
      payload: {
        calendarOptions: { ...calendarOptions, month, year },
      },
    });
  }, [month, year]);

  return (
    <>
      <div
        className={classnames({
          [styles.calendar]: true,
          [styles.mobile]: isMobile,
        })}
      >
        <HeaderButton
          year={year}
          month={month}
          disableLeft={disableLeft(processDateFrom, month, year)}
          disableRight={disableRight(processDateTo, month, year)}
          handleLeft={() => {
            const [newMonth, newYear] = calcMonthAndYear(month, year, 'left');
            setMonth(newMonth);
            setYear(newYear);
          }}
          handleRight={() => {
            const [newMonth, newYear] = calcMonthAndYear(month, year, 'right');
            setMonth(newMonth);
            setYear(newYear);
          }}
        />
        <Calendar
          mode="month"
          dateCellRender={_moment => (
            <RecordList operation={operation} _moment={_moment} dataMap={calendarDataMap} />
          )}
          value={moment()
            .year(year)
            .month(month)}
        />
        <div>
          <div style={{ color: '#D87A16', display: 'inline-block', marginRight: 10 }}>
            <div className={styles.badge} style={{ background: '#D87A16' }} />
            Monthly
          </div>
          <div style={{ color: '#4F6ED5', display: 'inline-block', marginRight: 10 }}>
            <div className={styles.badge} style={{ background: '#4F6ED5' }} />
            Ad-hoc
          </div>
          <div style={{ color: '#30B2AD', display: 'inline-block' }}>
            <div className={styles.badge} style={{ background: '#30B2AD' }} />
            Daily
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleTaskCalendar;
