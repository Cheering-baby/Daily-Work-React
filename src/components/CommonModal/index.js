import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Modal } from 'antd';

const COMMONFOOTER = {
  okText: formatMessage({ id: 'COMMON_CONFIRM' }),
  cancelText: formatMessage({ id: 'COMMON_CANCEL' }),
};
const confirmCommonProps = {
  title: formatMessage({ id: 'COMMON_CONFIRM' }),
  ...COMMONFOOTER,
};
const modalCommonProps = {
  title: formatMessage({ id: 'COMMON_MODAL' }),
  visible: true,
  width: 'calc(100% - 300px)',
  wrapClassName: 'modal-container',
  centered: true,
  maskClosable: false,
  destroyOnClose: true,
  ...COMMONFOOTER,
};
const { confirm } = Modal;

export const commonConfirm = ({ onOk, ...otherProps }) => {
  confirm({
    ...confirmCommonProps,
    ...otherProps,
    onOk: () => {
      onOk();
    },
  });
};

export default class CommonModal extends PureComponent {
  render() {
    const { modalOpts, children } = this.props;
    return (
      <Modal {...modalCommonProps} {...modalOpts}>
        {children}
      </Modal>
    );
  }
}
