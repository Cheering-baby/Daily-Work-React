import React from 'react';
import { connect } from 'dva';
import { Button, Drawer, Icon, InputNumber, message, Modal, Radio } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { commonConfirm } from '@/components/CommonModal';

const { confirm } = Modal;
const drawWidth = 400;

@connect(({ offline }) => ({
  offline,
}))
class EditCommission extends React.PureComponent {
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/save',
      payload: {
        drawerVisible: false,
        type: undefined,
        modifyParams: {
          tplId: null,
          usageScope: 'Offline',
          commissionType: 'Fixed',
          commissionScheme: 'Amount',
          commissionValue: null,
          commissionValueAmount: null,
          commissionValuePercent: null,
        },
      },
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      offline: {
        modifyParams: {
          tplId,
          usageScope,
          commissionType,
          commissionScheme,
          commissionValueAmount,
          commissionValuePercent,
        },
      },
    } = this.props;
    if (
      commissionScheme === 'Amount' &&
      (commissionValueAmount === null || commissionValueAmount === '')
    ) {
      message.warning('Commission amount is required.');
      return;
    }
    if (
      commissionScheme === 'Percentage' &&
      (commissionValuePercent === null || commissionValuePercent === '')
    ) {
      message.warning('Commission percentage is required.');
      return;
    }

    let commissionValue2 = '';
    if (commissionScheme === 'Percentage') {
      const point = String(+commissionValuePercent).indexOf('.') + 1;
      const count = String(+commissionValuePercent).length - point;
      if (point > 0) {
        if (count === 1) {
          commissionValue2 = parseFloat(commissionValuePercent / 100).toFixed(3);
        } else if (count === 2) {
          commissionValue2 = parseFloat(commissionValuePercent / 100).toFixed(4);
        }
      }
      if (point === 0) {
        commissionValue2 = parseFloat(commissionValuePercent / 100);
      }
    }
    commonConfirm({
      content: `Confirm to modify?`,
      onOk: () => {
        dispatch({
          type: 'offline/edit',
          payload: {
            tplId,
            usageScope,
            commissionType,
            commissionScheme,
            commissionValue:
              commissionScheme === 'Amount' ? commissionValueAmount : commissionValue2,
          },
        }).then(resultCode => {
          if (resultCode === '0') {
            message.success('Modified successfully.');
            dispatch({
              type: 'offline/fetchOfflineList',
            });
            this.onClose();
          }
        });
      },
    });
  };

  changeRadioValue = value => {
    const { dispatch } = this.props;

    confirm({
      className: styles.confirmStyle,
      title: 'Change the Commission Schema?',
      content:
        value === 'Amount' ? (
          <span>{formatMessage({ id: 'CHANGE_COMMISSION_AMOUNT' })}</span>
        ) : (
          <span>{formatMessage({ id: 'CHANGE_PERCENT_AMOUNT' })}</span>
        ),
      icon: <Icon type="exclamation-circle" />,
      cancelText: 'No',
      cancelButtonProps: {
        type: 'default',
      },
      okText: 'Yes',
      okButtonProps: {
        type: 'primary',
      },
      onOk() {
        if (value === 'Amount') {
          dispatch({
            type: 'offline/saveModifyParams',
            payload: {
              commissionScheme: value,
              commissionValuePercent: '',
            },
          });
        } else {
          dispatch({
            type: 'offline/saveModifyParams',
            payload: {
              commissionScheme: value,
              commissionValueAmount: '',
            },
          });
        }
      },
      onCancel() {
        dispatch({
          type: 'offline/saveModifyParams',
          payload: {
            commissionScheme: value === 'Amount' ? 'Percentage' : 'Amount',
          },
        });
      },
    });
  };

  changeInputValue = (value, flag) => {
    const { dispatch } = this.props;
    if (flag === 'Amount') {
      dispatch({
        type: 'offline/saveModifyParams',
        payload: {
          commissionValueAmount: value,
        },
      });
    }
    if (flag === 'Percentage') {
      dispatch({
        type: 'offline/saveModifyParams',
        payload: {
          commissionValuePercent: value,
        },
      });
    }
  };

  render() {
    const {
      offline: {
        drawerVisible,
        modifyParams: { commissionScheme, commissionValueAmount, commissionValuePercent },
      },
    } = this.props;

    return (
      <div>
        <Drawer
          title={<div className={styles.drawerTitle}>MODIFY</div>}
          placement="right"
          destroyOnClose
          maskClosable={false}
          onClose={this.onClose}
          visible={drawerVisible}
          width={drawWidth}
          bodyStyle={{
            height: 'calc(100% - 55px)',
            padding: '20px 20px 53px 20px',
            overflow: 'auto',
          }}
        >
          <div>
            <div className={styles.modifyTitleDiv}>
              <span className={styles.titleSpan}>{formatMessage({ id: 'COMMISSION_SCHEMA' })}</span>
            </div>
            <Radio.Group
              value={commissionScheme}
              onChange={e => this.changeRadioValue(e.target.value)}
            >
              <Radio value="Amount">
                <div className={styles.modifyDivStyle}>
                  <span>{formatMessage({ id: 'COMMISSION_AMOUNT' })}</span>
                </div>
                <InputNumber
                  value={commissionValueAmount}
                  style={{ marginLeft: '10px' }}
                  precision={2}
                  min={0}
                  formatter={value => `$ ${value}`}
                  parser={value => {
                    value = value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : '';
                    return String(value);
                  }}
                  onChange={value => this.changeInputValue(value, 'Amount')}
                />
              </Radio>
              <Radio value="Percentage" style={{ paddingTop: '15px' }}>
                <div className={styles.modifyDivStyle}>
                  <span>{formatMessage({ id: 'COMMISSION_PERCENTAGE' })}</span>
                </div>
                <InputNumber
                  value={commissionValuePercent}
                  style={{ marginLeft: '10px' }}
                  formatter={value => `${value}%`}
                  min={0}
                  max={100}
                  parser={value => {
                    value = value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : '';
                    return String(value);
                  }}
                  onChange={value => this.changeInputValue(value, 'Percentage')}
                />
              </Radio>
            </Radio.Group>
            <div className={styles.formControl}>
              <Button onClick={this.onClose} style={{ marginRight: 8, width: 60 }}>
                Cancel
              </Button>
              <Button type="primary" onClick={() => this.handleSubmit()} style={{ width: 60 }}>
                OK
              </Button>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}
export default EditCommission;
