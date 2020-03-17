import React from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Radio,
  Row,
  Select,
  Switch,
  Spin,
  Checkbox,
} from 'antd';
import { formatMessage } from 'umi/locale';
import classNames from 'classnames';
import { connect } from 'dva';
import { router } from 'umi';
import detailStyles from './Approval.less';
import ApprovalHistory from './ApprovalHistory';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 10,
  },
};

const formItemLayoutNonLable = {
  wrapperCol: {
    offset: 6,
    span: 10,
  },
};

const ColProps = {
  xs: 24,
};

@Form.create()
@connect(({ activityDetail, loading }) => ({
  activityDetail,
  approveLoading: loading.effects['activityDetail/approve'],
}))
class Approval extends React.PureComponent {
  reroute = checked => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityDetail/save',
      payload: {
        bReroute: checked,
      },
    });
  };

  radioDrawChange = e => {
    const { dispatch } = this.props;

    dispatch({
      type: 'activityDetail/save',
      payload: {
        approvalStatus: e.target.value,
      },
    });
  };

  cancel = () => {
    router.push({
      pathname: '/MyActivity',
    });
  };

  ok = ev => {
    ev.preventDefault();
    const {
      form,
      dispatch,
      activityDetail: { bReroute, approvalStatus },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (bReroute === true) {
          dispatch({
            type: 'activityDetail/approve',
            payload: {
              bReroute,
              approver: values.approver,
            },
          });
        } else {
          dispatch({
            type: 'activityDetail/approve',
            payload: {
              approvalStatus,
              reason: values.reason,
              allowRestart: values.allowRestart,
            },
          });
        }
      }
    });
  };

  handleInitVal = key => {
    const { activityDetail } = this.props;
    return activityDetail[key];
  };

  render() {
    const {
      form: { getFieldDecorator },
      activityDetail: {
        bReroute,
        approvalStatus,
        activityInfo: { status: activityStatus, activityTplCode },
      },
      rerouteList = [],
      approveLoading,
    } = this.props;
    const rerouteSelectList = rerouteList.map(item => (
      <Option key={item} value={item}>
        {item}
      </Option>
    ));

    return (
      <Spin spinning={approveLoading === true}>
        <Col span={24} id="signUpView">
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Card>
                <Row type="flex" justify="space-around">
                  <Col span={24}>
                    <ApprovalHistory />
                    {activityStatus === '02' ? (
                      <div className="no-shadow no-border">
                        <div className={detailStyles.titleHeader}>
                          <span>{formatMessage({ id: 'COMMON_APPROVAL' })}</span>
                        </div>
                        <div
                          className={classNames(detailStyles.searchDiv, 'no-shadow', 'no-border')}
                        >
                          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                            <Row>
                              <Col {...ColProps}>
                                <Form.Item
                                  {...formItemLayout}
                                  label={formatMessage({ id: 'APPROVAL_RE_ROUTE' })}
                                >
                                  {getFieldDecorator(`bReroute`, {
                                    rules: [
                                      {
                                        required: false,
                                        msg: 'Required',
                                      },
                                    ],
                                  })(
                                    <div style={{ marginTop: '4px' }}>
                                      <Switch
                                        disabled={rerouteList == null || rerouteList.length === 0}
                                        checkedChildren={<Icon type="check" />}
                                        unCheckedChildren={<Icon type="close" />}
                                        style={{ marginRight: '20px' }}
                                        onChange={this.reroute}
                                        checked={bReroute}
                                      />
                                    </div>
                                  )}
                                </Form.Item>
                              </Col>
                              {bReroute !== true ? (
                                <Col {...ColProps}>
                                  <Form.Item
                                    {...formItemLayout}
                                    label={formatMessage({ id: 'STATUS' })}
                                  >
                                    {getFieldDecorator(`approvalStatus`, {
                                      rules: [
                                        {
                                          required: bReroute !== true,
                                          msg: 'Required',
                                        },
                                      ],
                                      initialValue: this.handleInitVal('approvalStatus'),
                                    })(
                                      <Radio.Group className={detailStyles.radioStyle}>
                                        <Radio
                                          value="A"
                                          checked={approvalStatus === 'A'}
                                          onChange={this.radioDrawChange}
                                        >
                                          {formatMessage({ id: 'APPROVAL_ACCEPT' })}
                                        </Radio>
                                        <Radio
                                          value="R"
                                          checked={approvalStatus === 'R'}
                                          onChange={this.radioDrawChange}
                                        >
                                          {formatMessage({ id: 'APPROVAL_REJECT' })}
                                        </Radio>
                                      </Radio.Group>
                                    )}
                                  </Form.Item>
                                </Col>
                              ) : null}
                              {bReroute === true ? (
                                <Col {...ColProps}>
                                  <Form.Item
                                    {...formItemLayout}
                                    label={formatMessage({ id: 'APPROVAL_APPROVER' })}
                                  >
                                    {getFieldDecorator(`approver`, {
                                      rules: [
                                        {
                                          required: bReroute,
                                          msg: 'Required',
                                          type: 'array',
                                        },
                                      ],
                                    })(
                                      <Select placeholder="Please Select" mode="multiple">
                                        {rerouteSelectList}
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                              ) : null}
                              {approvalStatus === 'R' && !bReroute ? (
                                <Col {...ColProps}>
                                  <Form.Item
                                    {...formItemLayout}
                                    label={formatMessage({ id: 'APPROVAL_REASON' })}
                                  >
                                    {getFieldDecorator(`reason`, {
                                      rules: [
                                        {
                                          required: approvalStatus === 'R' && !bReroute,
                                          msg: 'Required',
                                        },
                                      ],
                                    })(<Input.TextArea placeholder="Please Enter" />)}
                                  </Form.Item>
                                </Col>
                              ) : null}
                              {approvalStatus === 'R' &&
                              !bReroute &&
                              activityTplCode === 'TA-SIGN-UP' ? (
                                <Col {...ColProps}>
                                  <Form.Item
                                    className={detailStyles.allowRestart}
                                    {...formItemLayoutNonLable}
                                  >
                                    {getFieldDecorator(
                                      `allowRestart`,
                                      {}
                                    )(
                                      <Checkbox>
                                        {formatMessage({ id: 'TA_REGISTRATION_NOT_ALLOW_RESTART' })}
                                      </Checkbox>
                                    )}
                                  </Form.Item>
                                </Col>
                              ) : null}
                              {approvalStatus === 'A' && !bReroute ? (
                                <Col {...ColProps}>
                                  <Form.Item
                                    {...formItemLayout}
                                    label={formatMessage({ id: 'COMMON_REMARKS' })}
                                  >
                                    {getFieldDecorator(`reason`, {
                                      rules: [
                                        {
                                          required: approvalStatus === 'R' && !bReroute,
                                          msg: 'Required',
                                        },
                                      ],
                                    })(<Input.TextArea placeholder="Please Enter" />)}
                                  </Form.Item>
                                </Col>
                              ) : null}
                            </Row>
                          </Form>
                        </div>
                        <div className={detailStyles.cancelOk}>
                          <Button className={detailStyles.cancel} onClick={this.cancel}>
                            Cancel
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className={detailStyles.ok}
                            onClick={this.ok}
                          >
                            OK
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Spin>
    );
  }
}

export default Approval;
