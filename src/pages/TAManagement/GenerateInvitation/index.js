import React, { PureComponent } from 'react';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import SearchComp from './components/SearchComp';
import TableComp from './components/TableComp';
import InvitationComp from './components/InvitationComp';
import styles from './index.less';
import SCREEN from '@/utils/screen';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const { taId = null, searchForm, searchList, statusList = [] } = store.generateInvitation;
  return {
    taId,
    searchForm,
    searchList,
    statusList,
  };
};

@connect(mapStateToProps)
class GenerateInvitation extends PureComponent {
  componentDidMount() {
    const { taInfo = {} } = window.g_app.login_data || {};
    const { dispatch, searchForm, searchList } = this.props;
    dispatch({
      type: 'generateInvitation/doCleanData',
      payload: {
        taId: !isNvl(taInfo.companyId) ? taInfo.companyId : null,
        companyName: !isNvl(taInfo.companyName) ? taInfo.companyName : null,
      },
    }).then(() => {
      dispatch({ type: 'generateInvitation/fetchQueryStatusList' });
      dispatch({
        type: 'generateInvitation/fetchQryInvitationRecordList',
        payload: {
          taId: !isNvl(taInfo.companyId) ? taInfo.companyId : null,
          email: searchForm.email || null,
          invitationStartDate: searchForm.invitationStartDate || null,
          invitationEndDate: searchForm.invitationEndDate || null,
          status: searchForm.status || null,
          pageInfo: {
            totalSize: searchList.total,
            currentPage: 1,
            pageSize: searchList.pageSize || '10',
          },
        },
      });
    });
  }

  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: '/TAManagement/GenerateInvitation',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_GENERATE_INVITATION' }),
        url: null,
      },
    ];
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" id="invitationView">
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
            <InvitationComp />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default GenerateInvitation;
