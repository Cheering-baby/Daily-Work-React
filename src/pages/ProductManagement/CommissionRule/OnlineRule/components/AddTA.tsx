import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Modal, Table, Row, Col, Input, Button, message, Tooltip } from 'antd';
import { ConnectProps } from '@/types/model';
import PaginationComp from '../../../components/PaginationComp';
import styles from './AddOnlinePLUModal.less';

interface PageProps extends ConnectProps {
  loading: boolean;
  excludedTA: {
    showAddTA: boolean;
    selectedTAId: string[];
    agentIdOrCompanyName: string | null;
    taAddInfoList: any[];
    excludedTAList: any[];
    addTAPagination: {
      pageSize: number;
      currentPage: number;
      totalSize: number;
    };
  };
}

const columns = [
  {
    title: formatMessage({ id: 'AGENT_ID' }),
    dataIndex: 'taId',
    render: text => (
      <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
        <span>{text}</span>
      </Tooltip>
    ),
  },
  {
    title: formatMessage({ id: 'COMPANY_NAME' }),
    dataIndex: 'companyName',
    render: text => (
      <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
        <span>{text}</span>
      </Tooltip>
    ),
  },
];

const AddTA: React.FC<PageProps> = props => {
  const {
    loading,
    dispatch,
    excludedTA: {
      showAddTA,
      agentIdOrCompanyName,
      selectedTAId,
      taAddInfoList,
      excludedTAList,
      addTAPagination: { pageSize, currentPage, totalSize },
    },
  } = props;

  const search = () => {
    dispatch({
      type: 'commissionNew/queryAgentOfferBindingList',
    });
  };

  const reset = () => {
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        agentIdOrCompanyName: null,
      },
    });
    search();
  };

  const cancel = () => {
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        showAddTA: false,
        selectedTAId: [],
        agentIdOrCompanyName: null,
        taAddInfoList: [],
        addTAPagination: {
          pageSize: 10,
          currentPage: 1,
        },
      },
    });
  };

  const ok = () => {
    const excludedTAListFilter = taAddInfoList
      .filter(i => selectedTAId.includes(i.taId) && !excludedTAList.find(j => j.taId === i.taId))
      .map(j => ({ ...j, createdTime: moment().format('x') }));

    if (excludedTAListFilter.length === 0) {
      message.warning('Please select TA.');
      return false;
    }

    const excludedTAListFinal = excludedTAList.concat(excludedTAListFilter);

    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        excludedTAList: excludedTAListFinal,
      },
    });
    cancel();
  };

  const changeSearchCondition = e => {
    dispatch({
      type: 'commissionNew/saveExcludedTA',
      payload: {
        agentIdOrCompanyName: e.target.value,
      },
    });
  };

  const pageOpts = {
    pageSize,
    total: totalSize,
    current: currentPage,
    pageChange: (current, pageSizeNow) => {
      dispatch({
        type: 'commissionNew/queryAgentOfferBindingList',
        payload: {
          pageBean: {
            currentPage: current,
            pageSize: pageSizeNow,
          },
        },
      });
    },
  };

  const rowSelection = {
    selectedRowKeys: selectedTAId,
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: 'commissionNew/saveExcludedTA',
        payload: {
          selectedTAId: selectedRowKeys,
        },
      });
    },
    getCheckboxProps: record => ({
      disabled: excludedTAList.find(i => i.taId === record.taId), // Column configuration not to be checked
    }),
  };

  return (
    <Modal
      width={800}
      destroyOnClose
      visible={showAddTA}
      maskClosable={false}
      onCancel={() => cancel()}
      title={<span className={styles.title}>{formatMessage({ id: 'ADD_EXCLUDED_TA' })}</span>}
      footer={
        <div>
          <Button style={{ width: 60 }} onClick={() => ok()} type="primary">
            OK
          </Button>
          <Button style={{ width: 60 }} onClick={() => cancel()}>
            Cancel
          </Button>
        </div>
      }
    >
      <Row>
        <Col className={styles.inputColStyle} xs={24} sm={12} md={10}>
          <Input
            allowClear
            autoComplete="off"
            style={{ width: '100%' }}
            value={agentIdOrCompanyName}
            onChange={changeSearchCondition}
            placeholder="Agent ID/Company Name"
          />
        </Col>
        <Col xs={12} sm={12} md={6} className={styles.searchReset}>
          <Button style={{ marginRight: 8, width: 70 }} type="primary" onClick={search}>
            Search
          </Button>
          <Button style={{ marginRight: 8, width: 70 }} onClick={reset}>
            Reset
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ marginBottom: 10 }}>
          <Table
            size="small"
            columns={columns}
            pagination={false}
            loading={!!loading}
            dataSource={taAddInfoList}
            rowSelection={rowSelection}
            rowKey={record => record.taId}
            className={`tabs-no-padding ${styles.searchTitle}`}
          />
        </Col>
        <PaginationComp {...pageOpts} />
      </Row>
    </Modal>
  );
};

export default connect(({ commissionNew, loading }) => ({
  excludedTA: commissionNew.excludedTA,
  loading: loading.effects['commissionNew/queryAgentOfferBindingList'],
}))(AddTA);
