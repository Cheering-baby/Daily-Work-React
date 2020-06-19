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
    const { dispatch, form } = this.props;
    dispatch({
      type: 'sendETicketMgr/resetData',
    });
    form.resetFields();
  }

  handleOk = (updateType, status) => {
    const { dispatch, form } = this.props;
    form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'updateOrderMgr/update',
        }).then(resultCode => {
          if (resultCode === ERROR_CODE_SUCCESS || (resultCode === '0' && updateType === 'Revalidation' && status === 'Complete')) {
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
    const { dispatch, form } = this.props;
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
    form.resetFields();
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

  showMain = (updateType, revalidationSelected, galaxyOrderNo, revalidationRejectReason, refundSelected, rejectReason, status, getFieldDecorator) => {
    if (updateType === 'Revalidation') {
      return (
        <div>
          {status === 'Confirmed' &&
          <Radio.Group onChange={e => this.onRevalidationSelectChange(e.target.value)} value={revalidationSelected}>
            <Radio value="Complete">{formatMessage({ id: 'COMPLETE' })}</Radio>
            <Radio value="Reject">{formatMessage({ id: 'REJECT' })}</Radio>
          </Radio.Group>
          }
          {revalidationSelected === 'Complete' ?
            <FormItem
              label={
                <span className={styles.modelFormItem}>{formatMessage({ id: 'GALAXY_ORDER_NO' })}</span>
              }
              colon={false}
            >
              {getFieldDecorator('galaxyOrderNo', {
                rules: [{required: status === 'Confirmed', message: 'Required'}],
                initialValue: galaxyOrderNo,
              })(
                <div className={styles.modelInputStyle}>
                  <Input
                    allowClear
                    placeholder="Please Enter"
                    onChange={e => this.galaxyOrderNoChange(e.target.value)}
                    value={galaxyOrderNo}
                    maxLength={128}
                    onKeyUp={(e)=>{
                      if(e.target.value.length >= 128){
                        message.config({
                          maxCount: 1,
                        });
                        message.warning('Max 128 characters for Galaxy Order No.');
                      }
                    }}
                  />
                </div>
              )}
            </FormItem> :
            <FormItem
              label={
                <span className={styles.modelFormItem}>
                  {formatMessage({ id: 'REJECT_REASON' })}
                </span>
              }
              colon={false}
            >
              {getFieldDecorator('revalidationRejectReason', {
                rules: [{ required: true, message: 'Required' }],
                initialValue: revalidationRejectReason,
              })(
                <div className={styles.modelInputStyle}>
                  <Input
                    allowClear
                    className={styles.selectStyle}
                    placeholder="Please Enter"
                    value={revalidationRejectReason}
                    onChange={e => this.revalidationRejectReasonChange(e.target.value)}
                    maxLength={128}
                    onKeyUp={(e)=>{
                      if(e.target.value.length >= 128){
                        message.config({
                          maxCount: 1,
                        });
                        message.warning('Max 128 characters for Reject Reason.');
                      }
                    }}
                  />
                </div>
              )}
            </FormItem>
          }
        </div>
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

  galaxyOrderNoChange = (value) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        galaxyOrderNo: value,
      },
    });
    form.setFieldsValue({ galaxyOrderNo: value });
  };

  onRevalidationSelectChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        revalidationSelected: value,
      },
    });
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

  revalidationRejectReasonChange = value => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        revalidationRejectReason: value !== undefined ? value : null,
      },
    });
    form.setFieldsValue({
      revalidationRejectReason: value !== undefined ? value : null,
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
      updateOrderMgr: {
        updateVisible,
        updateType,
        revalidationSelected,
        galaxyOrderNo,
        revalidationRejectReason,
        refundSelected,
        rejectReason,
        status
      },
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
              onClick={() => this.handleOk(updateType, status)}
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
            revalidationSelected,
            galaxyOrderNo,
            revalidationRejectReason,
            refundSelected,
            rejectReason,
            status,
            getFieldDecorator
          )}
        </Spin>
      </Modal>
    );
  }
}

export default Update;
