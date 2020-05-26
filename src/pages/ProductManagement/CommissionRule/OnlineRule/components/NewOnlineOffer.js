import React from 'react';
import { Col, Form, Icon, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../New/index.less';
import AddOnlinePLUModal from './AddOnlinePLUModal';
import PaginationComp from '../../../components/PaginationComp';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class NewOnlineOffer extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      dataIndex: 'commodityName',
      key: 'commodityName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OFFER_IDENTIFIER' }),
      dataIndex: 'commodityIdentifier',
      key: 'commodityIdentifier',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'OFFER_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
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

  subDetailColumns = [
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
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
              <Icon
                type="delete"
                onClick={() => {
                  this.deleteSubSubPLU(record);
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
    dispatch({ type: 'commissionNew/queryThemeParks' });
    if (tplId !== null) {
      dispatch({
        type: 'commissionNew/queryBindingDetailList',
        payload: {
          tplId,
          usageScope: 'Online',
        },
      });
    }
  }

  delete = record => {
    const {
      commissionNew: {
        checkedOnlineList,
        onlineOfferPagination: { currentPage, pageSize },
      },
      dispatch,
    } = this.props;
    const filterCheckedList = checkedOnlineList.filter(item => {
      const { commoditySpecId } = item;
      return commoditySpecId !== record.commoditySpecId;
    });
    if ((currentPage - 1) * pageSize >= filterCheckedList.length && currentPage > 1) {
      dispatch({
        type: 'commissionNew/effectSave',
        payload: {
          onlineOfferPagination: {
            currentPage: currentPage - 1,
            pageSize,
          },
        },
      }).then(() => {
        setTimeout(() => {
          dispatch({
            type: 'commissionNew/changeOnlinePage',
            payload: {
              checkedOnlineList: filterCheckedList,
            },
          });
        }, 500);
      });
    } else {
      dispatch({
        type: 'commissionNew/changeOnlinePage',
        payload: {
          checkedOnlineList: filterCheckedList,
        },
      });
    }
  };

  deleteSubPLU = record => {
    const {
      commissionNew: { checkedOnlineList },
      dispatch,
    } = this.props;
    for (let i = 0; i < checkedOnlineList.length; i += 1) {
      if (record.proCommoditySpecId === checkedOnlineList[i].commoditySpecId) {
        for (let j = 0; j < checkedOnlineList[i].subCommodityList.length; j += 1) {
          if (record.commoditySpecId === checkedOnlineList[i].subCommodityList[j].commoditySpecId) {
            checkedOnlineList[i].subCommodityList.splice(j, 1);
            j -= 1;
          }
        }
      }
      if (
        checkedOnlineList[i].subCommodityList.length === 0 &&
        checkedOnlineList[i].selectedType === 'offerPLU'
      ) {
        checkedOnlineList.splice(i, 1);
        i -= 1;
      }
    }
    dispatch({
      type: 'commissionNew/changeOnlinePage',
      payload: {
        checkedOnlineList,
      },
    });
  };

  deleteSubSubPLU = record => {
    const {
      commissionNew: { checkedOnlineList },
      dispatch,
    } = this.props;
    for (let i = 0; i < checkedOnlineList.length; i += 1) {
      if (record.proProCommoditySpecId === checkedOnlineList[i].commoditySpecId) {
        for (let j = 0; j < checkedOnlineList[i].subCommodityList.length; j += 1) {
          if (
            record.proCommoditySpecId === checkedOnlineList[i].subCommodityList[j].commoditySpecId
          ) {
            for (
              let k = 0;
              k < checkedOnlineList[i].subCommodityList[j].subCommodityList.length;
              k += 1
            ) {
              if (
                record.commoditySpecId ===
                checkedOnlineList[i].subCommodityList[j].subCommodityList[k].commoditySpecId
              ) {
                checkedOnlineList[i].subCommodityList[j].subCommodityList.splice(k, 1);
                k -= 1;
              }
            }
          }
          if (
            checkedOnlineList[i].subCommodityList[j].subCommodityList.length === 0 &&
            checkedOnlineList[i].subCommodityList[j].selectedType === 'packagePLU'
          ) {
            checkedOnlineList[i].subCommodityList.splice(j, 1);
            j -= 1;
          }
        }
      }
    }
    dispatch({
      type: 'commissionNew/changeOnlinePage',
      payload: {
        checkedOnlineList,
      },
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/save',
      payload: {
        addBindingModal: true,
      },
    });
  };

  subExpandedRowRender = record => {
    const { subCommodityList } = record;
    return (
      <div>
        <Table
          size="small"
          columns={this.subDetailColumns}
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

  expandedRowRender = record => {
    const { subCommodityList } = record;
    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
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

  render() {
    const {
      type,
      tplId = null,
      commissionNew: {
        addBindingModal,
        checkedOnlineList = [],
        onlineOfferPagination,
        displayOnlineList = [],
      },
    } = this.props;
    const { currentPage, pageSize: nowPageSize } = onlineOfferPagination;
    const pageOpts = {
      total: checkedOnlineList.length,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'commissionNew/effectSave',
          payload: {
            onlineOfferPagination: {
              currentPage: page,
              pageSize,
            },
          },
        }).then(() => {
          setTimeout(() => {
            dispatch({
              type: 'commissionNew/changeOnlinePage',
              payload: {
                checkedOnlineList,
              },
            });
          }, 500);
        });
      },
    };

    return (
      <Form onSubmit={this.commit}>
        <div style={{ paddingTop: 15 }}>
          <Row>
            <Col className={styles.commissionTitle}>{formatMessage({ id: 'BINDING' })}</Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col className={styles.DetailTitle}>{formatMessage({ id: 'ONLINE_OFFER' })}</Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                size="small"
                columns={this.columns}
                className={`tabs-no-padding ${styles.searchTitle}`}
                pagination={false}
                rowClassName={(_, index) => (index === 0 ? styles.hideIcon : undefined)}
                expandedRowRender={record => this.expandedRowRender(record)}
                dataSource={[
                  {
                    key: 'addOption',
                    commodityName: <a onClick={() => this.add()}>+ Add</a>,
                    commodityIdentifier: '',
                    operation: '',
                  },
                ].concat(displayOnlineList)}
              />
              <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
            </Col>
          </Row>
          {addBindingModal ? <AddOnlinePLUModal tplId={tplId} type={type} /> : null}
        </div>
      </Form>
    );
  }
}

export default NewOnlineOffer;
