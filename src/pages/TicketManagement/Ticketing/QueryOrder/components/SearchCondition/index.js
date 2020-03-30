import React, { Component } from 'react';
import { Button, Col, DatePicker, Input, message, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import Card from '../../../../components/Card';
import styles from './index.less';

const { Option } = Select;

@connect(({ queryOrderMgr, global }) => ({
  queryOrderMgr,
  global,
}))
class SearchCondition extends Component {
  inputChange = (value, flag) => {
    const { dispatch } = this.props;
    if (flag === 'lastName') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          lastName: value,
        },
      });
    }
    if (flag === 'firstName') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          firstName: value,
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
    if (flag === 'agentName') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          agentName: value,
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
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          orderType: value !== undefined ? value : null,
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
        lastName: null,
        firstName: null,
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
      });
    }
  };

  render() {
    const {
      queryOrderMgr: {
        searchConditions: {
          lastName,
          firstName,
          confirmationNumber,
          bookingId,
          taReferenceNo,
          status,
          orderType,
          createTimeFrom,
          createTimeTo,
          agentId,
          agentName,
        },
      },
      global: {
        currentUser: { userType },
      },
    } = this.props;
    return (
      <Card>
        {(userType === '02' || userType === '03') && (
          <Row>
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                placeholder={formatMessage({ id: 'LAST_NAME' })}
                onChange={e => this.inputChange(e.target.value, 'lastName')}
                value={lastName}
              />
            </Col>
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                placeholder={formatMessage({ id: 'FIRST_NAME' })}
                onChange={e => this.inputChange(e.target.value, 'firstName')}
                value={firstName}
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
              <Input
                allowClear
                placeholder={formatMessage({ id: 'PAMS_TRANSACTION_NO' })}
                onChange={e => this.inputChange(e.target.value, 'bookingId')}
                value={bookingId}
              />
            </Col>
          </Row>
        )}
        {(userType === '02' || userType === '03') && (
          <Row>
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                placeholder={formatMessage({ id: 'TA_REFERENCE_NO' })}
                onChange={e => this.inputChange(e.target.value, 'taReferenceNo')}
                value={taReferenceNo}
              />
            </Col>
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <Select
                allowClear
                placeholder={formatMessage({ id: 'STATUS' })}
                className={styles.inputStyle}
                onChange={value => this.selectChange(value, 'status')}
                value={status === null ? undefined : status}
              >
                <Option value="Confirmed">Confirmed</Option>
                <Option value="PendingPayment">Pending Payment</Option>
                <Option value="Pending">Pending Payment</Option>
                <Option value="PendingApproval">Pending Approval</Option>
                <Option value="PendingOrderNo">Pending order No.</Option>
                <Option value="PendingRefund">Pending Refund</Option>
                <Option value="Reject">Reject</Option>
                <Option value="PendingTopUp">Pending Topup</Option>
              </Select>
            </Col>
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <DatePicker
                allowClear
                showTime
                placeholder={formatMessage({ id: 'START_DATE' })}
                className={styles.inputStyle}
                value={this.showDateValue(createTimeFrom)}
                onChange={date => this.dateChange(date, 'StartDate')}
              />
            </Col>
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <DatePicker
                allowClear
                showTime
                placeholder={formatMessage({ id: 'END_DATE' })}
                className={styles.inputStyle}
                value={this.showDateValue(createTimeTo)}
                onChange={date => this.dateChange(date, 'EndDate')}
              />
            </Col>
          </Row>
        )}
        <Row>
          {(userType === '02' || userType === '03') && (
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <Select
                allowClear
                placeholder={formatMessage({ id: 'ORDER_TYPE' })}
                className={styles.inputStyle}
                onChange={value => this.selectChange(value, 'orderType')}
                value={orderType === null ? undefined : orderType}
              >
                <Option value="Booking">Booking</Option>
                <Option value="Revalidation">Revalidation</Option>
                <Option value="Refund">Refund</Option>
              </Select>
            </Col>
          )}
          {userType === '01' && (
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                placeholder={formatMessage({ id: 'AGENT_ID' })}
                onChange={e => this.inputChange(e.target.value, 'agentId')}
                value={agentId}
              />
            </Col>
          )}
          {userType === '01' && (
            <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                placeholder={formatMessage({ id: 'AGENT_NAME' })}
                onChange={e => this.inputChange(e.target.value, 'agentName')}
                value={agentName}
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
