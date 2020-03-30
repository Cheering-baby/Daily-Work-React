import React from 'react';
import { connect } from 'dva';
import { Button, Drawer, Form, Radio, InputNumber } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const FormItem = Form.Item;
const drawWidth = 480;
const COMMONRule = {
  required: true,
  msg: 'Required',
};

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

  render() {
    const {
      offline: { drawerVisible },
      form: { getFieldDecorator },
    } = this.props;

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
            <Form>
              <FormItem label={formatMessage({ id: 'COMMISSION_SCHEMA' })} colon={false}>
                {getFieldDecorator('commissionName', {
                  // initialValue: promotionCode,
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="Y">
                      {formatMessage({ id: 'COMMISSION_AMOUNT' })}
                      {getFieldDecorator('amount', {
                        rules: [COMMONRule],
                      })(
                        <InputNumber
                          style={{ marginLeft: '10px' }}
                          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      )}
                    </Radio>
                    <Radio value="N" style={{ paddingTop: '15px' }}>
                      {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                      {getFieldDecorator('percent', {
                        rules: [COMMONRule],
                      })(<InputNumber style={{ marginLeft: '10px' }} min={1} max={10} />)}
                    </Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Form>
            <div className={styles.formControl}>
              <Button onClick={this.onClose} style={{ marginRight: 8, width: 60 }}>
                Cancel
              </Button>
              <Button onClick={this.save} type="primary" style={{ width: 60 }}>
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
