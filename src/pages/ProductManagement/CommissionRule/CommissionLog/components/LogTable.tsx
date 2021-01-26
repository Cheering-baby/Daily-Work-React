import React from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Table, Tabs } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table/interface';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { ConnectProps, Loading } from '@/types/model';
import PaginationComp from '@/pages/ProductManagement/components/PaginationComp';
import {
  CommissionLogStateType,
  commissionAuditLogListItem,
  commissionTabKeyType,
} from '../models/commissionLog';
import styles from '../index.less';

interface PageProps extends ConnectProps {
  commissionLog: CommissionLogStateType;
  tableLoading: Boolean;
}

interface columnsType<T> extends ColumnProps<T> {
  fields?: commissionTabKeyType[];
}

const { TabPane } = Tabs;

const LogTable: React.FC<PageProps> = props => {
  const {
    dispatch,
    tableLoading,
    commissionLog: { activeKey, pagination, commissionAuditLogList = [] },
  } = props;

  const pageOpts = {
    ...pagination,
    pageChange: (currentPage, pageSize) => {
      dispatch({
        type: 'commissionLog/queryCommissionAuditLogList',
        payload: {
          currentPage,
          pageSize,
        },
      });
    },
  };

  const columns: columnsType<commissionAuditLogListItem>[] = [
    {
      title: formatMessage({ id: 'NO' }),
      width: 80,
      dataIndex: 'logSnId',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'COMMISSION_NAME' }),
      width: 150,
      dataIndex: 'commissionName',
      fields: ['Tiered & Attendance'],
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'OFFER_ID' }),
      width: 140,
      dataIndex: 'offerId',
      fields: ['Online Fixed commission', 'Tiered & Attendance'],
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'OFFER_NUMBER' }),
      width: 180,
      dataIndex: 'offerNo',
      fields: ['Online Fixed commission', 'Tiered & Attendance'],
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      width: 150,
      dataIndex: 'offerName',
      fields: ['Online Fixed commission', 'Tiered & Attendance'],
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'PACKAGE_PLU' }),
      width: 190,
      dataIndex: 'packagePlu',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'PACKAGE_DESCRIPTION' }),
      width: 220,
      dataIndex: 'packagePluDesc',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      width: 190,
      dataIndex: 'pluCode',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      width: 220,
      dataIndex: 'pluCodeDesc',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'OPERATION_TYPE' }),
      width: 120,
      dataIndex: 'operationType',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'FIELD_NAME' }),
      width: 120,
      dataIndex: 'filedName',
      fields: ['Tiered & Attendance'],
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'NEW_VALUE' }),
      width: 100,
      dataIndex: 'newValue',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'OLD_VALUE' }),
      width: 100,
      dataIndex: 'oldValue',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'CREATE_DATE' }),
      width: 150,
      dataIndex: 'createdDate',
      render: text => <span>{text ? moment(text, 'x').format('DD-MMM-YYYY HH:mm:ss') : text}</span>,
    },
    {
      title: formatMessage({ id: 'CREATE_BY' }),
      width: 100,
      dataIndex: 'createBy',
      render: text => <span>{text}</span>,
    },
  ];

  const columnsFilter: columnsType<commissionAuditLogListItem>[] = columns.filter(({ fields }) =>
    fields ? fields.includes(activeKey) : true
  );

  const commonProps: TableProps<commissionAuditLogListItem> = {
    pagination: false,
    scroll: { x: 1500 },
    columns: columnsFilter,
    loading: !!tableLoading,
    dataSource: commissionAuditLogList,
    className: `components-table-demo-nested ${styles.table}`,
  };

  const changeActiveType = (key: commissionTabKeyType) => {
    dispatch({
      type: 'commissionLog/save',
      payload: {
        activeKey: key,
        searchOptions: {},
        commissionAuditLogList: [],
      },
    });

    dispatch({
      type: 'commissionLog/queryCommissionAuditLogList',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  return (
    <Card className={styles.LogTable}>
      <Row>
        <Col span={24}>
          <Tabs activeKey={activeKey} onChange={changeActiveType}>
            <TabPane
              key="Online Fixed commission"
              tab={formatMessage({ id: 'ONLINE_FIXED_COMMISSION_TAB' })}
            >
              <Table {...commonProps} />
            </TabPane>
            <TabPane
              key="Offline Fixed commission"
              tab={formatMessage({ id: 'OFFLINE_FIXED_COMMISSION_TAB' })}
            >
              <Table {...commonProps} />
            </TabPane>
            <TabPane
              key="Tiered & Attendance"
              tab={formatMessage({ id: 'TIERED_ATTENDANCE_COMMISSION_TAB' })}
            >
              <Table {...commonProps} />
            </TabPane>
          </Tabs>

          <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
        </Col>
      </Row>
    </Card>
  );
};

export default connect(
  ({ commissionLog, loading }: { commissionLog: CommissionLogStateType; loading: Loading }) => ({
    commissionLog,
    tableLoading: loading.effects['commissionLog/queryCommissionAuditLogList'],
  })
)(LogTable);
