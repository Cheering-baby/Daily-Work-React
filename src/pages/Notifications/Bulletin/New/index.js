import React from 'react';
import { Breadcrumb, Col } from 'antd';
import 'react-quill/dist/quill.snow.css';
import NotificationEdit from '@/pages/Notifications/components/NotificationEdit';

class index extends React.PureComponent {
  render() {
    return (
      <Col lg={24} md={24}>
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className="breadcrumb-style">Notifications</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style" onClick={this.routerTo}>
            Bulletin
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbbold">New</Breadcrumb.Item>
        </Breadcrumb>
        <NotificationEdit type="NEW" notificationType="01" />
      </Col>
    );
  }
}

export default index;
