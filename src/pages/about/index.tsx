import React, { FC, useEffect, useState } from 'react';
import SCREEN from '@/utils/screen';
import MediaQuery from 'react-responsive';
import { Row, Col, Card, Menu } from 'antd';
import styles from './index.less';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import { formatMessage } from 'umi/locale';
import MenuItem from 'antd/lib/menu/MenuItem';
import { ClickParam } from 'antd/lib/menu';
import router from 'umi/router';
import { downloadFile } from '@/services/copyright';
import 'react-quill/dist/quill.snow.css';
import Link from 'umi/link';

const pamsImage = require('../../assets/image/PARTNERS-LOGO.png');
interface Props {
  location: any;
}
const titleMap = {
  termsConditions: 'Terms and Conditions',
  frequentlyAskedQuestions: 'FAQs',
  contactUs: 'Contact Us',
};
const about: FC<Props> = props => {
  const selectedKey = props.location.query.key || 'termsConditions';
  const [html, setHtml] = useState('');

  const handleMenuClick = (e: ClickParam) => {
    const { key } = e;
    router.replace({ query: { key }, pathname: '/about' });
  };
  useEffect(() => {
    console.log(props.location.query.key);
    (async () => {
      const { file, success } = await downloadFile(selectedKey as any);
      if (success) {
        const reader = new FileReader();
        reader.addEventListener('loadend', function(e) {
          // console.log(e.target.result);
          try {
            JSON.parse(e.target.result as string);
          } catch (error) {
            setHtml(e.target.result as string);
          }
          // setHtml(e.target.result as string);
        });
        reader.readAsText(file);
      }

      // console.log(file);
    })();
  }, [selectedKey]);
  return (
    <React.Fragment>
      <header className={styles.head}>
        <div className={styles.headDiv}>
          <Link to="/userLogin/pamsLogin">
            <img src={pamsImage} title="Return Partners Login Page." />
          </Link>
        </div>
      </header>
      <section className={styles.main}>
        <Row type="flex" justify="space-around" id="menuView">
          <Col span={24}>
            <Card bodyStyle={{ padding: 0 }} className={styles.cardStyle}>
              <Row className={styles.row}>
                <Col
                  xxl={6}
                  xl={6}
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
                          <span className={styles.titleSpan}>CATEGORIES</span>
                        </div>
                      </MediaQuery>
                      <div className={styles.mainLeftDivStyle}>
                        <div>
                          <Menu
                            onClick={handleMenuClick}
                            defaultSelectedKeys={[selectedKey]}
                            className={styles.basicSettingsMenuStyle}
                            style={{ width: '100%' }}
                            mode="inline"
                            theme="light"
                          >
                            <MenuItem className={styles.menuItemStyle} key="termsConditions">
                              <span className={styles.itemSpan}>Terms and Conditions</span>
                            </MenuItem>
                            <MenuItem
                              className={styles.menuItemStyle}
                              key="frequentlyAskedQuestions"
                            >
                              <span className={styles.itemSpan}>FAQs</span>
                            </MenuItem>
                            <MenuItem className={styles.menuItemStyle} key="contactUs">
                              <span className={styles.itemSpan}>Contact Us</span>
                            </MenuItem>
                          </Menu>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  xxl={18}
                  xl={18}
                  lg={18}
                  md={16}
                  sm={24}
                  xs={24}
                  style={{ paddingRight: 0, paddingLeft: 0 }}
                >
                  <div className="ql-snow">
                    <header className={styles.title}>{titleMap[selectedKey]}</header>
                    <pre className="ql-editor" dangerouslySetInnerHTML={{ __html: html }}></pre>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </section>
    </React.Fragment>
  );
};

export default about;
