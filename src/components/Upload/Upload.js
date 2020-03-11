import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Icon, message, Upload } from 'antd';
import CommonModal from '../CommonModal';

const { Dragger } = Upload;

@connect(({}) => ({})) // eslint-disable-line
class UploadModal extends Component {
  render() {
    const { type, ...modalProps } = this.props;
    const modalOpts = {
      ...modalProps,
      width: 444,
      onOk: () => {
        // this.handleOk(e);
      },
    };
    const props = {
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <CommonModal modalOpts={modalOpts}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">{formatMessage({ id: 'UPLOAD_CLICK_FILE' })}</p>
          <p className="ant-upload-hint">{formatMessage({ id: 'UPLOAD_SUPPORT' })}</p>
        </Dragger>
        ,
      </CommonModal>
    );
  }
}

export default UploadModal;
