import React, { PureComponent } from 'react';
import { Badge, Card, Col, Icon, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
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
        dataIndex: 'fileSourceName',
        key: 'fileSourceName',
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
                      fileName: record.fileName,
                      filePath: record.filePath,
                    },
                    record.fileSourceName,
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

  getReceiverArray = targetList => {
    let text = '';
    if (targetList && targetList.length > 0) {
      targetList.map((target, index) => {
        if (index === 0) {
          text += !isNvl(target.targetObjName) ? `${target.targetObjName}` : '';
        } else {
          text += !isNvl(target.targetObjName) ? `,${target.targetObjName}` : '';
        }
        return target;
      });
    }
    return !isNvl(text) ? (
      <span>
        <Tooltip title={text}>{text}</Tooltip>
      </span>
    ) : null;
  };

  getStatus = status => {
    let statusStr;
    let statusTxt;
    // 01: Draft
    // 02: Pending (Schedule Release)
    // 03: Published
    switch (String(status).toLowerCase()) {
      case '01':
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'NOTICE_STATUS_DRAFT' });
        break;
      case '02':
        statusStr = 'success';
        statusTxt = formatMessage({ id: 'NOTICE_STATUS_PUBLISHED' });
        break;
      case '03':
        statusStr = 'warning';
        statusTxt = formatMessage({ id: 'NOTICE_STATUS_PENDING' });
        break;
      default:
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'NOTICE_STATUS_DRAFT' });
        break;
    }
    return <Badge status={statusStr} text={statusTxt || null} />;
  };

  render() {
    const { notificationInfo, isAdminRoleFlag = false } = this.props;
    const { fileTableLoadingFlag } = this.state;
    if (notificationInfo.fileList && notificationInfo.fileList.length > 0) {
      notificationInfo.fileList.map(item =>
        Object.assign(item, { id: Number.parseInt(item.key, 10) })
      );
    }
    return (
      <Card
        title={notificationInfo.title || ''}
        extra={
          notificationInfo.subType === '01' ? (
            <span>{this.getStatus(notificationInfo.status)}</span>
          ) : null
        }
        className={`as-shadow no-border ${styles.detailCardClass}`}
      >
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.detailCardContentTop}>
            {!isNvl(notificationInfo.scheduleDate) ? (
              <span>{moment(notificationInfo.scheduleDate).format('DD-MMM-YYYY HH:mm:ss')}</span>
            ) : null}
            {isAdminRoleFlag ? <span>{notificationInfo.createBy}</span> : null}
          </Col>
          {notificationInfo.subType === '01' ? (
            <Col span={24} className={styles.detailCardContentTop}>
              <span style={{ marginRight: '10px' }}>
                {formatMessage({ id: 'REASON_SCOPE_ROLE' })} :{' '}
              </span>
              {this.getReceiverArray(notificationInfo.targetList)}
            </Col>
          ) : null}
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
