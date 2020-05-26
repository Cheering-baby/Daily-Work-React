import React from 'react';
import { formatMessage } from 'umi/locale';
import { Card, Col, Icon, message, Upload } from 'antd';
import { getUrl, handleDownFile } from '@/utils/utils';
import styles from './index.less';

const actionUrl = `${getUrl()}/common/upload`;
const downUrl = `${getUrl()}/common/downloadFile`;

const UploadDragger = ({
  fileList,
  fileKeys,
  onHandleDelFile,
  onHandleFileChange,
  fileUploading,
  fileType,
}) => {
  const comProps = {
    accept: '.csv, .pdf, .txt, .doc, .docx, .xls, .xlsx, .zip, .rar',
    name: 'file',
    action: actionUrl,
    headers: new Headers({
      Origin: '*',
      'App-Code': 'PAMS',
    }),
    multiple: false,
  };

  const fileBeforeChange = file =>
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
        message.error(formatMessage({ id: 'UPLOAD_FILE_TYPE' }));
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

  const onHandleChange = changeValue => {
    const {
      file: { uid, status, response: { result: { filePath, fileName, fileSourceName } = '' } = '' },
    } = changeValue;
    const reFile = {};
    reFile[`${fileKeys.labelUid || 'uid'}`] = uid;
    reFile[`${fileKeys.labelStatus || 'status'}`] = status;
    reFile[`${fileKeys.labelName || 'name'}`] = fileName;
    reFile[`${fileKeys.labelPath || 'path'}`] = filePath;
    reFile[`${fileKeys.labelSourceName || 'sourceName'}`] = fileSourceName;
    onHandleFileChange(reFile, false);
  };

  const fileProps = {
    ...comProps,
    data: { type: fileType },
    onPreview: () => {},
    onChange: changeValue => onHandleChange(changeValue, fileType),
    onRemove: file => {
      const {
        uid,
        status,
        response: { result: { filePath, fileName, fileSourceName } = '' } = '',
      } = file;
      const reFile = {};
      reFile[`${fileKeys.labelUid || 'uid'}`] = uid;
      reFile[`${fileKeys.labelStatus || 'status'}`] = status;
      reFile[`${fileKeys.labelName || 'name'}`] = fileName;
      reFile[`${fileKeys.labelPath || 'path'}`] = filePath;
      reFile[`${fileKeys.labelSourceName || 'sourceName'}`] = fileSourceName;
      if (status === 'done') {
        onHandleDelFile(reFile, fileType);
      }
      if (status === 'error') {
        onHandleFileChange(reFile, true);
      }
    },
    beforeUpload: file => fileBeforeChange(file),
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

  const normFile = fList => {
    const newFileList = [];
    if (fList && fList.length > 0) {
      fList.forEach((n, key) =>
        newFileList.push({
          uid: n[`${fileKeys.labelUid || 'uid'}`] || `${key}`,
          name: n[`${fileKeys.labelSourceName || 'sourceName'}`],
          status: n[`${fileKeys.labelStatus || 'status'}`] || 'done',
          url: n[`${fileKeys.labelPath || 'path'}`],
          response: {
            result: {
              filePath: n[`${fileKeys.labelPath || 'path'}`],
              fileName: n[`${fileKeys.labelName || 'name'}`],
              fileSourceName: n[`${fileKeys.labelSourceName || 'sourceName'}`],
            },
          },
        })
      );
    }
    return newFileList || [];
  };

  return (
    <Card className={styles.uploadCard} loading={fileUploading}>
      <Col span={24}>
        <Upload.Dragger {...fileProps} fileList={normFile(fileList)}>
          <p className={styles.uploadDragIcon}>
            <Icon type="inbox" className={styles.uploadIcon} />
          </p>
          <p className={styles.uploadText}>{formatMessage({ id: 'UPLOAD_CLICK_OR_DRAG' })}</p>
          <p className={styles.uploadHint}>{formatMessage({ id: 'UPLOAD_SUPPORT_EXTENSION' })}</p>
        </Upload.Dragger>
      </Col>
    </Card>
  );
};

export default UploadDragger;
