import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Col, Row } from 'antd';
import { Icon as MobileIcon, NavBar } from 'antd-mobile';
import style from './index.less';

const commonFooter = {
  okText: formatMessage({ id: 'COMMON_CONFIRM' }),
  cancelText: formatMessage({ id: 'COMMON_CANCEL' }),
};

const modalCommonProps = {
  title: formatMessage({ id: 'COMMON_MODAL' }),
  ...commonFooter,
};

class MobileModal extends PureComponent {
  render() {
    const { modalOpts, children } = this.props;
    const mobileModalOpts = { ...modalCommonProps, ...modalOpts };
    const defaultProps = {
      mode: 'light',
      icon: <MobileIcon type="left" />,
      onLeftClick: mobileModalOpts.onCancel,
      rightContent: mobileModalOpts.rightContent ? mobileModalOpts.rightContent : [],
    };
    return modalOpts.visible === false ? null : (
      <div className={style.mobileModelWrapper}>
        <NavBar {...defaultProps}>{mobileModalOpts.title}</NavBar>
        <div className={style.contentWrapper}>{children}</div>
        {modalOpts.footer === null ? (
          ''
        ) : (
          <div className={style.buttonWrapper}>
            <Row gutter={8}>
              <Col span={12}>
                <Button type="primary" block onClick={mobileModalOpts.onOk}>
                  {mobileModalOpts.okText}
                </Button>
              </Col>
              <Col span={12}>
                <Button block onClick={mobileModalOpts.onCancel}>
                  {mobileModalOpts.cancelText}
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

export default MobileModal;
