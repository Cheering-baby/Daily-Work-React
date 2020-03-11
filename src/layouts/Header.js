import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import GlobalHeader from '../components/GlobalHeader';
import TopNavHeader from '../components/TopNavHeader';
import MobileHeader from '../components/MobileHeader';
import Authorized from '../utils/Authorized';
import SCREEN from '../utils/screen';

const { Header } = Layout;

class HeaderView extends PureComponent {
  state = {
    visible: true,
    popoverVisible: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 64px)' : 'calc(100% - 256px)';
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings/base');
      return;
    }
    if (key === 'changePassword') {
      this.setState({
        popoverVisible: false,
      });
      dispatch({
        type: 'login/save',
        payload: {
          resetModal: true,
        },
      });
    }
    if (key === 'logout') {
      this.setState({
        popoverVisible: false,
      });
      dispatch({
        type: 'login/logout',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
          this.scrollTop = scrollTop;
          return;
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
    this.ticking = false;
  };

  handleVisibleChange = () => {
    const { popoverVisible } = this.state;
    this.setState({
      popoverVisible: !popoverVisible,
    });
  };

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys = menuData => {
    let keys = [];
    menuData.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  };

  render() {
    const { isMobile, handleMenuCollapse, setting, menuData } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible, popoverVisible } = this.state;
    const isTop = layout === 'topmenu';
    // const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0 }} className={fixedHeader ? 'fixed-header' : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            Authorized={Authorized}
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onHandleVisibleChange={this.handleVisibleChange}
            popoverVisible={popoverVisible}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            popoverVisible={popoverVisible}
            onHandleVisibleChange={this.handleVisibleChange}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    const showMenuData = [...this.getFlatMenuKeys(menuData)];
    return (
      <React.Fragment>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          maxHeight={SCREEN.screenXsMax}
        >
          <MobileHeader
            theme={navTheme}
            onMenuClick={this.handleMenuClick}
            onCollapse={handleMenuCollapse}
            flatMenuKeys={showMenuData}
            {...this.props}
          />
        </MediaQuery>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <Animate component="" transitionName="fade">
            {HeaderDom}
          </Animate>
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <Animate component="" transitionName="fade">
            {HeaderDom}
          </Animate>
        </MediaQuery>
        <MediaQuery maxWidth={SCREEN.screenXsMax}>
          <MobileHeader
            theme={navTheme}
            onMenuClick={this.handleMenuClick}
            onCollapse={handleMenuCollapse}
            flatMenuKeys={showMenuData}
            {...this.props}
          />
        </MediaQuery>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, user }) => ({
  currentUser: global.currentUser,
  collapsed: global.collapsed,
  setting,
  user,
}))(HeaderView);
