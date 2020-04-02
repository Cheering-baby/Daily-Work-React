import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Radio, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import styles from './index.less';

const formItemLayout = {
  colon: false,
};
const themeParkList = [
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
    group: 1,
    value: 'MXM',
    label: 'Maritime Experiential Museum',
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
];
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@Form.create()
@connect(({ seasonalityCalendarMgr }) => ({
  seasonalityCalendarMgr,
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
    window.addEventListener('click', this.closeYearPanel);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeYearPanel);
    const { dispatch } = this.props;
    dispatch({
      type: 'seasonalityCalendarMgr/resetData',
      payload: {},
    });
  }

  changeThemeParkCode = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'seasonalityCalendarMgr/save',
      payload: {
        themeParkCode: e.target.value,
      },
    });
  };

  clearYear = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'seasonalityCalendarMgr/save',
      payload: {
        year: undefined,
      },
    });
  };

  changeYear = value => {
    // console.log(value);
    const {
      form,
      dispatch,
      seasonalityCalendarMgr: { year },
    } = this.props;
    const clickYear = value.format('YYYY');
    if (clickYear !== year) {
      dispatch({
        type: 'seasonalityCalendarMgr/effectSave',
        payload: {
          year: clickYear,
        },
      }).then(() => {
        this.closeYearPanel();
        form.setFieldsValue({
          year: clickYear,
        });
      });
    }
  };

  closeYearPanel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'seasonalityCalendarMgr/save',
      payload: {
        yearPaneOpen: false,
      },
    });
  };

  openYearPanel = e => {
    e.nativeEvent.stopImmediatePropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'seasonalityCalendarMgr/save',
      payload: {
        yearPaneOpen: true,
      },
    });
  };

  search = () => {
    const {
      form,
      dispatch,
      seasonalityCalendarMgr: { themeParkCode, year },
    } = this.props;
    const data = {
      themeParkCode,
      year,
    };
    form.setFieldsValue(data);
    form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'seasonalityCalendarMgr/queryPeakDateList',
          payload: {
            year,
            themeParkCode,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      seasonalityCalendarMgr: { themeParkCode, year, yearPaneOpen = false },
    } = this.props;
    const { clientHeight } = this.state;
    return (
      <div className={styles.container} style={{ minHeight: clientHeight }}>
        <div className={styles.titleFontBlackWeight}>CUSTOMER FILTER</div>
        <Form>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'THEME_PARK' })}>
            {getFieldDecorator('themeParkCode', {
              initialValue: themeParkCode,
              rules: [
                {
                  required: true,
                  message: 'Required',
                },
              ],
            })(
              <div>
                <RadioGroup value={themeParkCode} onChange={this.changeThemeParkCode}>
                  {themeParkList.map(item => {
                    const { label, value } = item;
                    return (
                      <Radio style={radioStyle} value={value} key={value}>
                        {label}
                      </Radio>
                    );
                  })}
                </RadioGroup>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'YEAR' })}>
            {getFieldDecorator('year', {
              initialValue: year,
              rules: [
                {
                  required: true,
                  message: 'Required',
                },
              ],
            })(
              <div onClick={this.openYearPanel}>
                <DatePicker
                  allowClear
                  mode="year"
                  style={{ width: '100%' }}
                  placeholder="Please Select"
                  format="YYYY"
                  onPanelChange={this.changeYear}
                  value={year ? moment(year) : null}
                  open={yearPaneOpen}
                  onChange={this.clearYear}
                />
              </div>
            )}
          </FormItem>

          <div className={styles.peakContainer}>
            <div className={styles.peakItem}>
              <div
                className={styles.circle}
                style={{
                  backgroundColor: 'rgb(254, 238, 217)',
                  color: 'rgb(250, 155, 34)',
                  borderWidth: '0',
                }}
              >
                0
              </div>
              <div>Peak</div>
            </div>
            <div className={styles.peakItem}>
              <div className={styles.circle}>0</div>
              <div>Non-peak</div>
            </div>
          </div>
        </Form>
        <div className={styles.formControl}>
          <Button type="primary" style={{ marginRight: 8, width: '70px' }} onClick={this.search}>
            {formatMessage({ id: 'SEARCH' })}
          </Button>
          <Button style={{ width: '70px' }} onClick={this.reset}>
            {formatMessage({ id: 'RESET' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default SearchPanel;
