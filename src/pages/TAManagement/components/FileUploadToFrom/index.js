import React, { PureComponent } from 'react';
import { Button, Col, Form, Icon, message, Popover, Row, Spin, Upload } from 'antd';
import { formatMessage } from 'umi/locale';
import { getUrl, handleDownFile } from '@/utils/utils';
import styles from './index.less';

const actionUrl = `${getUrl()}/common/upload`;
const downUrl = `${getUrl()}/common/downloadFile`;

class FileUploadToFrom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initState(
      {
        newTaFileList: [],
        newArAccountFileList: [],
        taFileLoadingFlag: false,
        arAccountFileLoadingFlag: false,
      },
      this.props
    );
  }

  initState = (state, props) => {
    const {
      newTaFileList = [],
      newArAccountFileList = [],
      taFileLoadingFlag,
      arAccountFileLoadingFlag,
    } = state;
    if (props.isRegistration) {
      return {
        newTaFileList: [...newTaFileList],
        newArAccountFileList: [...newArAccountFileList],
        taFileLoadingFlag,
        arAccountFileLoadingFlag,
      };
    }
    return {
      newTaFileList: [...newTaFileList, ...this.normFile(props.taFileList)],
      newArAccountFileList: [...newArAccountFileList, ...this.normFile(props.arAccountFileList)],
      taFileLoadingFlag,
      arAccountFileLoadingFlag,
    };
  };

  fileBeforeChange = file =>
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

  onHandleChange = ({ file, fileList, event }, type) => {
    const {
      onHandleArAccountFileChange,
      arAccountFileList,
      onHandleTaFileChange,
      taFileList,
    } = this.props;
    // console.log('onHandleChange file:', file);
    const { newTaFileList = [], newArAccountFileList = [] } = this.state;
    const {
      uid,
      status,
      response: { result: { filePath, fileName, fileSourceName } = '' } = '',
    } = file;
    let newTaFiles = [...newTaFileList];
    let newArAccountFiles = [...newArAccountFileList];
    if (typeof uid === 'string' && status === 'error') {
      message.error('Failed to upload.');
      if (String(type) === 'taFile') {
        newTaFiles = newTaFiles.filter(item => item.uid !== file.uid);
      }
      if (String(type) === 'arAccountFile') {
        newArAccountFiles = newArAccountFiles.filter(item => item.uid !== file.uid);
      }
    }
    if (typeof uid === 'string' && status === 'uploading') {
      if (String(type) === 'taFile') {
        newTaFiles = newTaFiles.filter(item => item.uid !== file.uid);
      }
      if (String(type) === 'arAccountFile') {
        newArAccountFiles = newArAccountFiles.filter(item => item.uid !== file.uid);
      }
    }
    if (typeof uid === 'string' && status === 'done') {
      if (String(type) === 'taFile') {
        newTaFiles = newTaFiles.filter(item => item.uid !== file.uid);
      }
      if (String(type) === 'arAccountFile') {
        newArAccountFiles = newArAccountFiles.filter(item => item.uid !== file.uid);
      }
      let isTaUpdate = true;
      if (
        taFileList &&
        taFileList.length > 0 &&
        taFileList.findIndex(n => String(n.name) === String(fileName)) > 0
      ) {
        isTaUpdate = false;
      }
      let isArUpdate = true;
      if (
        arAccountFileList &&
        arAccountFileList.length > 0 &&
        arAccountFileList.findIndex(n => String(n.name) === String(fileName)) > 0
      ) {
        isArUpdate = false;
      }
      if (String(type) === 'taFile' && isTaUpdate) {
        const taFile = { name: fileName, path: filePath, sourceName: fileSourceName };
        onHandleTaFileChange(taFile, false);
      }
      if (String(type) === 'arAccountFile' && isArUpdate) {
        const arAccountFile = { name: fileName, path: filePath, sourceName: fileSourceName };
        onHandleArAccountFileChange(arAccountFile, false);
      }
    }
    if (String(type) === 'taFile') {
      this.setState({
        newTaFileList: [...newTaFiles, file],
      });
      return {
        file,
        fileList: [...newTaFiles, file],
        event,
      };
    }
    if (String(type) === 'arAccountFile') {
      this.setState({
        newArAccountFileList: [...newArAccountFiles, file],
      });
      return {
        file,
        fileList: [...newArAccountFiles, file],
        event,
      };
    }
    return {
      file,
      fileList,
      event,
    };
  };

  normFile = fileList => {
    const newFileList = [];
    if (fileList && fileList.length > 0) {
      fileList.forEach((n, key) =>
        newFileList.push({
          uid: `-${key}`,
          name: n.sourceName,
          status: 'done',
          url: n.path,
          response: {
            result: {
              filePath: n.filePath,
              fileName: n.name,
              fileSourceName: n.sourceName,
            },
          },
        })
      );
    }
    return newFileList || [];
  };

  getRegistrationContent = () => (
    <div className={styles.fileUploadContent}>
      <Row type="flex" justify="space-around">
        <Col span={24} className={styles.fileUploadContentTop}>
          <span>{formatMessage({ id: 'FILE_REGISTRATION_UPLOAD_REQUIRED' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col span={24} className={styles.fileUploadContentCenter}>
          <p>{formatMessage({ id: 'FILE_REGISTRATION_RECOMMENDED' })}</p>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col span={24} className={styles.fileUploadContentBottom}>
          <ul>
            <li>
              <p>{formatMessage({ id: 'FILE_REGISTRATION_CERTIFICATE' })}</p>
            </li>
            <li>
              <p>{formatMessage({ id: 'FILE_REGISTRATION_AGENT_LICENSE' })}</p>
            </li>
            <li>
              <p>{formatMessage({ id: 'FILE_REGISTRATION_OTHERS' })}</p>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );

  getArAccountContent = () => (
    <div className={styles.fileUploadContent}>
      <Row type="flex" justify="space-around">
        <Col span={24} className={styles.fileUploadContentTop}>
          <span>{formatMessage({ id: 'FILE_AR_REGISTRATION_UPLOAD_REQUIRED' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col span={24} className={styles.fileUploadContentCenter}>
          <p>{formatMessage({ id: 'FILE_AR_REGISTRATION_RECOMMENDED' })}</p>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col span={24} className={styles.fileUploadContentBottom}>
          <ul>
            <li>
              <p>{formatMessage({ id: 'FILE_AR_REGISTRATION_CERTIFICATE' })}</p>
            </li>
            <li>
              <p>{formatMessage({ id: 'FILE_AR_FINANCIAL_STATEMENT' })}</p>
            </li>
            <li>
              <p>{formatMessage({ id: 'FILE_AR_CREDIT_APPLICATION' })}</p>
            </li>
            <li>
              <p>{formatMessage({ id: 'FILE_AR_REGISTRATION_OTHERS' })}</p>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );

  render() {
    const { form, viewId, formItemRowLayout, applyArAccount, onHandleDelTaFile, isTaDeActivationFlag } = this.props;
    const {
      newTaFileList = [],
      newArAccountFileList = [],
      taFileLoadingFlag = false,
      arAccountFileLoadingFlag = false,
    } = this.state;
    const { getFieldDecorator } = form;
    const comProps = {
      accept: '.csv, .pdf, .txt, .doc, .docx, .xls, .xlsx, .zip, .rar',
      name: 'file',
      action: actionUrl,
      headers: new Headers({
        Origin: '*',
        'App-Code': 'PAMS',
      }),
      FormData: 'file',
      multiple: false,
    };
    const fileProps = {
      ...comProps,
      data: { type: 'taFile' },
      disabled: isTaDeActivationFlag,
      onPreview: () => {},
      onChange: changeValue => this.onHandleChange(changeValue, 'taFile'),
      onRemove: file => {
        const { status, response: { result: { filePath, fileName } = '' } = '' } = file;
        let newTaFiles = [...newTaFileList];
        newTaFiles = newTaFiles.filter(item => item.uid !== file.uid);
        if (status === 'done') {
          onHandleDelTaFile({ name: fileName, filePath }, 'taFile');
        }
        this.setState({
          newTaFileList: [...newTaFiles],
        });
      },
      beforeUpload: file => this.fileBeforeChange(file),
      // fileList: newTaFileList||[],
      onDownload: file => {
        const { response: { result: { filePath, fileName, fileSourceName } = '' } = '' } = file;
        const reqParamJson = {
          fileName,
          filePath,
          path: filePath,
        };
        handleDownFile(
          downUrl,
          reqParamJson,
          fileSourceName,
          () => this.setState({ taFileLoadingFlag: true }),
          () => this.setState({ taFileLoadingFlag: false })
        );
      },
    };
    const arFileProps = {
      ...comProps,
      disabled: isTaDeActivationFlag,
      data: { type: 'arAccountFile' }, // taFile arAccountFile contractFile
      onPreview: () => {},
      onChange: changeValue => this.onHandleChange(changeValue, 'arAccountFile'),
      onRemove: file => {
        const { status, response: { result: { filePath, fileName } = '' } = '' } = file;
        let newArAccountFiles = [...newArAccountFileList];
        newArAccountFiles = newArAccountFiles.filter(item => item.uid !== file.uid);
        if (status === 'done') {
          onHandleDelTaFile({ name: fileName, filePath }, 'arAccountFile');
        }
        this.setState({
          newArAccountFileList: [...newArAccountFiles],
        });
      },
      beforeUpload: file => this.fileBeforeChange(file),
      onDownload: file => {
        const { response: { result: { filePath, fileName, fileSourceName } = '' } = '' } = file;
        const reqParamJson = {
          fileName,
          filePath,
          path: filePath,
        };
        handleDownFile(
          downUrl,
          reqParamJson,
          fileSourceName,
          () => this.setState({ arAccountFileLoadingFlag: true }),
          () => this.setState({ arAccountFileLoadingFlag: false })
        );
      },
    };
    const arRole = [];
    if (String(applyArAccount).toUpperCase() === 'Y') {
      arRole.push({ required: true, message: formatMessage({ id: 'REQUIRED' }) });
    }
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'FILE_REGISTRATION_DOCS' })}
              {...formItemRowLayout}
              colon={false}
            >
              <Spin spinning={taFileLoadingFlag}>
                <div className={styles.fileUploadDiv}>
                  <div className={styles.fileUploadBtnDiv}>
                    {getFieldDecorator('taFileList', {
                      valuePropName: 'fileList',
                      initialValue: newTaFileList || [],
                      getValueFromEvent: e => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      },
                      rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                    })(
                      <Upload {...fileProps}>
                        <Button icon="upload" className={styles.fileUploadBtn}>
                          {formatMessage({ id: 'FILE_CLICK_TO_UPLOAD' })}
                        </Button>
                      </Upload>
                    )}
                  </div>
                  <div className={styles.fileUploadProDiv}>
                    <Popover
                      content={this.getRegistrationContent()}
                      placement="rightBottom"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                    >
                      <Icon type="info-circle" />
                    </Popover>
                    <span className={styles.fileUploadSpan}>
                      {formatMessage({ id: 'FILE_CLICK_TO_VIEW_THE_FILE' })}
                    </span>
                  </div>
                </div>
              </Spin>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'FILE_AR_CREDIT_LIMIT' })}
              {...formItemRowLayout}
              colon={false}
            >
              <Spin spinning={arAccountFileLoadingFlag}>
                <div className={styles.fileUploadDiv}>
                  <div className={styles.fileUploadBtnDiv}>
                    {getFieldDecorator('arAccountFileList', {
                      valuePropName: 'fileList',
                      initialValue: newArAccountFileList || [],
                      getValueFromEvent: e => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      },
                      rules: arRole || [],
                    })(
                      <Upload {...arFileProps}>
                        <Button icon="upload" className={styles.fileUploadBtn}>
                          {formatMessage({ id: 'FILE_CLICK_TO_UPLOAD' })}
                        </Button>
                      </Upload>
                    )}
                  </div>
                  <div className={styles.fileUploadProDiv}>
                    <Popover
                      content={this.getArAccountContent()}
                      placement="rightBottom"
                      getPopupContainer={() => document.getElementById(`${viewId}`)}
                    >
                      <Icon type="info-circle" />
                    </Popover>
                    <span className={styles.fileUploadSpan}>
                      {formatMessage({ id: 'FILE_CLICK_TO_VIEW_THE_FILE' })}
                    </span>
                  </div>
                </div>
              </Spin>
            </Form.Item>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default FileUploadToFrom;
