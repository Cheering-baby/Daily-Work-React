import React from 'react';
import {Breadcrumb, Col, Form, Spin} from 'antd';
// import { formatMessage } from 'umi/locale';
import {connect} from 'dva';
import {router, withRouter} from 'umi';
import detailStyles from './index.less';
import Approval from '../components/Approval';
import ApprovalDetail from '../components/ApprovalDetail';

@withRouter
@Form.create()
@connect(({activityDetail}) => ({
  activityDetail,
}))
class ActivityDetail extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: {params},
    } = this.props;
    dispatch({
      type: 'activityDetail/queryDetail',
      payload: {
        activityId: params.activityId,
      },
    });
  }

  routerTo = () => {
    router.push('/MyActivity');
  };

  render() {
    const {
      activityDetail: {activityInfo, historyHandlers, pendingHandlers},
      match: {params: {activityId}},
      location: {
        query: {activityTplCode},
      },
    } = this.props;
    return (
      <Col lg={24} md={24} id="smsReport">
        <Breadcrumb separator=" > " style={{marginBottom: '10px'}}>
          <Breadcrumb.Item className={detailStyles.BreadcrumbStyle}>TA Management</Breadcrumb.Item>
          <Breadcrumb.Item className={detailStyles.BreadcrumbStyle} onClick={this.routerTo}>
            My Activity
          </Breadcrumb.Item>
          <Breadcrumb.Item className={detailStyles.Breadcrumbbold}>
            Activity Details
          </Breadcrumb.Item>
        </Breadcrumb>
        <ApprovalDetail activityTplCode={activityTplCode}/>
        <Approval/>
      </Col>
    );
  }
}

export default ActivityDetail;
