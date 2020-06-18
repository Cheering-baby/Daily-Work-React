import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Button, Card, Checkbox, DatePicker, Form, InputNumber, Select, Spin } from 'antd';
import moment from 'moment';
import { arrToString } from '../../../../utils/utils';
import styles from './index.less';
import SortSelect from '@/components/SortSelect';

const FormItem = Form.Item;
const formItemLayout = {
  colon: false,
};

@Form.create()
@connect(({ ticketMgr, loading }) => ({
  ticketMgr,
  showLoading: loading.effects['ticketMgr/querySessionTime'],
}))
class SearchPanel extends Component {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      80;
    this.state = {
      clientHeight,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketMgr/fetchQueryAgentOpt',
      payload: {},
    });
  }

  changeDateOfVisit = value => {
    const {
      dispatch,
      form,
      ticketMgr: { activeGroup, activeGroupSelectData },
    } = this.props;
    const dateOfVisit = value ? value.format('x') : value;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        dateOfVisit,
        activeGroupSelectData: {
          ...activeGroupSelectData,
          dateOfVisit,
        },
      },
    });
    const data = {
      dateOfVisit,
      sessionTime: undefined,
    };
    form.setFieldsValue(data);
    form.validateFields(['dateOfVisit']);
    if (activeGroup === 3 && dateOfVisit && dateOfVisit !== '') {
      dispatch({
        type: 'ticketMgr/querySessionTime',
        payload: {},
      });
    }
  };

  reset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'ticketMgr/resetData',
      payload: {},
    });
  };

  search = () => {
    const {
      form,
      ticketMgr: { themeParkChooseList = [], numOfGuests },
    } = this.props;
    form.setFieldsValue({
      themePark: themeParkChooseList,
      numOfGuests,
    });
    form.validateFields((err, values) => {
      if (!err) {
        if (themeParkChooseList.indexOf('OAP') === -1) {
          this.searchAttraction();
        } else if (themeParkChooseList.length === 1 && themeParkChooseList[0] === 'OAP') {
          this.searchOAP(values);
        }
      }
    });
  };

  searchAttraction = () => {
    const {
      dispatch,
      ticketMgr: { dateOfVisit, themeParkChooseList = [] },
    } = this.props;
    let requestParams;
    const paramValue = arrToString(themeParkChooseList);
    if (themeParkChooseList.length > 1) {
      requestParams = [
        {
          paramCode: 'BookingCategory',
          paramValue,
        },
      ];
    } else {
      requestParams = [
        {
          paramCode: 'BookingCategory',
          paramValue: themeParkChooseList[0],
        },
      ];
    }
    dispatch({
      type: 'ticketMgr/queryOfferList',
      payload: {
        pageSize: 1000,
        currentPage: 1,
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
        requestParams,
      },
    }).then(() => {
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          activeGroup: 0,
          activeDataPanel: 0,
        },
      });
    });
  };

  searchOAP = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketMgr/queryOAPOfferList',
      payload: {
        formData: {
          ...values,
          dateOfVisit: values.dateOfVisit ? values.dateOfVisit.format('x') : values.dateOfVisit,
        },
      },
    }).then(() => {
      // console.log('queryOAPOfferList done: ');
    });
  };

  searchDolphinIsland = () => {
    const {
      dispatch,
      ticketMgr: { dateOfVisit, themeParkChooseList = [] },
    } = this.props;
    const requestParams = [
      {
        paramCode: 'BookingCategory',
        paramValue: themeParkChooseList[0],
      },
    ];
    dispatch({
      type: 'ticketMgr/queryDolphinIsland',
      payload: {
        pageSize: 1000,
        currentPage: 1,
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
        requestParams,
      },
    }).then(() => {
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          activeGroup: 2,
          activeDataPanel: 2,
        },
      });
    });
  };

  changeThemeParkChoose = checkedValue => {
    const {
      dispatch,
      ticketMgr: { themeParkList, activeGroupSelectData },
      form,
    } = this.props;
    let groupObject;
    let newThemeParkList;
    if (checkedValue.length > 0) {
      groupObject = themeParkList.find(item => item.value === checkedValue[0]);
      newThemeParkList = themeParkList.map(item => {
        return {
          ...item,
          disabled: !(item.group === groupObject.group),
        };
      });
    } else {
      newThemeParkList = themeParkList.map(item => {
        return {
          ...item,
          disabled: false,
        };
      });
    }
    let themeParkTipType = 'NoTip';
    if (groupObject && (groupObject.group === 2 || groupObject.group === 3)) {
      themeParkTipType = '1';
    }
    if (groupObject && groupObject.group === 3) {
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          dateOfVisit: undefined,
        },
      });
      const data = {
        dateOfVisit: undefined,
      };
      form.setFieldsValue(data);
    }
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        themeParkChooseList: checkedValue,
        themeParkList: newThemeParkList,
        activeGroup: groupObject ? groupObject.group : 0,
        themeParkTipType,
        activeGroupSelectData: {
          ...activeGroupSelectData,
          themeParkCode: checkedValue,
        },
      },
    });
  };

  disabledDateOfVisit = current => {
    // Can not select days before today and today
    const nowDate = new Date();
    let result = false;
    const minDate = moment(nowDate)
      .add(-1, 'days')
      .endOf('day');
    const maxDate = moment(nowDate)
      .add(6, 'months')
      .endOf('day');
    if (current && (current < minDate || current > maxDate)) {
      result = true;
    }
    return result;
  };

  accessibleSeatChange = e => {
    const { checked } = e.target;
    const {
      dispatch,
      ticketMgr: { activeGroupSelectData },
    } = this.props;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        activeGroupSelectData: {
          ...activeGroupSelectData,
          accessibleSeat: checked,
        },
      },
    });
  };

  changeNumOfGuests = value => {
    const {
      dispatch,
      ticketMgr: { activeGroupSelectData },
    } = this.props;
    const testReg = /^[1-9]\d*$/;
    if (testReg.test(value) || value === '') {
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          numOfGuests: value,
          activeGroupSelectData: {
            ...activeGroupSelectData,
            numOfGuests: value,
          },
        },
      });
    }
  };

  formatNumOfGuestsValue = value => {
    const {
      ticketMgr: { numOfGuests },
    } = this.props;
    const testReg = /^[1-9]\d*$/;
    if (testReg.test(value) || value === '') {
      return value;
    }
    return numOfGuests;
  };

  changeSessionTime = value => {
    const {
      dispatch,
      ticketMgr: { activeGroupSelectData },
    } = this.props;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        activeGroupSelectData: {
          ...activeGroupSelectData,
          sessionTime: value,
        },
      },
    });
  };

  render() {
    const {
      ticketMgr: {
        themeParkList,
        dateOfVisit,
        sessionTimeList,
        themeParkChooseList,
        activeGroup,
        themeParkTipType,
        searchPanelActive,
        activeGroupSelectData,
      },
      form: { getFieldDecorator },
      showLoading = false,
    } = this.props;

    const { clientHeight } = this.state;
    return (
      <Spin spinning={showLoading}>
        <Card
          className={styles.marginTop4}
          style={{ minHeight: clientHeight, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ minHeight: clientHeight }} className={styles.bodyContainer}>
            <div className={styles.filterText}>{formatMessage({ id: 'FILTER' })}</div>
            <Form className={styles.form} hideRequiredMark>
              <FormItem
                className={styles.categories}
                {...formItemLayout}
                label={formatMessage({ id: 'PRODUCT_CATEGORIES' })}
              >
                {getFieldDecorator('themePark', {
                  initialValue: themeParkChooseList,
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <Checkbox.Group key="Checkbox" onChange={this.changeThemeParkChoose}>
                    {themeParkList &&
                      themeParkList.map(item => {
                        return (
                          <Checkbox
                            disabled={item.disabled}
                            value={item.value}
                            key={`themePark_${item.value}`}
                          >
                            {item.label}
                          </Checkbox>
                        );
                      })}
                  </Checkbox.Group>
                )}
                {themeParkTipType === '1' && (
                  <div className={styles.themeParkTipStyles2}>
                    {formatMessage({ id: 'SELECT_INDIVIDUALLY_TIP' })}
                  </div>
                )}
              </FormItem>
              <div className={styles.customerChoiceText}>
                {formatMessage({ id: 'CUSTOMER_CHOICE' })}
              </div>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'DATE_OF_VISIT' })}>
                {getFieldDecorator('dateOfVisit', {
                  validateTrigger: '',
                  initialValue: dateOfVisit ? moment(dateOfVisit, 'x') : null,
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <DatePicker
                    disabled={searchPanelActive}
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Select Date"
                    showToday={false}
                    format={['DD-MMM-YYYY', 'DDMMYYYY']}
                    onChange={this.changeDateOfVisit}
                    disabledDate={this.disabledDateOfVisit}
                  />
                )}
              </FormItem>
              {activeGroup === 3 && (
                <FormItem {...formItemLayout} label={formatMessage({ id: 'SESSION_TIME' })}>
                  {getFieldDecorator('sessionTime', {
                    initialValue: activeGroupSelectData.sessionTime,
                    rules: [
                      {
                        required: true,
                        message: 'Required',
                      },
                    ],
                  })(
                    <SortSelect
                      disabled={searchPanelActive}
                      placeholder="Please Select"
                      allowClear
                      showSearch
                      onChange={this.changeSessionTime}
                      options={
                        sessionTimeList &&
                        sessionTimeList.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Select.Option key={`${item.value}_${index}`} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))
                      }
                    />
                  )}
                </FormItem>
              )}
              <FormItem {...formItemLayout} label={formatMessage({ id: 'NUM_OF_GUESTS' })}>
                {getFieldDecorator('numOfGuests', {
                  initialValue: activeGroupSelectData.numOfGuests,
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <InputNumber
                    disabled={searchPanelActive}
                    onChange={this.changeNumOfGuests}
                    placeholder="Please Input"
                    style={{ width: '100%' }}
                    min={1}
                    formatter={this.formatNumOfGuestsValue}
                  />
                )}
              </FormItem>
              {activeGroup === 3 && (
                <FormItem {...formItemLayout} label="">
                  {getFieldDecorator('accessibleSeat', {
                    initialValue: activeGroupSelectData.accessibleSeat,
                    rules: [
                      {
                        required: false,
                        message: 'Required',
                      },
                    ],
                  })(
                    <Checkbox
                      onChange={this.accessibleSeatChange}
                      checked={activeGroupSelectData.accessibleSeat}
                      disabled={searchPanelActive}
                      style={{ display: 'block', color: '#3B414A', margin: '5px 0px' }}
                    >
                      {formatMessage({ id: 'ACCESSIBLE_SEAT' })}
                    </Checkbox>
                  )}
                </FormItem>
              )}
            </Form>
            <div className={styles.formControl}>
              <Button
                disabled={searchPanelActive}
                type="primary"
                style={{ marginRight: 8, width: '70px' }}
                onClick={this.search}
              >
                {formatMessage({ id: 'SEARCH' })}
              </Button>
              <Button disabled={searchPanelActive} style={{ width: '70px' }} onClick={this.reset}>
                {formatMessage({ id: 'RESET' })}
              </Button>
            </div>
          </div>
        </Card>
      </Spin>
    );
  }
}

export default SearchPanel;
