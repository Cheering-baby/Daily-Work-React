import React, { Component } from 'react';
import { Button, Col, DatePicker, Input, message, Radio, Row, Select, Icon } from 'antd';
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
    if (flag === 'offerName') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          offerName: value,
        },
      });
    }
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
    if (time !== null && time !== undefined) {
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
    if (flag === 'checkInDateFrom') {
      dispatch({
        type: 'queryOrderMgr/saveSearchConditions',
        payload: {
          checkInDateFrom: date !== null ? date.format('YYYY-MM-DD') : null,
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
        offerName: null,
        checkInDateFrom: null,
        agentValue: null,
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

  changeExpandCondition = () => {
    const {
      dispatch,
      queryOrderMgr: { isQueryExpand },
    } = this.props;
    dispatch({
      type: 'queryOrderMgr/save',
      payload: {
        isQueryExpand: !isQueryExpand,
      },
    });
  };

  render() {
    const {
      queryOrderMgr: {
        isQueryExpand,
        searchConditions: {
          offerName,
          checkInDateFrom,
          confirmationNumber,
          bookingId,
          status,
          orderType,
          createTimeFrom,
          createTimeTo,
          agentType,
          agentValue,
          taReferenceNo,
        },
      },
      global: {
        currentUser: { userType },
        userCompanyInfo: { companyType },
      },
    } = this.props;
    const rwsLogin = userType === '01';
    const mainTaLogin = companyType === '01';
    const searchColLayout = {
      xs: 24,
      sm: 12,
      md: 24,
      lg: 18,
    };
    if (rwsLogin) {
      searchColLayout.md = 8;
      searchColLayout.lg = 6;
    } else if (mainTaLogin) {
      searchColLayout.md = 24;
      searchColLayout.lg = 24;
    }
    if (!isQueryExpand) {
      searchColLayout.lg = 6;
      searchColLayout.md = 8;
      searchColLayout.sm = 12;
    }
    return (
      <Card>
        <Row type="flex">
          <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
            <Input
              allowClear
              placeholder={formatMessage({ id: 'OFFER_NAME' })}
              onChange={e => this.inputChange(e.target.value, 'offerName')}
              value={offerName}
            />
          </Col>
          <Col
            className={styles.inputColStyle}
            xs={isQueryExpand ? 24 : 0}
            sm={isQueryExpand ? 12 : 0}
            md={8}
            lg={6}
          >
            <Input
              allowClear
              placeholder={formatMessage({ id: 'PARTNERS_TRANSACTION_NO' })}
              onChange={e => this.inputChange(e.target.value, 'bookingId')}
              value={bookingId}
            />
          </Col>
          <Col
            className={styles.inputColStyle}
            xs={isQueryExpand ? 24 : 0}
            sm={isQueryExpand ? 12 : 0}
            md={isQueryExpand ? 8 : 0}
            lg={6}
          >
            <Input
              allowClear
              placeholder={formatMessage({ id: 'CONFIRMATION_NO' })}
              onChange={e => this.inputChange(e.target.value, 'confirmationNumber')}
              value={confirmationNumber}
            />
          </Col>
          {isQueryExpand ? (
            <>
              <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
                <DatePicker
                  allowClear
                  showToday={false}
                  placeholder={formatMessage({ id: 'VISIT_DATE' })}
                  className={styles.inputStyle}
                  format="DD-MMM-YYYY"
                  value={checkInDateFrom ? moment(checkInDateFrom) : null}
                  onChange={date => this.dateChange(date, 'checkInDateFrom')}
                />
              </Col>
              <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
                <DatePicker
                  allowClear
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder={formatMessage({ id: 'ORDER_DATE_FROM' })}
                  className={styles.inputStyle}
                  format="DD-MMM-YYYY HH:mm:ss"
                  value={this.showDateValue(createTimeFrom)}
                  onChange={date => this.dateChange(date, 'StartDate')}
                />
              </Col>
              <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
                <DatePicker
                  allowClear
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder={formatMessage({ id: 'ORDER_DATE_TO' })}
                  className={styles.inputStyle}
                  format="DD-MMM-YYYY HH:mm:ss"
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
                  getPopupContainer={() =>
                    document.getElementById('Ticketing-Query-Order')
                  }
                  dropdownClassName={styles.queryType}
                  options={[
                    <Option value="Booking" key="Booking">Booking</Option>,
                    <Option value="Revalidation" key="Revalidation">Revalidation</Option>,
                    <Option value="Refund" key="Refund">Refund</Option>,
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
                  getPopupContainer={() =>
                    document.getElementById('Ticketing-Query-Order')
                  }
                  dropdownClassName={styles.queryType}
                  options={[
                    <Option value="Confirmed" key="Confirmed">Confirmed</Option>,
                    <Option value="WaitingForPaying" key="WaitingForPaying">Pending Payment</Option>,
                    <Option value="PendingApproval" key="PendingApproval">Pending Approval</Option>,
                    <Option value="PendingOrderNo" key="PendingOrderNo">Pending order No.</Option>,
                    <Option value="PendingRefund" key="PendingRefund">Pending Refund</Option>,
                    <Option value="Reject" key="Reject">Reject</Option>,
                    <Option value="PendingTopup" key="PendingTopup">Pending Topup</Option>,
                    <Option value="Cancelled" key="Cancelled">Cancelled</Option>,
                    <Option value="Failed" key="Failed">Failed</Option>,
                    <Option value="ArchiveFailed" key="ArchiveFailed">ArchiveFailed</Option>,
                    <Option value="CommissionFail" key="CommissionFail">CommissionFail</Option>,
                  ]}
                />
              </Col>
              <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
                <Input
                  allowClear
                  placeholder={formatMessage({ id: 'TA_REFERENCE_NO' })}
                  onChange={e => this.inputChange(e.target.value, 'taReferenceNo')}
                  value={taReferenceNo}
                />
              </Col>
              {(rwsLogin || mainTaLogin) && (
                <Col
                  className={styles.radioColStyle}
                  xs={24}
                  sm={12}
                  md={mainTaLogin ? 16 : 8}
                  lg={mainTaLogin ? 12 : 6}
                >
                  <Radio.Group value={agentType} onChange={this.onAgentTypeChange}>
                    <Radio value="agentId">
                      {formatMessage({ id: rwsLogin ? 'AGENT_ID' : 'SUB_AGENT_ID' })}
                    </Radio>
                    <Radio value="agentName">
                      {formatMessage({ id: rwsLogin ? 'COMPANY_NAME' : 'SUB_COMPANY_NAME' })}
                    </Radio>
                  </Radio.Group>
                </Col>
              )}
              {(rwsLogin || mainTaLogin) && (
                <Col className={styles.inputColStyle} xs={24} sm={12} md={8} lg={6}>
                  <Input
                    allowClear
                    placeholder={
                      agentType === 'agentId'
                        ? formatMessage({ id: rwsLogin ? 'AGENT_ID' : 'SUB_AGENT_ID' })
                        : formatMessage({ id: rwsLogin ? 'COMPANY_NAME' : 'SUB_COMPANY_NAME' })
                    }
                    onChange={e => this.inputChange(e.target.value, 'agentValue')}
                    value={agentValue}
                  />
                </Col>
              )}
            </>
          ) : null}
          <Col className={styles.buttonColStyle} {...searchColLayout}>
            <Button
              className={styles.expandButton}
              style={{ border: '0', marginLeft: '5px', width: '80px' }}
              onClick={this.changeExpandCondition}
            >
              {isQueryExpand ? ' Collapse' : 'Expand'} <Icon type={isQueryExpand ? 'up' : 'down'} />
            </Button>
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
