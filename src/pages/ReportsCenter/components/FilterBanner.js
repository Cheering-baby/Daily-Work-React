import { DatePicker, Form, Input, Select, Row, Col, Checkbox } from 'antd';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
  colon: false,
};

const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
  colon: false,
};

const generateFilter = (props, filterItem) => {
  const {
    dispatch,
    form: { getFieldDecorator, setFieldsValue, getFieldValue, getFieldsValue },
    reportCenter: {
      page,
      reportFrequency,
      openThemePark,
      openChannel,
      openCustomerGroup,
      checkThemeParkValue,
      checkChannelValue,
      checkAccountManager,
      checkCustomerGroupValue,
      checkChannelValueInit,
      categoryTypeList,
      openUserRoleForCreated,
      openAccountManager,
      checkUserRoleValue,
    },
    detailList,
  } = props;

  const {
    isRequiredWhere = '',
    filterKey,
    filterName,
    filterType,
    options = [],
    // mulOptions = [],
    themeParkOptions = [],
    dictType,
    dictSubType,
    customerGroupOptions = [],
    userRoleOptions = [],
    taMarketOptions = [],
    accountManagerOptions = [],
  } = filterItem;

  const categoryType = getFieldValue('categoryType');
  const categoryTypeArr =
    categoryTypeList && categoryTypeList.length > 0
      ? categoryTypeList.filter(i => i.dictSubType === '1004')
      : [];
  const arr = categoryTypeArr.filter(t => t.dictId === categoryType);
  const arr1 = Array.isArray(arr) && arr.length > 0 ? arr.map(i => i.dictName) : [];
  const customerOptions =
    customerGroupOptions && customerGroupOptions.length > 0
      ? customerGroupOptions.filter(i => i.dictSubTypeName === arr1.join())
      : [];

  const themeParkSelect = React.createRef();

  const whereColumnList = detailList ? detailList.whereColumnList : [];
  const cronTypeValue = detailList
    ? detailList.cronType === 'Daily' || detailList.cronType === 'Monthly'
    : false;

  const handleInitVal = filter => {
    const cronTypeVal = detailList ? detailList.cronType : '';
    if (whereColumnList && whereColumnList.length > 0) {
      const result = whereColumnList.find(item => item.filterKey === filter);
      if (result) {
        let val = result.filterValue;
        if (result.filterType === 'RANGE_PICKER' || result.filterType === 'DATE_PICKER') {
          if (cronTypeVal === 'Daily' || cronTypeVal === 'Monthly') {
            val = '';
          } else if (cronTypeValue && reportFrequency === '') {
            val = '';
          } else if (reportFrequency === 'Daily' || reportFrequency === 'Monthly') {
            val = '';
          } else {
            val = val ? moment(+val) : '';
          }
        } else if (result.filterType === 'MULTIPLE_SELECT' || result.filterType === 'SELECT') {
          if (val === 'All') {
            return false;
          }
          if (filterKey === 'taMarket') {
            if (!checkChannelValueInit) {
              const num = `,${val},`
              const res =
                Array.isArray(taMarketOptions) && taMarketOptions.length > 0
                  ? taMarketOptions.filter(ii => num.includes(ii.dictId))
                  : [];
              val = res && res.length > 0 && res.map(i => i.dictName);
              dispatch({
                type: 'reportCenter/save',
                payload: {
                  checkChannelValue: val,
                  checkChannelValueInit: true,
                },
              });
            }
          } else if (result.filterKey === 'themeParkCode') {
            if (!checkChannelValueInit) {
              val = val ? val.split(',') : []
              const res = Array.isArray(themeParkOptions) && themeParkOptions.length > 0 ? themeParkOptions.filter(ii => val.includes(ii.attributeKey)) : []
              val = res && res.length > 0 && res.map(i => i.attributeValue)
              val = val ? val : [];
              dispatch({
                type: 'reportCenter/save',
                payload: {
                  checkThemeParkValue: val,
                  checkChannelValueInit: true,
                },
              });
            }
          } else if (result.filterKey === 'userRoleForCreated') {
            if (!checkChannelValueInit) {
              const res =
                Array.isArray(userRoleOptions) && userRoleOptions.length > 0
                  ? userRoleOptions.filter(ii => val.includes(ii.roleCode))
                  : [];
              val = res && res.length > 0 && res.map(i => i.roleName);
              val = val ? val : [];
              dispatch({
                type: 'reportCenter/save',
                payload: {
                  checkUserRoleValue: val,
                  checkChannelValueInit: true,
                },
              });
            }
          } else if (result.filterKey === 'customerGroup') {
            if (!checkChannelValueInit) {
              const num = `,${val},`
              const res =
                Array.isArray(customerGroupOptions) && customerGroupOptions.length > 0
                  ? customerGroupOptions.filter(ii => num.includes(ii.dictId))
                  : [];
              val = res && res.length > 0 && res.map(i => i.dictName);
              val = val ? val : [];
              dispatch({
                type: 'reportCenter/save',
                payload: {
                  checkCustomerGroupValue: val,
                  checkChannelValueInit: true,
                },
              });
            }
          } else if (result.filterKey === 'accountManager') {
            if (!checkChannelValueInit) {
              const res =
                Array.isArray(accountManagerOptions) && accountManagerOptions.length > 0
                  ? accountManagerOptions.filter(ii => val.includes(ii.userType))
                  : [];
              val = res && res.length > 0 && res.map(i => i.userCode);
              val = val ? val : [];
              dispatch({
                type: 'reportCenter/save',
                payload: {
                  checkAccountManager: val,
                  checkChannelValueInit: true,
                },
              });
            }
          }
        }
        return val;
      }
    }
  };

  const rangeChange = date => {
    if (+isRequiredWhere === 1) {
      const {
        type,
        sourcePage,
        reportCenter: { reportName1, reportName2 },
        reportType,
      } = props;
      const cronTypeVal = detailList && detailList.cronType ? detailList.cronType : '';
      const startDate = moment(+date[0]).format('YYYY-MM-DD');
      const endDate = moment(+date[1]).format('YYYY-MM-DD');
      let reportName;
      if (type === 'new') {
        if (reportFrequency === 'Ad-hoc' && endDate && startDate) {
          reportName = `${reportName2}_${startDate}-${endDate}_V1`;
        } else if (reportFrequency !== 'Ad-hoc') {
          reportName = `${reportName1}`;
        } else if (reportFrequency === 'Ad-hoc') {
          reportName = `${reportName1}`;
        } else if (endDate === null && startDate === null) {
          reportName = `${reportName1}`;
        }
      } else if (type === 'edit' || sourcePage === 'reports') {
        if (cronTypeVal === 'Ad-hoc' && endDate && startDate && !reportFrequency) {
          reportName = `${reportType}_${startDate}-${endDate}_V1`;
        } else if (reportFrequency === 'Ad-hoc' && endDate && startDate) {
          reportName = `${reportType}_${startDate}-${endDate}_V1`;
        } else if (reportFrequency === 'Ad-hoc') {
          reportName = `${reportType}_V1`;
        } else if (reportFrequency !== 'Ad-hoc') {
          reportName = `${reportType}_V1`;
        }
      }
      setFieldsValue({ reportName });
      dispatch({
        type: 'reportCenter/save',
        payload: {
          startDate,
          endDate,
          reportName,
          reportFrequency,
        },
      });
    }
  };

  const calendarChange = dates => {
    dispatch({
      type: 'reportCenter/save',
      payload: {
        selectDate: dates[0],
      },
    });
  };

  const disabledDate = current => {
    const {
      reportCenter: { selectDate },
    } = props;
    if (page === 'downloadAdhoc') {
      if (!current) {
        return false;
      }
      return (
        moment(current).format('YYYY-MM-DD') >
        moment(selectDate)
          .add(6, 'months')
          .format('YYYY-MM-DD')
      );
    }
  };

  const start = `${filterKey}From`;
  const end = `${filterKey}To`;

  const showDateValue = (start1, end1) => {
    if (start1 && end1) {
      return [start1, end1];
    }
    return null;
  };

  let dateRequire = false;
  const vals = getFieldsValue();
  if (vals && vals.cronType === 'Ad-hoc' && +isRequiredWhere === 1 && page !== 'downloadAdhoc') {
    dateRequire = true;
  } else if (+isRequiredWhere === 1 && page === 'downloadAdhoc') {
    dateRequire = true;
  } else {
    dateRequire = false;
  }

  let dateDisable = false;
  if (reportFrequency && +isRequiredWhere === 1) {
    dateDisable =
      reportFrequency === 'Daily' || (reportFrequency === 'Monthly' && +isRequiredWhere === 1);
  } else if (detailList && detailList.cronType !== '') {
    dateDisable = detailList.cronType === 'Daily' || detailList.cronType === 'Monthly';
  }

  const showSelectOpen = e => {
    e.nativeEvent.stopImmediatePropagation();
    themeParkSelect.current.focus();
    if (filterKey === 'themeParkCode') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          openThemePark: true,
          openChannel: false,
          openCustomerGroup: false,
          openUserRoleForCreated: false,
          openAccountManager: false,
        },
      });
    } else if (filterKey === 'customerGroup') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          openCustomerGroup: true,
          openChannel: false,
          openThemePark: false,
          openUserRoleForCreated: false,
          openAccountManager: false,
        },
      });
    } else if (filterKey === 'userRoleForCreated') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          openCustomerGroup: false,
          openChannel: false,
          openThemePark: false,
          openUserRoleForCreated: true,
          openAccountManager: false,
        },
      });
    } else if (filterKey === 'accountManager') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          openCustomerGroup: false,
          openChannel: false,
          openThemePark: false,
          openUserRoleForCreated: false,
          openAccountManager: true,
        },
      });
    } else if (dictSubType && dictType) {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          openThemePark: false,
          openChannel: true,
          openCustomerGroup: false,
          openUserRoleForCreated: false,
          openAccountManager: false,
        },
      });
    }
  };

  const themeParkChangeAll = e => {
    let arr2 = [];
    if (e.target.checked === true) {
      arr2 =
        themeParkOptions &&
        themeParkOptions.length > 0 &&
        themeParkOptions.map(i => i.bookingCategoryName);
    } else {
      arr2 = [];
    }
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkThemeParkValue: arr2,
      },
    });
    setFieldsValue({
      themeParkCode: arr2,
    });
  };

  const channelChangeAll = e => {
    let arr2 = [];
    if (e.target.checked === true) {
      arr2 = taMarketOptions && taMarketOptions.length > 0 && taMarketOptions.map(i => i.dictName);
    } else {
      arr2 = [];
    }
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkChannelValue: arr2,
      },
    });
    setFieldsValue({
      taMarket: arr2,
    });
  };

  const customerGroupAll = e => {
    let arr3 = [];
    if (e.target.checked === true) {
      arr3 = customerOptions && customerOptions.length > 0 && customerOptions.map(i => i.dictName);
    } else {
      arr3 = [];
    }
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkCustomerGroupValue: arr3,
      },
    });
    setFieldsValue({
      customerGroup: arr3,
    });
  };

  const userRoleAll = e => {
    let arr4 = [];
    if (e.target.checked === true) {
      arr4 = userRoleOptions && userRoleOptions.length > 0 && userRoleOptions.map(i => i.roleName);
    } else {
      arr4 = [];
    }
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkUserRoleValue: arr4,
      },
    });
    setFieldsValue({
      userRoleForCreated: arr4,
    });
  };

  const accountManagerAll = e => {
    let arr5 = [];
    if (e.target.checked === true) {
      arr5 =
        accountManagerOptions &&
        accountManagerOptions.length > 0 &&
        accountManagerOptions.map(i => i.userCode);
    } else {
      arr5 = [];
    }
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkAccountManager: arr5,
      },
    });
    setFieldsValue({
      checkAccountManager: arr5,
    });
  };

  const itemChange = value => {
    dispatch({
      type: 'reportCenter/save',
      payload: {
        selectPark: value,
        checkThemeParkValue: value,
      },
    });
    setFieldsValue({
      themeParkCode: value,
    });
  };

  const itemChange2 = value => {
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkChannelValue: value,
      },
    });
    setFieldsValue({
      taMarket: value,
    });
  };

  const itemChange3 = value => {
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkCustomerGroupValue: value,
      },
    });
    setFieldsValue({
      customerGroup: value,
    });
  };

  const itemChange4 = value => {
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkUserRoleValue: value,
      },
    });
    setFieldsValue({
      userRoleForCreated: value,
    });
  };

  const itemChange5 = value => {
    dispatch({
      type: 'reportCenter/save',
      payload: {
        checkAccountManager: value,
      },
    });
    setFieldsValue({
      accountManager: value,
    });
  };

  const themeParkDropDown = () => {
    if (themeParkOptions && themeParkOptions.length > 0) {
      const arr11 = themeParkOptions.map(i => i.bookingCategoryName);
      const matchAll =
        checkThemeParkValue && checkThemeParkValue.length > 0
          ? themeParkOptions.length === checkThemeParkValue.length
          : false;
      return (
        <div className={styles.dropDownContainer}>
          <div style={{ maxHeight: '150px', overflow: 'auto' }}>
            <div style={{ marginTop: '5px' }}>
              <Checkbox onChange={themeParkChangeAll} checked={matchAll}>
                Select All
              </Checkbox>
            </div>
            <CheckboxGroup options={arr11} onChange={itemChange} value={checkThemeParkValue} />
          </div>
        </div>
      );
    }
    return <div />;
  };

  const customerGroupDropDown = () => {
    if (customerOptions && customerOptions.length > 0) {
      const arr1s = customerOptions.map(i => i.dictName);
      const matchAll =
        checkCustomerGroupValue && checkCustomerGroupValue.length > 0
          ? customerOptions.length === checkCustomerGroupValue.length
          : false;
      return (
        <div className={styles.dropDownContainer}>
          <div style={{ maxHeight: '150px', overflow: 'auto' }}>
            <div style={{ marginTop: '5px' }}>
              <Checkbox onChange={customerGroupAll} checked={matchAll}>
                Select All
              </Checkbox>
            </div>
            <CheckboxGroup options={arr1s} onChange={itemChange3} value={checkCustomerGroupValue} />
          </div>
        </div>
      );
    }
    return <div />;
  };

  const channelDropDown = () => {
    if (taMarketOptions && taMarketOptions.length > 0) {
      const arr2 = taMarketOptions.map(i => i.dictName);
      const matchAll =
        checkChannelValue && checkChannelValue.length > 0
          ? taMarketOptions.length === checkChannelValue.length
          : false;
      return (
        <div className={styles.dropDownContainer}>
          <div style={{ maxHeight: '150px', overflow: 'auto' }}>
            <div style={{ marginTop: '5px' }}>
              <Checkbox onChange={channelChangeAll} checked={matchAll}>
                Select All
              </Checkbox>
            </div>
            <CheckboxGroup options={arr2} onChange={itemChange2} value={checkChannelValue} />
          </div>
        </div>
      );
    }
    return <div />;
  };

  const userRoleForCreatedDropDown = () => {
    if (userRoleOptions && userRoleOptions.length > 0) {
      const arr2 = userRoleOptions.map(i => i.roleName);
      const matchAll =
        checkUserRoleValue && checkUserRoleValue.length > 0
          ? userRoleOptions.length === checkUserRoleValue.length
          : false;
      return (
        <div className={styles.dropDownContainer}>
          <div style={{ maxHeight: '150px', overflow: 'auto' }}>
            <div style={{ marginTop: '5px' }}>
              <Checkbox onChange={userRoleAll} checked={matchAll}>
                Select All
              </Checkbox>
            </div>
            <CheckboxGroup options={arr2} onChange={itemChange4} value={checkUserRoleValue} />
          </div>
        </div>
      );
    }
    return <div />;
  };

  const accountManagerDropDown = () => {
    if (accountManagerOptions && accountManagerOptions.length > 0) {
      const arrs = accountManagerOptions.map(i => i.userCode);
      const matchAll =
        checkAccountManager && checkAccountManager.length > 0
          ? accountManagerOptions.length === checkAccountManager.length
          : false;
      return (
        <div className={styles.dropDownContainer}>
          <div style={{ maxHeight: '150px', overflow: 'auto' }}>
            <div style={{ marginTop: '5px' }}>
              <Checkbox onChange={accountManagerAll} checked={matchAll}>
                Select All
              </Checkbox>
            </div>
            <CheckboxGroup options={arrs} onChange={itemChange5} value={checkAccountManager} />
          </div>
        </div>
      );
    }
    return <div />;
  };

  const themeParkDelete = value => {
    if (filterKey === 'themeParkCode') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          checkThemeParkValue: value,
        },
      });
      setFieldsValue({
        themeParkCode: value,
      });
    } else if (filterKey === 'customerGroup') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          checkCustomerGroupValue: value,
        },
      });
      setFieldsValue({
        customerGroup: value,
      });
    } else if (filterKey === 'userRoleForCreated') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          checkUserRoleValue: value,
        },
      });
      setFieldsValue({
        userRoleForCreated: value,
      });
    } else if (filterKey === 'taMarket') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          checkChannelValue: value,
        },
      });
      setFieldsValue({
        taMarket: value,
      });
    } else if (filterKey === 'accountManager') {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          checkAccountManager: value,
        },
      });
      setFieldsValue({
        accountManager: value,
      });
    }
  };

  const categoryTypeChange = () => {
    const customerGroupVal = getFieldValue('customerGroup');
    if (filterKey === 'categoryType' && customerGroupVal && customerGroupVal.length > 0) {
      dispatch({
        type: 'reportCenter/save',
        payload: {
          checkCustomerGroupValue: [],
        },
      });
    }
  };

  const FILTER_DICT = {
    INPUT: () => (
      <Form.Item {...formItemLayout} label={filterName}>
        {getFieldDecorator(filterKey, {
          initialValue: handleInitVal(filterKey),
          rules: [
            {
              required: isRequiredWhere === '1',
              message: 'Required',
            },
          ],
        })(<Input placeholder="please enter" />)}
      </Form.Item>
    ),
    SELECT: () => (
      <Form.Item {...formItemLayout} label={filterName}>
        {getFieldDecorator(filterKey, {
          initialValue: handleInitVal(filterKey),
          rules: [
            {
              required: isRequiredWhere === '1',
              message: 'Required',
            },
          ],
        })(
          <Select
            optionFilterProp="children"
            showSearch
            allowClear
            placeholder={filterName}
            onChange={categoryTypeChange}
          >
            {options &&
            options.map(item => (
              <Select.Option key={item.dictId} value={item.dictId}>
                {item.dictName}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    ),
    MULTIPLE_SELECT: ({ label, name, required, isOpen, isDropDown, selectValue, ...ommit }) => (
      <Form.Item className={styles.selectStyle} {...formItemLayout} label={label}>
        {getFieldDecorator(filterKey, {
          initialValue: handleInitVal(filterKey),
          rules: [
            {
              required: isRequiredWhere === '1',
              message: 'Required',
            },
          ],
        })(
          <div onClick={showSelectOpen}>
            <Select
              optionFilterProp="children"
              allowClear
              mode="multiple"
              open={false}
              ref={themeParkSelect}
              showSearch
              placeholder={
                filterKey === 'themeParkCode' ||
                filterKey === 'taMarket' ||
                filterKey === 'userRoleForCreated' ||
                filterKey === 'accountManager'
                  ? 'All'
                  : filterName
              }
              value={selectValue}
              onChange={themeParkDelete}
              {...ommit}
            />
          </div>
        )}
        {isOpen ? (
          <Row onClick={showSelectOpen}>
            <Col span={24} className={styles.mutilSelectRelative}>
              <div className={styles.mutilSelectAbsolute}>{isDropDown}</div>
            </Col>
          </Row>
        ) : null}
      </Form.Item>
    ),
    DATE_PICKER: ({ required }) => (
      <Form.Item {...formItemLayout} label={filterName}>
        {getFieldDecorator(filterKey, {
          initialValue: handleInitVal(filterKey),
          rules: [
            {
              required,
              message: 'Required',
            },
          ],
        })(<DatePicker style={{ width: '100%' }} placeholder={filterName} format="DD-MMM-YYYY" />)}
      </Form.Item>
    ),
    RANGE_PICKER: () => (
      <Form.Item {...formItemLayout2} label={filterName}>
        {getFieldDecorator(filterKey, {
          initialValue: showDateValue(handleInitVal(start), handleInitVal(end)),
          rules: [
            {
              required: dateRequire,
              message: 'Required',
            },
          ],
        })(
          <RangePicker
            placeholder={['Start Date', 'End Date']}
            style={{ width: '100%' }}
            format="DD-MMM-YYYY"
            onChange={rangeChange}
            disabledDate={disabledDate}
            onCalendarChange={calendarChange}
            disabled={dateDisable}
          />
        )}
      </Form.Item>
    ),
  };

  const comp = FILTER_DICT[filterType];

  let open;
  if (filterKey === 'themeParkCode') {
    open = openThemePark;
  } else if (filterKey === 'customerGroup') {
    open = openCustomerGroup;
  } else if (filterKey === 'taMarket') {
    open = openChannel;
  } else if (filterKey === 'userRoleForCreated') {
    open = openUserRoleForCreated;
  } else if (filterKey === 'accountManager') {
    open = openAccountManager;
  } else {
    open = false;
  }

  let dropDown;
  if (filterKey === 'themeParkCode') {
    dropDown = themeParkDropDown();
  } else if (filterKey === 'customerGroup') {
    dropDown = customerGroupDropDown();
  } else if (filterKey === 'taMarket') {
    dropDown = channelDropDown();
  } else if (filterKey === 'userRoleForCreated') {
    dropDown = userRoleForCreatedDropDown();
  } else if (filterKey === 'accountManager') {
    dropDown = accountManagerDropDown();
  } else {
    dropDown = '';
  }

  let val;
  if (filterKey === 'themeParkCode') {
    val = checkThemeParkValue;
  } else if (filterKey === 'customerGroup') {
    val = checkCustomerGroupValue;
  } else if (filterKey === 'userRoleForCreated') {
    val = checkUserRoleValue;
  } else if (filterKey === 'taMarket') {
    val = checkChannelValue;
  } else if (filterKey === 'accountManager') {
    val = checkAccountManager;
  } else {
    val = [];
  }

  return comp
    ? comp({
      label: filterName,
      required: isRequiredWhere === '1',
      name: filterKey,
      options,
      isOpen: open,
      isDropDown: dropDown,
      selectValue: val,
      onFocus() {
        if (filterKey === 'themeParkCode') {
          open = openThemePark;
        } else if (filterKey === 'customerGroup') {
          open = openCustomerGroup;
        } else if (filterKey === 'taMarket') {
          open = openChannel;
        } else if (filterKey === 'userRoleForCreated') {
          open = openUserRoleForCreated;
        } else if (filterKey === 'accountManager') {
          open = openUserRoleForCreated;
        }
      },
    })
    : null;
};

export default generateFilter;
