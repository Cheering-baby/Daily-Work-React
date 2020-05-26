import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import styles from './index.less';
import {
  PAGE_SIZE_SIMPLE,
  PATH_PAMS_REPORT_SCHEDULED_TASKS,
} from '@/pages/ReportCenter/consts/pamsReport';
import ReceiverTable from '@/pages/ReportCenter/PamsReport/ScheduledTasks/components/ReceiverTable';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/pages/ReportCenter/components/BreadcrumbComp';
import SelectReceiverModal from '@/pages/ReportCenter/PamsReport/ScheduledTasks/components/SelectReceiverModal';
import usePartialList from '@/pages/ReportCenter/PamsReport/hooks/usePartialList';
import CryptoAES from '@/pages/ReportCenter/PamsReport/utils/cryptoAES';
import useMessage from '@/pages/ReportCenter/PamsReport/hooks/useMessage';

const formColProps = { span: 24, xs: 24, sm: 24, md: 24, lg: 24 };

const itemLayout = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
  colon: false,
};

const BasicInfoForm = ({ form: { getFieldDecorator }, scheduledTasks: { taskDetail = {} } }) => {
  const items = [
    {
      label: 'Name',
      name: 'jobName',
      options: {
        initialValue: taskDetail.jobName,
        rules: [
          {
            whitespace: true,
            required: true,
            message: 'Required',
          },
          {
            max: 128,
            message: 'Job Name can not be longer than 128.',
          },
          {
            pattern: new RegExp('^[a-zA-Z0-9_ ]+$'),
            message: 'Only characters, numbers, space, and underline are allowed.',
          },
        ],
      },
      ele: <Input allowClear placeholder="Please Enter" />,
    },
    {
      label: 'Description',
      name: 'jobDesc',
      options: {
        initialValue: taskDetail.jobDesc,
        rules: [
          {
            whitespace: true,
            required: true,
            message: 'Required',
          },
          {
            max: 512,
            message: 'Description can not be longer than 512.',
          },
        ],
      },
      ele: (
        <Input.TextArea
          autoSize={{ minRows: 3, maxRows: 3 }}
          placeholder="Please Enter"
          allowClear
        />
      ),
    },
    {
      label: 'SQL',
      name: 'executorSql',
      options: {
        initialValue: taskDetail.executorSql,
        rules: [
          {
            whitespace: true,
            required: true,
            message: 'Required',
          },
          {
            max: 2048,
            message: 'SQL can not be longer than 2048.',
          },
        ],
      },
      ele: <Input placeholder="Please Enter" allowClear />,
    },
    {
      label: 'Period',
      name: 'jobCron',
      options: {
        initialValue: taskDetail.jobCron,
        rules: [
          {
            whitespace: true,
            required: true,
            message: 'Required',
          },
          {
            max: 512,
            message: 'Description can not be longer than 512.',
          },
        ],
      },
      ele: (
        <Input.TextArea
          autoSize={{ minRows: 3, maxRows: 3 }}
          placeholder="Please Enter"
          allowClear
        />
      ),
    },
  ];
  return (
    <>
      <Form className={styles.formStyle}>
        {items.map(item => {
          return (
            <Col {...formColProps} key={item.name}>
              <Form.Item {...itemLayout} label={item.label}>
                {getFieldDecorator(item.name, item.options)(item.ele)}
              </Form.Item>
            </Col>
          );
        })}
      </Form>
    </>
  );
};

const BasicInfoDetail = ({ scheduledTasks: { taskDetail } = {} }) => {
  const items = [
    {
      label: 'Name',
      name: 'jobName',
      ele: <span className={styles.text}>{taskDetail.jobName}</span>,
    },
    {
      label: 'Description',
      name: 'jobDesc',
      ele: <span className={styles.text}>{taskDetail.jobDesc}</span>,
    },
    {
      label: 'SQL',
      name: 'executorSql',
      ele: <span className={styles.text}>{taskDetail.executorSql}</span>,
    },
    {
      label: 'Period',
      name: 'jobCron',
      ele: <span className={styles.text}>{taskDetail.jobCron}</span>,
    },
  ];
  return (
    <>
      <Form className={styles.formStyle}>
        {items.map(item => {
          return (
            <Col {...formColProps} key={item.name}>
              <Form.Item {...itemLayout} label={item.label}>
                {item.ele}
              </Form.Item>
            </Col>
          );
        })}
      </Form>
    </>
  );
};

const MESSAGE_MAP = {
  'PAMS-APP-100007': { type: 'warn', msg: 'Please recheck the period.' },
  'PAMS-APP-210002': { type: 'warn', msg: 'Please recheck the SQL.' },
};

const CREATE_MESSAGE_MAP = {
  '0': { type: 'success', msg: 'Created scheduled task successfully.' },
  ...MESSAGE_MAP,
};

const UPDATE_MESSAGE_MAP = {
  '0': { type: 'success', msg: 'Updated scheduled task successfully.' },
  ...MESSAGE_MAP,
};

const mapStateToProps = ({ scheduledTasks, loading }) => ({
  scheduledTasks,
  loadingFlag:
    loading.effects['scheduledTasks/fetchScheduledTaskDetail'] ||
    loading.effects['scheduledTasks/createScheduledTask'] ||
    loading.effects['scheduledTasks/updateScheduledTask'],
  fetchReceiverListLoadingFlag: loading.effects['scheduledTasks/fetchReceiverList'],
});

