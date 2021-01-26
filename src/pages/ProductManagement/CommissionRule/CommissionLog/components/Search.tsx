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
    } else {
      payload[type] = value;
    }

    dispatch({
      type: 'commissionLog/saveSearchOptions',
      payload,
    });
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
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
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
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
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
