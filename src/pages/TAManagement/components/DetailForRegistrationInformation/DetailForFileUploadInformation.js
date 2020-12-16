import React from 'react';
import { Col, Descriptions, Row, Spin, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import DetailForFileInfo from '@/components/DetailForFileInfo';
import { getUrl, handleDownFile } from '@/utils/utils';

const downUrl = `${getUrl()}/b2b/agent/common/downloadAllFiles`;

const DetailForFileUploadInformation = props => {
  const { companyInfo = {}, updateDownFileLoading, downFileLoadingFlag = false } = props;

  const downLoadAllFiles = () => {
    handleDownFile(
      downUrl,
      {
        taId: companyInfo.taId,
        type: 'TA_PROFILE',
      },
      `TA_PROFILE-${companyInfo.taId}-AllFiles.zip`,
      () => updateDownFileLoading({ downFileLoadingFlag: true }),
      () => updateDownFileLoading({ downFileLoadingFlag: false }),
    )
  };

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
            <Button
              type="primary"
              disabled={
                (!companyInfo.fileList || companyInfo.fileList.length === 0) &&
                (!companyInfo.arAccountFileList || companyInfo.arAccountFileList.length === 0)
              }
              onClick={downLoadAllFiles}
            >
              {formatMessage({ id: 'DOWNLOAD_ALL_FILES' })}
            </Button>
          </Col>
          <Col span={24}>
            <Descriptions className={styles.descriptionsStyle} column={1}>
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
