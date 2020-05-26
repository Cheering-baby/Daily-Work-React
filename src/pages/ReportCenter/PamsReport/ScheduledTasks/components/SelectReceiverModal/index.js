import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Modal, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import ReceiverTable from '@/pages/ReportCenter/PamsReport/ScheduledTasks/components/ReceiverTable';
import { PAGE_SIZE } from '@/pages/ReportCenter/consts/pamsReport';

const checkItemSelectedStatus = (_record, _rowKeys = []) => {
  return _rowKeys.includes(_record.key);
};

const SelectReceiverModal = props => {
  const {
    visible,
    setVisible,
    dispatch,
    scheduledTasks: {
      receiverTable: { currentPage, pageSize, totalSize, dataList },
      selectedReceivers,
    },
  } = props;

  const [userCode, setUserCode] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cacheSelectedRows, setCacheSelectedRows] = useState([]);

  const handleChange = e => {
    setUserCode(e.target.value);
  };

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'scheduledTasks/fetchReceiverList',
        payload: {
          pageSize: PAGE_SIZE,
          currentPage: 1,
        },
      });
    }
  }, [visible, dispatch]);

  const fetchReceiverList = (current, size, fuzzyUserCode) => {
    setSelectedRowKeys([]);
    setCacheSelectedRows([]);
    dispatch({
      type: 'scheduledTasks/fetchReceiverList',
      payload: {
        fuzzyUserCode: fuzzyUserCode || userCode,
        pageSize: size,
        currentPage: current,
      },
    });
  };

  /**
   * Tips: Cache the rows to prevent from overwriting the previous rows
   * @param rowKeys: all keys you choose in table
   * @param rows: current page keys you choose in table
   */
  const onSelectChange = (rowKeys, rows) => {
    // todo optimize algorithm
    setSelectedRowKeys(preKeys => {
      const diffKeys = rowKeys.filter(item => !preKeys.includes(item));
      setCacheSelectedRows(preRows => {
        const diffRows = rows.filter(item => diffKeys.includes(item.userCode));
        return [...preRows, ...diffRows].filter(item => rowKeys.includes(item.userCode));
      });
      return rowKeys;
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: 'checkbox',
    getCheckboxProps: record => ({
      disabled: checkItemSelectedStatus(
        record,
        selectedReceivers.map(item => item.userCode)
      ),
    }),
  };

  const onPageChange = (_current, _size) => {
    fetchReceiverList(_current, _size);
  };

  const handleOk = () => {
    setSelectedRowKeys([]);
    setCacheSelectedRows([]);
    dispatch({
      type: 'scheduledTasks/updateState',
      payload: {
        selectedReceivers: [...selectedReceivers, ...cacheSelectedRows],
      },
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'scheduledTasks/updateState',
      payload: {
        receiverTable: {
          currentPage: 1,
          pageSize: PAGE_SIZE,
          totalSize: 0,
          dataList: [],
        },
      },
    });
  };

  return (
    <>
      <Modal
        destroyOnClose
        maskClosable={false}
        title={<span className={styles.title}>SELECT RECEIVERS</span>}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={
          <>
            <Button
              style={{ width: 80 }}
              onClick={() => {
                handleCancel();
                setVisible(false);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ width: 80, marginLeft: 10 }}
              onClick={() => {
                handleOk();
                setVisible(false);
              }}
              type="primary"
            >
              OK
            </Button>
          </>
        }
      >
        <Row>
          <Col span={18}>
            <Input
              placeholder={formatMessage({ id: 'USER_CODE' })}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Button
              style={{ marginLeft: 10, width: '-webkit-fill-available' }}
              type="primary"
              htmlType="button"
              onClick={() => {
                fetchReceiverList(currentPage, pageSize, userCode);
              }}
            >
              {formatMessage({ id: 'BTN_SEARCH' })}
            </Button>
          </Col>
          <Col span={24}>
            <ReceiverTable
              {...props}
              onPageChange={onPageChange}
              fetchDataList={fetchReceiverList}
              currentPage={currentPage}
              pageSize={pageSize}
              totalSize={totalSize}
              dataList={dataList}
              rowSelection={rowSelection}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default SelectReceiverModal;
