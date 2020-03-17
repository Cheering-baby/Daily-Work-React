import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Button, Checkbox, Form, Modal } from 'antd';

import styles from './arApply.less';
import { getUrl, handleDownFile } from '@/utils/utils';

const downUrl = `${getUrl()}/common/downloadFile`;

const formItemLayout = {
  labelCol: {
    lg: { span: 6 },
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    lg: { span: 10 },
    xs: { span: 10 },
    sm: { span: 18 },
  },
};

@Form.create()
@connect(({ myWallet, loading }) => ({
  myWallet,
  loading: loading.models.myWallet,
}))
class More extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
    };
  }

  handleClick = () => {
    this.setState({ visible: true });
  };

  handleDownload = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.checked.forEach(item => {
          const it = JSON.parse(item);
          handleDownFile(
            downUrl,
            {
              fileName: it.fileName,
              filePath: it.filePath,
            },
            it.fileSourceName,
            () => {},
            () => {}
          );
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    const {
      myWallet: { arActivity = {} },
      form: { getFieldDecorator },
    } = this.props;
    const { content = '' } = arActivity;
    const contentObj = content ? JSON.parse(content) : [];

    const checkedList = contentObj.uploadFiles
      ? contentObj.uploadFiles.map(item => {
          return { label: item.fileSourceName, value: JSON.stringify(item) };
        })
      : [];

    const modelProps = {
      title: formatMessage({ id: 'MORE_TITLE' }),
      visible,
      width: 545,
      onCancel: this.handleCancel,
      footer: [
        <Button key="submit" type="primary" loading={loading} onClick={this.handleDownload}>
          {formatMessage({ id: 'BTN_DOWNLOAD' })}
        </Button>,
        <Button key="cancel" loading={loading} onClick={this.handleCancel}>
          {formatMessage({ id: 'BTN_CANCEL' })}
        </Button>,
      ],
    };

    return (
      <React.Fragment>
        <Button type="link" onClick={this.handleClick}>
          {formatMessage({ id: 'MORE_BTN' })}
        </Button>
        <Modal {...modelProps}>
          <div className={styles.title}>{formatMessage({ id: 'AR_CREDIT_LIMIT' })}</div>
          <Form {...formItemLayout}>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator(`checked`, {
                rules: [{ required: true }],
              })(<Checkbox.Group options={checkedList} />)}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default More;
