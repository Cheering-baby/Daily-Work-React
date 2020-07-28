import React, { Component } from 'react';
import { Button, Col, DatePicker, Input, message, Radio, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import Card from '../../../../components/Card';
import styles from './index.less';
import SortSelect from '@/components/SortSelect';

const { Option } = Select;

@connect(({ queryOrderMgr, global }) => ({
  queryOrderMgr,
  global,
}))
class SearchCondition extends Component {
  inputChange = (value, flag) => {
    const { dispatch } = this.props;
    if (flag === 'deliveryLastName') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          deliveryLastName: value,
        },
      });
    }
    if (flag === 'deliveryFirstName') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          deliveryFirstName: value,
        },
      });
    }
    if (flag === 'confirmationNumber') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          confirmationNumber: value,
        },
      });
    }
    if (flag === 'bookingId') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          bookingId: value,
        },
      });
    }
    if (flag === 'taReferenceNo') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          taReferenceNo: value,
        },
      });
    }
    if (flag === 'agentId') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          agentId: value,
        },
      });
    }
    if (flag === 'agentValue') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          agentValue: value,
        },
      });
    }
  };

  selectChange = (value, flag) => {
    const { dispatch } = this.props;
    if (flag === 'status') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          status: value !== undefined ? value : null,
        },
      });
    }
    if (flag === 'orderType') {
      let orderType = null;
      if (value.length > 0) {
        orderType = value.join(',');
      }
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          orderType,
        },
      });
    }
  };

  showDateValue = time => {
    if (time !== null) {
      return moment(time, 'YYYY-MM-DDTHH:mm:ss');
    }
    return null;
  };

  dateChange = (date, flag) => {
    const { dispatch } = this.props;
    if (flag === 'StartDate') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          createTimeFrom: date !== null ? date.format('YYYY-MM-DDTHH:mm:ss') : null,
        },
      });
    }
    if (flag === 'EndDate') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          createTimeTo: date !== null ? date.format('YYYY-MM-DDTHH:mm:ss') : null,
        },
      });
    }
  };

  resetCondition = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderMgr/queryTransactions',
      payload: {
        deliveryLastName: null,
        deliveryFirstName: null,
        confirmationNumber: null,
        bookingId: null,
        taReferenceNo: null,
        status: null,
        orderType: null,
        createTimeFrom: null,
        createTimeTo: null,
        agentId: null,
        agentName: null,
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  searchBookings = () => {
    const {
      dispatch,
      queryOrderMgr: {
        searchConditions: { createTimeFrom, createTimeTo },
      },
    } = this.props;
    if (moment(createTimeFrom) >= moment(createTimeTo)) {
      message.warning('The start date must be earlier than the end date.');
    } else {
      dispatch({
        type: 'queryOrderMgr/queryTransactions',
        payload: {
          currentPage: 1,
        },
      });
    }
  };

  onAgentTypeChange = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderMgr/saveSearchConditions',
      payload: {
        agentType: e.target.value,
        agentValue: null,
      },
    });
  };

  render() {
    const {
      queryOrderMgr: {
        searchConditions: {
          deliveryLastName,
          deliveryFirstName,
          confirmationNumber,
          bookingId,
          status,
          orderType,
          createTimeFrom,
          createTimeTo,
          agentType,
          agentValue,
        },
      },
      global: {
        currentUser: { userType },
      },
    } = this.props;
    const rwsLogin = userType === '01';
    return (
      <Card>
        <Row>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder={formatMessage({ id: 'FIRST_NAME' })}
              onChange={e => this.inputChange(e.target.value, 'deliveryFirstName')}
              value={deliveryFirstName}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder={formatMessage({ id: 'LAST_NAME' })}
              onChange={e => this.inputChange(e.target.value, 'deliveryLastName')}
              value={deliveryLastName}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder={formatMessage({ id: 'PARTNERS_TRANSACTION_NO' })}
              onChange={e => this.inputChange(e.target.value, 'bookingId')}
              value={bookingId}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder={formatMessage({ id: 'CONFIRMATION_NO' })}
              onChange={e => this.inputChange(e.target.value, 'confirmationNumber')}
              value={confirmationNumber}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <DatePicker
              allowClear
              showTime
              placeholder={formatMessage({ id: 'ORDER_DATE_FROM' })}
              className={styles.inputStyle}
              value={this.showDateValue(createTimeFrom)}
              onChange={date => this.dateChange(date, 'StartDate')}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <DatePicker
              allowClear
              showTime
              placeholder={formatMessage({ id: 'ORDER_DATE_TO' })}
              className={styles.inputStyle}
              value={this.showDateValue(createTimeTo)}
              onChange={date => this.dateChange(date, 'EndDate')}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <SortSelect
              allowClear
              mode="multiple"
              placeholder={formatMessage({ id: 'ORDER_TYPE' })}
              className={styles.inputStyle}
              onChange={value => this.selectChange(value, 'orderType')}
              value={orderType === null ? [] : orderType.split(',')}
              options={[
                <Option value="Booking">Booking</Option>,
                <Option value="Revalidation">Revalidation</Option>,
                <Option value="Refund">Refund</Option>,
              ]}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <SortSelect
              allowClear
              showSearch
              placeholder={formatMessage({ id: 'STATUS' })}
              className={styles.inputStyle}
              onChange={value => this.selectChange(value, 'status')}
              value={status === null ? undefined : status}
              options={[
                <Option value="Confirmed">Confirmed</Option>,
                <Option value="WaitingForPaying">Pending Payment</Option>,
                <Option value="PendingApproval">Pending Approval</Option>,
                <Option value="PendingOrderNo">Pending order No.</Option>,
                <Option value="PendingRefund">Pending Refund</Option>,
                <Option value="Reject">Reject</Option>,
                <Option value="PendingTopup">Pending Topup</Option>,
                <Option value="Cancelled">Cancelled</Option>,
                <Option value="Failed">Failed</Option>,
                <Option value="ArchiveFailed">ArchiveFailed</Option>,
                <Option value="CommissionFail">CommissionFail</Option>,
              ]}
            />
          </Col>
          {rwsLogin && (
            <Col className={styles.radioColStyle} xs={24} sm={12} md={8} lg={6}>
              <Radio.Group value={agentType} onChange={this.onAgentTypeChange}>
                <Radio value="agentId">Agent ID</Radio>
                <Radio value="agentName">Agent Name</Radio>
              </Radio.Group>
            </Col>
          )}
          {rwsLogin && (
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                placeholder={
                  agentType === 'agentId'
                    ? formatMessage({ id: 'AGENT_ID' })
                    : formatMessage({ id: 'AGENT_NAME' })
                }
                onChange={e => this.inputChange(e.target.value, 'agentValue')}
                value={agentValue}
              />
            </Col>
          )}
          <Col className={styles.buttonColStyle} xs={24} sm={12} md={8} lg={6}>
            <Button className={styles.searchButton} onClick={() => this.resetCondition()}>
              {formatMessage({ id: 'RESET' })}
            </Button>
            <Button
              type="primary"
              className={styles.searchButton}
              onClick={() => this.searchBookings()}
            >
              {formatMessage({ id: 'SEARCH' })}
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default SearchCondition;
