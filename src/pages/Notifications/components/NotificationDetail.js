import React, { PureComponent } from 'react';
import { Card, Col, Icon, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { getUrl, handleDownFile, isNvl } from '@/utils/utils';
import { showTableTitle } from '../utils/pubUtils';
import styles from '../index.less';

const downUrl = `${getUrl()}/common/downloadFile`;

class NotificationDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileTableLoadingFlag: false,
    };
    this.column = [
      {
        title: showTableTitle(formatMessage({ id: 'FILE' })),
        dataIndex: 'fileName',
        key: 'fileName',
        render: text => {
          return !isNvl(text) ? text : '-';
        },
      },
      {
        title: showTableTitle(formatMessage({ id: 'OPERATION' })),
        width: '20%',
        render: (text, record) => (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DOWNLOAD' })}>
              <Icon
                type="download"
                className={styles.iconClass}
                onClick={e => {
                  e.preventDefault();
                  handleDownFile(
                    downUrl,
                    {
                      fileName: record.fileRourceName,
                      filePath: record.filePath,
                    },
                    record.fileName,
                    () => this.setState({ fileTableLoadingFlag: true }),
                    () => this.setState({ fileTableLoadingFlag: false })
                  );
                }}
              />
            </Tooltip>
          </div>
        ),
      },
    ];
  }

  showHtml = htmlString => {
    const html = { __html: htmlString };
    return <div dangerouslySetInnerHTML={html} />;
  };

  render() {
    const { notificationInfo } = this.props;
    const { fileTableLoadingFlag } = this.state;
    if (notificationInfo.fileList && notificationInfo.fileList.length > 0) {
      notificationInfo.fileList.map(item =>
        Object.assign(item, { id: Number.parseInt(item.key, 10) })
      );
    }
    return (
      <Card
        title={notificationInfo.title || ''}
        className={`as-shadow no-border ${styles.detailCardClass}`}
      >
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.detailCardContentTop}>
            <span>{!isNvl(notificationInfo.createTime) ? notificationInfo.createTime : '-'}</span>
            <span>{notificationInfo.title}</span>
            <span>{notificationInfo.createBy}</span>
          </Col>
          <Col span={24}>
            <div className={styles.detailCardContent}>
              {this.showHtml(notificationInfo.content)}
            </div>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Table
              size="small"
              className={`tabs-no-padding ${styles.searchTitle}`}
              columns={this.column}
              rowKey={record => `notificationList${record.id}`}
              dataSource={notificationInfo.fileList || []}
              scroll={{ x: 660 }}
              loading={fileTableLoadingFlag}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default NotificationDetail;
