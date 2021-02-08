import React from 'react';
import { Col, Form, Icon, Row, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../New/index.less';
import AddOnlinePLUModal from './AddOnlinePLUModal';
import PaginationComp from '../../../components/PaginationComp';

@Form.create()
@connect(({ commissionNew, detail }) => ({
  commissionNew,
  detail,
}))
class NewOnlineOffer extends React.PureComponent {
  state = {
    expandedRowKeys: [],
  };

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
          this.filterTaFileList();
        }, 500);
      });
    } else {
      dispatch({
        type: 'commissionNew/changeOnlinePage',
        payload: {
          checkedOnlineList: filterCheckedList,
        },
      });
      this.filterTaFileList();
    }
  };

  filterTaFileList = async () => {
    const {
      dispatch,
      commissionNew: {
        excludedTA: { excludedTAList },
      },
    } = this.props;
    const taAddInfoList = await dispatch({
      type: 'commissionNew/queryAgentOfferBindingList',
      payload: {
        pageBean: {
          currentPage: 1,
          pageSize: 1000,
        },
      },
    });

    if (Array.isArray(taAddInfoList)) {
      const taAddInfoListId = taAddInfoList.map(i => i.taId);
      const excludedTAListFilter = excludedTAList.filter(i => taAddInfoListId.includes(i.taId));
      dispatch({
        type: 'commissionNew/saveExcludedTA',
        payload: {
          excludedTAList: excludedTAListFilter,
        },
      });
    }
  };

  deleteSubPLU = record => {
    let {
      commissionNew: { checkedOnlineList },
      dispatch,
    } = this.props;
    if (Array.isArray(checkedOnlineList)) {
      checkedOnlineList = checkedOnlineList.filter(item => {
        let bool = true;
        // if (record.proCommoditySpecId !== item.commoditySpecId) {
        //   return bool
        // }
        // if(!(Array.isArray(item.subCommodityList) && item.subCommodityList.length)) {
        //   return bool
        // }
        if (!item.subCommodityListNull) {
          item.subCommodityList = item.subCommodityList.filter(item2 => {
            let bool2 = true;
            if (!item2.subCommodityListNull) {
              item2.subCommodityList = item2.subCommodityList.filter(item3 => {
                return record.commoditySpecId !== item3.commoditySpecId;
              });
              bool2 = item2.subCommodityList.length > 0;
            }
            if (bool2) {
              bool2 = record.commoditySpecId !== item2.commoditySpecId;
            }
            return bool2;
          });
          bool = item.subCommodityList.length > 0;
        }
        if (!bool) {
          const { expandedRowKeys } = this.state;
          this.setState(() => ({
            expandedRowKeys: expandedRowKeys.filter(e => e !== item.commoditySpecId),
          }));
        }
        return bool;
      });
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
    // if(Array.isArray(checkedOnlineList)){
    //   checkedOnlineList = checkedOnlineList.filter(item => {
    //     let bool = true
    //     item.subCommodityList = item.subCommodityList.filter(i => {
    //       // return
    //       // return record.commoditySpecId !== i.commoditySpecId
    //         i.subCommodityList = i.subCommodityList.filter(k => {
    //           console.log(record, k.commoditySpecId)
    //
    //           if (record.commoditySpecId !== k.commoditySpecId) {
    //             return bool
    //           }
    //           // if(!(Array.isArray(k.subCommodityList) && k.subCommodityList.length)) {
    //           //   return bool
    //           // }
    //           // k.subCommodityList = k.subCommodityList.filter(i => {
    //           //   return record.commoditySpecId !== i.commoditySpecId
    //           // })
    //           // bool = item.subCommodityList.length > 0; return bool
    //           // return record.commoditySpecId !== k.commoditySpecId
    //           // return record.commoditySpecId !== k.commoditySpecId
    //           // if (record.proCommoditySpecId !== k.commoditySpecId) {
    //           //   return bool
    //           // }
    //           // if(!(Array.isArray(item.subCommodityList) && k.subCommodityList.length)) {
    //           //   return bool
    //           // }
    //         })
    //     })
    //     // bool = item.subCommodityList.length > 0; return bool
    //     // if (!bool) {
    //     //   const { expandedRowKeys } = this.state
    //     //   this.setState(() => ({ expandedRowKeys: expandedRowKeys.filter(e => e !== item.commoditySpecId) }))
    //     // }
    //     // return true
    //   })
    // }
    dispatch({
      type: 'commissionNew/changeOnlinePage',
      payload: {
        checkedOnlineList,
      },
    });
  };

  add = () => {
    const { add } = this.props;
    add();
  };

  subExpandedRowRender = record => {
    const { subCommodityList } = record;
    return subCommodityList.length > 0 ? (
      <Table
        size="small"
        rowKey={(_, i) => i}
        columns={this.subDetailColumns}
        dataSource={subCommodityList}
        rowClassName={rec =>
          rec.subCommodityList === null || rec.subCommodityList.length === 0
            ? styles.hideIcon
            : undefined
        }
        pagination={false}
        bordered={false}
      />
    ) : null;
  };

  expandedRowRender = record => {
    const { subCommodityList } = record;
    return subCommodityList.length > 0 ? (
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
    ) : null;
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
                rowKey="commoditySpecId"
                columns={this.columns}
                className={`tabs-no-padding ${styles.searchTitle}`}
                pagination={false}
                expandedRowKeys={this.state.expandedRowKeys}
                onExpand={(bool, record) => {
                  let { expandedRowKeys } = this.state;
                  if (bool) {
                    expandedRowKeys = expandedRowKeys.concat(record.commoditySpecId);
                  } else {
                    expandedRowKeys = expandedRowKeys.filter(e => e !== record.commoditySpecId);
                  }
                  this.setState({ expandedRowKeys });
                }}
                rowClassName={(record, index) => this.getRowSelectedClassName(record, index)}
                expandedRowRender={record => this.expandedRowRender(record)}
                dataSource={[
                  {
                    key: 'addOption',
                    commodityName: <a onClick={this.add}>+ Add</a>,
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
