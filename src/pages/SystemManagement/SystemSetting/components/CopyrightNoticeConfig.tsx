import React, { FC, useState, useEffect } from 'react';
import styles from './CopyrightNoticeConfig.less';
import { List, Icon, Alert } from 'antd';
import SettingModal from './SettingModal';
import { queryDictionary } from '@/services/copyright';
import { SettingResult } from '@/types/settingResult';

interface Props {}

interface ListItemBean {
  title: React.ReactNode;
  description: React.ReactNode;
  actions: React.ReactNode[];
}

const CopyrightNoticeConfig: FC<Props> = props => {
  const [visible, setVisible] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [showModalKey, setShowModalKey] = useState<keyof SettingResult | ''>('');
  const [title, setTitle] = useState('');

  const [result, setResult] = useState({
    // companyName: 'lalal',
    // termsConditions: 'Already Set',
    // contactUs: 'Already Set',
    // dataProtection: 'www.baidu.com',
    // legalInformation: 'www.youku.com',
    // frequentlyAskedQuestions: 'Already Set',
  } as SettingResult);
  const getData = async () => {
    const {
      data: { result: data, resultCode },
      success
    } = await queryDictionary();
    setIsLoad(true);
    if (success && data) {
      setResult(data);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const isShowAlert =
    !(
      result.companyName &&
      result.contactUs &&
      result.dataProtection &&
      result.frequentlyAskedQuestions &&
      result.legalInformation &&
      result.termsConditions
    ) && isLoad;
  const dataList: ListItemBean[] = [
    {
      title: <span>Company Name</span>,
      description: result.companyName ? (
        <span>
          <Icon type="check-circle" style={{ marginRight: 5, color: '#52c41a' }} /> Company Name:{' '}
          {result.companyName}
        </span>
      ) : (
        'You have not set Company Name yet.'
      ),
      actions: [
        <a
          onClick={() => {
            setShowModalKey('companyName');
            setVisible(true);
            setTitle('COMPANY NAME');
          }}
        >
          {result.companyName ? 'Change' : 'Set'}
        </a>,
      ],
    },
    {
      title: <span>Terms and Conditions</span>,
      description: result.termsConditions ? (
        <span>
          <Icon type="check-circle" style={{ marginRight: 5, color: '#52c41a' }} />
          Already Set
        </span>
      ) : (
        'You have not set Terms and Conditions yet.'
      ),
      actions: [
        <a
          onClick={() => {
            setShowModalKey('termsConditions');
            setVisible(true);
            setTitle('TERMS AND CONDITIONS');
          }}
        >
          {result.termsConditions ? 'Modify' : 'Set'}
        </a>,
      ],
    },
    {
      title: <span>Legal Information</span>,
      description: result.legalInformation ? (
        <span>
          <Icon type="check-circle" style={{ marginRight: 5, color: '#52c41a' }} />
          Link to: {result.legalInformation}
        </span>
      ) : (
        'You have not set Legal Information yet.'
      ),
      actions: [
        <a
          onClick={() => {
            setShowModalKey('legalInformation');
            setVisible(true);
            setTitle('LEGAL INFORMATION');
          }}
        >
          {result.legalInformation ? 'Change' : 'Bind'}
        </a>,
      ],
    },
    {
      title: <span>Data Protection</span>,
      description: result.dataProtection ? (
        <span>
          <Icon type="check-circle" style={{ marginRight: 5, color: '#52c41a' }} />
          Link to: {result.dataProtection}
        </span>
      ) : (
        'You have not set Company Name yet.'
      ),
      actions: [
        <a
          onClick={() => {
            setShowModalKey('dataProtection');
            setVisible(true);
            setTitle('DATA PROTECTION');
          }}
        >
          {result.dataProtection ? 'Change' : 'Bind'}
        </a>,
      ],
    },
    {
      title: <span>Frequently Asked Questions</span>,
      description: result.frequentlyAskedQuestions ? (
        <span>
          <Icon type="check-circle" style={{ marginRight: 5, color: '#52c41a' }} />
          Already Set
        </span>
      ) : (
        'You have not set Frequently Asked Questions yet.'
      ),
      actions: [
        <a
          onClick={() => {
            setShowModalKey('frequentlyAskedQuestions');
            setVisible(true);
            setTitle('FREQUENTLY ASKED QUESTIONS');
          }}
        >
          {result.frequentlyAskedQuestions ? 'Modify' : 'Set'}
        </a>,
      ],
    },
    {
      title: <span>Contact Us</span>,
      description: result.contactUs ? (
        <span>
          <Icon type="check-circle" style={{ marginRight: 5, color: '#52c41a' }} />
          Already Set
        </span>
      ) : (
        'You have not set Contact yet.'
      ),
      actions: [
        <a
          onClick={() => {
            setShowModalKey('contactUs');
            setVisible(true);
            setTitle('CONTACT US');
          }}
        >
          {result.contactUs ? 'Modify' : 'Set'}
        </a>,
      ],
    },
  ];

  return (
    <div className="no-border" style={{ marginTop: '3px', height: '100%' }}>
      <div className={styles.titleHeader}>
        <span className={styles.titleSpan}>COPYRIGHT NOTICE CONFIGURATION</span>
      </div>
      {isShowAlert && (
        <div className={styles.alert}>
          <Alert
            message=""
            description="In order to ensure the complete presentation of information, the contents of this page are required."
            type="warning"
            showIcon
          />
        </div>
      )}

      <List
        className={styles.list}
        itemLayout="horizontal"
        dataSource={dataList}
        renderItem={item => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <SettingModal
        visible={visible}
        showModalKey={showModalKey}
        setShowModalKey={setShowModalKey}
        title={title}
        onVisible={() => setVisible(false)}
        data={result}
        onChange={() => {
          getData();
        }}
      />
    </div>
  );
};
export default CopyrightNoticeConfig;
