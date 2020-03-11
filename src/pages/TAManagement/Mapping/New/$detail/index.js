import React from 'react';
import { Breadcrumb, Col, Form } from 'antd';
// import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { router } from 'umi';
import MappingDetail from '../../components/MappingDetail';

@Form.create()
@connect(({ mappingDetails }) => ({
  mappingDetails,
}))
class MappingDetails extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;

    dispatch({
      type: 'mappingDetails/statusDetail',
      payload: {
        id: params.mappingDetails,
      },
    });
  }

  routerTo = () => {
    router.push('/TAManagement/Mapping');
  };

  render() {
    // const {
    //   mappingDetails: { statusDetailList },
    // } = this.props;
    return (
      <Col lg={24} md={24} id="newMapping">
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className="breadcrumb-style">TA Management</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style" onClick={this.routerTo}>
            Mapping
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbbold">New</Breadcrumb.Item>
        </Breadcrumb>
        <MappingDetail />
      </Col>
    );
  }
}

export default MappingDetails;
