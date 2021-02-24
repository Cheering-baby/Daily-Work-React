import React from 'react';
import { connect } from 'dva';
import { Col, Form, Row, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../Detail/$detail/index.less';
import { isNvl } from '@/utils/utils';
import { toThousands } from '../../../utils/tools';

@Form.create()
@connect(({ detail, loading }) => ({
  detail,
  loading: loading.effects['detail/queryDetail'],
}))
class DetailForCommission extends React.PureComponent {
  columns = [
    {
      title: () => this.showCommissionTierTitle(),
      dataIndex: 'minimum',
      render: (text, record) => (
        <span>
          {+record.maxmum === 0 ? `${record.minimum}-` : `${record.minimum}~${record.maxmum}`}
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'COMMISSION_SCHEMA' }),
      dataIndex: 'commissionValue',
      render: text => this.showCommission(text),
    },
  ];

  showCommissionTierTitle = () => {
    const {
      detail: { commisssionList },
    } = this.props;
    const { commissionType = '' } = commisssionList;
    if (commissionType === 'Tiered') {
      return formatMessage({ id: 'TIERED_COMMISSION_TIER' });
    }
    if (commissionType === 'Attendance') {
      return formatMessage({ id: 'ATTENDANCE_COMMISSION_TIER' });
    }
    return formatMessage({ id: 'TIERED_COMMISSION_TIER' });
  };

  showCommission = text => {
    const {
      detail: {
        commisssionList: { commissionScheme },
      },
    } = this.props;
    if (commissionScheme === 'Amount') {
      return <span>{`$ ${toThousands(text)} / Ticket`}</span>;
    }
    if (commissionScheme === 'Percentage') {
      return <span>{`${toThousands(text)}% / Ticket`}</span>;
    }
    return null;
  };

  showCommissionType = commisssionList => {
    const { commissionType = '' } = commisssionList;
    if (commissionType) {
      if (commissionType === 'Tiered') {
        return <span>{formatMessage({ id: 'TIERED_COMMISSION' })}</span>;
      }
      if (commissionType === 'Attendance') {
        return <span>{formatMessage({ id: 'ATTENDANCE_COMMISSION' })}</span>;
      }
    }
    return <span>-</span>;
  };

  render() {
    const {
      detail: { commisssionList, tieredList },
      loading,
    } = this.props;
    return (
      <div>
        <Col lg={24} md={24} id="detailForTieredCommission">
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <span className={styles.commissionTitle}>{formatMessage({ id: 'COMMISSION' })}</span>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'COMMISSION_CREATED_BY' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {!isNvl(commisssionList.createStaff) && commisssionList.createStaff !== 'null'
                        ? commisssionList.createStaff
                        : '-'}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'COMMISSION_CREATED_TIME' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {!isNvl(commisssionList.createTime)
                        ? moment(commisssionList.createTime).format('DD-MMM-YYYY')
                        : '-'}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'PRODUCT_COMMISSION_NAME' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {!isNvl(commisssionList.commissionName) &&
                      commisssionList.commissionName !== 'null'
                        ? commisssionList.commissionName
                        : '-'}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    {this.showCommissionType(commisssionList)}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'EFFECTIVE_PERIOD' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {!isNvl(commisssionList.effectiveDate)
                        ? `${moment(commisssionList.effectiveDate).format('DD-MMM-YYYY')} ~`
                        : '-'}
                      {!isNvl(commisssionList.expiryDate)
                        ? moment(commisssionList.expiryDate).format('DD-MMM-YYYY')
                        : '-'}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'CALCULATION_CYCLE' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {!isNvl(commisssionList.caluculateCycle) &&
                      commisssionList.caluculateCycle !== 'null'
                        ? commisssionList.caluculateCycle
                        : '-'}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ paddingTop: '14px' }}>
            <Col span={24}>
              <Table
                rowKey={record => record.tplId}
                size="small"
                columns={this.columns}
                dataSource={tieredList}
                className={`tabs-no-padding ${styles.searchTitle}`}
                loading={!!loading}
                pagination={false}
              />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}
export default DetailForCommission;
