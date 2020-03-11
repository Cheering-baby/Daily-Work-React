import React, { PureComponent } from 'react';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import TableComp from './components/TableComp';
import OperationMenuFormComp from './components/OperationMenuFormComp';
import styles from './index.less';
import SCREEN from '@/utils/screen';

const mapStateToProps = store => {
  const { searchForm } = store.menuMgr;
  return {
    searchForm,
  };
};

@connect(mapStateToProps)
class MenuManagement extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'menuMgr/fetchAllMenus' });
    dispatch({ type: 'menuMgr/fetchAllFontIcons' });
  }

  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_SYSTEM_MANAGEMENT' }),
        url: '/SystemManagement/MenuManagement',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_MENU' }),
        url: null,
      },
    ];
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" id="menuView">
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
          <Col span={24} className={styles.menuTableCard}>
            <Card>
              <TableComp />
            </Card>
          </Col>
          <Col span={24}>
            <OperationMenuFormComp />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default MenuManagement;
