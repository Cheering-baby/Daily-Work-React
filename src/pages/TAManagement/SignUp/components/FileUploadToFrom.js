import React, { PureComponent } from 'react';
import { Button, Col, Form, Icon, message, Popover, Row, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import { getUrl, handleDownFile } from '@/utils/utils';
import styles from './FileUploadToFrom.less';
import UploadDraggerModal from './UploadDraggerModal';
import theme from '../../../../theme/light/theme';

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
        modalVisible: false,
        fileType: null,
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
      modalVisible,
      fileType,
    } = state;
    if (props.isRegistration) {
      return {
        newTaFileList: [...newTaFileList],
        newArAccountFileList: [...newArAccountFileList],
        taFileLoadingFlag,
        arAccountFileLoadingFlag,
        modalVisible,
        fileType,
      };
    }
    return {
      newTaFileList: [...newTaFileList, ...this.normFile(props.taFileList)],
      newArAccountFileList: [...newArAccountFileList, ...this.normFile(props.arAccountFileList)],
      taFileLoadingFlag,
      arAccountFileLoadingFlag,
      modalVisible,
      fileType,
    };
  };

  normFile = (fileList, fileType) => {
    const newFileList = [];
    if (fileList && fileList.length > 0) {
      fileList.forEach((n, key) =>
        newFileList.push({
          field: fileType,
          uid: n.uid || `-${key}`,
          status: n.status || 'done',
          name: n.name,
          path: n.path,
          sourceName: n.sourceName,
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

  handleModalOk = (fileList, fileType) => {
    const { newTaFileList = [], newArAccountFileList = [] } = this.state;
    const { onHandleArAccountFileChange, onHandleTaFileChange } = this.props;
    if (!fileList || fileList.length <= 0) {
      message.warn(formatMessage({ id: 'FILE_CHECK_MSG' }), 10);
      return;
    }
    if (fileList && fileList.length > 0) {
      const newTaFiles = [...newTaFileList];
      const newArAccountFiles = [...newArAccountFileList];
      fileList.forEach(n => {
        const file = {
          field: fileType,
          uid: n.uid,
          name: n.name,
          status: n.status,
          path: n.path,
          sourceName: n.sourceName,
        };
        if (
          String(fileType) === 'taFile' &&
          String(n.status) === 'done' &&
          newTaFiles.findIndex(item => item.uid === n.uid) === -1
        ) {
          newTaFiles.push(file);
          onHandleTaFileChange(file, false);
        }
        if (
          String(fileType) === 'arAccountFile' &&
          String(n.status) === 'done' &&
          newArAccountFiles.findIndex(item => item.uid === n.uid) === -1
        ) {
          newArAccountFiles.push(file);
          onHandleArAccountFileChange(file, false);
        }
      });
      if (String(fileType) === 'taFile') {
        this.setState({
          newTaFileList: [...newTaFiles],
          modalVisible: false,
          fileType: null,
        });
      }
      if (String(fileType) === 'arAccountFile') {
        this.setState({
          newArAccountFileList: [...newArAccountFiles],
          modalVisible: false,
          fileType: null,
        });
      }
    }
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      fileType: null,
    });
  };

  showFileList = (fileList, fileType, onHandleDelTaFile) => {
    if (fileList && fileList.length > 0) {
      return fileList.map(n => (
        <div key={n.uid} className="">
          <span>
            <div
              className={`${theme['ant-prefix']}-upload-list-item ${theme['ant-prefix']}-upload-list-item-done ${theme['ant-prefix']}-upload-list-item-list-type-text`}
            >
              <div className={`${theme['ant-prefix']}-upload-list-item-info`}>
                <span>
                  <Icon type="paper-clip" />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${theme['ant-prefix']}-upload-list-item-name ${theme['ant-prefix']}-upload-list-item-name-icon-count-2`}
                    title={n.sourceName}
                    href={n.path}
                  >
                    {n.sourceName}
                  </a>
                  <span className={`${theme['ant-prefix']}-upload-list-item-card-actions`}>
                    <a
                      title="Download file"
                      onClick={() => {
                        const reqParamJson = {
                          fileName: n.name,
                          filePath: n.path,
                          path: n.path,
                        };
                        handleDownFile(
                          downUrl,
                          reqParamJson,
                          n.sourceName,
                          () => this.setState({ taFileLoadingFlag: true }),
                          () => this.setState({ taFileLoadingFlag: false })
                        );
                      }}
                    >
                      <Icon type="download" />
                    </a>
                    <a
                      title="Remove file"
                      onClick={() => {
                        let newFiles = [...fileList];
                        newFiles = newFiles.filter(item => item.uid !== n.uid);
                        if (n.status === 'done') {
                          onHandleDelTaFile({ name: n.name, filePath: n.path }, fileType);
                        }
                        if (String(fileType) === 'taFile') {
                          this.setState({
                            newTaFileList: [...newFiles],
                          });
                        }
                        if (String(fileType) === 'arAccountFile') {
                          this.setState({
                            newArAccountFileList: [...newFiles],
                          });
                        }
                      }}
                    >
                      <Icon type="delete" />
                    </a>
                  </span>
                </span>
              </div>
            </div>
          </span>
        </div>
      ));
    }
    return null;
  };

  render() {
    const {
      viewId,
      formItemRowLayout,
      applyArAccount,
      onHandleDelTaFile,
      taFileCheck = {},
      arAccountFileCheck = {},
    } = this.props;
    const {
      newTaFileList = [],
      newArAccountFileList = [],
      taFileLoadingFlag = false,
      arAccountFileLoadingFlag = false,
      modalVisible = false,
      fileType,
    } = this.state;
    if (applyArAccount === 'N' && newArAccountFileList && newArAccountFileList.length > 0) {
      this.setState({ newArAccountFileList: [] });
    }
    const arRole = [];
    if (String(applyArAccount).toUpperCase() === 'Y') {
      arRole.push({ required: true, message: formatMessage({ id: 'REQUIRED' }) });
    }
    const upFileProps = {
      handleModalOk: this.handleModalOk,
      handleModalCancel: this.handleModalCancel,
      modalVisible,
      fileType,
    };
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'FILE_REGISTRATION_DOCS' })}
              {...formItemRowLayout}
              colon={false}
              {...taFileCheck}
              required
            >
              <Spin spinning={taFileLoadingFlag}>
                <div className={styles.fileUploadDiv}>
                  <div className={styles.fileUploadBtnDiv}>
                    <Button
                      icon="upload"
                      className={styles.fileUploadBtn}
                      onClick={() =>
                        this.setState({
                          modalVisible: true,
                          fileType: 'taFile',
                        })
                      }
                    >
                      {formatMessage({ id: 'FILE_CLICK_TO_UPLOAD' })}
                    </Button>
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
                {newTaFileList && newTaFileList.length > 0 && (
                  <div className={styles.fileUploadDiv}>
                    <div
                      className={`${theme['ant-prefix']}-upload-list ${theme['ant-prefix']}-upload-list-text`}
                    >
                      {this.showFileList(newTaFileList, 'taFile', onHandleDelTaFile)}
                    </div>
                  </div>
                )}
              </Spin>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'FILE_AR_CREDIT_LIMIT' })}
              {...formItemRowLayout}
              colon={false}
              required={String(applyArAccount).toUpperCase() === 'Y'}
              {...arAccountFileCheck}
            >
              <Spin spinning={arAccountFileLoadingFlag}>
                <div className={styles.fileUploadDiv}>
                  <div className={styles.fileUploadBtnDiv}>
                    <Button
                      icon="upload"
                      className={styles.fileUploadBtn}
                      disabled={String(applyArAccount).toUpperCase() !== 'Y'}
                      onClick={() =>
                        this.setState({
                          modalVisible: true,
                          fileType: 'arAccountFile',
                        })
                      }
                    >
                      {formatMessage({ id: 'FILE_CLICK_TO_UPLOAD' })}
                    </Button>
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
                {newArAccountFileList && newArAccountFileList.length > 0 && (
                  <div className={styles.fileUploadDiv}>
                    <div
                      className={`${theme['ant-prefix']}-upload-list ${theme['ant-prefix']}-upload-list-text`}
                    >
                      {this.showFileList(newArAccountFileList, 'arAccountFile', onHandleDelTaFile)}
                    </div>
                  </div>
                )}
              </Spin>
            </Form.Item>
          </Col>
        </Row>
        {modalVisible && <UploadDraggerModal {...upFileProps} />}
      </Col>
    );
  }
}

export default FileUploadToFrom;
