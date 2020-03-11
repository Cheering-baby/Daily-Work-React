import React, { Component } from 'react';
import { Button, Icon, Popover, Tabs } from 'antd';
import { formatMessage } from 'umi/locale';

const { TabPane } = Tabs;
const DEFAULT = formatMessage({ id: 'COMMON_SELECT_ICON' });
const getDefaultIcon = props => {
  let { iconUrl } = props;
  if (!iconUrl || iconUrl === '') iconUrl = DEFAULT;
  return iconUrl;
};

class IconTab extends Component {
  static defaultProps = {
    iconClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      iconUrl: getDefaultIcon(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { iconUrl } = this.props;
    const { iconUrl: stateIcon } = this.state;
    if (
      (iconUrl === nextProps.iconUrl && nextProps.iconUrl !== stateIcon) ||
      iconUrl !== nextProps.iconUrl
    ) {
      this.refresh(nextProps);
    }
  }

  refresh = props => {
    this.setState({ iconUrl: getDefaultIcon(props) });
  };

  tabClick = icon => {
    const { iconClick } = this.props;
    this.setState({ visible: false, iconUrl: icon });
    iconClick(icon);
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  renderIcon = () => {
    const { iconArr = [] } = this.props;
    return (
      <div className="iconfontpicker-list">
        {iconArr.length > 0 ? (
          <Tabs defaultActiveKey={`page${iconArr[0].page}`}>
            {iconArr.map((item, index) => (
              <TabPane tab={index} key={`page${item.page}`}>
                <div className="well">
                  {item.list &&
                    item.list.length > 0 &&
                    item.list.map(icon => (
                      <Icon key={`icon_${icon}`} type={icon} onClick={() => this.tabClick(icon)} />
                    ))}
                </div>
              </TabPane>
            ))}
          </Tabs>
        ) : (
          formatMessage({ id: 'COMMPN_DATA_EMPTY' })
        )}
      </div>
    );
  };

  render() {
    const { visible, iconUrl } = this.state;
    const { disabled } = this.props;
    return (
      <Popover
        placement="top"
        title="please choose"
        content={this.renderIcon()}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        trigger="click"
      >
        <Button disabled={disabled}>{iconUrl}</Button>
      </Popover>
    );
  }
}

export default IconTab;
