import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, TreeSelect } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { getAllChildrenTargetList, getAllTargetList } from '../utils/pubUtils';
import styles from '../index.less';
import SortSelect from '@/components/SortSelect';

const { Option } = Select;

const colLayout = {
  lg: 6,
  md: 8,
  sm: 12,
  xs: 24,
};

const colAdminBtnLayout = {
  lg: 24,
  md: 16,
  sm: 24,
  xs: 24,
};

const colBtnLayout = {
  lg: 12,
  md: 8,
  sm: 24,
  xs: 24,
};

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
  colon: false,
};

@connect(({ notificationSearchForm }) => ({
  notificationSearchForm,
}))
class NotificationSearchForm extends PureComponent {
  static defaultProps = {
    onSearch: () => {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notificationSearchForm/queryNotificationTypeList',
    });
    dispatch({
      type: 'notificationSearchForm/queryTargetTypeList',
    });
    dispatch({
      type: 'notificationSearchForm/queryStatusList',
    });
    dispatch({ type: 'notificationSearchForm/queryAllCompanyConfig' });
  }

  handleReset = () => {
    const { form, onSearch } = this.props;
    form.resetFields();
    form.validateFields((err, values) => {
      if (!err) {
        let startDate;
        let endDate;
        if (Array.isArray(values.createDate)) {
          startDate = values.createDate[0].format('YYYY-MM-DD');
          endDate = values.createDate[1].format('YYYY-MM-DD');
        }
        values.startDate = startDate;
        values.endDate = endDate;
        onSearch(values);
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      notificationSearchForm: { targetTreeData = [] },
      onSearch,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let startDate;
        let endDate;
        if (Array.isArray(values.createDate)) {
          startDate = values.createDate[0].format('YYYY-MM-DD');
          endDate = values.createDate[1].format('YYYY-MM-DD');
        }
        values.startDate = startDate;
        values.endDate = endDate;
        const newTargetList = [];
        if (values.targetList && values.targetList.length > 0) {
          const aaList = [];
          getAllTargetList(values.targetList, targetTreeData, aaList);
          getAllChildrenTargetList(aaList, newTargetList);
        }
        values.targetList = newTargetList;
        onSearch(values);
      }
    });
  };

  getStatusTitle = text => {
    let statusTxt = null;
    switch (String(text).toLowerCase()) {
      case '01':
        statusTxt = formatMessage({ id: 'NOTICE_STATUS_DRAFT' });
        break;
      case '02':
        statusTxt = formatMessage({ id: 'NOTICE_STATUS_PUBLISHED' });
        break;
      case '03':
        statusTxt = formatMessage({ id: 'NOTICE_STATUS_PENDING' });
        break;
      default:
        break;
    }
    return statusTxt;
  };

  render() {
    const {
      form,
      notificationSearchForm: { statusList = [], targetTreeData = [] },
      isAdminRoleFlag = false,
    } = this.props;
    const { getFieldDecorator } = form;
    const viewId = 'notificationSearchView';
    const tProps = {
      allowClear: true,
      showSearch: true,
      multiple: true,
      treeDefaultExpandAll: true,
      treeData: targetTreeData,
      treeCheckable: true,
      treeNodeFilterProp: 'title',
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      searchPlaceholder: formatMessage({ id: 'NOTICE_PLEASE_SELECT' }),
      getPopupContainer: () => document.getElementById(`${viewId}`),
      style: {
        width: '100%',
      },
      dropdownStyle: {
        maxHeight: '300px',
        maxWidth: '200px',
      },
    };
    return (
      <Card id={`${viewId}`} className={`as-shadow no-border ${styles.formCardClass}`}>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col {...colLayout}>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator(`title`, {
                  rules: [],
                })(
                  <Input
                    allowClear
                    placeholder={formatMessage({ id: 'TITLE' })}
                    autoComplete="off"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator(`readStatus`, {
                  rules: [],
                })(
                  <SortSelect
                    allowClear
                    placeholder={formatMessage({ id: 'READ_STATUS' })}
                    getPopupContainer={() => document.getElementById(`${viewId}`)}
                    options={[
                      <Option key={`readStatusList01}`} value="01">
                        {formatMessage({ id: 'READ_STATUS_READ' })}
                      </Option>,
                      <Option key={`readStatusList02}`} value="02">
                        {formatMessage({ id: 'READ_STATUS_UNREAD' })}
                      </Option>,
                    ]}
                  />
                )}
              </Form.Item>
            </Col>
            {isAdminRoleFlag && (
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} style={{ height: '32px' }}>
                  {getFieldDecorator(`targetList`, {
                    rules: [],
                  })(
                    <TreeSelect {...tProps} placeholder={formatMessage({ id: 'TARGET_OBJECT' })} />
                  )}
                </Form.Item>
              </Col>
            )}
            {isAdminRoleFlag && (
              <Col {...colLayout}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator(`status`, {
                    rules: [],
                  })(
                    <SortSelect
                      allowClear
                      placeholder={formatMessage({ id: 'STATUS' })}
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                      options={statusList.map(item => (
                        <Option key={`statusList${item.id}`} value={item.dicValue}>
                          {this.getStatusTitle(item.dicValue)}
                        </Option>
                      ))}
                    />
                  )}
                </Form.Item>
              </Col>
            )}
            {isAdminRoleFlag ? (
              <Col {...colAdminBtnLayout} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 15 }}>
                  {formatMessage({ id: 'SEARCH' })}
                </Button>
                <Button htmlType="reset" onClick={this.handleReset}>
                  {formatMessage({ id: 'RESET' })}
                </Button>
              </Col>
            ) : (
              <Col {...colBtnLayout} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 15 }}>
                  {formatMessage({ id: 'SEARCH' })}
                </Button>
                <Button htmlType="reset" onClick={this.handleReset}>
                  {formatMessage({ id: 'RESET' })}
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </Card>
    );
  }
}

const WrapperNotificationSearchForm = Form.create({ name: 'NotificationSearch' })(
  NotificationSearchForm
);

export default WrapperNotificationSearchForm;
