import React from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Row,
  Select,
  Spin,
  Tooltip,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import moment from 'moment';
import TextArea from 'antd/es/input/TextArea';
import styles from '../index.less';
import SCREEN from '@/utils/screen';
import { colLayOut, rowLayOut } from '@/utils/utils';
import SortSelect from '@/components/SortSelect';
import PrivilegeUtil from '@/utils/PrivilegeUtil';

const { Option } = Select;

@Form.create()
@connect(({ userMgr, loading }) => ({
  userMgr,
  pageLoading:
    loading.effects['userMgr/addRWSUser'] ||
    loading.effects['userMgr/checkUserCode'] ||
    loading.effects['userMgr/queryUserRoles'],
}))
class index extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    if (!PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.CREATE_RWS_USER_PRIVILEGE])) {
      router.push(`/Exception/403`);
    }
    dispatch({
      type: 'userMgr/queryUserRoles',
      payload: {
        roleType: '01',
      },
    });
  }

  filterCode = () => {
    const { dispatch, form } = this.props;
    const userCode = form.getFieldValue('userCode');
    if (userCode !== undefined && userCode !== null && userCode !== '') {
      dispatch({
        type: 'userMgr/checkUserCode',
        payload: {
          userCode,
        },
      }).then(resultData => {
        if (resultData) {
          const { email, phone } = resultData;
          if (email) {
            this.resetEmailAndPhone(form, email, phone);
          } else {
            this.resetEmailAndPhone(form, null, null);
            message.warn(formatMessage({ id: 'SET_EMAIL_ON_AD_SERVER' }));
          }
        } else if (resultData === null) {
          this.resetEmailAndPhone(form, null, null);
          message.warn(formatMessage({ id: 'USER_NO_EXIST_ON_AD_SERVER' }));
        }
      });
    }
  };

  resetEmailAndPhone = (form, email, phone) => {
    form.setFieldsValue({
      email: email ? email.trim() : null,
      phone,
    });
  };

  getUserRoleOptions = () => {
    const {
      userMgr: { userRoles = [] },
    } = this.props;

    return userRoles
      .map(item => {
        return (
          <Option key={item.roleCode} value={item.roleCode}>
            {item.roleName}
          </Option>
        );
      })
      .filter(item => item !== null);
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

  commit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const { userEffDate, userExpDate } = values;
        dispatch({
          type: 'userMgr/addRWSUser',
          payload: {
            ...values,
            effectiveDate:
              userEffDate !== undefined ? moment(userEffDate).format('YYYY-MM-DD') : null,
            expiryDate: userExpDate !== undefined ? moment(userExpDate).format('YYYY-MM-DD') : null,
            userType: '01',
          },
        }).then(result => {
          if (result) {
            router.goBack();
          }
        });
      }
    });
  };

  cancel = e => {
    e.preventDefault();
    router.goBack();
  };

  render() {
    const {
      pageLoading,
      form: { getFieldDecorator },
    } = this.props;

    const breadCrumbBody = (
      <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
        <Breadcrumb.Item className={styles.breadCrumbStyle}>
          {formatMessage({ id: 'SYSTEM_MANAGEMENT' })}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className={styles.breadCrumbStyle}
          style={{ cursor: 'pointer' }}
          onClick={e => this.cancel(e)}
        >
          {formatMessage({ id: 'USER_MANAGEMENT' })}
        </Breadcrumb.Item>
        <Breadcrumb.Item className={styles.breadCrumbBold}>
          {formatMessage({ id: 'COMMON_NEW_RWS_USER' })}
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    return (
      <Col lg={24} md={24}>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          {breadCrumbBody}
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>{breadCrumbBody}</MediaQuery>
        <Card className={styles.cardClass}>
          <Spin spinning={!!pageLoading}>
            <Form onSubmit={this.commit}>
              <div style={{ padding: '15px' }}>
                <Row {...rowLayOut}>
                  <Col {...colLayOut}>
                    <Form.Item label={formatMessage({ id: 'FULL_NAME' })}>
                      {getFieldDecorator(`userName`, {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'REQUIRED' }),
                          },
                        ],
                      })(
                        <Input
                          maxLength={80}
                          allowClear
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoComplete="off"
                        />
                      )}
                    </Form.Item>
                  </Col>
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
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'REQUIRED' }),
                          },
                        ],
                      })(
                        <Input
                          allowClear
                          maxLength={50}
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoComplete="off"
                          onBlur={() => this.filterCode()}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col {...colLayOut}>
                    <Form.Item label={formatMessage({ id: 'PHONE' })}>
                      {getFieldDecorator(
                        `phone`,
                        {}
                      )(
                        <Input
                          disabled
                          type="tel"
                          allowClear
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoComplete="off"
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col {...colLayOut}>
                    <Form.Item label={formatMessage({ id: 'EMAIL' })}>
                      {getFieldDecorator(`email`, {
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
                          disabled
                          allowClear
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoComplete="off"
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col {...colLayOut}>
                    <Form.Item label={formatMessage({ id: 'EFFECTIVE_DATE' })}>
                      {getFieldDecorator('userEffDate', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'REQUIRED' }),
                          },
                        ],
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                          disabledDate={this.disableStartDate}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col {...colLayOut}>
                    <Form.Item label={formatMessage({ id: 'EXPIRY_DATE' })}>
                      {getFieldDecorator(
                        'userExpDate',
                        {}
                      )(
                        <DatePicker
                          style={{ width: '100%' }}
                          placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                          disabledDate={this.disableEndDate}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label={formatMessage({ id: 'ROLE' })}>
                      {getFieldDecorator(`roleCodes`, {
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
                          placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                          options={this.getUserRoleOptions()}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label={formatMessage({ id: 'ADDRESS' })}>
                      {getFieldDecorator(
                        `address`,
                        {}
                      )(
                        <Input
                          allowClear
                          maxLength={1000}
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoComplete="off"
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label={formatMessage({ id: 'REMARKS' })}>
                      {getFieldDecorator(
                        `remarks`,
                        {}
                      )(
                        <TextArea
                          maxLength={2000}
                          placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                          autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col
                  style={{ textAlign: 'right', borderTop: '1px solid #EEE', padding: '10px 15px' }}
                >
                  <Button onClick={e => this.cancel(e)}>
                    {formatMessage({ id: 'COMMON_CANCEL' })}
                  </Button>
                  <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'COMMON_OK' })}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
      </Col>
    );
  }
}

export default index;
