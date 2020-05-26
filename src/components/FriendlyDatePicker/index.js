import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';

class FriendlyDatePicker extends PureComponent {
  state = {
    format: 'DD-MMM-YYYY',
  };

  componentDidMount() {
    const { displayFormat } = this.props;
    if (displayFormat) {
      this.setState({ format: displayFormat });
    }
  }

  toggleOpen = open => {
    const { searchFormat, displayFormat } = this.props;
    if (open) {
      this.setState({ format: searchFormat || 'DD-MMM-YYYY' });
    } else {
      this.setState({ format: displayFormat || 'DD-MMM-YYYY' });
    }
  };

  render() {
    const { format } = this.state;
    const { searchFormat, displayFormat, ...otherProps } = this.props;

    return (
      <DatePicker
        format={format}
        onOpenChange={status => this.toggleOpen(status)}
        {...otherProps}
      />
    );
  }
}

export default FriendlyDatePicker;