const ScheduledTaskAddition = props => {
  const {
    dispatch,
    history,
    location: {
      query: { _crypto = '' },
    },
    form: { validateFields },
    scheduledTasks: { taskId, operationType, selectedReceivers },
  } = props;

  const [receiverModalVisible, setReceiverModalVisible] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [breadcrumbArr, setBreadcrumbArr] = useState([]);

  const [partialList, { current, size, total }, fetch, initialize] = usePartialList();
  const [showCreateMessage] = useMessage(CREATE_MESSAGE_MAP);
  const [showUpdateMessage] = useMessage(UPDATE_MESSAGE_MAP);

  useEffect(() => {
    const cryptoArr = _crypto && CryptoAES.Decrypt(_crypto).split(',');
    const [selectedId = '', type = 'NEW', reportName = ''] = cryptoArr || [];
    const types = ['EDIT', 'DETAIL'];
    if (types.includes(type))
      dispatch({
        type: 'scheduledTasks/fetchScheduledTaskDetail',
        payload: { id: selectedId },
      });

    dispatch({
      type: 'scheduledTasks/updateState',
      payload: { operationType: type, taskId: selectedId },
    });

    const arr = [
      { breadcrumbName: formatMessage({ id: 'REPORT_CENTER' }) },
      { breadcrumbName: formatMessage({ id: 'PAMS' }) },
      {
        breadcrumbName: formatMessage({ id: 'SCHEDULED_TASKS' }),
        url: PATH_PAMS_REPORT_SCHEDULED_TASKS,
      },
      {
        breadcrumbName:
          type === 'NEW' ? formatMessage({ id: `SCHEDULED_TASKS_${type}` }) : reportName,
      },
    ];
    setBreadcrumbArr(arr);
  }, [dispatch, _crypto]);

  useEffect(() => {
    initialize(selectedReceivers, 1, PAGE_SIZE_SIMPLE);
  }, [initialize, selectedReceivers]);

  useEffect(() => {
    const types = ['NEW', 'EDIT'];
    if (types.includes(operationType)) {
      const tempArr = [...partialList];
      tempArr.unshift({ type: 'ADD', key: 'ADD' });
      setDataList(tempArr);
    } else {
      setDataList([...partialList]);
    }
  }, [operationType, partialList]);

  const handleAdd = () => {
    setReceiverModalVisible(true);
  };

  const handleDel = row => {
    dispatch({
      type: 'scheduledTasks/updateState',
      payload: {
        selectedReceivers: selectedReceivers.filter(item => item.userCode !== row.userCode),
      },
    });
  };

  const handleCancel = () => {
    history.push({
      pathname: PATH_PAMS_REPORT_SCHEDULED_TASKS,
    });
  };

  const handleOk = () => {
    validateFields((errors, values) => {
      if (errors) return;
      if (selectedReceivers instanceof Array && selectedReceivers.length <= 0) {
        message.warn('Please recheck the receivers.');
        return;
      }
      Object.assign(values, { listReceiver: selectedReceivers });

      if (operationType === 'NEW') {
        dispatch({
          type: 'scheduledTasks/createScheduledTask',
          payload: { values },
        }).then(res => {
          showCreateMessage(res);
          if (res.resultCode === '0') {
            history.push({
              pathname: PATH_PAMS_REPORT_SCHEDULED_TASKS,
            });
          }
        });
      }

      if (operationType === 'EDIT') {
        Object.assign(values, { id: taskId });
        dispatch({
          type: 'scheduledTasks/updateScheduledTask',
          payload: { values },
        }).then(res => {
          showUpdateMessage(res);
          if (res.resultCode === '0') {
            history.push({
              pathname: PATH_PAMS_REPORT_SCHEDULED_TASKS,
            });
          }
        });
      }
    });
  };

  return (
    <>
      <Row>
        <Col span={24} xs={24} sm={24} md={24} className={styles.pageHeaderTitle}>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
        </Col>
        <Col span={24}>
          <Card className={styles.card}>
            <Row style={{ marginTop: -10 }}>
              <Col span={24} className={styles.title}>
                BASIC INFORMATION
              </Col>
              <Col span={24}>
                {operationType === 'DETAIL' ? (
                  <BasicInfoDetail {...props} />
                ) : (
                  <BasicInfoForm {...props} />
                )}
              </Col>
              <Col span={24} className={styles.title}>
                RECEIVER INFORMATION
              </Col>
              <Col span={24}>
                {operationType === 'DETAIL' ? (
                  <ReceiverTable
                    {...props}
                    onPageChange={fetch}
                    currentPage={current}
                    pageSize={size}
                    totalSize={total}
                    dataList={dataList}
                  />
                ) : (
                  <ReceiverTable
                    {...props}
                    onPageChange={fetch}
                    currentPage={current}
                    pageSize={size}
                    totalSize={total}
                    dataList={dataList}
                    handleAdd={handleAdd}
                    handleDel={handleDel}
                  />
                )}
              </Col>
            </Row>
            {operationType !== 'DETAIL' && (
              <Row style={{ marginTop: 20, float: 'right' }}>
                <Col span={24}>
                  <Button style={{ width: 80 }} htmlType="button" onClick={handleCancel}>
                    {formatMessage({ id: 'CANCEL' })}
                  </Button>
                  <Button
                    style={{ marginLeft: 10, width: 80 }}
                    type="primary"
                    htmlType="button"
                    onClick={handleOk}
                  >
                    {formatMessage({ id: 'OK' })}
                  </Button>
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
      <SelectReceiverModal
        {...props}
        visible={receiverModalVisible}
        setVisible={setReceiverModalVisible}
      />
    </>
  );
};
export default connect(mapStateToProps)(Form.create()(ScheduledTaskAddition));
