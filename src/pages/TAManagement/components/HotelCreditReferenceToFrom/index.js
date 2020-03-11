import React, { PureComponent } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';

class HotelCreditReferenceToFrom extends PureComponent {
  render() {
    const { form, formItemLayout, otherInfo = {}, onHandleChange } = this.props;
    const { getFieldDecorator } = form;
    const { hotelCreditReferenceList = [] } = otherInfo || {};
    const numFormat = formatMessage({ id: 'INPUT_MAX_NUM' });
    let hotelInfoOne = {};
    if (hotelCreditReferenceList && hotelCreditReferenceList.length > 0) {
      hotelInfoOne = hotelCreditReferenceList.find(item => String(item.hotelType) === '1') || {};
    }
    let hotelInfoTwo = {};
    if (hotelCreditReferenceList && hotelCreditReferenceList.length > 0) {
      hotelInfoTwo = hotelCreditReferenceList.find(item => String(item.hotelType) === '2') || {};
    }
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'HOTEL_NAME_ONE' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('hotelNameOne', {
                initialValue: hotelInfoOne.hotelName || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('hotelName', e.target.value, 'hotelNameOne', '1')}
                  onPressEnter={e =>
                    onHandleChange('hotelName', e.target.value, 'hotelNameOne', '1')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
            &nbsp;
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'HOTEL_MONTHLY_BIL' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('monthlyBillingOne', {
                initialValue: hotelInfoOne.monthlyBilling || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange('monthlyBilling', e.target.value, 'monthlyBillingOne', '1')
                  }
                  onPressEnter={e =>
                    onHandleChange('monthlyBilling', e.target.value, 'monthlyBillingOne', '1')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'HOTEL_MONTHLY_BIL' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('creditLimitOne', {
                initialValue: hotelInfoOne.creditLimit || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange('creditLimit', e.target.value, 'creditLimitOne', '1')
                  }
                  onPressEnter={e =>
                    onHandleChange('creditLimit', e.target.value, 'creditLimitOne', '1')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'HOTEL_NAME_TWO' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('hotelNameTwo', {
                initialValue: hotelInfoTwo.hotelName || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('hotelName', e.target.value, 'hotelNameTwo', '2')}
                  onPressEnter={e =>
                    onHandleChange('hotelName', e.target.value, 'hotelNameTwo', '2')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
            &nbsp;
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'HOTEL_MONTHLY_BIL' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('monthlyBillingTwo', {
                initialValue: hotelInfoTwo.monthlyBilling || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange('monthlyBilling', e.target.value, 'monthlyBillingTwo', '2')
                  }
                  onPressEnter={e =>
                    onHandleChange('monthlyBilling', e.target.value, 'monthlyBillingTwo', '2')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'HOTEL_MONTHLY_BIL' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('creditLimitTwo', {
                initialValue: hotelInfoTwo.creditLimit || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e =>
                    onHandleChange('creditLimit', e.target.value, 'creditLimitTwo', '2')
                  }
                  onPressEnter={e =>
                    onHandleChange('creditLimit', e.target.value, 'creditLimitTwo', '2')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default HotelCreditReferenceToFrom;
