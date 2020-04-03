import React from 'react';
import { Col, Form } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import MappingDetail from '../../components/MappingDetail';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import SCREEN from '@/utils/screen';

@Form.create()
@connect(({ mappingDetails, mapping }) => ({
  mappingDetails,
  mapping,
}))
class MappingDetails extends React.PureComponent {
  render() {
    const {
      match: {
        params: { detail },
      },
      location: {
        query: { companyName, arAllowed },
      },
      mapping: { type },
    } = this.props;

    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MAPPING' }),
        url: '/TAManagement/Mapping',
      },
      {
        breadcrumbName:
          type === 'edit'
            ? formatMessage({ id: 'COMMON_MODIFY' })
            : formatMessage({ id: 'MENU_TA_MAPPING' }),
        url: null,
      },
    ];
    return (
      <Col lg={24} md={24} id="mappingEdit">
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <MappingDetail taId={detail} companyName={companyName} arAllowed={arAllowed} />
      </Col>
    );
  }
}

export default MappingDetails;
