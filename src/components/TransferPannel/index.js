import React, { Component } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import style from './index.less';

class TransferPannel extends Component {
  static defaultProps = {
    onChange: () => {},
  };

  componentDidMount() {}

  downAll = (type = true) => {
    const { upSelecRows, upList, onChange } = this.props;
    let filter = [];
    if (!type) {
      filter = upSelecRows.filter(v => !v.disabled);
    } else filter = upList.filter(v => !v.disabled);
    onChange(filter, 'down');
  };

  downSingle = () => {
    this.downAll(false);
  };

  upAll = (type = true) => {
    const { downSelectRows, downList, onChange } = this.props;
    let filter = [];
    if (!type) {
      filter = downSelectRows.filter(v => !v.disabled);
    } else filter = downList.filter(v => !v.disabled);
    onChange(filter, 'up');
  };

  upSingle = () => {
    this.upAll(false);
  };

  render() {
    const {
      upList = [],
      downList = [],
      upSelecRows = [],
      downSelectRows = [],
      direction = 'horizontal',
    } = this.props;
    return (
      <div
        className={classNames({
          [style.transferArea]: true,
          [style.vertical]: direction === 'vertical',
        })}
      >
        <Button
          data-comp-code="role_mgr_read_only"
          className="margin-right"
          icon="double-right"
          disabled={upList.length <= 0}
          onClick={this.downAll}
        />
        <Button
          // className="margin-right"
          data-comp-code="role_mgr_read_only"
          icon="down"
          disabled={upSelecRows.length <= 0}
          onClick={this.downSingle}
        />
        <Button
          // className="margin-right"
          data-comp-code="role_mgr_read_only"
          icon="up"
          disabled={downSelectRows.length <= 0}
          onClick={this.upSingle}
        />
        <Button
          // className="margin-right"
          data-comp-code="role_mgr_read_only"
          icon="double-left"
          disabled={downList.length <= 0}
          onClick={this.upAll}
        />
      </div>
    );
  }
}

export default TransferPannel;
