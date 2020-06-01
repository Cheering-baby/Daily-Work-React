import React from 'react';
import classNames from 'classnames';
import { formatMessage } from 'umi/locale';
import { Icon, Modal } from 'antd';
import styles from '../index.less';

class Approval extends React.PureComponent {
  showModal = () => {
    Modal.confirm({
      title: formatMessage({ id: 'APPROVAL_MODEL_TITLE' }),
      content: formatMessage({ id: 'APPROVAL_MODEL_CONTENT' }),
      icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
      okText: formatMessage({ id: 'APPROVAL_MODEL_okText' }),
      cancelText: formatMessage({ id: 'APPROVAL_MODEL_cancelText' }),
    });
  };

  render() {
    return (
      <React.Fragment>
        <div
          className={classNames(styles.labelValue, styles.colorOrange, styles.cursorPointer)}
          onClick={this.showModal}
        >
          {formatMessage({ id: 'APPROVAL' })}
        </div>
      </React.Fragment>
    );
  }
}

export default Approval;
