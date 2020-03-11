import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import ModalForm from './ModalForm';
import style from './index.less';

@connect(({ global }) => ({
  global,
}))
class ContextMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      visible: false,
      compCode: '',
      privName: '',
      partyName: '',
      comments: '',
    };
  }

  componentDidMount() {
    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('click', this.handleClick);
  }

  initState = () => {
    this.setState({
      menuShow: false,
      compCode: '',
      privName: '',
      comments: '',
    });
  };

  handleContextMenu = event => {
    this.initState();
    if ('compCode' in event.target.dataset) {
      event.preventDefault();
      this.setState({ menuShow: true, compCode: event.target.dataset.compCode });
      this.showMenu(event);
    }
  };

  handleClick = event => {
    const { menuShow } = this.state;
    if (menuShow && !String(event.target.className).includes('context_menu_option')) {
      this.setState({ menuShow: false });
    }
  };

  /* openComponentModal = () => {
    const { dispatch } = this.props;
    const { compCode, menuId } = this.state;
    dispatch({
      type: 'priv/checkComponentPrivilege',
      payload: {
        menuId,
        objId: compCode,
      },
    }).then(data => {
      this.setState({ visible: true, menuShow: false });
      if (data) {
        this.setState({
          hasPriv: true,
          privId: data.privId,
          privName: data.privName,
          comments: data.comments,
        });
      }
    });
  }; */

  showMenu = event => {
    const clickX = event.clientX;
    const clickY = event.clientY;
    this.root.style.left = `${clickX + 5}px`;
    this.root.style.top = `${clickY + 5}px`;
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  /* handleOk = () => {
    const { form } = this.formRef.props;
    const { dispatch } = this.props;
    const { compCode, hasPriv, privId, menuId } = this.state;
    const method = hasPriv ? 'PUT' : 'POST';
    form.validateFields(['privName', 'comments'], (err, values) => {
      if (err) {
        return;
      }
      const params = {
        ...values,
        method,
        menuId,
        objId: compCode,
      };
      if (hasPriv) {
        params.privId = privId;
      }
      dispatch({
        type: 'priv/addComponentPrivilege',
        payload: params,
      }).then(() => {
        this.setState({ visible: false });
      });
    });
  }; */

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { menuShow, compCode, privName, partyName, visible, comments } = this.state;
    const otherProps = {
      privName,
      partyName,
      compCode,
      comments,
    };
    return (
      <React.Fragment>
        {menuShow && (
          <div
            ref={ref => {
              this.root = ref;
            }}
            className={style.contextMenu}
          >
            <a className={style.context_menu_option}>
              {formatMessage({ id: 'SET_COMPONENT_PRIVILEGE' })}
            </a>
          </div>
        )}
        <ModalForm
          {...otherProps}
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />
      </React.Fragment>
    );
  }
}

export default ContextMenu;
