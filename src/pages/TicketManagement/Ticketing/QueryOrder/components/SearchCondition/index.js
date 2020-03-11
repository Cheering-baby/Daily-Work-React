import React, {Component} from 'react';
import {Button, Col, DatePicker, Input, Row, Select} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import Card from '../../../../components/Card';
import styles from './index.less';

const {Option} = Select;

@connect(({queryOrderMgr}) => ({
  queryOrderMgr,
}))
class SearchCondition extends Component {
  inputChange = (value, flag) => {
    const {dispatch} = this.props;
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
  };

  selectChange = (value, flag) => {
    const {dispatch} = this.props;
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
    const {dispatch} = this.props;
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
    const {dispatch} = this.props;
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
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  searchBookings = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'queryOrderMgr/queryTransactions',
    });
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
        },
      },
    } = this.props;
    return (
      <Card>
        <Row>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder="Last Name"
              onChange={e => this.inputChange(e.target.value, 'lastName')}
              value={lastName}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder="First Name"
              onChange={e => this.inputChange(e.target.value, 'firstName')}
              value={firstName}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder="Confirmation No."
              onChange={e => this.inputChange(e.target.value, 'confirmationNumber')}
              value={confirmationNumber}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder="PAMS Transaction No."
              onChange={e => this.inputChange(e.target.value, 'bookingId')}
              value={bookingId}
            />
          </Col>
        </Row>
        <Row>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder="TA Reference No."
              onChange={e => this.inputChange(e.target.value, 'taReferenceNo')}
              value={taReferenceNo}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Select
              allowClear
              placeholder="Status"
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
              placeholder="Start Date"
              className={styles.inputStyle}
              value={this.showDateValue(createTimeFrom)}
              onChange={date => this.dateChange(date, 'StartDate')}
            />
          </Col>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <DatePicker
              allowClear
              showTime
              placeholder="End Date"
              className={styles.inputStyle}
              value={this.showDateValue(createTimeTo)}
              onChange={date => this.dateChange(date, 'EndDate')}
            />
          </Col>
        </Row>
        <Row>
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Select
              allowClear
              placeholder="Order Type"
              className={styles.inputStyle}
              onChange={value => this.selectChange(value, 'orderType')}
              value={orderType === null ? undefined : orderType}
            >
              <Option value="Booking">Booking</Option>
              <Option value="Revalidation">Revalidation</Option>
              <Option value="Refund">Refund</Option>
            </Select>
          </Col>
          <Col className={styles.buttonColStyle} xs={24} sm={12} md={8} lg={6}>
            <Button className={styles.searchButton} onClick={() => this.resetCondition()}>
              Reset
            </Button>
            <Button
              type="primary"
              className={styles.searchButton}
              onClick={() => this.searchBookings()}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default SearchCondition;
