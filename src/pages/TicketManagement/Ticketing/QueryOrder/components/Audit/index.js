import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Form, Input, message, Modal, Radio, Spin } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

const FormItem = Form.Item;

@Form.create()
@connect(({ queryOrderMgr, auditOrderMgr, loading }) => ({
  queryOrderMgr,
  auditOrderMgr,
  pageLoading: loading.effects['auditOrderMgr/audit'],
}))
class Audit extends React.Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sendETicketMgr/resetData',
    });
  }

  handleOk = () => {
    const {
      dispatch,
      form,
      queryOrderMgr: { selectedBookings, transactionList },
      auditOrderMgr: { auditSelect }
    } = this.props;
    form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'auditOrderMgr/audit',
        }).then(resultCode => {
          if (resultCode === ERROR_CODE_SUCCESS) {
            this.handleCancel();
            message.success(formatMessage({ id: 'AUDIT_SUCCESSFULLY' }));
            const selectedBooking = selectedBookings[0];
            const { transType } = selectedBooking;
            if(transType === 'booking' && auditSelect === 'Approve'){
              dispatch({
                type: 'auditOrderMgr/queryAuditStatus',
                payload: {
                  bookingId: selectedBooking.bookingNo,
                  currentPage: 1,
                  pageSize: 10,
                },
              }).then(status => {
                if (status && status === 'WaitingForPaying') {
                  for (let i = 0; i < transactionList.length; i += 1) {
                    if (transactionList[i].bookingNo === selectedBooking.bookingNo) {
                      transactionList[i].status = status;
                      dispatch({
                        type: 'queryOrderMgr/save',
                        payload: {
                          transactionList,
                        },
                      });
                      dispatch({
                        type: 'queryOrderPaymentMgr/save',
                        payload: {
                          paymentModalVisible: true,
                          selectedBooking,
                          bookDetail: selectedBooking,
                          bookingNo: selectedBooking.bookingNo,
                        },
                      });
                      break;
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: 'queryOrderMgr/queryTransactions',
              });
            }
          }
        });
      }
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auditOrderMgr/effectSave',
      payload: {
        auditVisible: false,
      },
    }).then(() => {
      setTimeout(() => {
        dispatch({
          type: 'auditOrderMgr/resetData',
        });
      }, 500);
    });
  };

  rejectReasonChange = value => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'auditOrderMgr/save',
      payload: {
        rejectReason: value !== undefined ? value : null,
      },
    });
    form.setFieldsValue({
      rejectReason: value !== undefined ? value : null,
    });
  };

  onSelectChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auditOrderMgr/save',
      payload: {
        auditSelect: value,
      },
    });
  };

  render() {
    const {
      pageLoading,
      form: { getFieldDecorator },
      auditOrderMgr: { auditVisible, auditSelect, rejectReason },
    } = this.props;
    return (
      <Modal
        title={
          <span className={styles.modelTitleStyle}>
            {formatMessage({ id: 'AUDIT_ORDER_TITLE' })}
          </span>
        }
        visible={auditVisible}
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
          <Radio.Group onChange={e => this.onSelectChange(e.target.value)} value={auditSelect}>
            <Radio value="Approve">{formatMessage({ id: 'APPROVE' })}</Radio>
            <Radio value="Reject">{formatMessage({ id: 'REJECT' })}</Radio>
          </Radio.Group>
          {auditSelect === 'Reject' ? (
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
                    maxLength={256}
                  />
                </div>
              )}
            </FormItem>
          ) : null}
        </Spin>
      </Modal>
    );
  }
}

export default Audit;
