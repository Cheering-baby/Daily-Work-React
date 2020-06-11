import React from 'react';
import { Col, Icon, Row, Tooltip } from 'antd';
import { getUrl, handleDownFile } from '../../utils/utils';
import styles from './index.less';

const DetailForFileInformation = props => {
  const { fileList = [], fileKeys = {}, fileTxt = null, afterDown, beforeDown } = props;
  const downUrl = `${getUrl()}/common/downloadFile`;

  return (
    <Row type="flex" justify="space-around">
      <Col span={24}>
        <div className={styles.fileLabelStyle}>
          <span>{fileTxt || null}</span>
        </div>
      </Col>
      <Col span={24}>
        <div className={styles.fileLeftStyle}>
          {fileList && fileList.length > 0
            ? fileList.map(item => (
              <div key={item.field + Math.random()} className={styles.fileListItem}>
                <div className={styles.fileListItemInfo}>
                  <Tooltip
                    placement="topLeft"
                    title={
                      <span style={{ whiteSpace: 'pre-wrap' }}>
                        {item[`${fileKeys.labelSourceName || 'sourceName'}`]}
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
                                fileName: item[`${fileKeys.labelName || 'name'}`],
                                filePath: item[`${fileKeys.labelPath || 'path'}`],
                              },
                              item[`${fileKeys.labelSourceName || 'sourceName'}`],
                              () => {
                                if (beforeDown) beforeDown();
                              },
                              () => {
                                if (afterDown) afterDown();
                              }
                            )
                          }
                      >
                        {item[`${fileKeys.labelSourceName || 'sourceName'}`]}
                      </a>
                    </span>
                  </Tooltip>
                </div>
              </div>
              ))
            : '-'}
        </div>
      </Col>
    </Row>
  );
};
export default DetailForFileInformation;
