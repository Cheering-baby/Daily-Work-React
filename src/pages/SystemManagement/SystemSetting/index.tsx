import React, { FC, useEffect } from 'react';
import SCREEN from '@/utils/screen';
import MediaQuery from 'react-responsive';
import { Row, Col, Card, Menu } from 'antd';
import styles from './index.less';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import { formatMessage } from 'umi/locale';
import MenuItem from 'antd/lib/menu/MenuItem';
import CopyrightNoticeConfig from './components/CopyrightNoticeConfig';


const SystemSetting: FC = () => {
  const breadcrumbArr = [
    {
      breadcrumbName: 'System Management',
      url: '/SystemManagement/SystemSetting',
    },
    {
      breadcrumbName: 'System Setting',
      url: null,
    },
  ];
  useEffect(() => {

  }, []);
  return (<React.Fragment>
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
      <Col span={24} >
        <Card bodyStyle={{ padding: 0 }} className={styles.cardStyle}>
          <Row className={styles.row}>
            <Col
              xxl={5}
              xl={5}
              lg={6}
              md={8}
              sm={24}
              xs={24}
              style={{ paddingRight: 0, paddingLeft: 0, borderRight: '1px solid #D9D9D9' }}
            >
              <div className="no-border" style={{ marginTop: '3px', marginRight: '-1px' }}>
                <div className={styles.leftDivStyle}>
                  <MediaQuery minWidth={SCREEN.screenSm}>
                    <div className={styles.titleHeader}>
                      <span className={styles.titleSpan}>SETTING ITEMS</span>
                    </div>
                  </MediaQuery>
                  <div className={styles.mainLeftDivStyle}>
                    <div>
                      <Menu
                        // onClick={this.menuChoose}
                        defaultSelectedKeys={['1']}
                        className={styles.basicSettingsMenuStyle}
                        style={{ width: '100%' }}
                        mode="inline"
                        theme="light"
                      >
                        <MenuItem className={styles.menuItemStyle} key="1">
                          <span className={styles.itemSpan}>Copyright Notice Configuration</span>
                        </MenuItem>

                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col
              xxl={19}
              xl={19}
              lg={18}
              md={16}
              sm={24}
              xs={24}
              style={{ paddingRight: 0, paddingLeft: 0 }}
            >
              <CopyrightNoticeConfig />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </React.Fragment>);
};

export default SystemSetting;
