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
  const { pagePrivileges = [] } = store.global;
  return {
    taList,
    qryTaTableLoading,
    modalVisible,
    searchList,
    pagePrivileges,
  };
};

@connect(mapStateToProps)
class MainTAManagement extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      idOrName = null,
      peoplesoftEwalletId = null,
      peoplesoftArAccountId = null,
      searchList,
    } = this.props;
    dispatch({
      type: 'mainTAManagement/doCleanAllDate',
    }).then(() => {
      dispatch({
        type: 'mainTAManagement/fetchQryMainTAList',
        payload: {
          idOrName,
          peoplesoftEwalletId,
          peoplesoftArAccountId,
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
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: '/TAManagement/MainTAManagement/',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MAIN_MANAGEMENT' }),
        url: null,
      },
    ];
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" id="mainTaView">
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
          <Col span={24}>
            <ConstraintComp />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default MainTAManagement;
