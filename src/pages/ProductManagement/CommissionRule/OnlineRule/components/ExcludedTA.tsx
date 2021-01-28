import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { Table, Row, Col, Tooltip, Icon } from 'antd';
import { ConnectProps } from '@/types/model';
import PaginationComp from '../../../components/PaginationComp';
import { formatPageData } from '@/pages/ProductManagement/utils/tools';
import GrantedOffer from './GrantedOffer';
import AddTA from './AddTA';
import styles from '../New/index.less';

interface PageProps extends ConnectProps {
  type: 'detail' | null;
  excludedTA: {
    showAddTA: boolean;
    excludedTAList: any[];
    showGrantedOffer: boolean;
    excludedTAPagination: {
      pageSize: number;
      currentPage: number;
    };
  };
}

const ExcludedTA: React.FC<PageProps> = props => {
  const {
    type,
    dispatch,
    excludedTA: {
      showAddTA,
      excludedTAList,
      showGrantedOffer,
      excludedTAPagination: { pageSize, currentPage },
    },
  } = props;

  const viewGrantOffer = record => {
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        showGrantedOffer: true,
        grantOfferList: record.grantOfferList,
      },
    });
  };

  const add = () => {
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        showAddTA: true,
      },
    });
    dispatch({
      type: 'commissionNew/queryAgentOfferBindingList',
    });
  };

  const deleteRecord = record => {
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        excludedTAList: excludedTAList.filter(i => i.taId !== record.taId),
      },
    });
  };

  const columns = [
    {
      title: formatMessage({ id: 'AGENT_ID' }),
      dataIndex: 'taId',
      render: (text, record) => {
        if (record.key === 'addOption') {
          return record.commoditySpecId;
        }
        return <span>{text}</span>;
      },
    },
    {
      title: formatMessage({ id: 'DATA_ADDED' }),
      dataIndex: 'createdTime',
      render: (text, record) => {
        if (record.key === 'addOption') {
          return null;
        }
        return <span>{text ? moment(text, 'x').format('DD-MMM-YYYY') : text}</span>;
      },
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
      render: (text, record) => {
        return record && record.key !== 'addOption' ? (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
              <Icon type="eye" onClick={() => viewGrantOffer(record)} />
            </Tooltip>
            {type !== 'detail' && (
              <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
                <Icon type="delete" onClick={() => deleteRecord(record)} />
              </Tooltip>
            )}
          </div>
        ) : null;
      },
    },
  ];

  const pageOpts = {
    pageSize,
    total: excludedTAList.length,
    current: currentPage,
    pageChange: (current, pageSizeNow) => {
      dispatch({
        type: 'commissionNew/saveExcludedTA',
        payload: {
          excludedTAPagination: {
            pageSize: pageSizeNow,
            currentPage: current,
          },
        },
      });
    },
  };

  const excludedTAListShow = formatPageData(currentPage, pageSize, excludedTAList).items;

  if (type !== 'detail') {
    excludedTAListShow.unshift({
      id: 'addOption',
      key: 'addOption',
      commoditySpecId: <a onClick={add}>+ Add</a>,
    });
  }

  return (
    <Row style={{ marginTop: '-25px' }}>
      {showAddTA && <AddTA />}
      {showGrantedOffer && <GrantedOffer />}
      <Col span={24} className={styles.DetailTitle}>
        {formatMessage({ id: 'EXCLUDED_TA' })}
      </Col>
      <Col span={24} style={{ marginBottom: 15 }}>
        <Table
          size="small"
          columns={columns}
          pagination={false}
          rowKey={record => record.key}
          className={`tabs-no-padding ${styles.searchTitle}`}
          dataSource={excludedTAListShow}
          rowClassName={() => styles.hideIcon}
          expandedRowRender={() => <span />}
        />
      </Col>
      {excludedTAList.length > 0 && <PaginationComp {...pageOpts} />}
    </Row>
  );
};

export default connect(({ commissionNew }) => ({
  excludedTA: commissionNew.excludedTA,
}))(ExcludedTA);
