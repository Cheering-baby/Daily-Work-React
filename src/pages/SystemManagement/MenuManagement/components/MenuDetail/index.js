import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import styles from './index.less';
import { getMenuTypeStr } from '../../utils/pubUtils';

class MenuDetail extends PureComponent {
  render() {
    const { menuInfo, menuTypeList } = this.props;
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <div className={styles.detailRightStyleRequired}>
                  <span>{formatMessage({ id: 'MENU_FORM_PARENT_DIRECTORY' })}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(menuInfo.parentMenuName) ? menuInfo.parentMenuName : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <div className={styles.detailRightStyleRequired}>
                  <span>{formatMessage({ id: 'MENU_FORM_MENU_NAME' })}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(menuInfo.menuName) ? menuInfo.menuName : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          {String(menuInfo.menuType) === '02' && (
            <Col span={24}>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <div className={styles.detailRightStyleRequired}>
                    <span>{formatMessage({ id: 'MENU_FORM_MENU_URL' })}</span>
                  </div>
                </Col>
                <Col span={24}>
                  <div className={styles.detailLeftStyle}>
                    <span>{!isNvl(menuInfo.menuUrl) ? menuInfo.menuUrl : '-'}</span>
                  </div>
                </Col>
              </Row>
            </Col>
          )}
          <Col span={24}>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <div className={styles.detailRightStyleRequired}>
                  <span>{formatMessage({ id: 'MENU_FORM_MENU_TYPE' })}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.detailLeftStyle}>
                  <span>{getMenuTypeStr(menuTypeList, menuInfo.menuType)}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'MENU_FORM_ICON_URL' })}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(menuInfo.iconUrl) ? menuInfo.iconUrl : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'MENU_FORM_REMARKS' })}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(menuInfo.remarks) ? menuInfo.remarks : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default MenuDetail;
