import React, { PureComponent } from 'react';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import ConstraintComp from './components/ConstraintComp';
import SearchComp from './components/SearchComp';
import TableComp from './components/TableComp';
import SCREEN from '@/utils/screen';
import styles from './index.less';

const mapStateToProps = store => {
  const { taList, qryTaTableLoading, modalVisible, searchList } = store.mainTAManagement;
  return {
    taList,
    qryTaTableLoading,
    modalVisible,
    searchList,
  };
};

@connect(mapStateToProps)
class MainTAManagement extends PureComponent {

  getTableHeight = () => {
    const {offsetHeight: layoutHeight} = document.getElementById('layout');
    if (document.getElementById('pageHeaderTitle') && document.getElementById('pageSearchCard')) {
      const {offsetHeight: pageHeaderTitleHeight} = document.getElementById('pageHeaderTitle');
      const {offsetHeight: pageSearchCardHeight} = document.getElementById('pageSearchCard');
      return layoutHeight - pageHeaderTitleHeight - pageSearchCardHeight - 280;
    }
    return layoutHeight;
  };

  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: '/TAManagement/MainTAManagement',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MAIN_MANAGEMENT' }),
        url: null,
      },
    ];
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" id="mainTaView">
          <Col id='pageHeaderTitle' span={24} className={styles.pageHeaderTitle}>
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
          <Col id='pageSearchCard' span={24} className={styles.pageSearchCard}>
            <Card>
              <SearchComp />
            </Card>
          </Col>
          <Col span={24} className={styles.pageTableCard}>
            <Card>
              <TableComp height={this.getTableHeight()} />
            </Card>
          </Col>
          <Col span={24}>
            <ConstraintComp />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default MainTAManagement;
