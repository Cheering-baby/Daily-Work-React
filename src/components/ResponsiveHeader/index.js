import MediaQuery from 'react-responsive';
import router from 'umi/router';
import React from 'react';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import BreadcrumbHeader from '@/components/BreadcrumbHeader';
import PageHeader from '@/components/MobileHeader/PageHeader';

const ResponsiveHeader = ({
                            menus = [],
                            headerName = '',
                            goBackUrl = '',
                            isMainPage = false,
                          }) =>
  (
    <>
      {
        !isMainPage &&
        <MediaQuery maxWidth={SCREEN.screenXsMax}>
          <div className={styles.pageHeader}>
            <PageHeader
              style={{ height: 64 }}
              rightContent={null}
              onLeftClick={() => {
                router.push(goBackUrl);
              }}
            >
              <div className={styles.titleName}>{headerName}</div>
            </PageHeader>
          </div>
        </MediaQuery>
      }
      <MediaQuery minWidth={SCREEN.screenSm}>
        <BreadcrumbHeader menus={menus} />
      </MediaQuery>
    </>
  );

export default ResponsiveHeader;
