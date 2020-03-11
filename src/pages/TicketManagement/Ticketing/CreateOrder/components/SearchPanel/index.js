import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Checkbox, Button, DatePicker, Card, InputNumber, Select, Spin } from 'antd';
import moment from 'moment';
import { arrToString } from '../../../../utils/utils';
import styles from './index.less';

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
      50;
    this.state = {
      clientHeight,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketMgr/queryAttributeList',
      payload: {},
    });
    dispatch({
      type: 'ticketMgr/queryCountry',
      payload: {
        tableName: 'CUST_PROFILE',
        columnName: 'NOTIONALITY',
      },
    });
  }

  componentWillUnmount() {
    /* const { dispatch } = this.props;
    dispatch({
      type: 'callCenterBookingAttraction/resetState',
      payload: {},
    }); */
  }

  changeDateOfVisit = value => {
    const {
      dispatch,
      form,
      ticketMgr: { activeGroup },
    } = this.props;
    const dateOfVisit = value ? value.format('x') : value;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        dateOfVisit,
      },
    });
    const data = {
      dateOfVisit,
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
      type: 'ticketMgr/save',
      payload: {
        dateOfVisit: undefined,
        themeParkChooseList: [],
        themeParkList: [
          {
            group: 1,
            value: 'USS',
            label: 'Universal Studios Singapore',
            disabled: false,
          },
          {
            group: 1,
            value: 'ACW',
            label: 'Adventure Cove Water Park',
            disabled: false,
          },
          {
            group: 1,
            value: 'SEA',
            label: 'S.E.A Aquarium',
            disabled: false,
          },
          {
            group: 2,
            value: 'DOL',
            label: 'Dolphin Island',
            disabled: false,
          },
          {
            group: 3,
            value: 'OAP',
            label: 'Once A Pirate',
            disabled: false,
          },
        ],
        activeGroup: 0,
        themeParkTipType: 'NoTip',
        numOfGuests: undefined,
      },
    });
  };

  search = () => {
    const {
      form,
      ticketMgr: { themeParkChooseList = [], numOfGuests, searchPanelActive },
    } = this.props;
    form.setFieldsValue({
      themePark: themeParkChooseList,
      numOfGuests,
    });
    form.validateFields((err, values) => {
      if (!err) {
        if (
          themeParkChooseList.indexOf('DOL') === -1 &&
          themeParkChooseList.indexOf('OAP') === -1
        ) {
          this.searchAttraction();
        } else if (themeParkChooseList.length === 1 && themeParkChooseList[0] === 'DOL') {
          this.searchDolphinIsland();
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
    let attractionParams;
    const paramValue = arrToString(themeParkChooseList);
    if (themeParkChooseList.length > 1) {
      attractionParams = [
        {
          paramCode: 'ThemeParkCodes',
          paramValue,
        },
      ];
    } else {
      attractionParams = [
        {
          paramCode: 'ThemeParkCode',
          paramValue: themeParkChooseList[0],
        },
      ];
    }
    dispatch({
      type: 'ticketMgr/queryOfferList',
      payload: {
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
        attractionParams,
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
        formData: values,
      },
    }).then(() => {
      console.log('queryOAPOfferList done: ');
    });
  };

  searchDolphinIsland = () => {
    const {
      dispatch,
      ticketMgr: { dateOfVisit, themeParkChooseList = [] },
    } = this.props;
    const attractionParams = [
      {
        paramCode: 'ThemeParkCode',
        paramValue: themeParkChooseList[0],
      },
    ];
    dispatch({
      type: 'ticketMgr/queryDolphinIsland',
      payload: {
        validTimeFrom: moment(dateOfVisit, 'x').format('YYYY-MM-DD'),
        attractionParams,
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
      ticketMgr: { themeParkList },
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
      },
    });
  };

  disabledDateOfVisit = current => {
    // Can not select days before today and today
    return (
      current &&
      current <
        moment(new Date())
          .add(-1, 'days')
          .endOf('day')
    );
  };

  accessibleSeatChange = e => {
    const { checked } = e.target;
    const {
      dispatch,
      ticketMgr: { activeGroupSelectData },
    } = this.props;
    activeGroupSelectData.accessibleSeat = checked;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        activeGroupSelectData,
      },
    });
  };

  changeNumOfGuests = value => {
    const { dispatch } = this.props;
    const testReg = /^[1-9]\d*$/;
    if (testReg.test(value) || value === '') {
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          numOfGuests: value,
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

  render() {
    const {
      ticketMgr: {
        themeParkList,
        dateOfVisit,
        sessionTimeList,
        themeParkChooseList,
        activeGroup,
        themeParkTipType,
        numOfGuests,
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
          style={{ minHeight: clientHeight }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: 15 }}>
            <div className={styles.titleFontBlackWeight}>Custom filter</div>
            <Form>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'Ticketing' })}>
                {getFieldDecorator('themePark', {
                  initialValue: themeParkChooseList,
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <Checkbox.Group
                    key={'Checkbox'}
                    onChange={this.changeThemeParkChoose}
                  >
                    {themeParkList &&
                    themeParkList.map(item => {
                      return (
                        <Checkbox
                          disabled={item.disabled}
                          value={item.value}
                          key={'themePark_'+item.value}
                          style={{ display: 'block', color: '#3B414A', margin: '5px 0px' }}
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
              <FormItem {...formItemLayout} label={formatMessage({ id: 'DATE_OF_VISIT' })}>
                {getFieldDecorator('dateOfVisit', {
                  validateTrigger: '',
                  initialValue: dateOfVisit,
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <div
                    className={`${styles.formatTime} ${dateOfVisit ? styles.formatPadding : null}`}
                  >
                    <DatePicker
                      disabled={searchPanelActive}
                      allowClear
                      value={dateOfVisit ? moment(dateOfVisit, 'x') : null}
                      style={{ width: '100%' }}
                      placeholder="Select Date"
                      showToday={false}
                      format="DDMMYYYY"
                      onChange={this.changeDateOfVisit}
                      disabledDate={this.disabledDateOfVisit}
                    />
                    {dateOfVisit ? (
                      <div className={styles.time}>
                        {moment(dateOfVisit, 'x').format('DD-MM-YYYY')}
                      </div>
                    ) : null}
                  </div>
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
                    <Select
                      disabled={searchPanelActive}
                      placeholder="Please Select"
                      allowClear
                      showSearch
                    >
                      {sessionTimeList &&
                        sessionTimeList.map((item,index) => (
                          <Select.Option key={item.value+'_'+index} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              )}
              <FormItem {...formItemLayout} label={formatMessage({ id: 'NUM_OF_GUESTS' })}>
                {getFieldDecorator('numOfGuests', {
                  initialValue: numOfGuests,
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <div>
                    <InputNumber
                      disabled={searchPanelActive}
                      onChange={this.changeNumOfGuests}
                      value={numOfGuests}
                      placeholder="Please Input"
                      style={{ width: '100%' }}
                      min={1}
                      formatter={this.formatNumOfGuestsValue}
                    />
                  </div>
                )}
              </FormItem>
              {activeGroup === 3 && (
                <FormItem {...formItemLayout} label="">
                  {getFieldDecorator('accessibleSeat', {
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
          </div>
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
        </Card>
      </Spin>
    );
  }
}

export default SearchPanel;
