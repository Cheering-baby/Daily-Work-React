import React, { PureComponent } from 'react';
import { Button, Card, Col, Drawer, Form, Row, Select, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getUrl } from '../../../utils/pubUtils';

const mapStateToProps = store => {
  const {
    taId = null,
    companyName = null,
    emailList = [],
    invitationVisible = false,
    sendInvitationLoading = false,
  } = store.generateInvitation;
  return {
    taId,
    companyName,
    emailList,
    invitationVisible,
    sendInvitationLoading,
  };
};

@Form.create()
@connect(mapStateToProps)
class InvitationComp extends PureComponent {
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generateInvitation/save',
      payload: {
        invitationVisible: false,
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
    const { dispatch } = this.props;
    dispatch({ type: 'generateInvitation/fetchSendInvitation' });
  };

  getUrl = (companyName, taId) => {
    let urlStr = `${getUrl().replace('/pams', '')}/#/SubTAManagement/SignUp`;
    if (!isNvl(taId) && !isNvl(companyName)) urlStr += `?taId=${taId}&companyName=${companyName}`;
    else if (!isNvl(taId) && isNvl(companyName)) urlStr += `?taId=${taId}`;
    else if (isNvl(taId) && !isNvl(companyName)) urlStr += `?companyName=${companyName}`;
    return urlStr;
  };

  render() {
    const {
      form,
      taId,
      companyName,
      invitationVisible,
      emailList,
      sendInvitationLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const subTaUrl = this.getUrl(companyName, taId);
    return (
      <div>
        <Drawer
          title={formatMessage({ id: 'GI_BTN_INVITATION' })}
          width={320}
          closable={false}
          visible={invitationVisible}
          bodyStyle={{ padding: '8px' }}
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
                    rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                  })(
                    <Select
                      mode="tags"
                      maxTagCount={999}
                      onChange={this.sendToChange}
                      open={false}
                      style={{ width: '100%' }}
                    >
                      {emailList && emailList.length > 0
                        ? emailList.map(item => (
                          <Select.Option key={`${item.key}`} value={`${item.email}`}>
                            {`${item.email}`}
                          </Select.Option>
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
              </Spin>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Card
                title={formatMessage({ id: 'GI_USER_PERSPECTIVE' })}
                className={styles.userPerspectiveCard}
              >
                <div className={styles.userPerspectiveContent}>
                  <div className={styles.userPerspectiveDear}>
                    {formatMessage({ id: 'GI_USER_PERSPECTIVE_DEAR' })}
                  </div>
                  <div className={styles.userPerspectiveP}>
                    {formatMessage({ id: 'GI_USER_PERSPECTIVE_CONTENT' })}
                  </div>
                  <div className={styles.userPerspectiveRul}>
                    {formatMessage({ id: 'GI_USER_PERSPECTIVE_URL' })}:
                    <a href={subTaUrl} rel="noopener noreferrer" target="_blank">
                      {String(subTaUrl)}
                    </a>
                  </div>
                  <div className={styles.userPerspectiveAgency}>
                    {formatMessage({ id: 'GI_USER_PERSPECTIVE_AGENCY' }).replace(
                      'XXX',
                      companyName
                    )}
                  </div>
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
