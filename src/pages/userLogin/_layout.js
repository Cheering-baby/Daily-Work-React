import { connect } from 'dva';
import Redirect from 'umi/redirect';
import React, { PureComponent } from 'react';
import { getPageQuery } from '../../utils/utils';

class userLogin extends PureComponent {
  render() {
    const {
      children,
      location: { pathname },
      match,
    } = this.props;

    const params = getPageQuery();
    const { redirect } = params;
    const queryParams = redirect ? `?redirect=${redirect}` : '';
    if (pathname === '/userLogin') {
      return <Redirect push to={`${match.url}/pamsLogin${queryParams}`} />;
    }
    return <div>{children}</div>;
  }
}

export default connect(({ global, login }) => ({
  global,
  login,
}))(userLogin);
