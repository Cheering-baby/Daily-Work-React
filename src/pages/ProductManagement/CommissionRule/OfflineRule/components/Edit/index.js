import React from 'react';
import { connect } from 'dva';
import { Button, Drawer, Form, Radio, InputNumber, message } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { commonConfirm } from '@/components/CommonModal';

const FormItem = Form.Item;
const drawWidth = 480;

@Form.create()
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
      },
    });
  };

  handleSubmit = e => {
    const {
      form,
      dispatch,
      offline: { commoditySpecId },
    } = this.props;
    e.preventDefault();
    const resCb = response => {
      this.onClose();
      if (response === 'SUCCESS') {
        message.success('Modified successfully.');
      } else if (response === 'ERROR') {
        message.error('Failed to modify.');
      }
    };
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      values.commissionValue =
        values.commissionScheme === 'Amount' ? values.Amount : values.Percentage;
      commonConfirm({
        content: `Confirm to Modify ?`,
        onOk: () => {
          dispatch({
            type: 'offline/edit',
            payload: {
              params: values,
              taId: commoditySpecId,
            },
          }).then(resCb);
        },
      });
    });
  };

  render() {
    const {
      offline: { drawerVisible, commissionList = [] },
      form: { getFieldDecorator },
    } = this.props;
    const { commissionValue, commissionScheme } = commissionList;
    let commissionValueAmount;
    let commissionValuePercent;
    if (commissionScheme === 'Amount') {
      commissionValueAmount = commissionValue;
    } else {
      commissionValuePercent = commissionValue;
    }
    return (
      <div>
        <Drawer
          title={<div className={styles.type}>MODIFY</div>}
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
            <Form onSubmit={this.handleSubmit}>
              <FormItem label={formatMessage({ id: 'COMMISSION_SCHEMA' })} colon={false}>
                {getFieldDecorator('commissionScheme', {
                  initialValue: commissionScheme,
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="Amount">
                      {formatMessage({ id: 'COMMISSION_AMOUNT' })}
                      {getFieldDecorator('Amount', {
                        initialValue: commissionValueAmount,
                      })(
                        <InputNumber
                          style={{ marginLeft: '10px' }}
                          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => {
                            value = value.replace(/[^\d]/g, '');
                            value = +value > 100 ? 100 : value.substr(0, 2);
                            return String(value);
                          }}
                        />
                      )}
                    </Radio>
                    <Radio value="Percentage" style={{ paddingTop: '15px' }}>
                      {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                      {getFieldDecorator('Percent', {
                        initialValue: commissionValuePercent,
                      })(
                        <InputNumber
                          style={{ marginLeft: '10px' }}
                          formatter={value => `${value}%`}
                          parser={value => {
                            value = value.replace(/[^\d]/g, '');
                            value = +value > 100 ? 100 : value.substr(0, 2);
                            return String(value);
                          }}
                        />
                      )}
                    </Radio>
                  </Radio.Group>
                )}
              </FormItem>
              <div className={styles.formControl}>
                <Button onClick={this.onClose} style={{ marginRight: 8, width: 60 }}>
                  Cancel
                </Button>
                <Button htmlType="submit" type="primary" style={{ width: 60 }}>
                  OK
                </Button>
              </div>
            </Form>
          </div>
        </Drawer>
      </div>
    );
  }
}
export default EditCommission;
