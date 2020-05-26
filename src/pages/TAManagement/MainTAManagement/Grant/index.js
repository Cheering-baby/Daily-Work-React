import React from 'react';
import { Tooltip, Button, Col, Row, Table, Card, Icon, message, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import styles from './index.less';
import SCREEN from '../../../../utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import AddOfferModal from '../components/AddOfferModal';
import PaginationComp from '@/pages/ProductManagement/components/PaginationComp';
import { objDeepCopy } from '../../utils/tools';
import { isNvl } from '@/utils/utils';

@connect(({ grant, loading }) => ({
  grant,
  loading: loading.effects['grant/fetch'],
  pluLoading: loading.effects['grant/queryCommodityBindingList'],
}))
class NewGrant extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      dataIndex: 'bindingName',
      key: 'bindingName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OFFER_IDENTIFIER' }),
      dataIndex: 'bindingIdentifier',
      key: 'bindingIdentifier',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OFFER_DESCRIPTION' }),
      dataIndex: 'bindingDescription',
      key: 'bindingDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
      render: (text, record) => {
        return record && !record.key && record.key !== 'addOption' ? (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
              <Icon
                type="delete"
                onClick={() => {
                  this.delete(record);
                }}
              />
            </Tooltip>
          </div>
        ) : null;
      },
    },
  ];

  pluColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commoditySpecId',
      key: 'commoditySpecId',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'COMMISSION' }),
      render: (text, record) => {
        return (
          <div>
            <Popover trigger="click" placement="left" content={this.getContent(record)}>
              <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
                <Icon type="eye" />
              </Tooltip>
            </Popover>
          </div>
        );
      },
    },
  ];

  subPluColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commoditySpecId',
      key: 'commoditySpecId',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'COMMISSION' }),
      render: (text, record) => {
        return (
          <div>
            <Popover trigger="click" placement="left" content={this.getContent(record)}>
              <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
                <Icon type="eye" />
              </Tooltip>
            </Popover>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { taIdList },
      },
    } = this.props;
    const newTaIdList = taIdList.split(',');
    if (newTaIdList.length === 1) {
      dispatch({
        type: 'grant/fetch',
        payload: {
          agentId: newTaIdList[0],
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'grant/clear',
    });
  }

  delete = record => {
    const {
      grant: {
        checkedList,
        grantPagination: { currentPage, pageSize },
      },
      dispatch,
    } = this.props;
    const filterCheckedList = checkedList.filter(item => {
      const { bindingId } = item;
      return bindingId !== record.bindingId;
    });
    if ((currentPage - 1) * pageSize >= filterCheckedList.length && currentPage > 1) {
      dispatch({
        type: 'grant/effectSave',
        payload: {
          grantPagination: {
            currentPage: currentPage - 1,
            pageSize,
          },
        },
      }).then(() => {
        setTimeout(() => {
          dispatch({
            type: 'grant/changePage',
            payload: {
              checkedList: filterCheckedList,
            },
          });
        }, 500);
      });
    } else {
      dispatch({
        type: 'grant/changePage',
        payload: {
          checkedList: filterCheckedList,
        },
      });
    }
  };

  getTieredColumns = commissionScheme => {
    return [
      {
        title: formatMessage({ id: 'TIERED_COMMISSION_TIER' }),
        key: 'tieredCommissionTier',
        render: (text, record) => {
          const { minimum, maxmum } = record;
          return (
            <Tooltip
              placement="topLeft"
              title={
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  {minimum} ~ {maxmum}
                </span>
              }
            >
              <span>
                {minimum} ~ {maxmum}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
        key: 'commissionScheme',
        render: (text, record) => {
          const { commissionValue } = record;
          if (commissionScheme === 'Amount') {
            return (
              <Tooltip
                placement="topLeft"
                title={<span style={{ whiteSpace: 'pre-wrap' }}>${commissionValue} / Ticket</span>}
              >
                <span>${commissionValue} / Ticket</span>
              </Tooltip>
            );
          }
          if (commissionScheme === 'Percentage') {
            return (
              <Tooltip
                placement="topLeft"
                title={<span style={{ whiteSpace: 'pre-wrap' }}>{commissionValue}%</span>}
              >
                <span>{commissionValue}%</span>
              </Tooltip>
            );
          }
        },
      },
    ];
  };

  getAttendanceColumns = commissionScheme => {
    return [
      {
        title: formatMessage({ id: 'ATTENDANCE_COMMISSION_TIER' }),
        key: 'attendanceCommissionTier',
        render: (text, record) => {
          const { minimum, maxmum } = record;
          return (
            <Tooltip
              placement="topLeft"
              title={
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  {minimum} ~ {maxmum}
                </span>
              }
            >
              <span>
                {minimum} ~ {maxmum}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
        key: 'commissionScheme',
        render: (text, record) => {
          const { commissionValue } = record;
          if (commissionScheme === 'Amount') {
            return (
              <Tooltip
                placement="topLeft"
                title={<span style={{ whiteSpace: 'pre-wrap' }}>${commissionValue} / Ticket</span>}
              >
                <span>${commissionValue} / Ticket</span>
              </Tooltip>
            );
          }
          if (commissionScheme === 'Percentage') {
            return (
              <Tooltip
                placement="topLeft"
                title={<span style={{ whiteSpace: 'pre-wrap' }}>{commissionValue}%</span>}
              >
                <span>{commissionValue}%</span>
              </Tooltip>
            );
          }
        },
      },
    ];
  };

  showFixedCommission = contentValue => {
    const child = [];
    for (let i = 0; i < contentValue.length; i += 1) {
      const {
        title,
        value: { commissionScheme, effectiveDate, expiryDate, tieredList = [] },
      } = contentValue[i];
      if (title === 'Tiered') {
        child.push(
          <div style={{ marginTop: 10 }}>
            <Col span={8} className={styles.drawerBlackText}>
              {formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
            </Col>
            <Col span={16}>
              <span>{commissionScheme}</span>
            </Col>
            <Col span={8} className={styles.drawerBlackText}>
              {formatMessage({ id: 'EFFECTIVE_PERIOD' })}
            </Col>
            <Col span={16}>
              <span>
                {!isNvl(effectiveDate) ? `${moment(effectiveDate).format('DD-MMM-YYYY')} ~` : '-'}
                {!isNvl(expiryDate) ? moment(expiryDate).format('DD-MMM-YYYY') : '-'}
              </span>
            </Col>
            <Col span={24}>
              <Table
                style={{ marginBottom: 10 }}
                size="small"
                dataSource={tieredList}
                columns={this.getTieredColumns(commissionScheme)}
                className={`tabs-no-padding ${styles.searchTitle}`}
                pagination={false}
              />
            </Col>
          </div>
        );
      }
    }
    return child;
  };

  showAttendanceCommission = contentValue => {
    const child = [];
    for (let i = 0; i < contentValue.length; i += 1) {
      const {
        title,
        value: { commissionScheme, effectiveDate, expiryDate, tieredList = [] },
      } = contentValue[i];
      if (title === 'Attendance') {
        child.push(
          <div style={{ marginTop: 10 }}>
            <Col span={8} className={styles.drawerBlackText}>
              {formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
            </Col>
            <Col span={16}>
              <span>{commissionScheme}</span>
            </Col>
            <Col span={8} className={styles.drawerBlackText}>
              {formatMessage({ id: 'EFFECTIVE_PERIOD' })}
            </Col>
            <Col span={16}>
              <span>
                {!isNvl(effectiveDate) ? `${moment(effectiveDate).format('DD-MMM-YYYY')} ~` : '-'}
                {!isNvl(expiryDate) ? moment(expiryDate).format('DD-MMM-YYYY') : '-'}
              </span>
            </Col>
            <Col span={24}>
              <Table
                style={{ marginBottom: 10 }}
                size="small"
                dataSource={tieredList}
                columns={this.getAttendanceColumns(commissionScheme)}
                className={`tabs-no-padding ${styles.searchTitle}`}
                pagination={false}
              />
            </Col>
          </div>
        );
      }
    }
    return child;
  };

  getContent = record => {
    const { commissionList = {} } = record;
    const contentValue = [];
    for (const key in commissionList) {
      let title = 'Attendance';
      if (key.length >= 5 && key.substr(0, 5) === 'Fixed') {
        title = 'Fixed';
      }
      if (key.length >= 6 && key.substr(0, 6) === 'Tiered') {
        title = 'Tiered';
      }
      contentValue.push({
        title,
        value: commissionList[key],
      });
    }

    return (
      <div className={styles.contentDiv}>
        <Row>
          <Col span={24}>
            <span className={styles.DetailTitle}>{formatMessage({ id: 'FIXED_COMMISSION' })}</span>
          </Col>
          <Col span={24} style={{ paddingTop: '10px' }}>
            <span className={styles.DetailTitle}>
              {formatMessage({ id: 'TIERED_COMMISSION_TITLE' })}
            </span>
          </Col>
          {this.showFixedCommission(contentValue)}
          <Col span={24} style={{ paddingTop: '10px' }}>
            <span className={styles.DetailTitle}>
              {formatMessage({ id: 'ATTENDANCE_COMMISSION_TITLE' })}
            </span>
          </Col>
          {this.showAttendanceCommission(contentValue)}
        </Row>
      </div>
    );
  };

  add = () => {
    const {
      dispatch,
      grant: { bindingList },
    } = this.props;
    let arr = cloneDeep(bindingList);
    const isExist = arr.find(({ type }) => type === 'ADD_ROW');
    if (!isExist) {
      arr = [{ type: 'ADD_ROW' }, ...arr];
    }

    dispatch({
      type: 'grant/save',
      payload: {
        addOfferModal: true,
        bindingList: arr,
      },
    });
  };

  cancel = () => {
    router.push(`/TAManagement/MainTAManagement`);
  };

  jumpToMainTA = () => {
    router.push(`/MainTAManagement/Grant`);
  };

  handleSubmit = () => {
    const {
      dispatch,
      grant: { checkedList },
      location: {
        query: { taIdList },
      },
    } = this.props;
    // if (checkedList.length === 0) {
    //   message.warning('Please select at least one offer.');
    //   return false;
    // }
    dispatch({
      type: 'grant/add',
      payload: {
        checkedList,
        agentList: taIdList.split(','),
        bindingType: 'Offer',
      },
    }).then(resultCode => {
      if (resultCode === '0') {
        router.push('/TAManagement/MainTAManagement');
        message.success(formatMessage({ id: 'COMMON_MODIFY_SUCCESSFULLY' }));
      }
    });
  };

  openRow = (record, subPLUList) => {
    const { dispatch } = this.props;
    const { bindingId } = record;
    let flag = true;
    for (let i = 0; i < subPLUList.length; i += 1) {
      if (subPLUList[i].commoditySpecId === bindingId) {
        flag = false;
      }
    }
    if (flag) {
      dispatch({
        type: 'grant/queryCommodityBindingList',
        payload: {
          commoditySpecId: bindingId,
        },
      });
    }
  };

  subExpandedRowRender = record => {
    const { subCommodityList } = record;
    return (
      <div>
        <Table
          size="small"
          columns={this.subPluColumns}
          dataSource={subCommodityList}
          expandedRowRender={rec => this.subExpandedRowRender(rec)}
          rowClassName={rec =>
            rec.subCommodityList === null || rec.subCommodityList.length === 0
              ? styles.hideIcon
              : undefined
          }
          pagination={false}
          bordered={false}
        />
      </div>
    );
  };

  expandedRowRender = (record, subPLUList, pluLoading) => {
    const { bindingId } = record;
    let pluDateSource = [];
    for (let i = 0; i < subPLUList.length; i += 1) {
      if (subPLUList[i].commoditySpecId === bindingId) {
        pluDateSource = objDeepCopy(subPLUList[i].subCommodityList);
      }
    }
    return (
      <div>
        <Table
          size="small"
          columns={this.pluColumns}
          dataSource={pluDateSource}
          pagination={false}
          bordered={false}
          loading={!!pluLoading}
          expandedRowRender={rec => this.subExpandedRowRender(rec)}
          rowClassName={rec =>
            rec.subCommodityList === null || rec.subCommodityList.length === 0
              ? styles.hideIcon
              : undefined
          }
        />
      </div>
    );
  };

  render() {
    const {
      loading,
      pluLoading,
      grant: {
        addOfferModal,
        checkedList,
        grantPagination,
        displayGrantOfferList = [],
        subPLUList = [],
      },
    } = this.props;

    const { currentPage, pageSize: nowPageSize } = grantPagination;
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MAIN_MANAGEMENT' }),
        url: '/TAManagement/MainTAManagement',
      },
      {
        breadcrumbName: formatMessage({ id: 'NEW_GRANT' }),
        url: null,
      },
    ];
    const pageOpts = {
      total: checkedList.length,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'grant/effectSave',
          payload: {
            grantPagination: {
              currentPage: page,
              pageSize,
            },
          },
        }).then(() => {
          setTimeout(() => {
            dispatch({
              type: 'grant/changePage',
              payload: {
                checkedList,
              },
            });
          }, 500);
        });
      },
    };

    return (
      <div>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <Card className={styles.cardClass}>
          <div style={{ padding: 15 }}>
            <Row>
              <Col className={styles.DetailTitle}>{formatMessage({ id: 'NEW_GRANT' })}</Col>
            </Row>
            <Row style={{ marginBottom: 40 }}>
              <Col span={24}>
                <Table
                  size="small"
                  dataSource={[
                    {
                      key: 'addOption',
                      bindingName: <a onClick={() => this.add()}>+ Add</a>,
                    },
                  ].concat(displayGrantOfferList)}
                  columns={this.columns}
                  className={`tabs-no-padding ${styles.searchTitle}`}
                  rowClassName={(_, index) => (index === 0 ? styles.hideIcon : undefined)}
                  pagination={false}
                  loading={loading}
                  expandedRowRender={record =>
                    this.expandedRowRender(record, subPLUList, pluLoading)
                  }
                  onExpand={(_, record) => this.openRow(record, subPLUList)}
                />
                <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
              </Col>
            </Row>
            {addOfferModal ? <AddOfferModal /> : null}
            <div className={styles.operateButtonDivStyle}>
              <Button
                style={{ marginRight: 8 }}
                onClick={() => {
                  this.cancel();
                }}
              >
                {formatMessage({ id: 'COMMON_CANCEL' })}
              </Button>
              <Button style={{ width: 60 }} onClick={this.handleSubmit} type="primary">
                {formatMessage({ id: 'COMMON_OK' })}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default NewGrant;
