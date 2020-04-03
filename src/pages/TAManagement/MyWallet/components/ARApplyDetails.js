import React from 'react';
import { formatMessage } from 'umi/locale';
import { Card, Col, Row } from 'antd';
import DetailForFileInformation from '@/components/DetailForFileInformation';

import styles from './ARApplyDetails.less';

class ArApplyDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { activityDetail = {} } = this.props;
    const { activityInfo = {} } = activityDetail;
    const { content = '' } = activityInfo;
    const contentObj = content ? JSON.parse(content) : [];
    return (
      <React.Fragment>
        <Col lg={24} md={24}>
          <Col span={24}>
            <Card>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <span className={styles.titleHeader}>
                    {formatMessage({ id: 'AR_APPLY_INFORMATION' })}
                  </span>
                </Col>
              </Row>
              <DetailForFileInformation
                fileTxt={formatMessage({ id: 'AR_CREDIT_LIMIT' })}
                fileKeys={{
                  labelName: 'fileName',
                  labelPath: 'filePath',
                  labelSourceName: 'fileSourceName',
                }}
                fileList={contentObj.uploadFiles || null}
                beforeDown={() => {}}
                afterDown={() => {}}
              />
            </Card>
          </Col>
        </Col>
      </React.Fragment>
    );
  }
}

export default ArApplyDetails;
