import React, { PureComponent } from 'react';
import { Button, Checkbox, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { getUrl, handleDownFile } from '@/utils/utils';
import styles from './index.less';

const downUrl = `${getUrl()}/common/downloadFile`;

class ApplyARCreditToFrom extends PureComponent {
  state = {
    aRCreditLoadingFlag: false,
    path: 'agent/template/',
    fileNameList: ['BG Template.pdf', 'Credit Application Form.pdf'],
  };

  render() {
    const { form, applyArAccount, onHandleToArCheckBox } = this.props;
    const { getFieldDecorator } = form;
    const { aRCreditLoadingFlag } = this.state;
    const isApplyARCreditLimit = String(applyArAccount).toUpperCase() === 'Y';
    return (
      <Row type="flex" justify="space-around" className={styles.downFileInformation}>
        <Col xs={24} sm={24} md={16} lg={20} xl={20} xxl={20} className={styles.topCol}>
          <Row type="flex" justify="space-around">
            <Col span={24} className={styles.topColCheckBoxMsg}>
              <Form.Item colon={false}>
                {getFieldDecorator('applyArAccount', {
                  valuePropName: 'checked',
                  initialValue: isApplyARCreditLimit || null,
                })(
                  <Checkbox
                    onChange={e => {
                      if (e.target.checked) {
                        onHandleToArCheckBox('applyArAccount', 'Y', 'applyArAccount');
                      } else {
                        onHandleToArCheckBox('applyArAccount', 'N', 'applyArAccount');
                      }
                    }}
                  >
                    <span className={styles.topColCheckBoxMsgTitle}>
                      <ul>
                        <li
                          style={{ fontSize: '16px', color: 'rgba(0,0,0, .85)', fontWeight: 600 }}
                        >
                          {formatMessage({ id: 'APPLY_AR_CREDIT_LIMIT' })}
                        </li>
                        <li style={{ color: 'rgba(0,0,0, .45)' }}>
                          {formatMessage({ id: 'APPLY_AR_CREDIT_LIMIT_NOTE' })}
                        </li>
                      </ul>
                    </span>
                  </Checkbox>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={8} lg={4} xl={4} xxl={4} className={styles.bottomCol}>
          <div className={styles.bottomColDiv}>
            <Button
              type="primary"
              disabled={!isApplyARCreditLimit}
              loading={aRCreditLoadingFlag}
              onClick={() => {
                const { path, fileNameList } = this.state;
                handleDownFile(
                  downUrl,
                  {
                    fileName: fileNameList[0],
                    filePath: path,
                    path,
                  },
                  fileNameList[0],
                  () => this.setState({ aRCreditLoadingFlag: true }),
                  () => this.setState({ aRCreditLoadingFlag: false })
                );
                handleDownFile(
                  downUrl,
                  {
                    fileName: fileNameList[1],
                    filePath: path,
                    path,
                  },
                  fileNameList[1],
                  () => this.setState({ aRCreditLoadingFlag: true }),
                  () => this.setState({ aRCreditLoadingFlag: false })
                );
              }}
            >
              {formatMessage({ id: 'DOWNLOAD_APPLICATION_FILE' })}
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}

export default ApplyARCreditToFrom;
