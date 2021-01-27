import React from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Button, Input, Select, DatePicker } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { ConnectProps } from '@/types/model';
import { CommissionLogStateType } from '../models/commissionLog';
import styles from '../index.less';

interface PageProps extends ConnectProps {
  commissionLog: CommissionLogStateType;
}

type searchOptions =
  | 'commissionName'
  | 'queryOfferKey'
  | 'queryPluKey'
  | 'operationType'
  | 'createBy'
  | 'startDate'
  | 'endDate';

const { Option } = Select;

const hours = [];
const minutes = [];
const seconds = [];
for (let i = 0; i <= 23; i += 1) {
  hours.push(i);
}

for (let i = 0; i <= 59; i += 1) {
  minutes.push(i);
}

for (let i = 0; i <= 59; i += 1) {
  seconds.push(i);
}

const colLayout = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  style: {
    paddingRight: 15,
    paddingTop: 15,
  },
};

const Search: React.FC<PageProps> = props => {
  const {
    dispatch,
    commissionLog: {
      activeKey,
      searchOptions: {
        commissionName,
        queryOfferKey,
        queryPluKey,
        operationType,
        createBy,
        startDate,
        endDate,
      },
    },
  } = props;

  const search = () => {
    dispatch({
      type: 'commissionLog/queryCommissionAuditLogList',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  const reset = () => {
    dispatch({
      type: 'commissionLog/resetSearchOptions',
    });
    dispatch({
      type: 'commissionLog/queryCommissionAuditLogList',
    });
  };

  const changeSearchOptions = (type: searchOptions, value: any) => {
    const payload = {};

    if (type === 'startDate' || type === 'endDate') {
      payload[type] = value !== null ? value.format('YYYY-MM-DDTHH:mm:ss') : null;

      if (type === 'startDate' && endDate) {
        if (value !== null) {
          payload[type] =
            value.format('YYYY-MM-DDTHH:mm:ss') > endDate
              ? endDate
              : value.format('YYYY-MM-DDTHH:mm:ss');
        } else {
          payload[type] = null;
        }
      }

      if (type === 'endDate' && startDate) {
        if (value !== null) {
          payload[type] =
            value.format('YYYY-MM-DDTHH:mm:ss') < startDate
              ? startDate
              : value.format('YYYY-MM-DDTHH:mm:ss');
        } else {
          payload[type] = null;
        }
      }
    } else {
      payload[type] = value;
    }

    dispatch({
      type: 'commissionLog/saveSearchOptions',
      payload,
    });
  };

  const disableTime = (type: 'startDate' | 'endDate', time: 'hour' | 'minute' | 'second') => {
    if (
      type === 'startDate' &&
      endDate &&
      startDate &&
      moment(startDate).format('YYYY-MM-DD') === moment(endDate).format('YYYY-MM-DD')
    ) {
      const endHour = moment(endDate).format('HH');
      const endMinute = moment(endDate).format('mm');
      const endSecond = moment(endDate).format('ss');
      if (time === 'hour') {
        return hours.filter(i => i > endHour);
      }
      if (time === 'minute' && moment(startDate).format('HH') === moment(endDate).format('HH')) {
        return minutes.filter(i => i > endMinute);
      }
      if (
        time === 'second' &&
        moment(startDate).format('HH') === moment(endDate).format('HH') &&
        moment(startDate).format('mm') === moment(endDate).format('mm')
      ) {
        return minutes.filter(i => i > endSecond);
      }
    }

    if (
      type === 'endDate' &&
      startDate &&
      endDate &&
      startDate &&
      moment(startDate).format('YYYY-MM-DD') === moment(endDate).format('YYYY-MM-DD')
    ) {
      const endHour = moment(startDate).format('HH');
      const endMinute = moment(startDate).format('mm');
      const endSecond = moment(startDate).format('ss');
      if (time === 'hour') {
        return hours.filter(i => i < endHour);
      }
      if (time === 'minute' && moment(startDate).format('HH') === moment(endDate).format('HH')) {
        return minutes.filter(i => i < endMinute);
      }
      if (
        time === 'second' &&
        moment(startDate).format('HH') === moment(endDate).format('HH') &&
        moment(startDate).format('mm') === moment(endDate).format('mm')
      ) {
        return minutes.filter(i => i < endSecond);
      }
    }

    return [];
  };

  return (
    <Card className={styles.Search}>
      <Row>
        {activeKey === 'Tiered & Attendance' && (
          <Col {...colLayout}>
            <Input
              allowClear
              value={commissionName}
              placeholder={formatMessage({ id: 'COMMISSION_NAME' })}
              onChange={e => changeSearchOptions('commissionName', e.target.value)}
            />
          </Col>
        )}
        {activeKey !== 'Offline Fixed commission' && (
          <Col {...colLayout}>
            <Input
              allowClear
              value={queryOfferKey}
              onChange={e => changeSearchOptions('queryOfferKey', e.target.value)}
              placeholder={`${formatMessage({ id: 'OFFER_ID' })}/${formatMessage({
                id: 'OFFER_NUMBER',
              })}/${formatMessage({ id: 'OFFER_NAME' })}`}
            />
          </Col>
        )}
        <Col {...colLayout}>
          <Input
            allowClear
            value={queryPluKey}
            onChange={e => changeSearchOptions('queryPluKey', e.target.value)}
            placeholder={`${formatMessage({ id: 'PACKAGE_PLU' })}/${formatMessage({
              id: 'PLU_CODE',
            })}`}
          />
        </Col>
        <Col {...colLayout}>
          <Select
            allowClear
            value={operationType}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'OPERATION_TYPE' })}
            onChange={value => changeSearchOptions('operationType', value)}
          >
            <Option value="Add">{formatMessage({ id: 'ADD' })}</Option>
            <Option value="Update">{formatMessage({ id: 'UPDATE' })}</Option>
            <Option value="Delete">{formatMessage({ id: 'DELETE' })}</Option>
          </Select>
        </Col>
        <Col {...colLayout}>
          <Input
            allowClear
            value={createBy}
            placeholder={formatMessage({ id: 'CREATE_BY' })}
            onChange={e => changeSearchOptions('createBy', e.target.value)}
          />
        </Col>
        <Col {...colLayout}>
          <DatePicker
            allowClear
            style={{ width: '100%' }}
            format="DD-MMM-YYYY HH:mm:ss"
            value={startDate ? moment(startDate) : null}
            placeholder={formatMessage({ id: 'START_DATE' })}
            onChange={date => changeSearchOptions('startDate', date)}
            showTime={{
              defaultValue: moment('00:00:00', 'HH:mm:ss'),
              disabledHours: () => disableTime('startDate', 'hour'),
              disabledMinutes: () => disableTime('startDate', 'minute'),
              disabledSeconds: () => disableTime('startDate', 'second'),
            }}
            disabledDate={current => current && endDate && current > moment(endDate).startOf('day')}
          />
        </Col>
        <Col {...colLayout}>
          <DatePicker
            allowClear
            style={{ width: '100%' }}
            format="DD-MMM-YYYY HH:mm:ss"
            value={endDate ? moment(endDate) : null}
            placeholder={formatMessage({ id: 'END_DATE' })}
            onChange={date => changeSearchOptions('endDate', date)}
            showTime={{
              defaultValue: moment('00:00:00', 'HH:mm:ss'),
              disabledHours: () => disableTime('endDate', 'hour'),
              disabledMinutes: () => disableTime('endDate', 'minute'),
              disabledSeconds: () => disableTime('endDate', 'second'),
            }}
            disabledDate={current =>
              current && startDate && current < moment(startDate).startOf('day')
            }
          />
        </Col>
        <Col
          {...colLayout}
          style={{ float: 'right', paddingTop: 15, paddingRight: 15, textAlign: 'right' }}
        >
          <Button type="primary" style={{ width: 65, marginRight: 15 }} onClick={search}>
            {formatMessage({ id: 'SEARCH' })}
          </Button>
          <Button style={{ width: 65 }} onClick={reset}>
            {formatMessage({ id: 'RESET' })}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ commissionLog }: { commissionLog: CommissionLogStateType }) => ({
  commissionLog,
}))(Search);
