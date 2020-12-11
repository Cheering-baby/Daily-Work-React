import React, { PureComponent } from 'react';
import { Badge, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getCountryStr } from '../../../utils/pubUtils';
import { hasAllPrivilege, MAIN_TA_ADMIN_PRIVILEGE } from '@/utils/PrivilegeUtil';
import { getTelStr } from '@/pages/TAManagement/utils/pubUtils';

class SubTaDetailComp extends PureComponent {
  showMainTaName = nameList => {
    if (!isNvl(nameList) && nameList.length > 0) {
      const isMainTaAdminRoleFlag = hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]);
      if (!isMainTaAdminRoleFlag) {
        return (
          <Col span={24} style={{ marginBottom: 14 }}>
            {nameList.map(name => {
              if (!isNvl(name)) {
                let statusStr = 'default';
                let statusTxt = '';
                if (!isNvl(name.enableName) && String(name.enableName).toLowerCase() === 'active') {
                  statusStr = 'success';
                  statusTxt = formatMessage({ id: 'SUB_TA_M_TABLE_STATUS_ACTIVE' });
                } else {
                  statusStr = 'default';
                  statusTxt = formatMessage({ id: 'SUB_TA_M_TABLE_STATUS_INACTIVE' });
                }
                return (
                  <div className={styles.subTaDetailLeftStyle}>
                    <span>
                      ({name.taId}) {name.mainCompanyName} (
                      <Badge status={statusStr} text={statusTxt || null} />)
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </Col>
        );
      }
      return (
        <Col span={24} style={{ marginBottom: 14 }}>
          {nameList.map(name => {
            if (!isNvl(name)) {
              return (
                <div className={styles.subTaDetailLeftStyle}>
                  <span>{!isNvl(name.mainCompanyName) ? name.mainCompanyName : '-'}</span>
                </div>
              );
            }
            return null;
          })}
        </Col>
      );
    }
    return (
      <Col span={24} style={{ marginBottom: 14 }}>
        <div className={styles.subTaDetailLeftStyle}>
          <span>-</span>
        </div>
      </Col>
    );
  };

  render() {
    const { subTaInfo, countryList } = this.props;
    return (
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_MAIN_TA_NAME' })}</span>
          </div>
        </Col>
        {this.showMainTaName(subTaInfo.relativeTaList)}
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_FULL_NAME' })}</span>
          </div>
        </Col>
        <Col span={24} style={{ marginBottom: 14 }}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.fullName) ? subTaInfo.fullName : '-'}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_EMAIL' })}</span>
          </div>
        </Col>
        <Col span={24} style={{ marginBottom: 14 }}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.email) ? subTaInfo.email : '-'}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}</span>
          </div>
        </Col>
        <Col span={24} style={{ marginBottom: 14 }}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.companyName) ? subTaInfo.companyName : '-'}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}</span>
          </div>
        </Col>
        <Col span={24} style={{ marginBottom: 14 }}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{getCountryStr(countryList, subTaInfo.country)}</span>
          </div>
        </Col>
        <Col span={24} style={{ marginBottom: 14 }}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_TEL' })}:</span>
          </div>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{getTelStr(countryList, subTaInfo.phoneCountry, subTaInfo.phone)}</span>
          </div>
        </Col>
        <Col span={24} style={{ marginBottom: 14 }}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_MOBILE_NO' })}:</span>
          </div>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{getTelStr(countryList, subTaInfo.mobileCountry, subTaInfo.mobileNumber)}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyle}>
            <span>{formatMessage({ id: 'SUB_TA_COMPANY_ADDRESS' })}</span>
          </div>
        </Col>
        <Col span={24} style={{ marginBottom: 14 }}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.address) ? subTaInfo.address : '-'}</span>
          </div>
        </Col>
      </Row>
    );
  }
}

export default SubTaDetailComp;
