import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Icon, message, Modal, Upload } from 'antd';
import { connect } from 'dva';
import styles from './arApply.less';
import { getUrl, handleDownFile } from '@/utils/utils';

const actionUrl = `${getUrl()}/common/upload`;
const downUrl = `${getUrl()}/common/downloadFile`;

@connect(({ apply, loading }) => ({
  apply,
  loading: loading.effects['apply/feathArActitivy'],
}))
class ARApply extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      uploadFiles: [],
      downloadTemplateFilePath: 'agent/template/',
      templateFiles: ['BG Template.pdf', 'Credit Application Form.pdf'],
    };
  }

  handleClick = () => {
    this.setState({ visible: true });
  };

  handleDownload = () => {
    const { downloadTemplateFilePath, templateFiles } = this.state;
    templateFiles.forEach(item => {
      handleDownFile(
        downUrl,
        {
          fileName: item,
          filePath: downloadTemplateFilePath,
        },
        item
      );
    });
  };

  handleCommit = () => {
    const { dispatch } = this.props;
    const { uploadFiles = [] } = this.state;
    if (uploadFiles.length === 0) {
      message.error('please upload Apply Files.');
      return;
    }
    dispatch({
      type: 'apply/feathArActitivy',
      payload: { uploadFiles },
      callback: (resultCode, resultMsg) => {
        message.success(resultMsg);
        this.setState({ visible: false });
      },
    });
  };

  // eslint-disable-next-line no-unused-vars
  handleCancel = e => {
    this.setState({ visible: false });
  };

  handleUploadChange = ({ file }) => {
    const { uploadFiles = [] } = this.state;
    const {
      uid,
      status,
      response: { result: { filePath, fileName, fileSourceName } = '' } = '',
    } = file;
    const newUploadFiles = [...uploadFiles];
    if (typeof uid === 'string' && status === 'error') {
      message.error('Failed to upload.');
    }
    // if (typeof uid === 'string' && status === 'uploading') {}
    if (typeof uid === 'string' && status === 'done') {
      newUploadFiles.push({ filePath, fileName, fileSourceName });
    }
    this.setState({ uploadFiles: newUploadFiles });
  };

  handleUploadBeforeChange = file =>
    new Promise(async (resolve, reject) => {
      const isFileType =
        file.type === 'text/csv' ||
        file.type === 'application/msword' ||
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'text/plain' ||
        file.type === 'application/zip';
      const pattern = /^.*?[.](csv|pdf|txt|doc|docx|xls|xlsx|zip|rar)$/;
      const isCheckFileType = pattern.test(String(file.name).toLowerCase());
      if (!(isCheckFileType || isFileType)) {
        message.error(formatMessage({ id: 'TA_UPLOAD_FILE_TYPE' }));
      }
      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        message.error(formatMessage({ id: 'FILE_MAX_SIZE_CHECK' }));
      }
      if ((isCheckFileType || isFileType) && isLt10M) {
        resolve(file);
      } else {
        reject();
      }
    });

  handleUploadRemove = file => {
    const { uploadFiles = [] } = this.state;
    const { status } = file;
    const newUploadFiles = uploadFiles.filter(item => item.uid !== file.uid);
    if (status === 'done') {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ uploadFileList: newUploadFiles });
    }
  };

  render() {
    const { visible, loading } = this.state;

    const modelProps = {
      title: formatMessage({ id: 'AR_APPLY_TITLE' }),
      visible,
      width: 545,
      onCancel: this.handleCancel,
      footer: [
        <Button key="submit" type="primary" loading={loading} onClick={this.handleCommit}>
          {formatMessage({ id: 'BTN_OK' })}
        </Button>,
        <Button key="cancel" loading={loading} onClick={this.handleCancel}>
          {formatMessage({ id: 'BTN_CANCEL' })}
        </Button>,
      ],
    };

    const comProps = {
      accept: '.csv, .pdf, .txt, .doc, .docx, .xls, .xlsx, .zip, .rar',
      name: 'file',
      action: actionUrl,
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
        'App-Code': 'PAMS',
      }),
      multiple: false,
      FormData: 'file',
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: true,
      },
    };

    const uploadProps = {
      ...comProps,
      data: { type: 'arAccountFile' },
      onPreview: () => {},
      onChange: changeValue => this.handleUploadChange(changeValue),
      onRemove: file => this.handleUploadRemove(file),
      beforeUpload: file => this.handleUploadBeforeChange(file),
      onDownload: file => {
        const { response: { result: { filePath, fileName, fileSourceName } = '' } = '' } = file;
        const reqParamJson = {
          fileName,
          filePath,
          path: filePath,
        };
        handleDownFile(downUrl, reqParamJson, fileSourceName);
      },
    };
    return (
      <React.Fragment>
        <Button type="primary" className={styles.button} onClick={this.handleClick}>
          {formatMessage({ id: 'AR_APPLY_BTN' })}
        </Button>
        <Modal {...modelProps}>
          <div className={styles.title}>{formatMessage({ id: 'AR_APPLY_DOWNLOAD_TIPS' })}</div>
          <Button type="primary" className={styles.downloadBtn} onClick={this.handleDownload}>
            {formatMessage({ id: 'BTN_DOWNLOAD' })}
          </Button>
          <div className={styles.title}>{formatMessage({ id: 'AR_APPLY_UPLOAD_REQUIRED' })}</div>
          <ul style={{ listStyleType: 'disc', padding: '15px' }}>
            <li className={styles.text}>
              {formatMessage({ id: 'AR_APPLY_UPLOAD_REQUIRED_INFO_1' })}
            </li>
            <li className={styles.text}>
              {formatMessage({ id: 'AR_APPLY_UPLOAD_REQUIRED_INFO_2' })}
            </li>
            <li className={styles.text}>
              {formatMessage({ id: 'AR_APPLY_UPLOAD_REQUIRED_INFO_3' })}
            </li>
            <li className={styles.text}>
              {formatMessage({ id: 'AR_APPLY_UPLOAD_REQUIRED_INFO_4' })}
            </li>
          </ul>
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" style={{ color: '#1890FF' }} />
            </p>
            <p className="ant-upload-text">{formatMessage({ id: 'AR_APPLY_UPLOAD_TEXT' })}</p>
            <p className="ant-upload-hint">{formatMessage({ id: 'AR_APPLY_UPLOAD_HINT' })}</p>
          </Upload.Dragger>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ARApply;
