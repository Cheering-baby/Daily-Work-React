import React from 'react';
import { Col, Icon, Row } from 'antd';
import { getUrl, handleDownFile } from '../../utils/utils';
import styles from './index.less';

const DetailForFileInformation = props => {
  const { fileList = [], fileKeys = {}, fileTxt = null, afterDown, beforeDown } = props;
  const downUrl = `${getUrl()}/common/downloadFile`;
  return (
    <Row type="flex" justify="space-around">
      <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
        <div className={styles.fileRightStyle}>
          <span>{fileTxt || null}</span>
        </div>
      </Col>
      <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
        <div className={styles.fileLeftStyle}>
          {fileList &&
            fileList.length > 0 &&
            fileList.map(item => (
              <div key={item.field + Math.random()} className={styles.fileListItem}>
                <div className={styles.fileListItemInfo}>
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
                </div>
              </div>
            ))}
        </div>
      </Col>
    </Row>
  );
};
export default DetailForFileInformation;
