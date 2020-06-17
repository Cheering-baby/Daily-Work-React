import React from 'react';
import { Col, Icon, Row, Tooltip } from 'antd';
import { getUrl, handleDownFile } from '../../utils/utils';
import styles from './index.less';

const DetailForFileInformation = props => {
  const { fileList = [], fileKeys = {}, fileTxt = null, afterDown, beforeDown } = props;
  const downUrl = `${getUrl()}/common/downloadFile`;
console.log(fileList.reportFile, fileKeys)
  return (
    <Row type="flex" justify="space-around">
      <Col span={24}>
        <div className={styles.fileLabelStyle}>
          <span>{fileTxt || null}</span>
        </div>
      </Col>
      <Col span={24}>
        <div className={styles.fileLeftStyle}>
          {/*{fileList && fileList.length > 0*/}
            {/*? fileList.map(item => (*/}
                <div className={styles.fileListItem}>
                  <div className={styles.fileListItemInfo}>
                    <Tooltip
                      placement="topLeft"
                      title={
                        <span style={{ whiteSpace: 'pre-wrap' }}>
                          {/*{fileList[`${fileKeys.labelSourceName || 'sourceName'}`]}*/}
                          {/*{item[`${fileKeys.labelSourceName || 'sourceName'}`]}*/}
                          {fileList && fileList.reportFile ? fileList.reportFile : ''}
                        </span>
                      }
                    >
                      <span>
                        <Icon type="paper-clip" className={styles.fileListItemInfoPaperClip} />
                        <a
                          className={styles.fileListItemName}
                          onClick={() =>
                            handleDownFile(
                              downUrl,
                              {
                                fileName: fileList && fileList.reportFile ? fileList.reportFile : '',
                                filePath: fileList && fileList.reportFilePath ? fileList.reportFilePath : ''
                              },
                              fileList && fileList.reportFile ? fileList.reportFile : '',
                              () => {
                                if (beforeDown) beforeDown();
                              },
                              () => {
                                if (afterDown) afterDown();
                              }
                            )
                          }
                        >
                          {fileList && fileList.reportFile ? fileList.reportFile : ''}
                        </a>
                      </span>
                    </Tooltip>
                  </div>
                </div>
              {/*))*/}
            {/*: '-'}*/}
        </div>
      </Col>
    </Row>
  );
};
export default DetailForFileInformation;
