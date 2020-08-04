import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Col,
  Row,
} from 'antd';
import { formatMessage } from 'umi/locale';
import MediaQuery from "react-responsive";
import SCREEN from "@/utils/screen";
import BreadcrumbComp from '@/components/BreadcrumbComp';
import SearchComp from './components/SearchComp';
import TableComp from './components/TableComp'
import styles from './index.less';


@connect(({ global }) => ({
  global,
}))
class TravelAgentWallet extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({type: 'travelAgentWalletMgr/fetchQryMainTAList'});
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({type: 'travelAgentWalletMgr/clean'});
  }

  getTableHeight = () => {
    const {offsetHeight: layoutHeight} = document.getElementById('pageContainer');
    if (document.getElementById('taAgentWalletPageHeaderTitle') && document.getElementById('taAgentWalletPageSearchCard')) {
      const {offsetHeight: pageHeaderTitleHeight} = document.getElementById('taAgentWalletPageHeaderTitle');
      const {offsetHeight: pageSearchCardHeight} = document.getElementById('taAgentWalletPageSearchCard');
      return layoutHeight - pageHeaderTitleHeight - pageSearchCardHeight - 100;
    }
    return layoutHeight - 270;
  };

  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'TRAVEL_AGENT_WALLET' }),
        url: '/TravelAgentWallet',
      },
    ];

    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" id="TravelAgentWalletView">
          <Col id='taAgentWalletPageHeaderTitle' span={24} className={styles.pageHeaderTitle}>
            <div>
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
            </div>
          </Col>
          <Col id='taAgentWalletPageSearchCard' span={24} className={styles.pageSearchCard}>
            <Card>
              <SearchComp />
            </Card>
          </Col>
          <Col span={24} className={styles.pageTableCard}>
            <Card>
              <TableComp height={this.getTableHeight()} />
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default TravelAgentWallet;
