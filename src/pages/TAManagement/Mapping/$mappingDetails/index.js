import React, { PureComponent } from 'react';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import DetailForMappingInfo from '../components/DetailForMappingInfo';

@connect(({ mappingDetails }) => ({
  mappingDetails,
}))
class MappingDetail extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { mappingDetails },
      },
    } = this.props;
    dispatch({
      type: 'mappingDetails/queryMappingDetail',
      payload: {
        taId: mappingDetails,
      },
    });
  }

  routerTo = () => {
    router.push('/TAManagement/Mapping');
  };

  render() {
    const {
      mappingDetails: { queryMappingInfo },
      location: {
        query: { companyName },
      },
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
        breadcrumbName: formatMessage({ id: 'COMMON_DETAILS' }),
        url: null,
      },
    ];
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.pageHeaderTitle}>
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
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card
              className={styles.information}
              // loading={taInfoLoadingFlag || taMappingInfoLoadingFlag || taAccountInfoLoadingFlag}
            >
              <Row type="flex" justify="space-around">
                <Col span={24} className={styles.detailInformation}>
                  <Card>
                    <DetailForMappingInfo
                      queryMappingInfo={queryMappingInfo}
                      companyName={companyName}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default MappingDetail;
