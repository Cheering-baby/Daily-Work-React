import React from 'react';
import {Button, Form, Input, Modal, Radio, Select, Tooltip} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const {Option} = Select;

@Form.create()
@connect(({updateOrderMgr}) => ({
  updateOrderMgr,
}))
class Update extends React.Component {
  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendETicketMgr/resetData',
    });
  }

  handleOk = () => {
    const {
      dispatch,
      form,
      updateOrderMgr: {
        updateType,
        // galaxyOrderNo,
        refundSelected,
        // rejectReason
      },
    } = this.props;
    if (updateType === 'Refund') {
      if (refundSelected === 'Reject') {
        form.validateFields(err => {
          if (!err) {
            dispatch({
              type: 'updateOrderMgr/save',
              payload: {
                updateVisible: false,
              },
            });
          }
        });
      } else if (refundSelected === 'Complete') {
        dispatch({
          type: 'updateOrderMgr/save',
          payload: {
            updateVisible: false,
          },
        });
      }
    } else if (updateType === 'Revalidation') {
      dispatch({
        type: 'updateOrderMgr/save',
        payload: {
          updateVisible: false,
        },
      });
    }
  };

  handleCancel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'updateOrderMgr/resetData',
    });
  };

  showUpdateTitle = updateType => {
    if (updateType === 'Revalidation') {
      return <span className={styles.modelTitleStyle}>UPDATE-REVALIDATION</span>;
    }
    if (updateType === 'Refund') {
      return <span className={styles.modelTitleStyle}>UPDATE-REFUND</span>;
    }
    return null;
  };

  showMain = (updateType, galaxyOrderNo, refundSelected, rejectReason, getFieldDecorator) => {
    if (updateType === 'Revalidation') {
      return (
        <FormItem
          label={<span className={styles.modelFormItem}>Galaxy Order No.</span>}
          colon={false}
        >
          <div className={styles.modelInputStyle}>
            <Input
              allowClear
              placeholder="Please Enter"
              onChange={e => this.galaxyOrderNoChange(e.target.value)}
              value={galaxyOrderNo}
            />
          </div>
        </FormItem>
      );
    }
    if (updateType === 'Refund') {
      return (
        <div>
          <Radio.Group onChange={e => this.onSelectChange(e.target.value)} value={refundSelected}>
            <Radio value="Complete">Complete</Radio>
            <Radio value="Reject">Reject</Radio>
          </Radio.Group>
          {refundSelected === 'Reject' ? (
            <FormItem
              label={<span className={styles.modelFormItem}>Reject Reason</span>}
              colon={false}
            >
              {getFieldDecorator('rejectReason', {
                rules: [{required: true, message: 'Required'}],
                initialValue: rejectReason,
              })(
                <div className={styles.modelInputStyle}>
                  <Select
                    allowClear
                    placeholder="Please Select"
                    className={styles.selectStyle}
                    value={rejectReason === null ? undefined : rejectReason}
                    onChange={this.rejectReasonChange}
                  >
                    <Option value="First Reject Reason">
                      <Tooltip placement="topLeft" title="First Reject Reason">
                        First Reject Reason
                      </Tooltip>
                    </Option>
                    <Option value="Second Reject Reason">
                      <Tooltip placement="topLeft" title="Second Reject Reason">
                        Second Reject Reason
                      </Tooltip>
                    </Option>
                  </Select>
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
    const {dispatch} = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        galaxyOrderNo: value,
      },
    });
  };

  onSelectChange = value => {
    const {dispatch} = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        refundSelected: value,
      },
    });
  };

  rejectReasonChange = value => {
    const {dispatch, form} = this.props;
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
      form: {getFieldDecorator},
      updateOrderMgr: {updateVisible, updateType, galaxyOrderNo, refundSelected, rejectReason},
    } = this.props;
    return (
      <Modal
        title={this.showUpdateTitle(updateType)}
        visible={updateVisible}
        centered
        onCancel={this.handleCancel}
        footer={
          <div>
            <Button onClick={() => this.handleOk()} type="primary">
              Confirm
            </Button>
            <Button onClick={this.handleCancel}>Cancel</Button>
          </div>
        }
      >
        {this.showMain(updateType, galaxyOrderNo, refundSelected, rejectReason, getFieldDecorator)}
      </Modal>
    );
  }
}

export default Update;
