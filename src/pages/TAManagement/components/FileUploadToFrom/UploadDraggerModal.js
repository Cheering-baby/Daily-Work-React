import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import UploadDragger from '@/components/UploadDragger';

const UploadDraggerModal = ({
  dispatch,
  fileType,
  handleModalOk,
  modalVisible,
  onHandleChange,
  handleModalCancel,
  fileKeys = {
    labelUid: 'uid',
    labelStatus: 'status',
    labelName: 'name',
    labelPath: 'path',
    labelSourceName: 'sourceName',
  },
}) => {
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploadList, setFileUploadList] = useState([]);

  const onHandleFileChange = (file, isDel) => {
    let newFileList = [];
    if (fileUploadList && fileUploadList.length > 0) {
      newFileList = [...fileUploadList].filter(n => String(n.uid) !== String(file.uid));
    }
    if (!isDel && String(file.status) !== 'removed') {
      Object.assign(file, {
        response: {
          result: { fileName: file.name, filePath: file.path, fileSourceName: file.sourceName },
        },
      });
      // console.log(file);
      newFileList.push(file);
    }
    setFileUploadList(newFileList);
  };

  const onHandleDelFile = (file, fType) => {
    setFileUploading(true);
    dispatch({
      type: 'taMgr/fetchDeleteTAFile',
      payload: {
        fileName: file.name,
        path: file.path,
        filePath: file.path,
      },
    }).then(flag => {
      if (flag && String(fType) === fileType) {
        onHandleFileChange(file, true);
      }
      if (!flag && String(fType) === fileType) {
        let newFileList = [];
        if (fileUploadList && fileUploadList.length > 0) {
          newFileList = [...fileUploadList].filter(n => String(n.uid) !== String(file.uid));
        }
        file.status = 'error';
        newFileList.push(file);
        setFileUploadList(newFileList);
      }
      setFileUploading(false);
    });
  };

  const filePropsToDragger = {
    fileType,
    fileKeys,
    fileUploading,
    onHandleChange,
    onHandleDelFile,
    onHandleFileChange,
    fileList: fileUploadList,
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      visible={modalVisible}
      onCancel={handleModalCancel}
      confirmLoading={fileUploading}
      title={formatMessage({ id: 'COMMON_UPLOAD' })}
      onOk={() => handleModalOk(fileUploadList, fileType)}
      footer={[
        <Button key="back" loading={fileUploading} onClick={handleModalCancel}>
          {formatMessage({ id: 'COMMON_CANCEL' })}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={fileUploading}
          onClick={() => handleModalOk(fileUploadList, fileType)}
        >
          {formatMessage({ id: 'COMMON_OK' })}
        </Button>,
      ]}
    >
      <UploadDragger {...filePropsToDragger} />
    </Modal>
  );
};

export default connect()(UploadDraggerModal);
