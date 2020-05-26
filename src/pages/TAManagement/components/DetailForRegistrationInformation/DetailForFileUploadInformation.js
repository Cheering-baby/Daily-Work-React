import React from 'react';
import { Col, Descriptions, Row, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import DetailForFileInfo from '@/components/DetailForFileInfo';

const DetailForFileUploadInformation = props => {
  const { companyInfo = {}, updateDownFileLoading, downFileLoadingFlag = false } = props;
  const layout = { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 };
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'FILE_UPLOAD' })}</span>
        </Col>
      </Row>
      <Spin spinning={downFileLoadingFlag}>
        <Row type="flex" justify="space-around" className={styles.detailContent}>
          <Col span={24}>
            <Descriptions className={styles.descriptionsStyle} column={layout}>
              <Descriptions.Item label={formatMessage({ id: 'FILE_REGISTRATION_DOCS' })}>
                <DetailForFileInfo
                  fileList={companyInfo.fileList || null}
                  fileKeys={{
                    labelName: 'name',
                    labelPath: 'path',
                    labelSourceName: 'sourceName',
                  }}
                  beforeDown={() => updateDownFileLoading({ downFileLoadingFlag: true })}
                  afterDown={() => updateDownFileLoading({ downFileLoadingFlag: false })}
                />
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: 'FILE_AR_CREDIT_LIMIT' })}>
                <DetailForFileInfo
                  fileList={companyInfo.arAccountFileList || null}
                  fileKeys={{
                    labelName: 'name',
                    labelPath: 'path',
                    labelSourceName: 'sourceName',
                  }}
                  beforeDown={() => updateDownFileLoading({ downFileLoadingFlag: true })}
                  afterDown={() => updateDownFileLoading({ downFileLoadingFlag: false })}
                />
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Spin>
    </React.Fragment>
  );
};
export default DetailForFileUploadInformation;
