import React from 'react';
import { Button, Col, Form, Row, Table, Tooltip, Icon, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { router } from 'umi';
import styles from '../New/index.less';
import AddOfflinePLUModal from './AddOfflinePLUModal';
import PaginationComp from '../../../components/PaginationComp';
import { formatPrice } from '../../../utils/tools';

@Form.create()
@connect(({ commissionNew, detail }) => ({
  commissionNew,
  detail,
}))
class NewOfflineplu extends React.PureComponent {
  columns = [
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
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
      key: 'themeParkCode',
      render: text => this.showThemeParkName(text),
    },
    {
      title: 'Price',
      dataIndex: 'commodityPrice',
      render: text => {
        const timeText = text ? formatPrice(text) : '';
        return timeText ? (
          <div>
            <Tooltip title={timeText} placement="topLeft">
              {timeText}
            </Tooltip>
          </div>
        ) : null;
      },
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

  detailColumns = [
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
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
      key: 'themeParkCode',
      render: text => this.showThemeParkName(text),
    },
    {
      title: 'Price',
      dataIndex: 'commodityPrice',
      render: text => {
        const timeText = text ? formatPrice(text) : '';
        return timeText ? (
          <div>
            <Tooltip title={timeText} placement="topLeft">
              {timeText}
            </Tooltip>
          </div>
        ) : null;
      },
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
              <Icon
                type="delete"
                onClick={() => {
                  this.deleteSubPLU(record);
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch, tplId = null } = this.props;
    if (tplId !== null) {
      dispatch({
        type: 'commissionNew/queryBindingDetailList',
        payload: {
          tplId,
          usageScope: 'Offline',
        },
      });
    }
  }

  showThemeParkName = text => {
    const {
      commissionNew: { themeParkList },
    } = this.props;
    for (let i = 0; i < themeParkList.length; i += 1) {
      if (themeParkList[i].bookingCategoryCode === text) {
        return (
          <Tooltip
            placement="topLeft"
            title={
              <span style={{ whiteSpace: 'pre-wrap' }}>{themeParkList[i].bookingCategoryName}</span>
            }
          >
            <span>{themeParkList[i].bookingCategoryName}</span>
          </Tooltip>
        );
      }
    }
    return null;
  };

  delete = record => {
    const {
      commissionNew: {
        checkedList,
        offlinePLUPagination: { currentPage, pageSize },
      },
      dispatch,
    } = this.props;
    const filterCheckedList = checkedList.filter(item => {
      const { commoditySpecId } = item;
      return commoditySpecId !== record.commoditySpecId;
    });
    if ((currentPage - 1) * pageSize >= filterCheckedList.length && currentPage > 1) {
      dispatch({
        type: 'commissionNew/effectSave',
        payload: {
          offlinePLUPagination: {
            currentPage: currentPage - 1,
            pageSize,
          },
        },
      }).then(() => {
        setTimeout(() => {
          dispatch({
            type: 'commissionNew/changeOfflinePage',
            payload: {
              checkedList: filterCheckedList,
            },
          });
        }, 500);
      });
    } else {
      dispatch({
        type: 'commissionNew/changeOfflinePage',
        payload: {
          checkedList: filterCheckedList,
        },
      });
    }
  };

  deleteSubPLU = record => {
    const {
      commissionNew: { checkedList },
      dispatch,
    } = this.props;
    for (let i = 0; i < checkedList.length; i += 1) {
      if (record.proCommoditySpecId === checkedList[i].commoditySpecId) {
        for (let j = 0; j < checkedList[i].subCommodityList.length; j += 1) {
          if (record.commoditySpecId === checkedList[i].subCommodityList[j].commoditySpecId) {
            checkedList[i].subCommodityList.splice(j, 1);
            j -= 1;
          }
        }
      }
      if (
        checkedList[i].subCommodityList.length === 0 &&
        checkedList[i].selectedType === 'packagePLU'
      ) {
        checkedList.splice(i, 1);
        i -= 1;
      }
    }
    dispatch({
      type: 'commissionNew/changeOfflinePage',
      payload: {
        checkedList,
      },
    });
  };

  add = () => {
    const { dispatch, detail } = this.props;
    const { effectiveStartDate, effectiveEndDate, commissionType } = detail;

    if (effectiveStartDate && effectiveEndDate && commissionType) {
      dispatch({
        type: 'commissionNew/save',
        payload: {
          addPLUModal: true,
        },
      });
    } else {
      message.warning(
        'Please fill in basic commission rule information, such as name, effective period, commission type.'
      );
    }
  };

  handleOk = () => {
    const { handleOk } = this.props;
    handleOk();
  };

  cancel = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule',
    });
  };

  expandedRowRender = record => {
    const { subCommodityList } = record;
    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={subCommodityList}
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

  getRowSelectedClassName = (record, index) => {
    if (index === 0) {
      return styles.hideIcon;
    }
    if (record.subCommodityList.length === 0) {
      return styles.hideIcon;
    }
    return undefined;
  };

  render() {
    const {
      type,
      tplId,
      commissionNew: {
        addPLUModal,
        checkedList = [],
        offlinePLUPagination,
        displayOfflineList = [],
      },
    } = this.props;
    const { currentPage, pageSize: nowPageSize } = offlinePLUPagination;
    const pageOpts = {
      total: checkedList.length,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'commissionNew/effectSave',
          payload: {
            offlinePLUPagination: {
              currentPage: page,
              pageSize,
            },
          },
        }).then(() => {
          setTimeout(() => {
            dispatch({
              type: 'commissionNew/changeOfflinePage',
              payload: {
                checkedList,
              },
            });
          }, 500);
        });
      },
    };

    return (
      <div style={{ paddingTop: 15 }}>
        <Row>
          <Col className={styles.DetailTitle}>{formatMessage({ id: 'OFFLINE_PLU' })}</Col>
        </Row>
        <Row style={{ marginBottom: 40 }}>
          <Col span={24}>
            <Table
              size="small"
              columns={this.columns}
              rowKey={record => record.commoditySpecId}
              className={`tabs-no-padding ${styles.searchTitle}`}
              rowClassName={(record, index) => this.getRowSelectedClassName(record, index)}
              expandedRowRender={record => this.expandedRowRender(record)}
              pagination={false}
              dataSource={[
                {
                  key: 'addOption',
                  commoditySpecId: <a onClick={this.add}>+ Add</a>,
                  themeParkCode: '',
                  operation: '',
                },
              ].concat(displayOfflineList)}
            />
            <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
          </Col>
        </Row>
        {addPLUModal ? <AddOfflinePLUModal tplId={tplId} type={type} /> : null}
        <div className={styles.operateButtonDivStyle}>
          <Button style={{ marginRight: 8 }} onClick={this.cancel}>
            {formatMessage({ id: 'COMMON_CANCEL' })}
          </Button>
          <Button style={{ width: 60 }} onClick={this.handleOk} type="primary">
            {formatMessage({ id: 'COMMON_OK' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default NewOfflineplu;
