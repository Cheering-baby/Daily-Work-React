import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Form, Input, message, Modal, Radio, Spin } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

const FormItem = Form.Item;

@Form.create()
@connect(({ updateOrderMgr, loading }) => ({
  updateOrderMgr,
  pageLoading: loading.effects['updateOrderMgr/update'],
}))
class Update extends React.Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sendETicketMgr/resetData',
    });
  }

  handleOk = () => {
    const { dispatch, form } = this.props;
    form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'updateOrderMgr/update',
        }).then(resultCode => {
          if (resultCode === ERROR_CODE_SUCCESS) {
            this.handleCancel();
            message.success(formatMessage({ id: 'UPDATE_SUCCESSFULLY' }));
            dispatch({
              type: 'queryOrderMgr/queryTransactions',
            });
          }
        });
      }
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateOrderMgr/effectSave',
      payload: {
        updateVisible: false,
      },
    }).then(() => {
      setTimeout(() => {
        dispatch({
          type: 'updateOrderMgr/resetData',
        });
      }, 500);
    });
  };

  showUpdateTitle = updateType => {
    if (updateType === 'Revalidation') {
      return (
        <span className={styles.modelTitleStyle}>
          {formatMessage({ id: 'UPDATE_REVALIDATION_TITLE' })}
        </span>
      );
    }
    if (updateType === 'Refund') {
      return (
        <span className={styles.modelTitleStyle}>
          {formatMessage({ id: 'UPDATE_REFUND_TITLE' })}
        </span>
      );
    }
    return null;
  };

  showMain = (updateType, galaxyOrderNo, refundSelected, rejectReason, getFieldDecorator) => {
    if (updateType === 'Revalidation') {
      return (
        <FormItem
          label={
            <span className={styles.modelFormItem}>{formatMessage({ id: 'GALAXY_ORDER_NO' })}</span>
          }
          colon={false}
        >
          {getFieldDecorator('galaxyOrderNo', {
            rules: [{ required: true, message: 'Required' }],
            initialValue: galaxyOrderNo,
          })(
            <div className={styles.modelInputStyle}>
              <Input
                allowClear
                placeholder="Please Enter"
                onChange={e => this.galaxyOrderNoChange(e.target.value)}
                value={galaxyOrderNo}
              />
            </div>
          )}
        </FormItem>
      );
    }
    if (updateType === 'Refund') {
      return (
        <div>
          <Radio.Group onChange={e => this.onSelectChange(e.target.value)} value={refundSelected}>
            <Radio value="Complete">{formatMessage({ id: 'COMPLETE' })}</Radio>
            <Radio value="Reject">{formatMessage({ id: 'REJECT' })}</Radio>
          </Radio.Group>
          {refundSelected === 'Reject' ? (
            <FormItem
              label={
                <span className={styles.modelFormItem}>
                  {formatMessage({ id: 'REJECT_REASON' })}
                </span>
              }
              colon={false}
            >
              {getFieldDecorator('rejectReason', {
                rules: [{ required: true, message: 'Required' }],
                initialValue: rejectReason,
              })(
                <div className={styles.modelInputStyle}>
                  <Input
                    allowClear
                    className={styles.selectStyle}
                    placeholder="Please Enter"
                    value={rejectReason}
                    onChange={e => this.rejectReasonChange(e.target.value)}
                  />
                </div>
              )}
            </FormItem>
          ) : null}
        </div>
      );
    }
    return null;
  };

  galaxyOrderNoChange = value => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        galaxyOrderNo: value,
      },
    });
    form.setFieldsValue({ galaxyOrderNo: value });
  };

  onSelectChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        refundSelected: value,
      },
    });
  };

  rejectReasonChange = value => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        rejectReason: value !== undefined ? value : null,
      },
    });
    form.setFieldsValue({
      rejectReason: value !== undefined ? value : null,
    });
  };

  render() {
    const {
      pageLoading,
      form: { getFieldDecorator },
      updateOrderMgr: { updateVisible, updateType, galaxyOrderNo, refundSelected, rejectReason },
    } = this.props;
    return (
      <Modal
        title={this.showUpdateTitle(updateType)}
        visible={updateVisible}
        centered
        maskClosable={false}
        onCancel={this.handleCancel}
        footer={
          <div>
            <Button
              style={{ width: 70 }}
              loading={!!pageLoading}
              onClick={() => this.handleOk()}
              type="primary"
            >
              {!pageLoading ? formatMessage({ id: 'CONFIRM' }) : null}
            </Button>
            <Button onClick={this.handleCancel}>{formatMessage({ id: 'CANCEL' })}</Button>
          </div>
        }
      >
        <Spin spinning={!!pageLoading}>
          {this.showMain(
            updateType,
            galaxyOrderNo,
            refundSelected,
            rejectReason,
            getFieldDecorator
          )}
        </Spin>
      </Modal>
    );
  }
}

export default Update;
