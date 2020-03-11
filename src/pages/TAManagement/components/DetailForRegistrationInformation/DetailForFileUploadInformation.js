import React from 'react';
import { Col, Icon, Row, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { getUrl, handleDownFile } from '@/pages/TAManagement/utils/pubUtils';

const downUrl = `${getUrl()}/common/downloadFile`;

const DetailForFileUploadInformation = props => {
  const { companyInfo = {}, updateDownFileLoading, downFileLoadingFlag = false } = props;
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'FILE_UPLOAD' })}</span>
        </Col>
      </Row>
      <Spin spinning={downFileLoadingFlag}>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'FILE_REGISTRATION_DOCS' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  {companyInfo &&
                    companyInfo.fileList &&
                    companyInfo.fileList.length > 0 &&
                    companyInfo.fileList.map(item => (
                      <div key={item.field + Math.random()} className={styles.uploadListItem}>
                        <div className={styles.uploadListItemInfo}>
                          <span>
                            <Icon
                              type="paper-clip"
                              className={styles.uploadListItemInfoPaperClip}
                            />
                            <a
                              className={styles.uploadListItemName}
                              onClick={() =>
                                handleDownFile(
                                  downUrl,
                                  {
                                    fileName: item.name,
                                    path: item.path,
                                    filePath: item.path,
                                  },
                                  item.sourceName,
                                  () => updateDownFileLoading({ downFileLoadingFlag: true }),
                                  () => updateDownFileLoading({ downFileLoadingFlag: false })
                                )
                              }
                            >
                              {item.sourceName}
                            </a>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'FILE_AR_CREDIT_LIMIT' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  {companyInfo &&
                    companyInfo.arAccountFileList &&
                    companyInfo.arAccountFileList.length > 0 &&
                    companyInfo.arAccountFileList.map(item => (
                      <div key={item.field + Math.random()} className={styles.uploadListItem}>
                        <div className={styles.uploadListItemInfo}>
                          <span>
                            <Icon
                              type="paper-clip"
                              className={styles.uploadListItemInfoPaperClip}
                            />
                            <a
                              className={styles.uploadListItemName}
                              onClick={() =>
                                handleDownFile(
                                  downUrl,
                                  {
                                    fileName: item.name,
                                    path: item.path,
                                    filePath: item.path,
                                  },
                                  item.sourceName,
                                  () => updateDownFileLoading({ downFileLoadingFlag: true }),
                                  () => updateDownFileLoading({ downFileLoadingFlag: false })
                                )
                              }
                            >
                              {item.sourceName}
                            </a>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Spin>
    </React.Fragment>
  );
};
export default DetailForFileUploadInformation;
