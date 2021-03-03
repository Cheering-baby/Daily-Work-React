import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Button, DatePicker, Form, Radio } from 'antd';
import moment from 'moment';
import styles from './index.less';

const formItemLayout = {
  colon: false,
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
  }

  reset = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'seasonalityCalendarMgr/save',
      payload: {
        themeParkCode: undefined,
        year: undefined,
        showYear: false,
        peakPeriodConfigs: [],
      },
    });
    form.resetFields();
  };

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
            periodStatus: 0,
            showListFlag: true,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      seasonalityCalendarMgr: {
        themeParkCode,
        year,
        yearPaneOpen = false,
        validThemeParkCodes,
        legendConfigs,
      },
    } = this.props;
    const { clientHeight } = this.state;
    return (
      <div className={styles.container} style={{ minHeight: clientHeight }}>
        <div className={styles.titleFontBlackWeight}>CUSTOMER FILTER</div>
        <Form>
          <FormItem
            {...formItemLayout}
            label={formatMessage({ id: 'THEME_PARK' })}
            className={styles.themeParkCodeForm}
          >
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
                  {validThemeParkCodes.map(item => {
                    const { themeParkName, themeParkCode } = item;
                    return (
                      <Radio value={themeParkCode} key={themeParkCode}>
                        <span className={styles.themeParkName}>{themeParkName}</span>
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
            {legendConfigs.map(item => (
              <div className={styles.peakItem} key={item.legendId}>
                <div
                  className={styles.circle}
                  style={{
                    backgroundColor: item.attractionValue,
                  }}
                ></div>
                <div className={styles.legendName}>{item.legendName}</div>
              </div>
            ))}
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
