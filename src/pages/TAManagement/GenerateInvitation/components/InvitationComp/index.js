import React, { PureComponent } from 'react';
import { Button, Card, Col, Drawer, Form, message, Row, Select, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import SortSelect from '@/components/SortSelect';

const mapStateToProps = store => {
  const {
    taId = null,
    companyName = null,
    searchList,
    searchForm,
    emailList = [],
    emailContent = {},
    invitationVisible = false,
    sendInvitationLoading = false,
  } = store.generateInvitation;
  return {
    taId,
    companyName,
    searchList,
    searchForm,
    emailList,
    emailContent,
    invitationVisible,
    sendInvitationLoading,
  };
};

@Form.create()
@connect(mapStateToProps)
class InvitationComp extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
  }

  onClose = () => {
    const { dispatch, form, taId, searchList, searchForm } = this.props;
    form.resetFields();
    dispatch({
      type: 'generateInvitation/save',
      payload: {
        emailList: [],
        invitationVisible: false,
      },
    });
    dispatch({
      type: 'generateInvitation/fetchQryInvitationRecordList',
      payload: {
        taId,
        email: searchForm.email || null,
        invitationStartDate: searchForm.invitationStartDate || null,
        invitationEndDate: searchForm.invitationEndDate || null,
        status: searchForm.status || null,
        pageInfo: {
          totalSize: searchList.total,
          currentPage: searchList.currentPage,
          pageSize: searchList.pageSize,
        },
      },
    });
  };

  getEmailVal = emailList => {
    const emailValList = [];
    if (emailList && emailList.length > 0) {
      emailList.map(item => emailValList.push(`${item.email}`));
    }
    return emailValList;
  };

  compareToEmailList = (rule, value, callback) => {
    if (!isNvl(value) && value.length > 0) {
      let checkEmail = false;
      value.forEach(n => {
        const _emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!_emailRegex.test(n)) {
          checkEmail = true;
        }
      });
      if (checkEmail) {
        callback(formatMessage({ id: 'INPUT_EMAIL' }));
      } else callback();
    } else callback();
  };

  sendToChange = value => {
    const values = [];
    if (value !== null && value.length <= 999) {
      for (let i = 0; i < value.length; i += 1) {
        if (value[i].trim() !== '') {
          values.push({ key: `emailList${i}`, email: value[i].trim() });
        }
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'generateInvitation/save',
        payload: {
          emailList: values,
        },
      });
    }
  };

  onSend = () => {
    const { dispatch, form, emailList } = this.props;
    form.validateFieldsAndScroll(error => {
      if (error) {
        return;
      }
      if (isNvl(emailList) || emailList.length <= 0) {
        message.warn(formatMessage({ id: 'SEND_EMAIL_IS_NULL' }), 10);
        return;
      }
      dispatch({ type: 'generateInvitation/fetchSendInvitation' }).then(flag => {
        if (flag) form.resetFields();
      });
    });
  };

  showHtml = htmlString => {
    if (htmlString) {
      const nowHtmlString = htmlString.replace('<a href="#">', '').replace('</a>', '');
      const html = { __html: nowHtmlString };
      return <div dangerouslySetInnerHTML={html} />;
    }
    return <div />;
  };

  render() {
    const { form, invitationVisible, emailList, emailContent, sendInvitationLoading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Drawer
          title={<div className={styles.title}>{formatMessage({ id: 'GI_BTN_INVITATION' })}</div>}
          className={styles.userPerspectiveDrawer}
          visible={invitationVisible}
          onClose={this.onClose}
          maskClosable={false}
          bodyStyle={{ padding: ' 8px 24px' }}
        >
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Spin spinning={sendInvitationLoading}>
                <Form.Item
                  label={formatMessage({ id: 'GI_Q_EMAIL_ADDRESS' })}
                  colon={false}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  {getFieldDecorator('emailList', {
                    initialValue: this.getEmailVal(emailList) || [],
                    rules: [
                      { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                      { validator: this.compareToEmailList },
                    ],
                  })(
                    <SortSelect
                      mode="tags"
                      maxTagCount={999}
                      onChange={this.sendToChange}
                      open={false}
                      style={{ width: '100%' }}
                      options={
                        emailList && emailList.length > 0
                          ? emailList.map(item => (
                              <Select.Option key={`${item.key}`} value={`${item.email}`}>
                                {`${item.email}`}
                              </Select.Option>
                            ))
                          : null
                      }
                    />
                  )}
                </Form.Item>
              </Spin>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Card
                style={{margin: '0 -10px'}}
                title={
                  <span className={styles.userPerspectiveTitle}>
                    {formatMessage({ id: 'GI_USER_PERSPECTIVE' })}
                  </span>
                }
                className={styles.userPerspectiveCard}
              >
                <div className={styles.userPerspectiveContent}>
                  {this.showHtml(emailContent.content || null)}
                </div>
              </Card>
            </Col>
          </Row>
          <div className={styles.userPerspectiveBtn}>
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>
            <Button onClick={this.onSend} type="primary" loading={sendInvitationLoading}>
              {formatMessage({ id: 'GI_BTN_SENT' })}
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default InvitationComp;
