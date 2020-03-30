import React from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import DetailForFileInformation from '@/components/DetailForFileInformation';
import styles from './TaRegistration.less';

const FileUpload = props => {
  const { companyInfo = {}, updateDownFileLoading, downFileLoadingFlag = false } = props;
  return (
    <Col span={24} id="signUpView">
      <Row type="flex" justify="space-around">
        <Col span={24} className={styles.activityCard}>
          <Card>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <Row type="flex" justify="space-around">
                  <Col span={24}>
                    <span className={styles.titleHeader}>
                      {' '}
                      {formatMessage({ id: 'FILE_UPLOAD' })}
                    </span>
                  </Col>
                </Row>
                <Spin spinning={downFileLoadingFlag}>
                  <Row type="flex" justify="space-around">
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                      <DetailForFileInformation
                        fileTxt={formatMessage({ id: 'FILE_REGISTRATION_DOCS' })}
                        fileList={companyInfo.fileList || null}
                        fileKeys={{
                          labelName: 'name',
                          labelPath: 'path',
                          labelSourceName: 'sourceName',
                        }}
                        beforeDown={() => updateDownFileLoading({ downFileLoadingFlag: true })}
                        afterDown={() => updateDownFileLoading({ downFileLoadingFlag: false })}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                      <DetailForFileInformation
                        fileTxt={formatMessage({ id: 'FILE_AR_CREDIT_LIMIT' })}
                        fileList={companyInfo.arAccountFileList || null}
                        fileKeys={{
                          labelName: 'name',
                          labelPath: 'path',
                          labelSourceName: 'sourceName',
                        }}
                        beforeDown={() => updateDownFileLoading({ downFileLoadingFlag: true })}
                        afterDown={() => updateDownFileLoading({ downFileLoadingFlag: false })}
                      />
                    </Col>
                  </Row>
                </Spin>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};
export default FileUpload;
