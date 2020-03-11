import React, { PureComponent } from 'react';
import { Checkbox, Col, Form, Input, InputNumber, Radio, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { getProductType } from '../../utils/pubUtils';

class QuestionsToFrom extends PureComponent {
  getRwsRoomVolumeRules = (productInfoOne, isRwsNewRoom, productTypeRoom) => {
    if (String(productInfoOne.productType) === productTypeRoom && isRwsNewRoom === 'Y') {
      return [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }];
    }
    return [];
  };

  getOtherRoomVolumeRules = (productInfoOne, isRwsNewRoom, productTypeRoom) => {
    if (String(productInfoOne.productType) === productTypeRoom && isRwsNewRoom === 'N') {
      return [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }];
    }
    return [];
  };

  getRwsAttractionsVolumeRules = (productInfoTwo, isRwsNewAttraction, productTypeAttractions) => {
    if (
      String(productInfoTwo.productType) === productTypeAttractions &&
      isRwsNewAttraction === 'Y'
    ) {
      return [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }];
    }
    return [];
  };

  getOtherAttractionsVolumeRules = (productInfoTwo, isRwsNewAttraction, productTypeAttractions) => {
    if (
      String(productInfoTwo.productType) === productTypeAttractions &&
      isRwsNewAttraction === 'N'
    ) {
      return [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }];
    }
    return [];
  };

  render() {
    const {
      form,
      formItemRowLayout,
      viewId,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      customerInfo = {},
      isRwsRoom,
      isRwsAttraction,
      countryList = [],
      onHandleToProCheckBox,
      onQuestionChange,
      onHandleChange,
      onHandleNationChange,
    } = this.props;
    const { getFieldDecorator } = form;
    const { companyInfo = {} } = customerInfo || {};
    const { productTypeRoom, productTypeAttractions } = getProductType() || {};
    let isRwsNewRoom = isRwsRoom;
    let isRwsNewAttraction = isRwsAttraction;
    let productInfoOne = {};
    if (companyInfo && companyInfo.productList && companyInfo.productList.length > 0) {
      productInfoOne =
        companyInfo.productList.find(item => String(item.productType) === productTypeRoom) || {};
      if (productInfoOne.rwsVolume) {
        isRwsNewRoom = 'Y';
      }
      if (productInfoOne.otherVolume) {
        isRwsNewRoom = 'N';
      }
    }
    let productInfoTwo = {};
    if (companyInfo && companyInfo.productList && companyInfo.productList.length > 0) {
      productInfoTwo =
        companyInfo.productList.find(item => String(item.productType) === productTypeAttractions) ||
        {};
      if (productInfoTwo.rwsVolume) {
        isRwsNewAttraction = 'Y';
      }
      if (productInfoTwo.otherVolume) {
        isRwsNewAttraction = 'N';
      }
    }
    let topNationalitiesArr = [];
    if (companyInfo.topNationalities) {
      topNationalitiesArr = [...companyInfo.topNationalities.split(',')];
    }
    const isDisable = isMainTaRoleFlag || isSaleSupportRoleFlag || isAccountingArRoleFlag;
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.questionsTitle}>
            <p>{formatMessage({ id: 'QUESTIONS_ONE' })}</p>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Form.Item
              label={formatMessage({ id: 'CUSTOMER_NATIONALITY' })}
              colon={false}
              {...formItemRowLayout}
            >
              {getFieldDecorator('topNationalities', {
                initialValue: topNationalitiesArr || [],
                rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
              })(
                <Select
                  mode="multiple"
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  optionFilterProp="children"
                  onChange={value => onHandleNationChange('topNationalities', value)}
                  getPopupContainer={() => document.getElementById(`${viewId}`)}
                  disabled={isDisable}
                >
                  {countryList && countryList.length > 0
                    ? countryList.map(item => (
                      <Select.Option
                        key={`topNationalities${item.dictId}`}
                        value={`${item.dictId}`}
                      >
                        {item.dictName}
                      </Select.Option>
                      ))
                    : null}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.questionsTitle}>
            <p>{formatMessage({ id: 'QUESTIONS_TWO' })}</p>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Form.Item colon={false} {...formItemRowLayout}>
              {getFieldDecorator('isQuestionsRooms', {
                valuePropName: 'checked',
                initialValue: String(productInfoOne.productType) === productTypeRoom,
              })(
                <Checkbox
                  onChange={e => onHandleToProCheckBox(e, productTypeRoom)}
                  disabled={isDisable}
                >
                  <span className={styles.questionsCheckBox}>
                    {formatMessage({ id: 'QUESTIONS_ROOMS' })}
                  </span>
                </Checkbox>
              )}
            </Form.Item>
          </Col>
          <Col span={24} className={styles.questionsRadioTitle}>
            <p>{formatMessage({ id: 'QUESTIONS_TWO_TWO' })}</p>
          </Col>
          <Col span={24} className={styles.questionsRadioBox}>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <Input.Group compact>
                  <Form.Item colon={false} className={styles.questionsRadioBoxItem}>
                    {getFieldDecorator('isQuestionsRadioRoom', {
                      initialValue: isRwsNewRoom,
                    })(
                      <Radio.Group
                        onChange={e => onQuestionChange(e, productTypeRoom)}
                        disabled={
                          String(productInfoOne.productType) !== productTypeRoom || isDisable
                        }
                        name="isQuestionsRadioRoom"
                      >
                        <Radio value="Y">{formatMessage({ id: 'QUESTIONS_TWO_ROOM_YES' })}</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item colon={false}>
                    {getFieldDecorator('rwsRoomVolume', {
                      initialValue: productInfoOne.rwsVolume || null,
                      rules:
                        this.getRwsRoomVolumeRules(productInfoOne, isRwsNewRoom, productTypeRoom) ||
                        [],
                    })(
                      <InputNumber
                        className={styles.questionsRadioBoxInput}
                        min={0}
                        max={10000000}
                        disabled={
                          !(
                            String(productInfoOne.productType) === productTypeRoom &&
                            isRwsNewRoom === 'Y'
                          ) || isDisable
                        }
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        onChange={value =>
                          onHandleChange('rwsVolume', value, 'rwsRoomVolume', productTypeRoom)
                        }
                        onPressEnter={e =>
                          onHandleChange(
                            'rwsVolume',
                            e.target.value,
                            'rwsRoomVolume',
                            productTypeRoom
                          )
                        }
                      />
                    )}
                  </Form.Item>
                </Input.Group>
              </Col>
              <Col span={24}>
                <Input.Group compact>
                  <Form.Item colon={false} className={styles.questionsRadioBoxItem}>
                    {getFieldDecorator('isQuestionsRadioRoom', {
                      initialValue: isRwsNewRoom,
                    })(
                      <Radio.Group
                        onChange={e => onQuestionChange(e, productTypeRoom)}
                        disabled={
                          String(productInfoOne.productType) !== productTypeRoom || isDisable
                        }
                        name="isQuestionsRadioRoom"
                      >
                        <Radio value="N">{formatMessage({ id: 'QUESTIONS_TWO_ROOM_NO' })}</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item colon={false}>
                    {getFieldDecorator('otherRoomVolume', {
                      initialValue: productInfoOne.otherVolume || null,
                      rules:
                        this.getOtherRoomVolumeRules(
                          productInfoOne,
                          isRwsNewRoom,
                          productTypeRoom
                        ) || [],
                    })(
                      <InputNumber
                        className={styles.questionsRadioBoxInput}
                        min={0}
                        max={10000000}
                        disabled={
                          !(
                            String(productInfoOne.productType) === productTypeRoom &&
                            isRwsNewRoom === 'N'
                          ) || isDisable
                        }
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        onChange={value =>
                          onHandleChange('otherVolume', value, 'otherRoomVolume', productTypeRoom)
                        }
                        onPressEnter={e =>
                          onHandleChange(
                            'otherVolume',
                            e.target.value,
                            'otherRoomVolume',
                            productTypeRoom
                          )
                        }
                      />
                    )}
                  </Form.Item>
                </Input.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Form.Item colon={false} {...formItemRowLayout}>
              {getFieldDecorator('isQuestionsAttractions', {
                valuePropName: 'checked',
                initialValue: String(productInfoTwo.productType) === productTypeAttractions,
              })(
                <Checkbox
                  onChange={e => onHandleToProCheckBox(e, productTypeAttractions)}
                  disabled={isDisable}
                >
                  <span className={styles.questionsCheckBox}>
                    {formatMessage({ id: 'QUESTIONS_ATTRACTIONS' })}
                  </span>
                </Checkbox>
              )}
            </Form.Item>
          </Col>
          <Col span={24} className={styles.questionsRadioTitle}>
            <p>{formatMessage({ id: 'QUESTIONS_TWO_ONE' })}</p>
          </Col>
          <Col span={24} className={styles.questionsRadioBox}>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <Input.Group compact>
                  <Form.Item colon={false} className={styles.questionsRadioBoxItem}>
                    {getFieldDecorator('isQuestionsRadioAttractions', {
                      initialValue: isRwsNewAttraction,
                    })(
                      <Radio.Group
                        onChange={e => onQuestionChange(e, productTypeAttractions)}
                        disabled={
                          String(productInfoTwo.productType) !== productTypeAttractions || isDisable
                        }
                        name="isQuestionsRadioAttractions"
                      >
                        <Radio value="Y">
                          {formatMessage({ id: 'QUESTIONS_TWO_ATTRACTIONS_YES' })}
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item colon={false}>
                    {getFieldDecorator('rwsAttractionsVolume', {
                      initialValue: productInfoTwo.rwsVolume || null,
                      rules:
                        this.getRwsAttractionsVolumeRules(
                          productInfoTwo,
                          isRwsNewAttraction,
                          productTypeAttractions
                        ) || [],
                    })(
                      <InputNumber
                        className={styles.questionsRadioBoxInput}
                        min={0}
                        max={10000000}
                        disabled={
                          !(
                            String(productInfoTwo.productType) === productTypeAttractions &&
                            isRwsNewAttraction === 'Y'
                          ) || isDisable
                        }
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        onChange={value =>
                          onHandleChange(
                            'rwsVolume',
                            value,
                            'rwsAttractionsVolume',
                            productTypeAttractions
                          )
                        }
                        onPressEnter={e =>
                          onHandleChange(
                            'rwsVolume',
                            e.target.value,
                            'rwsAttractionsVolume',
                            productTypeAttractions
                          )
                        }
                      />
                    )}
                  </Form.Item>
                </Input.Group>
              </Col>
              <Col span={24}>
                <Input.Group compact>
                  <Form.Item colon={false} className={styles.questionsRadioBoxItem}>
                    {getFieldDecorator('isQuestionsRadioAttractions', {
                      initialValue: isRwsNewAttraction,
                    })(
                      <Radio.Group
                        onChange={e => onQuestionChange(e, productTypeAttractions)}
                        disabled={String(productInfoTwo.productType) !== productTypeAttractions}
                        name="isQuestionsRadioAttractions"
                      >
                        <Radio value="N" disabled={isDisable}>
                          {formatMessage({ id: 'QUESTIONS_TWO_ATTRACTIONS_NO' })}
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item colon={false}>
                    {getFieldDecorator('otherAttractionsVolume', {
                      initialValue: productInfoTwo.otherVolume || null,
                      rules:
                        this.getOtherAttractionsVolumeRules(
                          productInfoTwo,
                          isRwsNewAttraction,
                          productTypeAttractions
                        ) || [],
                    })(
                      <InputNumber
                        className={styles.questionsRadioBoxInput}
                        min={0}
                        max={10000000}
                        disabled={
                          !(
                            String(productInfoTwo.productType) === productTypeAttractions &&
                            isRwsNewAttraction === 'N'
                          ) || isDisable
                        }
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        onChange={value =>
                          onHandleChange(
                            'otherVolume',
                            value,
                            'otherAttractionsVolume',
                            productTypeAttractions
                          )
                        }
                        onPressEnter={e =>
                          onHandleChange(
                            'otherVolume',
                            e.target.value,
                            'otherAttractionsVolume',
                            productTypeAttractions
                          )
                        }
                      />
                    )}
                  </Form.Item>
                </Input.Group>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default QuestionsToFrom;
