import React from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import { formatMessage } from 'umi/locale';
import classNames from 'classnames';
import { connect } from 'dva';
import detailStyles from './OperationApproval.less';
import OperationApprovalHistory from '@/pages/MyActivity/components/OperationApprovalHistory';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';
import SortSelect from '@/components/SortSelect';

const { Option } = Select;
const ColProps = {
  xs: 24,
};

@Form.create()
@connect(({ operationApproval }) => ({
  operationApproval,
}))
class OperationApproval extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationApproval/queryRerouteList',
    });
    dispatch({
      type: 'operationApproval/querySalePerson',
    });
  }

  reroute = checked => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationApproval/save',
      payload: {
        bReroute: checked,
      },
    });
  };

  radioDrawChange = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationApproval/save',
      payload: {
        approvalStatus: e.target.value,
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationApproval/save',
      payload: {
        operationVisible: false,
      },
    });
  };

  ok = ev => {
    ev.preventDefault();
    const {
      form,
      dispatch,
      operationApproval: { bReroute, approvalStatus },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'operationApproval/save',
          payload: {
            loadingFlag: true,
          },
        });
        if (bReroute === true) {
          dispatch({
            type: 'operationApproval/approve',
            payload: {
              bReroute,
              approver: values.approver,
            },
          });
        } else {
          dispatch({
            type: 'operationApproval/approve',
            payload: {
              approvalStatus,
              reason: values.reason,
              remarks: values.remarks,
              allowRestart: values.allowRestart,
              saleManager: values.saleManager,
            },
          });
        }
      }
    });
  };

  handleInitVal = key => {
    const { operationApproval } = this.props;
    return operationApproval[key];
  };

  render() {
    const {
      form: { getFieldDecorator },
      operationApproval: {
        bReroute,
        approvalStatus,
        rerouteList = [],
        saleManagerList = [],
        loadingFlag,
      },
      activityTplCode,
      pendStepTplCode,
      approveLoading,
    } = this.props;
    const isTaRegistrationAllowedRole = hasAllPrivilege(['TA_REGISTRATION_NOT_ALLOWED_PRIVILEGE']);
    const rerouteSelectList = rerouteList.map(item => (
      <Option key={item} value={item}>
        {item}
      </Option>
    ));
    const saleManagerSelectList = saleManagerList.map(user => (
      <Option key={`option_${user.id}`} value={user.userCode}>
        {user.userCode}
      </Option>
    ));
    return (
      <React.Fragment>
        <Spin spinning={approveLoading === true}>
          <Col span={24} className={detailStyles.approvalHis}>
            <Card>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <OperationApprovalHistory />
                  <div className="no-shadow no-border">
                    <div>
                      <span className={detailStyles.titleHeader}>
                        {formatMessage({ id: 'COMMON_APPROVAL' })}
                      </span>
                    </div>
                    <div className={classNames(detailStyles.searchDiv, 'no-shadow', 'no-border')}>
                      <Form className={classNames('ant-advanced-search-form')}>
                        <Row>
                          {activityTplCode !== 'SUB-TA-SIGN-UP' ? (
                            <Col {...ColProps}>
                              <Form.Item
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 6 }}
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
                          ) : null}
                          {bReroute !== true ? (
                            <Col {...ColProps}>
                              <Form.Item
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
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
                                  <Radio.Group>
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
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
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
                                  <SortSelect
                                    placeholder="Please Select"
                                    mode="multiple"
                                    options={rerouteSelectList}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          ) : null}
                          {approvalStatus === 'A' &&
                          !bReroute &&
                          pendStepTplCode === 'TA_SALES_LEAD_APPROVAL' ? (
                            <Col {...ColProps}>
                              <Form.Item
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                label={formatMessage({ id: 'SALE_MANAGER' })}
                              >
                                {getFieldDecorator(
                                  `saleManager`,
                                  {}
                                )(
                                  <SortSelect
                                    showSearch
                                    placeholder="Please Select"
                                    filterOption={(input, option) =>
                                      option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={saleManagerSelectList}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          ) : null}
                          {approvalStatus === 'R' && !bReroute ? (
                            <Col {...ColProps}>
                              <Form.Item
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
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
                          isTaRegistrationAllowedRole &&
                          activityTplCode === 'TA-SIGN-UP' ? (
                            <Col {...ColProps}>
                              {getFieldDecorator('allowRestart', {
                                valuePropName: 'checked',
                              })(
                                <Checkbox>
                                  {formatMessage({ id: 'TA_REGISTRATION_NOT_ALLOW_RESTART' })}
                                </Checkbox>
                              )}
                            </Col>
                          ) : null}
                          {approvalStatus === 'A' && !bReroute ? (
                            <Col {...ColProps}>
                              <Form.Item
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                label={formatMessage({ id: 'COMMON_REMARKS' })}
                              >
                                {getFieldDecorator(
                                  `remarks`,
                                  {}
                                )(<Input.TextArea placeholder="Please Enter" />)}
                              </Form.Item>
                            </Col>
                          ) : null}
                        </Row>
                      </Form>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Spin>
        <div className={detailStyles.cancelOk}>
          <Button onClick={this.cancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            className={detailStyles.ok}
            loading={loadingFlag}
            onClick={this.ok}
          >
            OK
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default OperationApproval;
