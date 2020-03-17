import React from 'react';
import { formatMessage } from 'umi/locale';
import { Icon, Upload } from 'antd';
import { connect } from 'dva';
import CommonModal from '@/components/CommonModal';
import { getUrl } from '../../TAManagement/utils/pubUtils';

const actionUrl = `${getUrl()}/common/upload`;

@connect(({ myActivityUpload }) => ({
  myActivityUpload,
}))
class MyActivityUpload extends React.PureComponent {
  handleOk = () => {
    // const { dispatch } = this.props;
  };

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
    const { contractFileList } = this.props;
    const modalOpts = {
      width: 444,
      onOk: e => {
        this.handleOk(e);
      },
    };
    const { Dragger } = Upload;
    const comProps = {
      accept: '.pdf,.jpg,.doc,.docx',
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
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: false,
      },
    };
    const props = {
      ...comProps,
      data: { type: 'contractFile' },
      // onPreview: () => {},
      // onChange: changeValue => this.onHandleChange(changeValue, 'contractFile'),
      // onRemove: file => {
      //   const {
      //     uid,
      //     status,
      //     response: { result: { filePath, fileName, fileSourceName } = '' } = '',
      //   } = file;
      //   if (status === 'done') {
      //     onHandleDelContactFile(
      //       { uid, status, name: fileName, path: filePath, filePath, sourceName: fileSourceName },
      //       'contractFile'
      //     );
      //   }
      //   if (status === 'error') {
      //     onHandleContractFileChange(
      //       { uid, status, name: fileName, path: filePath, filePath, sourceName: fileSourceName },
      //       true
      //     );
      //   }
      // }
    };
    return (
      <CommonModal modalOpts={modalOpts}>
        <Dragger {...props} fileList={this.normFile(contractFileList)}>
          <p>
            <Icon type="cloud-upload" />
          </p>
          <p>{formatMessage({ id: 'CLICK_TO_UPLOAD' })}</p>
          <p>{formatMessage({ id: 'SUPPORT_EXTENSION' })}</p>
        </Dragger>
      </CommonModal>
    );
  }
}

export default MyActivityUpload;
