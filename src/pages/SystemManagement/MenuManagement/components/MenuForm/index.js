import React, { PureComponent } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import IconTab from '@/components/IconTab';
import SortSelect from '@/components/SortSelect';

@Form.create()
class MenuForm extends PureComponent {
  render() {
    const { form, menuInfo, menuTypeList, iconArr, onHandleChange, viewId } = this.props;
    const { getFieldDecorator } = form;
    const numFormat = formatMessage({ id: 'MENU_FORM_INPUT_MAX_NUM' });
    const iconProps = {
      iconUrl: menuInfo.iconUrl,
      iconArr,
    };
    let isDisabled = false;
    if (menuInfo.children && menuInfo.children.length > 0) {
      isDisabled = true;
    }
    return (
      <React.Fragment>
        <Form>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Form.Item label={formatMessage({ id: 'MENU_FORM_PARENT_DIRECTORY' })}>
                {getFieldDecorator('parentMenuName', {
                  initialValue: menuInfo.parentMenuName || null,
                  rules: [
                    { required: true, message: formatMessage({ id: 'MENU_FORM_REQUIRED' }) },
                    { max: 200, message: numFormat },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={e =>
                      onHandleChange('parentMenuName', e.target.value, 'parentMenuName')
                    }
                    onPressEnter={e =>
                      onHandleChange('parentMenuName', e.target.value, 'parentMenuName')
                    }
                    disabled
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Form.Item label={formatMessage({ id: 'MENU_FORM_MENU_NAME' })}>
                {getFieldDecorator('menuName', {
                  initialValue: menuInfo.menuName || null,
                  rules: [
                    { required: true, message: formatMessage({ id: 'MENU_FORM_REQUIRED' }) },
                    { max: 200, message: numFormat },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={e => onHandleChange('menuName', e.target.value, 'menuName')}
                    onPressEnter={e => onHandleChange('menuName', e.target.value, 'menuName')}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          {String(menuInfo.menuType) === '02' && (
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <Form.Item label={formatMessage({ id: 'MENU_FORM_MENU_URL' })}>
                  {getFieldDecorator('menuUrl', {
                    initialValue: menuInfo.menuUrl || null,
                    rules: [
                      { required: true, message: formatMessage({ id: 'MENU_FORM_REQUIRED' }) },
                      { max: 200, message: numFormat },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      onChange={e => onHandleChange('menuUrl', e.target.value, 'menuUrl')}
                      onPressEnter={e => onHandleChange('menuUrl', e.target.value, 'menuUrl')}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Form.Item label={formatMessage({ id: 'MENU_FORM_MENU_TYPE' })}>
                {getFieldDecorator('menuType', {
                  initialValue: menuInfo.menuType || [],
                  rules: [{ required: true, message: formatMessage({ id: 'MENU_FORM_REQUIRED' }) }],
                })(
                  <SortSelect
                    showSearch
                    placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                    optionFilterProp="children"
                    getPopupContainer={() => document.getElementById(`${viewId}`)}
                    onChange={value => onHandleChange('menuType', value, 'menuType')}
                    disabled={isDisabled}
                    style={{ width: '100%' }}
                    options={
                      menuTypeList && menuTypeList.length > 0
                        ? menuTypeList.map(item => (
                            <Select.Option
                              key={`menuTypeList${item.dicValue}`}
                              value={`${item.dicValue}`}
                            >
                              {item.dicName}
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
            <Col span={24}>
              <Form.Item label={formatMessage({ id: 'MENU_FORM_ICON_URL' })}>
                <IconTab
                  {...iconProps}
                  iconClick={iconUrl => onHandleChange('iconUrl', iconUrl, 'iconUrl')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Form.Item label={formatMessage({ id: 'MENU_FORM_REMARKS' })}>
                {getFieldDecorator('remarks', {
                  initialValue: menuInfo.remarks || null,
                  rules: [{ max: 200, message: numFormat }],
                })(
                  <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                    onChange={e => onHandleChange('remarks', e.target.value, 'remarks')}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

export default MenuForm;
