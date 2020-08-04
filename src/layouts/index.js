import React, { Fragment } from 'react';
import { BackTop, Layout, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import withRouter from 'umi/withRouter';
import Redirect from 'umi/redirect';
import pathToRegexp from 'path-to-regexp';
import { forEach, isEqual } from 'lodash';
import MediaQuery from 'react-responsive';
import SiderMenu from '../components/SiderMenu';
import ContextMenu from '../components/ContextMenu';
import PageContainer from '../components/PageContainer';
import Authorized from '../utils/Authorized';
import loginSession from '../utils/loginSession';
import logo from '../assets/logo.svg';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import ResetPwd from '../pages/userLogin/components/ResetPwd';
import SCREEN from '../utils/screen';

const { Content } = Layout;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      let locale = 'menu';
      if (parentName && item.name) {
        locale = `${parentName}.${item.name}`;
      } else if (item.name) {
        locale = `menu.${item.name}`;
      } else if (parentName) {
        locale = parentName;
      }
      if (item.path) {
        const result = {
          ...item,
          locale,
          authority: item.authority || parentAuthority,
        };
        if (item.routes) {
          // Reduce memory usage
          result.children = formatter(item.routes, item.authority, locale);
        }
        delete result.routes;
        return result;
      }

      return null;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  state = {
    // rendering: true,
    isMobile: false,
  };

  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidMount() {
    const {
      dispatch,
      menuLoaded,
      location: {
        pathname,
        query: { redirect },
      },
    } = this.props;
    const isSignUp =
      pathname.indexOf('/TAManagement/SignUp') >= 0 ||
      pathname.indexOf('/about') >= 0 ||
      pathname.indexOf('/SubTAManagement/SignUp') >= 0;
    // 最大宽度1200px，菜单被自动折叠
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
    window.portal_react_version = '0.0.10';
    if (!menuLoaded && !isSignUp) {
      dispatch({
        type: 'global/logged',
        payload: {
          redirect,
        },
      }).then(() => {
        const { currentUserGlobal } = this.props;
        if (currentUserGlobal) {
          const { _csrf } = currentUserGlobal;
          if (_csrf) {
            dispatch({
              type: 'global/fetchDefaultMenu',
            });
          }
        }
      });
    }
    if (!isSignUp) {
      dispatch({
        type: 'global/fetchDefaultMenu',
      });
    }
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    // unenquireScreen(this.enquireHandler);
    window.removeEventListener('resize', this.handleResize.bind(this));

    const { dispatch, menuLoaded } = this.props;
    if (!menuLoaded) {
      dispatch({
        type: 'global/logged',
        payload: {},
      });
    }
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    return memoizeOneFormatter(routes);
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  handleResize = () => {
    if (document.documentElement.clientWidth <= 1200) {
      this.handleMenuCollapse(true);
    }
  };

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);
    if (!currRouterData) {
      return 'PARTNERS';
    }
    return 'PARTNERS';
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '64px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      paddingTop: fixedHeader ? 64 : 0,
      height: '100%',
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  judgeBeforeRenderLogin = () => {
    const { children } = this.props;
    const currentUser = loginSession.getUser();
    const currentMenu = loginSession.getData('currentMenu') || {};
    if (Object.keys(currentUser).length > 0) {
      return <Redirect to={currentMenu.path || `/ `} />;
    }
    const { currentUserGlobal } = this.props;
    if (Object.keys(currentUserGlobal).length > 0) {
      return <Redirect to={currentMenu.path || `/ `} />;
    }
    return children;
  };

  getCurrentMenu = (rawMenu, pathname) => {
    let currentMenu = null;

    const getMenu = (menu, menus) => {
      forEach(menus, item => {
        if (currentMenu) return false;

        if (pathname === item.path) {
          currentMenu = item;
          return false;
        }

        const { relativePages } = item;
        if (relativePages && relativePages.length > 0) {
          for (const page of relativePages) {
            if (this.comparePath(pathname, page.pageUrl)) {
              currentMenu = item;
              return false;
            }
          }
        }

        if (item.children) {
          getMenu(menu, item.children);
        }
      });
    };
    getMenu(currentMenu, rawMenu);
    return currentMenu;
  };

  comparePath = (pathname, pageUrl) => {
    const pathNames = pathname.split('/');
    const pageUrls = pageUrl.split('/');
    if (pathNames.length !== pageUrls.length) {
      return false;
    }
    for (let i = 0; i < pathNames.length; i += 1) {
      if (!(pageUrls[i] === '*' || pathNames[i].toLowerCase() === pageUrls[i].toLowerCase())) {
        return false;
      }
    }
    return true;
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      menuData,
      rawMenu,
      currentUserRole,
      resetModal,
      menuLoaded,
      privilegeLoading,
      needChangePassword,
    } = this.props;
    const isSignUp =
      pathname.indexOf('/TAManagement/SignUp') >= 0 ||
      pathname.indexOf('/SubTAManagement/SignUp') >= 0 ||
      pathname.indexOf('/about') >= 0;
    if (pathname.indexOf('/about') >= 0) {
      return children;
    }
    const visibilityHeight = Math.round((Number(document.body.clientHeight) - 64) / 2);
    if (isSignUp) {
      return (
        <Fragment>
          <div
            style={{
              minHeight: '100vh',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right bottom',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
            id="signUpDiv"
          >
            <PageContainer>{children}</PageContainer>
            <BackTop
              style={{ bottom: 70 }}
              target={() => document.getElementById('signUpDiv')}
              visibilityHeight={visibilityHeight}
            />
          </div>
        </Fragment>
      );
    }
    if (
      pathname === '/' &&
      !menuLoaded &&
      String(needChangePassword) !== '01' &&
      String(needChangePassword) !== '02'
    )
      return <Redirect to="/userLogin" />;
    if (pathname === '/userLogin') return this.judgeBeforeRenderLogin();
    if (pathname !== '/userLogin' && pathname.indexOf('/userLogin') !== -1)
      return this.judgeBeforeRenderLogin();
    if (pathname === '/twoFactorAuth') return children;
    const { isMobile } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const hasAuthority = () => {
      if (rawMenu.length === 0) {
        return false;
      }
      if (window.location.hash !== '#/') {
        const currentMenu = this.getCurrentMenu(rawMenu, pathname);
        loginSession.saveData('currentMenu', currentMenu);
        return !!currentMenu;
      }
      return true;
    };

    const layout = (
      <Layout style={{ height: 'inherit' }}>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          {isTop && !isMobile ? null : (
            <SiderMenu
              logo={logo}
              Authorized={Authorized}
              theme={navTheme}
              onCollapse={this.handleMenuCollapse}
              menuData={menuData}
              {...this.props}
            />
          )}
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          {isTop && !isMobile ? null : (
            <SiderMenu
              logo={logo}
              Authorized={Authorized}
              theme={navTheme}
              onCollapse={this.handleMenuCollapse}
              menuData={menuData}
              {...this.props}
            />
          )}
        </MediaQuery>
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right bottom',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
          id="layout"
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            currentUserRole={currentUserRole}
            {...this.props}
          />
          <Content style={this.getContentStyle()} className="main-layout-content">
            <Fragment>
              {!menuLoaded || privilegeLoading ? (
                <Spin />
              ) : (
                <Authorized authority={hasAuthority} noMatch={<Exception403 />}>
                  {!menuLoaded || privilegeLoading ? (
                    <Spin />
                  ) : (
                    <PageContainer>{children}</PageContainer>
                  )}
                </Authorized>
              )}
              <ContextMenu />
              <MediaQuery
                maxWidth={SCREEN.screenMdMax}
                minWidth={SCREEN.screenSmMin}
                maxHeight={SCREEN.screenXsMax}
              >
                <BackTop
                  target={() => document.getElementById('layout')}
                  visibilityHeight={visibilityHeight}
                />
              </MediaQuery>
              <MediaQuery maxWidth={SCREEN.screenXsMax}>
                <BackTop
                  target={() => document.getElementById('layout')}
                  visibilityHeight={visibilityHeight}
                />
              </MediaQuery>
            </Fragment>
          </Content>
          {resetModal && <ResetPwd needChangePassword={needChangePassword} />}
        </Layout>
      </Layout>
    );
    return (
      <Fragment>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          maxHeight={SCREEN.screenXsMax}
        >
          <DocumentTitle title={this.getPageTitle(pathname)}>
            <Context.Provider value={this.getContext()}>
              <div style={{ minWidth: 'auto' }}>{layout}</div>
            </Context.Provider>
          </DocumentTitle>
        </MediaQuery>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <DocumentTitle title={this.getPageTitle(pathname)}>
            <ContainerQuery query={query}>
              {params => (
                <Context.Provider value={this.getContext()}>
                  <div className={classNames(params)}>{layout}</div>
                </Context.Provider>
              )}
            </ContainerQuery>
          </DocumentTitle>
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <DocumentTitle title={this.getPageTitle(pathname)}>
            <ContainerQuery query={query}>
              {params => (
                <Context.Provider value={this.getContext()}>
                  <div className={classNames(params)}>{layout}</div>
                </Context.Provider>
              )}
            </ContainerQuery>
          </DocumentTitle>
        </MediaQuery>
        <MediaQuery maxWidth={SCREEN.screenXsMax}>
          <DocumentTitle title={this.getPageTitle(pathname)}>
            <Context.Provider value={this.getContext()}>
              <div style={{ minWidth: 'auto' }}>{layout}</div>
            </Context.Provider>
          </DocumentTitle>
        </MediaQuery>
      </Fragment>
    );
  }
}

export default withRouter(
  connect(({ global, setting, login, loading }) => ({
    collapsed: global.collapsed,
    currentUserRole: global.currentUserRole,
    currentUserGlobal: global.currentUser,
    layout: setting.layout,
    menuData: global.menu,
    rawMenu: global.rawMenu,
    resetModal: login.resetModal,
    needChangePassword: global.needChangePassword,
    menuLoaded: global.menuLoaded,
    leafMenuSpecialGroup: global.leafMenuSpecialGroup,
    privilegeLoading: loading.effects['global/fetchPrivileges'],
    ...setting,
  }))(BasicLayout)
);
