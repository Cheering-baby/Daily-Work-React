import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Card,
  Form,
  Radio,
  Select,
  Input,
  Button,
  DatePicker,
  Divider,
  Icon,
  Checkbox,
  Popover,
} from 'antd';

import { formatMessage } from 'umi/locale';
import ReactQuill, { Quill } from 'react-quill';
import styles from '../index.less';
import 'react-quill/dist/quill.snow.css';
import NotificationTemplate from './NotificationTemplate';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  colon: false,
};

const formItemHalfLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
  colon: false,
};

const Link = Quill.import('formats/link');

class LinkFile extends Link {
  static create(value) {
    const node = super.create(value);
    if (typeof value !== 'object') return node;
    const file = document.createElement('a');
    file.setAttribute('href', value.url);
    file.setAttribute('target', '_blank');
    // file.dataset.fileName = value.name;
    file.innerText = value.name;
    return file;
  }
}
LinkFile.blotName = 'link';
LinkFile.tagName = 'A';

@Form.create()
@connect(({ notification, loading }) => ({
  notification,
  addLoading: loading.effects['notification/addNotification'],
}))
class NotificationEdit extends React.PureComponent {
  componentDidMount() {
    const { dispatch, notificationType } = this.props;
    dispatch({
      type: 'notification/saveData',
      payload: {
        type: notificationType,
        filter: {
          type: notificationType,
        },
      },
    });
  }

  commit = e => {
    e.preventDefault();
    const {
      dispatch,
      form,
      type = 'NEW',
      notificationId,
      notification: {},
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let dispatchType = '';
        if (type === 'NEW') {
          dispatchType = 'notification/addNotification';
        } else {
          dispatchType = 'notification/modifyUser';
          values.id = notificationId;
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

  render() {
    const {
      form,
      type,
      notificationType,
      notification: { currentNotification },
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Card>
        <Form onSubmit={this.commit}>
          <p className={styles.title}>Publish New Bulletin</p>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'TITLE' })}>
            <div>
              <Form.Item>
                {getFieldDecorator(`title`, {
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(<Input placeholder="Please Enter" allowClear />)}
              </Form.Item>
              <Popover
                content={<NotificationTemplate />}
                placement="bottomRight"
                trigger="click"
                style={{ width: '400px !important' }}
                onVisibleChange={this.handleNotificationVisibleChange}
                // visible={visibleFlag}
              >
                <a className={styles.templateSelect}>Select Template</a>
              </Popover>
            </div>
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'REASON_DURATION' })}>
            <div>
              <Form.Item>
                {getFieldDecorator(`releaseDuration`, {
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(<DatePicker placeholder="Please Enter" style={{ width: '100%' }} />)}
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item {...formItemHalfLayout} label={formatMessage({ id: 'REASON_SCOPE_ROLE' })}>
            {getFieldDecorator(`scopeRole`, {
              rules: [
                {
                  required: true,
                  message: 'Required',
                },
              ],
            })(
              <Select
                placeholder="Please Select"
                allowClear
                mode="multiple"
                optionFilterProp="children"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}>
            {getFieldDecorator(`type`, {
              rules: [
                {
                  required: true,
                  message: 'Required',
                },
              ],
            })(
              <Radio.Group style={{ marginTop: '6px' }}>
                <Radio value="Invites">Invites</Radio>
                <Radio value="GR">GR</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemHalfLayout} label={formatMessage({ id: 'PUBLISH_CONTENT' })}>
            {getFieldDecorator(`publishContent`, {
              rules: [
                {
                  required: true,
                  message: 'Required',
                },
              ],
            })(
              <div style={{ border: '1px solid #D9D9D9', backgroundColor: 'white' }}>
                <ReactQuill
                  // ref={rich => this.rich = rich}
                  // id={`smartEdit${type}`}
                  // onChange={this.handleChange}
                  className={styles.reactQuillStyle}
                  // modules={this.modules}
                  // bounds={`#smartEdit${type}`}
                  // defaultValue = {this.props.originBody.body}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'FILE' })}>
            {getFieldDecorator(`file`, {
              rules: [
                {
                  required: true,
                  message: 'Required',
                },
              ],
            })(
              <div>
                <Button>
                  <Icon type="upload" />
                  Click to Upload
                </Button>
                <span className={styles.note}>{formatMessage({ id: 'SUPPORT_EXTENSION' })}</span>
              </div>
            )}
          </Form.Item>
          <Form.Item {...formItemHalfLayout} label={formatMessage({ id: 'STATE' })}>
            <Checkbox.Group compact>
              {getFieldDecorator(`staet`, {
                rules: [
                  {
                    required: true,
                    message: 'Required',
                  },
                ],
              })(
                <Checkbox.Group>
                  <Checkbox value="Draft">Draft</Checkbox>
                  <Checkbox value="Release">Release</Checkbox>
                  <Checkbox value="Scheduled" className={styles.scheduledCheckbox}>
                    Scheduled Release
                    <DatePicker placeholder={formatMessage({ id: 'PLEASE_SELECT' })} />
                  </Checkbox>
                  <Checkbox value="Template" className={styles.temCheckbox}>
                    Save As Template
                  </Checkbox>
                  <span className={styles.extension}>{formatMessage({ id: 'NOTE' })}</span>
                </Checkbox.Group>
              )}
            </Checkbox.Group>
          </Form.Item>
        </Form>
        <Divider />
        <div style={{ float: 'right' }}>
          <Button htmlType="button">{formatMessage({ id: 'COMMON_CANCEL' })}</Button>
          <Button style={{ marginLeft: '10px' }} type="primary" htmlType="button">
            {formatMessage({ id: 'COMMON_OK' })}
          </Button>
        </div>
      </Card>
    );
  }
}

export default NotificationEdit;
