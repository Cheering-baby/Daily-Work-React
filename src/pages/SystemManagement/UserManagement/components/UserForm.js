import React, { Fragment } from 'react';
import { Button, Col, DatePicker, Form, Icon, Input, Row, Select, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import TextArea from 'antd/es/input/TextArea';
import router from 'umi/router';
import moment from 'moment';
import styles from '../index.less';
import constants from '../constants';
import PrivilegeUtil from '@/utils/PrivilegeUtil';
import SortSelect from '@/components/SortSelect';
import { colLayOut, rowLayOut, isNvl } from '@/utils/utils';

const { Option } = Select;

@Form.create()
@connect(({ userMgr, global, loading }) => ({
  userMgr,
  global,
  addLoading: loading.effects['userMgr/addTAUser'],
  modifyLoading: loading.effects['userMgr/modifyUser'],
}))
class Index extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      type = 'NEW',
      userMgr: { companyList = [] },
    } = this.props;
    if (type === 'NEW' && companyList.length === 0) {
      dispatch({
        type: 'userMgr/queryAllCompany',
      });
    }
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        userFormOkDisable: false,
      },
    });
  }

  getRoleCodes = (currentUserProfile = {}) => {
    const { type = 'NEW' } = this.props;
    if (type === 'NEW') {
      return [];
    }
    const { userRoles = [] } = currentUserProfile;
    const roleCodes = [];
    userRoles.forEach(item => {
      const { roleCode } = item;
      roleCodes.push(roleCode);
    });
    return roleCodes;
  };

  commit = e => {
    e.preventDefault();
    const {
      dispatch,
      form,
      type = 'NEW',
      global: { currentUser = {} },
      userMgr: { currentUserProfile = {} },
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        let dispatchType = '';
        if (type === 'NEW') {
          const { userType: loginUserType = '' } = currentUser;
          dispatchType = 'userMgr/addTAUser';
          const { subCompanyId } = values;
          if (subCompanyId) {
            values.userType = '03';
            values.companyId = subCompanyId;
          } else {
            values.userType = '02';
          }
          if (loginUserType === '03') {
            values.userType = '03';
          }
        } else {
          dispatchType = 'userMgr/modifyUser';
          const { userRoles = [], userType = '' } = currentUserProfile;
          const { roleCodes = [] } = values;
          const removeRoleCodes = this.getRemoveRoleCodes(userRoles, roleCodes);
          const addRoleCodes = this.getAddRoleCodes(userRoles, roleCodes);
          values.removeRoleCodes = removeRoleCodes;
          values.addRoleCodes = addRoleCodes;
          values.userType = userType;

          if (userType === '01') {
            const { userEffDate, userExpDate } = values;
            values.effectiveDate = userEffDate ? moment(userEffDate).format('YYYY-MM-DD') : null;
            values.expiryDate = userExpDate ? moment(userExpDate).format('YYYY-MM-DD') : '';
            delete values.companyId;
            delete values.userEffDate;
            delete values.userExpDate;
          }
        }
        dispatch({
          type: dispatchType,
          payload: values,
        }).then(result => {
          if (result) {
            router.goBack();
          }
        });
      }
    });
  };

  getRemoveRoleCodes = (userRoles = [], roleCodes = []) => {
    const removeRoleCodes = [];
    userRoles.forEach(item => {
      const { roleCode = '' } = item;
      if (!roleCodes.includes(roleCode)) {
        removeRoleCodes.push(roleCode);
      }
    });
    return removeRoleCodes;
  };

  getAddRoleCodes = (userRoles = [], roleCodes = []) => {
    const addRoleCode = [];
    roleCodes.forEach(roleCode => {
      const tem = userRoles.find(item => item.roleCode === roleCode);
      if (!tem) {
        addRoleCode.push(roleCode);
      }
    });
    return addRoleCode;
  };

  cancel = e => {
    e.preventDefault();
    router.goBack();
  };

  getCompanyOptions = () => {
    const {
      type = '',
      userMgr: { companyList = [], allSubTACompanies = [], currentUserProfile },
    } = this.props;
    const { userType = '' } = currentUserProfile;
    if (
      PrivilegeUtil.hasAnyPrivilege([
        PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
        PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE,
      ])
    ) {
      if (userType === constants.SUB_TA_USER_TYPE && (type === 'EDIT' || type === 'DETAIL')) {
        return allSubTACompanies.map(item => {
          if (item.id === -1) return null;
          return (
            <Option key={item.id} value={`${item.id}`}>
              {item.companyName}
            </Option>
          );
        });
      }
    }
    return companyList.map(item => {
      if (item.id === -1) return null;
      return (
        <Option key={item.id} value={`${item.id}`}>
          {item.companyName}
        </Option>
      );
    });
  };

  getSubCompanyOptions = () => {
    const {
      userMgr: { formSubTaCompanies = [] },
    } = this.props;
    return formSubTaCompanies.map(item => (
      <Option key={item.id} value={item.id}>
        {item.companyName}
      </Option>
    ));
  };

  companyChange = value => {
    const {
      dispatch,
      form: { setFields, setFieldsValue },
    } = this.props;
    let flag = false;
    if (
      !PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE]) &&
      PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SALES_SUPPORT_PRIVILEGE])
    ) {
      flag = true;
    }

    dispatch({
      type: 'userMgr/saveData',
      payload: {
        userFormOkDisable: false,
        formSubTaCompanies: [],
        companyDetailInfo: {},
      },
    });
    setFields({
      subCompanyId: {
        value: undefined,
      },
    });

    if (flag && value) {
      dispatch({
        type: 'userMgr/checkHasMasterUser',
        payload: {
          companyId: value,
          companyType: '01',
        },
      }).then(result => {
        if (!result) {
          setFields({
            companyId: {
              value,
              errors: [new Error(formatMessage({ id: 'MAIN_TA_HAS_USER_TIPS' }))],
            },
          });
          dispatch({
            type: 'userMgr/saveData',
            payload: {
              userFormOkDisable: true,
            },
          });
        } else {
          setFields({
            companyId: {
              value,
            },
          });
        }
      });
    }

    setFields({
      roleCodes: {
        value: undefined,
      },
    });

    if (value) {
      if (
        PrivilegeUtil.hasAnyPrivilege([
          PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
          PrivilegeUtil.SALES_SUPPORT_PRIVILEGE,
          PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE,
        ])
      ) {
        this.getTACompanyDetail(value);
        this.getUserRoles('01');
      } else if (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SUB_TA_ADMIN_PRIVILEGE])) {
        this.getUserRoles('02');
      }
    }

    const clearData = {
      userName: undefined,
      email: undefined,
      address: undefined,
      phone: undefined,
      officeNumber: undefined,
    };
    setFieldsValue(clearData);
    // if ta do not have user, then set basic info from sub ta company info.
    if (value) {
      dispatch({
        type: 'userMgr/fetchFirstUser',
        payload: {
          companyId: value,
          companyType: '01',
        },
      }).then(result => {
        if (result) {
          dispatch({
            type: 'userMgr/fetchTaDetail',
            payload: {
              taId: value,
            },
          }).then(res => {
            if (res) {
              const {
                email,
                phone,
                country,
                mobileNumber,
                mobileCountry,
                firstName,
                lastName,
              } = res;
              const {
                userMgr: {
                  companyDetailInfo: { address },
                },
              } = this.props;
              const companyData = {
                userName: firstName + lastName,
                email,
                address,
                phone: (isNvl(country) ? '' : country) + (isNvl(phone) ? '' : phone),
                officeNumber:
                  (isNvl(mobileCountry) ? '' : mobileCountry) +
                  (isNvl(mobileNumber) ? '' : mobileNumber),
              };
              setFieldsValue(companyData);
            }
          });
        }
      });
    }
  };

  subCompanyChange = value => {
    const {
      dispatch,
      form: { setFields, setFieldsValue },
    } = this.props;
    let flag = false;
    if (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE])) {
      flag = true;
    }

    if (flag && value) {
      dispatch({
        type: 'userMgr/checkHasMasterUser',
        payload: {
          companyId: value,
          companyType: '02',
        },
      }).then(result => {
        if (!result) {
          setFields({
            subCompanyId: {
              value,
              errors: [new Error(formatMessage({ id: 'SUB_TA_HAS_USER_TIPS' }))],
            },
          });
          dispatch({
            type: 'userMgr/saveData',
            payload: {
              userFormOkDisable: true,
            },
          });
        } else {
          setFields({
            subCompanyId: {
              value,
            },
          });
        }
      });
    } else {
      setFields({
        subCompanyId: {
          value,
        },
      });
    }

    const clearData = {
      userName: undefined,
      email: undefined,
      address: undefined,
      phone: undefined,
      officeNumber: undefined,
    };
    // if sub ta do not have user, then set basic info from sub ta company info.
    if (value) {
      dispatch({
        type: 'userMgr/fetchFirstUser',
        payload: {
          companyId: value,
          companyType: '02',
        },
      }).then(result => {
        if (result) {
          const {
            userMgr: { formSubTaCompanies = [] },
          } = this.props;
          const subTaInfo = formSubTaCompanies.find(item => item.id === value);
          const {
            fullName,
            email,
            address,
            phone,
            phoneCountry,
            mobileNumber,
            mobileCountry,
          } = subTaInfo;
          const companyData = {
            userName: fullName,
            email,
            address,
            phone: (isNvl(phoneCountry) ? '' : phoneCountry) + (isNvl(phone) ? '' : phone),
            officeNumber:
              (isNvl(mobileCountry) ? '' : mobileCountry) +
              (isNvl(mobileNumber) ? '' : mobileNumber),
          };
          setFieldsValue(companyData);
        } else {
          setFieldsValue(clearData);
        }
      });
    } else {
      setFieldsValue(clearData);
    }

    dispatch({
      type: 'userMgr/saveData',
      payload: {
        userFormOkDisable: false,
      },
    });
    setFields({
      roleCodes: {
        value: undefined,
      },
    });

    if (value) {
      this.getUserRoles('02');
    } else {
      this.getUserRoles('01');
    }
  };

  getTACompanyDetail = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/getTACompanyDetail',
      payload: {
        companyId,
      },
    });
  };

  getUserRoles = companyType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        currentCompanyType: companyType,
      },
    });
    dispatch({
      type: 'userMgr/queryUserRoles',
      payload: {
        roleType: companyType === '01' ? '02' : '03',
      },
    });
  };

  getUserRoleOptions = () => {
    const {
      userMgr: { userRoles = [], currentCompanyType = '' },
      global: { userCompanyInfo = {} },
    } = this.props;

    const { companyType = '00' } = userCompanyInfo;

    if (
      currentCompanyType === companyType ||
      PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE])
    ) {
      return userRoles.map(item => (
        <Option key={item.roleCode} value={item.roleCode}>
          {item.roleName}
        </Option>
      ));
    }

    let roleCode = '';
    if (PrivilegeUtil.hasAnyPrivilege([constants.USER_MGR_MAIN_TA_ADMIN_ROLE_PRIVILEGE])) {
      roleCode = constants.MAIN_TA_ADMIN_ROLE_CODE;
    } else if (PrivilegeUtil.hasAnyPrivilege([constants.USER_MGR_SUB_TA_ADMIN_ROLE_PRIVILEGE])) {
      roleCode = constants.SUB_TA_ADMIN_ROLE_CODE;
    }

    return userRoles
      .map(item => {
        if (item.roleCode === roleCode) {
          return (
            <Option key={item.roleCode} value={item.roleCode}>
              {item.roleName}
            </Option>
          );
        }
        return null;
      })
      .filter(item => item !== null);
  };

  getUserInfo = () => {
    const { type = '', userMgr = {} } = this.props;
    const { currentUserProfile = {} } = userMgr;

    if (type === 'NEW') {
      return {};
    }
    const { userCode = '', userType = '' } = currentUserProfile;
    let { taInfo = {}, rwsInfo = {} } = currentUserProfile;
    taInfo = taInfo || {};
    rwsInfo = rwsInfo || {};
    const {
      companyId,
      fullName = '',
      phone = '',
      email = '',
      address = '',
      remarks = '',
      officeNumber = '',
    } = taInfo;
    const {
      address: rwsAddress = '',
      remarks: rwsRemarks = '',
      fullName: rwsFullName = '',
      phone: rwsPhone = '',
      email: rwsEmail = '',
    } = rwsInfo;

    return {
      userCode,
      companyId: userType === constants.RWS_USER_TYPE ? 'RWS' : companyId,
      userName: userType === constants.RWS_USER_TYPE ? rwsFullName : fullName,
      phone: userType === constants.RWS_USER_TYPE ? rwsPhone : phone,
      email: userType === constants.RWS_USER_TYPE ? rwsEmail : email,
      address: userType === constants.RWS_USER_TYPE ? rwsAddress : address,
      remarks: userType === constants.RWS_USER_TYPE ? rwsRemarks : remarks,
      officeNumber: userType === constants.RWS_USER_TYPE ? '' : officeNumber,
    };
  };

  toDateTime = value => {
    if (!value) {
      return '';
    }
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  };

  disableStartDate = current => {
    const { form } = this.props;
    const data = current ? current.valueOf() : '';
    const userExpDate = form.getFieldValue('userExpDate');
    if (!current || !userExpDate) {
      return false;
    }
    return moment(data).startOf('day') >= moment(userExpDate).startOf('day');
  };

  disableEndDate = current => {
    const { form } = this.props;
    const data = current ? current.valueOf() : '';
    const userEffDate = form.getFieldValue('userEffDate');
    if (!current || !userEffDate) {
      return false;
    }
    return moment(data).startOf('day') <= moment(userEffDate).startOf('day');
  };

  checkUserCode = (rule, value, callback) => {
    const pattern = new RegExp("[`~!#$^&*=|{}':;,\\[\\]<>/?！@￥…（）—【】‘；：”“。，、？%+]");
    if (pattern.test(value)) {
      callback("User Login can not contain `~!#$^&*=|{}':;,[]<>/?！@￥…（）—【】‘；：”“。，、？%+");
    }
    callback();
  };

  render() {
    const {
      type = 'NEW',
      userMgr: { userFormOkDisable = false, currentUserProfile = {}, companyDetailInfo = {} },
      global: { currentUser = {} },
      addLoading = false,
      modifyLoading = false,
      form: { getFieldDecorator },
    } = this.props;

    const { userType: loginUserType = '' } = currentUser;

    const {
      userType = '',
      effectiveDate: userEffDate,
      expiryDate: userExpDate,
    } = currentUserProfile;
    const userInfo = this.getUserInfo();
    const {
      userCode,
      companyId,
      userName = '',
      phone = '',
      officeNumber = '',
      email = '',
      address = '',
      remarks = '',
    } = userInfo;

    const {
      marketName = '',
      categoryName = '',
      customerGroupName = '',
      effectiveDate: effectiveStartDate,
      endDate: effectiveEndDate,
      salesPerson = '',
    } = companyDetailInfo;

    const subCompanyId = '';

    return (
      <Fragment>
        <Form onSubmit={this.commit}>
          <div style={{ padding: '15px' }}>
            <Row>
              <Col className={styles.headerClass}>
                {formatMessage({ id: 'INFORMATION_FOR_SALES' })}
              </Col>
            </Row>
            <Row {...rowLayOut}>
              <Col {...colLayOut} style={{ minHeight: '75px' }}>
                <Form.Item
                  label={
                    PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SUB_TA_ADMIN_PRIVILEGE]) ||
                    type === 'EDIT' ||
                    type === 'DETAIL'
                      ? formatMessage({ id: 'COMPANY_NAME' })
                      : formatMessage({ id: 'TA_COMPANY_NAME' })
                  }
                >
                  {getFieldDecorator(`companyId`, {
                    initialValue: type === 'NEW' ? undefined : String(companyId),
                    rules: [
                      {
                        required: userType !== constants.RWS_USER_TYPE,
                        message: formatMessage({ id: 'REQUIRED' }),
                      },
                    ],
                  })(
                    <SortSelect
                      onChange={this.companyChange}
                      disabled={type === 'DETAIL' || type === 'EDIT'}
                      allowClear
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      options={this.getCompanyOptions()}
                    />
                  )}
                </Form.Item>
              </Col>
              {PrivilegeUtil.hasAnyPrivilege([
                PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
                PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE,
              ]) && type === 'NEW' ? (
                <Col {...colLayOut} style={{ minHeight: '75px' }}>
                  <Form.Item label={formatMessage({ id: 'SUB_COMPANY_NAME' })}>
                    {getFieldDecorator(`subCompanyId`, {
                      initialValue: type === 'NEW' ? undefined : String(subCompanyId),
                    })(
                      <SortSelect
                        onChange={this.subCompanyChange}
                        disabled={type === 'DETAIL' || type === 'EDIT'}
                        allowClear
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        options={this.getSubCompanyOptions()}
                      />
                    )}
                  </Form.Item>
                </Col>
              ) : null}
              <Col {...colLayOut}>
                <Form.Item
                  label={
                    <span>
                      {formatMessage({ id: 'USER_LOGIN' })}&nbsp;
                      <Tooltip title={formatMessage({ id: 'USER_LOGIN_TIPS' })}>
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator(`userCode`, {
                    initialValue: userCode,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'REQUIRED' }),
                      },
                      {
                        validator: (rule, value, callback) => {
                          this.checkUserCode(rule, value, callback);
                        },
                      },
                    ],
                  })(
                    <Input
                      allowClear
                      maxLength={50}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                      disabled={type !== 'NEW'}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayOut}>
                <Form.Item label={formatMessage({ id: 'FULL_NAME' })}>
                  {getFieldDecorator(`userName`, {
                    initialValue: userName,
                    rules: [
                      {
                        required: userType !== constants.RWS_USER_TYPE,
                        message: formatMessage({ id: 'REQUIRED' }),
                      },
                    ],
                  })(
                    type === 'DETAIL' ? (
                      <Tooltip
                        placement="topLeft"
                        title={<span style={{ whiteSpace: 'pre-wrap' }}>{userName || ''}</span>}
                      >
                        <Input
                          disabled
                          maxLength={80}
                          allowClear
                          value={userName}
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoComplete="off"
                        />
                      </Tooltip>
                    ) : (
                      <Input
                        disabled={userType === constants.RWS_USER_TYPE}
                        maxLength={80}
                        allowClear
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        autoComplete="off"
                      />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayOut} style={{ minHeight: '75px' }}>
                <Form.Item label={formatMessage({ id: 'ROLE' })}>
                  {getFieldDecorator(`roleCodes`, {
                    initialValue: this.getRoleCodes(currentUserProfile),
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'REQUIRED' }),
                      },
                    ],
                  })(
                    <SortSelect
                      allowClear
                      showArrow
                      mode="multiple"
                      disabled={type === 'DETAIL'}
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      options={this.getUserRoleOptions()}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayOut}>
                <Form.Item label={formatMessage({ id: 'PHONE' })}>
                  {getFieldDecorator(`phone`, {
                    initialValue: phone,
                  })(
                    type === 'DETAIL' ? (
                      <Tooltip
                        placement="topLeft"
                        title={<span style={{ whiteSpace: 'pre-wrap' }}>{phone || ''}</span>}
                      >
                        <Input
                          disabled
                          type="tel"
                          value={phone}
                          allowClear
                          maxLength={80}
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoComplete="off"
                        />
                      </Tooltip>
                    ) : (
                      <Input
                        disabled={userType === constants.RWS_USER_TYPE}
                        type="tel"
                        allowClear
                        maxLength={80}
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        autoComplete="off"
                      />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayOut}>
                <Form.Item label={formatMessage({ id: 'OFFICE_NUMBER' })}>
                  {getFieldDecorator(`officeNumber`, {
                    initialValue: officeNumber,
                  })(
                    type === 'DETAIL' ? (
                      <Tooltip
                        placement="topLeft"
                        title={<span style={{ whiteSpace: 'pre-wrap' }}>{officeNumber || ''}</span>}
                      >
                        <Input
                          disabled
                          type="tel"
                          value={officeNumber}
                          allowClear
                          maxLength={80}
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoComplete="off"
                        />
                      </Tooltip>
                    ) : (
                      <Input
                        disabled={userType === constants.RWS_USER_TYPE}
                        type="tel"
                        allowClear
                        maxLength={80}
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        autoComplete="off"
                      />
                    )
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayOut}>
                <Form.Item label={formatMessage({ id: 'EMAIL' })}>
                  {getFieldDecorator(`email`, {
                    initialValue: email,
                    rules: [
                      {
                        type: 'email',
                        message: formatMessage({ id: 'VALID_EMAIL' }),
                      },
                      {
                        required: true,
                        message: formatMessage({ id: 'REQUIRED' }),
                      },
                    ],
                  })(
                    <Input
                      disabled={type === 'DETAIL' || userType === constants.RWS_USER_TYPE}
                      allowClear
                      maxLength={200}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              {userType === constants.RWS_USER_TYPE && (
                <React.Fragment>
                  <Col {...colLayOut}>
                    <Form.Item label={formatMessage({ id: 'EFFECTIVE_DATE' })}>
                      {getFieldDecorator('userEffDate', {
                        initialValue: userEffDate ? moment(userEffDate) : null,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'REQUIRED' }),
                          },
                        ],
                      })(
                        <DatePicker
                          disabled={type === 'DETAIL'}
                          style={{ width: '100%' }}
                          placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                          disabledDate={this.disableStartDate}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col {...colLayOut}>
                    <Form.Item label={formatMessage({ id: 'EXPIRY_DATE' })}>
                      {getFieldDecorator('userExpDate', {
                        initialValue: userExpDate ? moment(userExpDate) : null,
                      })(
                        <DatePicker
                          disabled={type === 'DETAIL'}
                          style={{ width: '100%' }}
                          placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                          disabledDate={this.disableEndDate}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </React.Fragment>
              )}
              <Col span={24}>
                <Form.Item label={formatMessage({ id: 'ADDRESS' })}>
                  {getFieldDecorator(`address`, {
                    initialValue: address,
                  })(
                    <Input
                      disabled={type === 'DETAIL'}
                      allowClear
                      maxLength={1000}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              {loginUserType === constants.RWS_USER_TYPE ? (
                <Col span={24}>
                  <Form.Item label={formatMessage({ id: 'REMARKS' })}>
                    {getFieldDecorator(`remarks`, {
                      initialValue: remarks,
                    })(
                      <TextArea
                        disabled={type === 'DETAIL'}
                        maxLength={2000}
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                    )}
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
            {userType === constants.TA_USER_TYPE ||
            (type === 'NEW' &&
              PrivilegeUtil.hasAnyPrivilege([
                PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
                PrivilegeUtil.SALES_SUPPORT_PRIVILEGE,
                PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE,
              ])) ? (
                <React.Fragment>
                  <Row>
                    <Col className={styles.headerClass} style={{ marginTop: '16px' }}>
                      {formatMessage({ id: 'TA_SUPPLEMENTARY_INFORMATION' })}
                    </Col>
                  </Row>
                  <Row {...rowLayOut}>
                    {loginUserType === constants.RWS_USER_TYPE && (
                    <Col {...colLayOut}>
                      <Form.Item label={formatMessage({ id: 'MARKET' })}>
                        {getFieldDecorator(`market`, {
                          initialValue: marketName || '',
                        })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                  )}
                    <Col {...colLayOut}>
                      <Form.Item label={formatMessage({ id: 'EFFECTIVE_DATE' })}>
                        {getFieldDecorator(`effectiveStartDate`, {
                        initialValue: this.toDateTime(effectiveStartDate),
                      })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                    <Col {...colLayOut}>
                      <Form.Item label={formatMessage({ id: 'END_DATE' })}>
                        {getFieldDecorator(`effectiveEndDate`, {
                        initialValue: this.toDateTime(effectiveEndDate),
                      })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                    <Col {...colLayOut}>
                      <Form.Item label={formatMessage({ id: 'SALES_PERSON' })}>
                        {getFieldDecorator(`salesPerson`, {
                        initialValue: salesPerson || '',
                      })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                    {loginUserType === constants.RWS_USER_TYPE && (
                    <Col {...colLayOut}>
                      <Form.Item label={formatMessage({ id: 'CATEGORY_AND_CUSTOMER_GROUP' })}>
                        {getFieldDecorator(`cateAndGroup`, {
                          initialValue: `${categoryName || ''}/${customerGroupName || ''}`,
                        })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                  )}
                  </Row>
                </React.Fragment>
            ) : null}
          </div>
          <Row>
            <Col style={{ textAlign: 'right', borderTop: '1px solid #EEE', padding: '10px 15px' }}>
              <Button onClick={e => this.cancel(e)}>
                {formatMessage({ id: 'COMMON_CANCEL' })}
              </Button>
              <Button
                disabled={userFormOkDisable}
                type="primary"
                htmlType="submit"
                loading={addLoading || modifyLoading}
                style={{ marginLeft: '10px', display: type === 'DETAIL' ? 'none' : 'inline' }}
              >
                {formatMessage({ id: 'COMMON_OK' })}
              </Button>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}

export default Index;
