import React from 'react';
import { Breadcrumb, Col } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import MediaQuery from 'react-responsive';
import UserSearchForm from './components/UserSearchForm';
import UserSearchTable from './components/UserSearchTable';
import styles from './index.less';
import SCREEN from '@/utils/screen';

// RWS user login: can see rws's user and TA company's main user
// Main TA user login: can see user in ta company 和 SUB TA company's main user
// Sub TA user login: can see user in sub ta company

class Index extends React.PureComponent {
  render() {
    const breadCrumbBody = (
      <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
        <Breadcrumb.Item className={styles.breadCrumbStyle}>
          {formatMessage({ id: 'SYSTEM_MANAGEMENT' })}
        </Breadcrumb.Item>
        <Breadcrumb.Item className={styles.breadCrumbBold}>
          {formatMessage({ id: 'USER_MANAGEMENT' })}
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    return (
      <Col lg={24} md={24}>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          {breadCrumbBody}
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>{breadCrumbBody}</MediaQuery>
        <MediaQuery maxWidth={SCREEN.screenXsMax}>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <UserSearchForm />
          </div>
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenSmMin}>
          <UserSearchForm />
        </MediaQuery>
        <UserSearchTable />
      </Col>
    );
  }
}

export default Index;
