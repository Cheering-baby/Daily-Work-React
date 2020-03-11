import React, { PureComponent } from 'react';
import { Card, Col, Icon, message, Upload } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { getUrl, handleDownFile } from '../../../utils/pubUtils';

const actionUrl = `${getUrl()}/common/upload`;
const downUrl = `${getUrl()}/common/downloadFile`;

class UploadContractComp extends PureComponent {
  onHandleChange = changeValue => {
    const { onHandleContractFileChange } = this.props;
    const {
      file: { uid, status, response: { result: { filePath, fileName, fileSourceName } = '' } = '' },
    } = changeValue;
    const contractFile = {
      uid,
      status,
      name: fileName,
      path: filePath,
      sourceName: fileSourceName,
    };
    onHandleContractFileChange(contractFile, false);
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

  normFile = fileList => {
    const newFileList = [];
    if (fileList && fileList.length > 0) {
      fileList.forEach((n, key) =>
        newFileList.push({
          uid: n.uid || `${key}`,
          name: n.sourceName,
          status: n.status || 'done',
          url: n.path,
          response: {
            result: {
              filePath: n.path,
              fileName: n.name,
              fileSourceName: n.sourceName,
            },
          },
        })
      );
    }
    return newFileList || [];
  };

  render() {
    const {
      contractFileList,
      onHandleDelContactFile,
      onHandleContractFileChange,
      contractFileUploading,
    } = this.props;
    const comProps = {
      accept: '.csv, .pdf, .txt, .doc, .docx, .xls, .xlsx, .zip, .rar',
      name: 'file',
      action: actionUrl,
      headers: {
        Authorization: 'fCm7Pc1OXg7XXWPW4DUqO3s2fa8ObSX2',
        contentType: 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Headers':
          'Authorization,Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST',
        'App-Code': 'PAMS',
      },
      multiple: false,
    };
    const contractProps = {
      ...comProps,
      data: { type: 'contractFile' },
      onPreview: () => {},
      onChange: changeValue => this.onHandleChange(changeValue, 'contractFile'),
      onRemove: file => {
        const {
          uid,
          status,
          response: { result: { filePath, fileName, fileSourceName } = '' } = '',
        } = file;
        if (status === 'done') {
          onHandleDelContactFile(
            { uid, status, name: fileName, path: filePath, filePath, sourceName: fileSourceName },
            'contractFile'
          );
        }
        if (status === 'error') {
          onHandleContractFileChange(
            { uid, status, name: fileName, path: filePath, filePath, sourceName: fileSourceName },
            true
          );
        }
      },
      beforeUpload: file => this.fileBeforeChange(file),
      onDownload: file => {
        const { response: { result: { filePath, fileName, fileSourceName } = '' } = '' } = file;
        const reqParamJson = {
          fileName,
          filePath,
          path: filePath,
        };
        handleDownFile(downUrl, reqParamJson, fileSourceName, null, null);
      },
    };
    return (
      <Card className={styles.uploadContractCard} spinning={contractFileUploading}>
        <Col span={24}>
          <Upload.Dragger {...contractProps} fileList={this.normFile(contractFileList)}>
            <p className={styles.contactUploadDragIcon}>
              <Icon type="inbox" className={styles.contactIcon} />
            </p>
            <p className={styles.contactUploadText}>
              {formatMessage({ id: 'TA_UPLOAD_CLICK_OR_DRAG' })}
            </p>
            <p className={styles.contactUploadHint}>
              {formatMessage({ id: 'TA_UPLOAD_SUPPORT_EXTENSION' })}
            </p>
          </Upload.Dragger>
        </Col>
      </Card>
    );
  }
}

export default UploadContractComp;
