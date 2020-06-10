import React, { PureComponent } from 'react';
import { Checkbox, Col, Form, Input, InputNumber, Radio, Row, Select, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { getProductType } from '../../utils/pubUtils';
import { isNvl } from '@/utils/utils';
import SortSelect from '@/components/SortSelect';

class QuestionsToFrom extends PureComponent {
  getRwsRoomVolumeRules = (productInfoOne, isRwsNewRoom, productTypeRoom) => {
    if (String(productInfoOne.productType) === productTypeRoom && isRwsNewRoom === 'Y') {
      return [
        { required: true, message: formatMessage({ id: 'REQUIRED' }) },
        { type: 'number', min: 0, max: 10000000, message: formatMessage({ id: 'ONLY_NUMBER' }) },
      ];
    }
    return [];
  };

  getOtherRoomVolumeRules = (productInfoOne, isRwsNewRoom, productTypeRoom) => {
    if (String(productInfoOne.productType) === productTypeRoom && isRwsNewRoom === 'N') {
      return [
        { required: true, message: formatMessage({ id: 'REQUIRED' }) },
        { type: 'number', min: 0, max: 10000000, message: formatMessage({ id: 'ONLY_NUMBER' }) },
      ];
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

  compareToNationalities = (rule, value, callback) => {
    if (value && value.length > 3) {
      callback(formatMessage({ id: 'QUESTIONS_NATIONALITY_CHECK_MSG' }));
    } else callback();
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
    const companyInfo = (customerInfo || {}).companyInfo || {};
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
      <Col span={24} className={styles.questionsInfo}>
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
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { validator: this.compareToNationalities },
                ],
              })(
                <SortSelect
                  mode="multiple"
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  optionFilterProp="label"
                  onChange={value => onHandleNationChange('topNationalities', value)}
                  getPopupContainer={() => document.getElementById(`${viewId}`)}
                  disabled={isDisable}
                  options={
                    countryList && countryList.length > 0
                      ? countryList.map(item => (
                        <Select.Option
                          key={`topNationalities${item.dictId}`}
                          value={`${item.dictId}`}
                          label={item.dictName}
                        >
                          <Tooltip
                            placement="topLeft"
                            title={
                              <span style={{ whiteSpace: 'pre-wrap' }}>{item.dictName}</span>
                              }
                          >
                            {item.dictName}
                          </Tooltip>
                        </Select.Option>
                        ))
                      : null
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.questionsTitle}>
            <div dangerouslySetInnerHTML={{ __html: formatMessage({ id: 'QUESTIONS_TWO' }) }} />
            <div className={styles.whiteSpacePreWrap}>
              {formatMessage({ id: 'QUESTIONS_TWO_EXPAND_A' })}
            </div>
            <div className={styles.whiteSpacePreWrap}>
              {formatMessage({ id: 'QUESTIONS_TWO_EXPAND_B' })}
            </div>
            <div className={styles.whiteSpacePreWrap}>
              {formatMessage({ id: 'QUESTIONS_TWO_EXPAND_C' })}
            </div>
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
          {String(productInfoOne.productType) === productTypeRoom && (
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
                          <Radio value="Y">
                            <span className={styles.whiteSpacePreWrap}>
                              {formatMessage({ id: 'QUESTIONS_TWO_ROOM_YES' })}
                            </span>
                          </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item colon={false}>
                      {getFieldDecorator('rwsRoomVolume', {
                        initialValue: !isNvl(productInfoOne.rwsVolume)
                          ? Number(String(productInfoOne.rwsVolume))
                          : null,
                        rules:
                          this.getRwsRoomVolumeRules(
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
                          <Radio value="N">
                            <span className={styles.whiteSpacePreWrap}>
                              {formatMessage({ id: 'QUESTIONS_TWO_ROOM_NO' })}
                            </span>
                          </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item colon={false}>
                      {getFieldDecorator('otherRoomVolume', {
                        initialValue: !isNvl(productInfoOne.otherVolume)
                          ? Number(String(productInfoOne.otherVolume))
                          : null,
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
          )}
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
          {String(productInfoTwo.productType) === productTypeAttractions && (
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
                            String(productInfoTwo.productType) !== productTypeAttractions ||
                            isDisable
                          }
                          name="isQuestionsRadioAttractions"
                        >
                          <Radio value="Y">
                            <span className={styles.whiteSpacePreWrap}>
                              {formatMessage({ id: 'QUESTIONS_TWO_ATTRACTIONS_YES' })}
                            </span>
                          </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item colon={false}>
                      {getFieldDecorator('rwsAttractionsVolume', {
                        initialValue: !isNvl(productInfoTwo.rwsVolume)
                          ? Number(String(productInfoTwo.rwsVolume))
                          : null,
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
                            <span className={styles.whiteSpacePreWrap}>
                              {formatMessage({ id: 'QUESTIONS_TWO_ATTRACTIONS_NO' })}
                            </span>
                          </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item colon={false}>
                      {getFieldDecorator('otherAttractionsVolume', {
                        initialValue: !isNvl(productInfoTwo.otherVolume)
                          ? Number(String(productInfoTwo.otherVolume))
                          : null,
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
          )}
        </Row>
      </Col>
    );
  }
}

export default QuestionsToFrom;
