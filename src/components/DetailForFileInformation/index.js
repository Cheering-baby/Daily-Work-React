import React from 'react';
import { Col, Icon, Row, Tooltip } from 'antd';
import { getUrl, handleDownFile } from '../../utils/utils';
import styles from './index.less';

const DetailForFileInformation = props => {
  const {
    fileList = [],
    fileKeys = {},
    fileTxt = null,
    afterDown,
    beforeDown,
    ifLongLayout = false,
  } = props;
  const downUrl = `${getUrl()}/common/downloadFile`;
  const layoutDisplay = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: ifLongLayout ? 6 : 12,
    xl: ifLongLayout ? 6 : 12,
    xxl: ifLongLayout ? 6 : 12,
  };
  const valueDisplay = {
    xs: 24,
    sm: 12,
    md: 16,
    lg: ifLongLayout ? 18 : 12,
    xl: ifLongLayout ? 18 : 12,
    xxl: ifLongLayout ? 18 : 12,
  };
  return (
    <Row type="flex" justify="space-around">
      <Col
        xs={layoutDisplay.xs}
        sm={layoutDisplay.sm}
        md={layoutDisplay.md}
        lg={layoutDisplay.lg}
        xl={layoutDisplay.xl}
        xxl={layoutDisplay.xxl}
      >
        <div className={styles.fileRightStyle}>
          <span>{fileTxt || null}</span>
        </div>
      </Col>
      <Col
        xs={valueDisplay.xs}
        sm={valueDisplay.sm}
        md={valueDisplay.md}
        lg={valueDisplay.lg}
        xl={valueDisplay.xl}
        xxl={valueDisplay.xxl}
      >
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
