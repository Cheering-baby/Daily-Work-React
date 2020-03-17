import React from 'react';
import { formatMessage } from 'umi/locale';
import DetailForFileInformation from '@/components/DetailForFileInformation';

class ArApplyDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { activityDetail = {} } = this.props;
    const { activityInfo = {} } = activityDetail;
    const { content = '' } = activityInfo;
    const contentObj = content ? JSON.parse(content) : [];
    return (
      <DetailForFileInformation
        fileTxt={formatMessage({ id: 'AR_CREDIT_LIMIT' })}
        fileKeys={{
          labelName: 'fileName',
          labelPath: 'filePath',
          labelSourceName: 'fileSourceName',
        }}
        fileList={contentObj.uploadFiles || null}
        beforeDown={() => {}}
        afterDown={() => {}}
      />
    );
  }
}

export default ArApplyDetails;
