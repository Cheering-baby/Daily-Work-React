import React from 'react';
import { formatMessage } from 'umi/locale';
// import { connect } from 'dva';
import { Icon } from 'antd';
import CommonModal from '@/components/CommonModal';

// @connect(({}) => ({}))
class MyActivityUpload extends React.PureComponent {
  render() {
    const { type, ...modalProps } = this.props;
    const modalOpts = {
      ...modalProps,
      width: 444,
      onOk: () => {
        // this.handleOk(e);
      },
    };
    return (
      <CommonModal modalOpts={modalOpts}>
        <div>
          <Icon type="inbox" />
          <div>{formatMessage({ id: 'CLICK_TO_UPLOAD' })}</div>
          <div>{formatMessage({ id: 'SUPPORT_EXTENSION' })}</div>
        </div>
      </CommonModal>
    );
  }
}

export default MyActivityUpload;
