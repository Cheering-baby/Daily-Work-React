import React, { Fragment } from 'react';
import { Tooltip, Button, Col, Popconfirm, Form, Row, Table, Card, Icon, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import { cloneDeep } from 'lodash';
import styles from './index.less';
import SCREEN from '../../../../utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import AddOfferModal from '../components/AddOfferModal';
import { commonConfirm } from '@/components/CommonModal';

const FormItem = Form.Item;
@Form.create()
@connect(({ grant, loading }) => ({
  grant,
  loading: loading.effects['grant/fetchAgentBindingList'],
}))
class NewGrant extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      dataIndex: 'bindingName',
    },
    {
      title: formatMessage({ id: 'OFFER_IDENTIFIER' }),
      dataIndex: 'bindingIdentifier',
    },
  ];

  pluColumns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'bindingCode',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'bindingDescription',
    },
    {
      title: formatMessage({ id: 'COMMISSION' }),
      dataIndex: 'subBinding',
      render: (text, record, idx) => {
        if (idx > 0 && text) {
          return (
            <Popconfirm
              title={this.addModelTitle}
              overlayClassName={styles.popClass}
              icon={null}
              // onVisibleChange={this.onVisibleChange}
              placement="leftTop"
              okText={null}
            >
              <div>
                <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
                  <Icon
                    type="eye"
                    onClick={() => {
                      // this.detail('eye', record);
                    }}
                  />
                </Tooltip>
              </div>
            </Popconfirm>
          );
        }
      },
    },
  ];

  tieredColumns = [
    {
      title: formatMessage({ id: 'TIERED_COMMISSION_TIER' }),
      key: 'offerName',
      dataIndex: 'offerName',
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      key: 'offerIdentify',
      dataIndex: 'offerIdentify',
    },
  ];

  attendanceColumns = [
    {
      title: formatMessage({ id: 'ATTENDANCE_COMMISSION_TIER' }),
      key: 'attendanceCommissionTier',
      dataIndex: 'attendanceCommissionTier',
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      key: 'commissionScheme',
      dataIndex: 'commissionScheme',
    },
  ];

  addModelTitle = (
    <div>
      <Row>
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'FIXED_COMMISSION' })}</span>
        </Col>
        <Col span={8} className={styles.drawerBlackText}>
          {formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
        </Col>
        <Col span={16}>
          <span>qwe wq</span>
        </Col>

        <Col span={24} style={{ paddingTop: '10px' }}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'TIERED_COMMISSION' })}</span>
        </Col>
        <Col span={24}>
          <Table
            size="small"
            // dataSource={roomTypeConfigList}
            columns={this.tieredColumns}
            className={`tabs-no-padding ${styles.searchTitle}`}
            pagination={false}
          />
        </Col>

        <Col span={24} style={{ paddingTop: '10px' }}>
          <span className={styles.DetailTitle}>
            {formatMessage({ id: 'ATTENDANCE_COMMISSION' })}
          </span>
        </Col>
        <Col span={24}>
          <Table
            size="small"
            // dataSource={transform2List}
            columns={this.attendanceColumns}
            className={`tabs-no-padding ${styles.searchTitle}`}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { rowAllSelected },
      },
    } = this.props;

    dispatch({
      type: 'grant/fetchAgentBindingList',
      payload: {
        agentId: rowAllSelected && rowAllSelected.taId ? rowAllSelected.taId : '',
        bindingType: 'Offer',
      },
    });
  }

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

  onChangeEvent = pagination => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    dispatch({
      type: 'grant/save',
      payload: {
        currentPage: current,
        pageSize,
        expandedRowKeys: [],
      },
    }).then(() => {
      dispatch({
        type: 'grant/fetchOfferList',
      });
    });
  };

  jumpToMainTA = () => {
    router.push(`/MainTAManagement/Grant`);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const resCb = response => {
      if (response === 'SUCCESS') {
        message.success('Added successfully.');
        this.jumpToMainTA();
      } else if (response === 'ERROR') {
        message.error('Failed to add.');
      }
    };
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      commonConfirm({
        content: `Confirm to New ?`,
        onOk: () => {
          // Object.entries(values).forEach(([k, v]) => {
          //   // if (k === 'arAccountCommencementDate' && v) {
          //   //   values[k] = v.format('YYYY-MM-DD');
          //   // }
          // });
          dispatch({
            type: 'grant/addMappingList',
            payload: {
              params: values,
            },
          }).then(resCb);
        },
      });
    });
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      loading,
      grant: { addOfferModal, bindingList, currentPage, pageSize, totalSize },
      location: {
        query: { rowAllSelected },
      },
      form: { getFieldDecorator },
    } = this.props;
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
    const pagination = {
      current: currentPage,
      pageSize,
      total: totalSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['20', '50', '100'],
      showTotal: this.showTotal,
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
          <Fragment>
            <Form onSubmit={this.handleSubmit}>
              <div style={{ padding: 15 }}>
                <Row>
                  <Col className={styles.DetailTitle}>{formatMessage({ id: 'NEW_GRANT' })}</Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem>
                      {getFieldDecorator(
                        'arAccountCommencementDate',
                        {}
                      )(
                        <Table
                          size="small"
                          dataSource={[
                            {
                              key: 'addOption',
                              bindingName: <a onClick={() => this.add()}>+ Add</a>,
                              bindingIdentifier: ' ',
                              operation: 'ADD',
                            },
                          ].concat(bindingList)}
                          columns={this.columns}
                          className={`tabs-no-padding ${styles.searchTitle}`}
                          pagination={pagination}
                          onChange={(pagination, filters, sorter, extra) => {
                            this.onChangeEvent(pagination, filters, sorter, extra);
                          }}
                          loading={loading}
                          rowKey={record => record.bindingId}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                {addOfferModal ? <AddOfferModal rowAllSelected={rowAllSelected} /> : null}
                <Row>
                  <Col style={{ textAlign: 'right', padding: '10px 15px' }}>
                    <Button
                      onClick={() => {
                        this.cancel();
                      }}
                    >
                      {formatMessage({ id: 'COMMON_CANCEL' })}
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
                      {formatMessage({ id: 'COMMON_OK' })}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          </Fragment>
        </Card>
      </div>
    );
  }
}

export default NewGrant;
