import React from 'react';
import router from 'umi/router';
import {
  Col,
  Form,
  Radio,
  Row,
  Button,
  Table,
  InputNumber,
  message,
  Tooltip,
  Icon,
  Card,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import SCREEN from '@/utils/screen';
import styles from '../../OnlineRule/New/index.less';
import AddOfflinePLUModal from '../components/AddOfflinePLUModal';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import PaginationComp from '@/pages/ProductManagement/components/PaginationComp';
import { changeThemeParkDisplay, formatPrice } from '../../../utils/tools';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
  colon: false,
};

@Form.create()
@connect(({ offlineNew, offline }) => ({
  offlineNew,
  offline,
}))
class OfflineNew extends React.PureComponent {
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
        const timeText = text || text === 0 ? formatPrice(text) : '';
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
        const timeText = text || text === 0 ? formatPrice(text) : '';
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
    const { dispatch } = this.props;
    dispatch({ type: 'offlineNew/queryThemeParks' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/resetData',
    });
  }

  showThemeParkName = text => {
    const {
      offlineNew: { themeParkList },
    } = this.props;
    const showThemeParks = changeThemeParkDisplay(text, themeParkList);
    if (showThemeParks !== null) {
      return (
        <Tooltip
          placement="topLeft"
          title={<span style={{ whiteSpace: 'pre-wrap' }}>{showThemeParks}</span>}
        >
          <span>{showThemeParks}</span>
        </Tooltip>
      );
    }
    return showThemeParks;
  };

  delete = record => {
    const {
      offlineNew: {
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
        type: 'offlineNew/effectSave',
        payload: {
          offlinePLUPagination: {
            currentPage: currentPage - 1,
            pageSize,
          },
        },
      }).then(() => {
        setTimeout(() => {
          dispatch({
            type: 'offlineNew/changeOfflinePage',
            payload: {
              checkedList: filterCheckedList,
            },
          });
        }, 500);
      });
    } else {
      dispatch({
        type: 'offlineNew/changeOfflinePage',
        payload: {
          checkedList: filterCheckedList,
        },
      });
    }
  };

  deleteSubPLU = record => {
    const {
      offlineNew: { checkedList },
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
      type: 'offlineNew/changeOfflinePage',
      payload: {
        checkedList,
      },
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/save',
      payload: {
        addPLUModal: true,
      },
    });
  };

  onClose = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OfflineRule',
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      offlineNew: {
        checkedList,
        commissionScheme,
        commissionAmountValue,
        commissionPercentageValue,
      },
    } = this.props;
    if (
      commissionScheme === 'Amount' &&
      (commissionAmountValue === null || commissionAmountValue === '')
    ) {
      message.warning('Commission amount is required.');
      return;
    }
    if (
      commissionScheme === 'Percentage' &&
      (commissionPercentageValue === null || commissionPercentageValue === '')
    ) {
      message.warning('Commission percentage is required.');
      return;
    }
    if (checkedList.length === 0) {
      message.warning('Select at least one PLU.');
      return;
    }
    let commissionValue2 = '';
    if (commissionScheme === 'Percentage') {
      const point = String(+commissionPercentageValue).indexOf('.') + 1;
      const count = String(+commissionPercentageValue).length - point;
      if (point > 0) {
        if (count === 1) {
          commissionValue2 = parseFloat(commissionPercentageValue / 100).toFixed(3);
        } else if (count === 2) {
          commissionValue2 = parseFloat(commissionPercentageValue / 100).toFixed(4);
        }
      }
      if (point === 0) {
        commissionValue2 = parseFloat(commissionPercentageValue / 100);
      }
    }
    dispatch({
      type: 'offlineNew/add',
      payload: {
        commissionType: 'Fixed',
        commissionScheme,
        commissionValue: commissionScheme === 'Amount' ? commissionAmountValue : commissionValue2,
        commodityList: checkedList,
        usageScope: 'Offline',
      },
    }).then(resultCode => {
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));
        this.onClose();
      } else {
        message.error(resultCode);
      }
    });
  };

  cancel = () => {
    router.push('/ProductManagement/CommissionRule/OfflineRule');
  };

  commissionSchemeChange = value => {
    const { dispatch } = this.props;
    if (value === 'Amount') {
      dispatch({
        type: 'offlineNew/save',
        payload: {
          commissionScheme: value,
          commissionPercentageValue: '',
        },
      });
    } else {
      dispatch({
        type: 'offlineNew/save',
        payload: {
          commissionScheme: value,
          commissionAmountValue: '',
        },
      });
    }
  };

  inputChange = (value, flag) => {
    const { dispatch } = this.props;
    if (flag === 'Amount') {
      dispatch({
        type: 'offlineNew/save',
        payload: {
          commissionAmountValue: value,
        },
      });
    } else if (flag === 'Percentage') {
      dispatch({
        type: 'offlineNew/save',
        payload: {
          commissionPercentageValue: value,
        },
      });
    }
  };

  expandedRowRender = record => {
    const { subCommodityList } = record;
    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={subCommodityList}
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
      location: {
        query: { type },
      },
    } = this.props;
    const title = [
      {
        name: formatMessage({ id: 'PRODUCT_MANAGEMENT' }),
      },
      {
        name: formatMessage({ id: 'COMMISSION_RULE_TITLE' }),
      },
      {
        name: formatMessage({ id: 'OFFLINE_FIXED_COMMISSION' }),
        href: '#/ProductManagement/CommissionRule/OfflineRule',
      },
      {
        name:
          type && type === 'edit'
            ? formatMessage({ id: 'COMMON_MODIFY' })
            : formatMessage({ id: 'COMMON_NEW' }),
      },
    ];

    const {
      offlineNew: {
        commissionScheme,
        commissionAmountValue,
        commissionPercentageValue,
        addPLUModal,
        checkedList = [],
        offlinePLUPagination,
        displayOfflineList = [],
      },
      location: {
        query: { offlineList },
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
          type: 'offlineNew/effectSave',
          payload: {
            offlinePLUPagination: {
              currentPage: page,
              pageSize,
            },
          },
        }).then(() => {
          setTimeout(() => {
            dispatch({
              type: 'offlineNew/changeOfflinePage',
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
        <MediaQuery minWidth={SCREEN.screenSm}>
          <BreadcrumbCompForPams title={title} />
        </MediaQuery>
        <div className={styles.pageTableCard}>
          <Card>
            <div className="title-header">
              <span>{formatMessage({ id: 'OFFLINE_FIXED_COMMISSION_RULE' })}</span>
            </div>
            <Form style={{ marginTop: 10 }}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'COMMISSION_SCHEMA' })}>
                <Radio.Group
                  value={commissionScheme}
                  onChange={e => this.commissionSchemeChange(e.target.value)}
                >
                  <Radio value="Amount">
                    {formatMessage({ id: 'COMMISSION_AMOUNT' })}
                    <InputNumber
                      value={commissionAmountValue}
                      style={{ marginLeft: '10px' }}
                      precision={2}
                      min={0}
                      formatter={value => `$ ${value}`}
                      parser={value => {
                        value = value.match(/\d+(\.\d{0,2})?/)
                          ? value.match(/\d+(\.\d{0,2})?/)[0]
                          : '';
                        return String(value);
                      }}
                      onChange={value => this.inputChange(value, 'Amount')}
                    />
                  </Radio>
                  <Radio value="Percentage" style={{ marginLeft: '30px' }}>
                    {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                    <InputNumber
                      value={commissionPercentageValue}
                      style={{ marginLeft: '10px' }}
                      formatter={value => `${value}%`}
                      min={0}
                      max={100}
                      parser={value => {
                        value = value.match(/\d+(\.\d{0,2})?/)
                          ? value.match(/\d+(\.\d{0,2})?/)[0]
                          : '';
                        return String(value);
                      }}
                      onChange={value => this.inputChange(value, 'Percentage')}
                    />
                  </Radio>
                </Radio.Group>
              </FormItem>
            </Form>
            <div className="title-header" style={{ marginTop: 10 }}>
              <span>{formatMessage({ id: 'BINDING' })}</span>
            </div>
            <div>
              <Row style={{ marginBottom: 50 }}>
                <Col span={24}>
                  <Table
                    style={{ marginTop: 10 }}
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
                        themeParkCode: ' ',
                        operation: '',
                      },
                    ].concat(displayOfflineList)}
                  />
                  <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
                </Col>
              </Row>
            </div>
            {addPLUModal ? <AddOfflinePLUModal offlineList={offlineList} /> : null}
            <div className={styles.operateButtonDivStyle}>
              <Button style={{ marginRight: 8 }} onClick={this.cancel}>
                {formatMessage({ id: 'COMMON_CANCEL' })}
              </Button>
              <Button style={{ width: 60 }} onClick={() => this.handleSubmit()} type="primary">
                {formatMessage({ id: 'COMMON_OK' })}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
export default OfflineNew;
