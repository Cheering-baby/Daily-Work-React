import React, { PureComponent } from 'react';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import SearchComp from './components/SearchComp';
import TableComp from './components/TableComp';
import SubTaInformationToDrawer from './components/SubTaInformationToDrawer';
import SCREEN from '@/utils/screen';
import styles from './index.less';

const mapStateToProps = store => {
  const { searchForm, searchList } = store.subTAManagement;
  return {
    searchForm,
    searchList,
  };
};

@connect(mapStateToProps)
class SubTAManagement extends PureComponent {
  componentDidMount() {
    const { dispatch, searchForm, searchList } = this.props;
    dispatch({
      type: 'subTAManagement/doCleanAllDate',
    }).then(() => {
      dispatch({
        type: 'subTAManagement/fetchQrySubTAList',
        payload: {
          companyName: searchForm.companyName,
          applyStartDate: searchForm.applyStartDate,
          applyEndDate: searchForm.applyEndDate,
          pageInfo: {
            currentPage: 1,
            pageSize: searchList.pageSize,
            totalSize: searchList.total,
          },
        },
      });
    });
  }

  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_SUB_TA_MANAGEMENT' }),
        url: '/SubTAManagement/SubTAManagement',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_SUB_TA_MAIN_MANAGEMENT' }),
        url: null,
      },
    ];
    return (
      <Row type="flex" justify="space-around" id="subTaView">
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
        <Col span={24} className={styles.pageSearchCard}>
          <Card>
            <SearchComp />
          </Card>
        </Col>
        <Col span={24} className={styles.pageTableCard}>
          <Card>
            <TableComp />
          </Card>
        </Col>
        <SubTaInformationToDrawer />
      </Row>
    );
  }
}

export default SubTAManagement;
