import React from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Radio,
  Spin,
  TreeSelect,
  Upload,
} from 'antd';
import MediaQuery from 'react-responsive';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import ReactQuill, { Quill } from 'react-quill';
import styles from '../index.less';
import 'react-quill/dist/quill.snow.css';
import NotificationTemplate from './NotificationTemplate';
import MobileModal from '@/components/MobileModal';
import SCREEN from '@/utils/screen';
import { getUrl, handleDownFile, isNvl } from '@/utils/utils';
import { getAllChildrenTargetList, getAllTargetList } from '../utils/pubUtils';

const formItemHalfLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 20,
  },
  colon: false
};

const SALES_SUPPORT_ROLE_KEY = 'SALES_SUPPORT';

const Link = Quill.import('formats/link');

class LinkFile extends Link {
  static create(value) {
    const node = super.create(value);
    if (typeof value !== 'object') return node;
    const file = document.createElement('a');
    file.setAttribute('href', value.url);
    file.setAttribute('target', '_blank');
    // file.dataset.fileName = value.name;
    file.innerText = value.name;
    return file;
  }
}

LinkFile.blotName = 'link';
LinkFile.tagName = 'A';
const actionUrl = `${getUrl()}/common/upload`;
const downUrl = `${getUrl()}/common/downloadFile`;

@Form.create()
@connect(({ notification, notificationSearchForm }) => ({
  notification,
  notificationSearchForm,
}))
class NotificationEdit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
          { align: [] },
        ],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ['link', 'image'],
      ],
    };
    this.state = {
      noticeFileLoadingFlag: false,
    };
    this.commit = this.commit.bind(this);
  };

  componentDidMount() {
    const { dispatch, form, notificationType, type = 'NEW', notification: { notificationInfo } } = this.props;
    form.resetFields();
    dispatch({
      type: 'notification/saveData',
      payload: {
        type: notificationType,
        filter: {
          type: notificationType,
        },
      },
    });
    dispatch({
      type: 'notificationSearchForm/queryNotificationTypeList',
    });
    dispatch({
      type: 'notificationSearchForm/queryStatusList',
    });
    dispatch({ type: 'notificationSearchForm/queryAllCompanyConfig' }).then(e => {
      const { notificationSearchForm: { targetTreeData } } = this.props;
      if(type === 'NEW') {
        dispatch({
          type: 'notification/saveData',
          payload: {
            defaultTargetList: [{targetObj: `${SALES_SUPPORT_ROLE_KEY}`, targetType: '02'}],
          }
        });
      } else if(type === 'EDIT' && notificationInfo && notificationInfo.targetList) {
        // load data
        const userList = notificationInfo.targetList.filter(item => item.targetType === '03');
        dispatch({
          type: 'notificationSearchForm/queryRoleByUsers',
          payload: {
            targetList: userList,
          }
        }).then(e => {
          const defaultTargetList = notificationInfo.targetList.filter(e => e.targetType !== '05')
          dispatch({
            type: 'notification/saveData',
            payload: {
              defaultTargetList,
            },
          });
        })
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/cleanData',
      payload: {},
    });
  }

  onSelectTemplate =(targetList, content, fileList)=> {
    const { dispatch, form,
      notificationSearchForm: { targetTreeData },
    } = this.props;
    // update targetList
    form.setFieldsValue({ fileList: this.normFile(fileList) || [] });
    // update content
    if (content) {
      if (this.reactQuillRef && this.reactQuillRef.getEditor) {
        this.quillRef = this.reactQuillRef.getEditor();
        const delta = [{ insert: ''}, { insert: '\n'}];
        this.quillRef.setContents(delta);
        this.quillRef.pasteHTML(content);
      }
    }

    if (targetList && targetList.length > 0) {
      const userList = targetList.filter(item => item.targetType === '03');
      dispatch({
        type: 'notificationSearchForm/queryRoleByUsers',
        payload: {
          targetList: userList,
        }
      }).then(e => {
        let tList = [];
        let newTargetList = [];
        this.initAllChildrenTargetList(targetList, targetTreeData, newTargetList);
        tList = this.initAllTargetList(newTargetList, targetTreeData);
        const roleList = targetList.filter(item => item.targetType === '02').map(item => `role${item.targetObj}`);
        tList = [...tList, ...roleList];
        form.setFieldsValue({ targetList: tList });
      })
    }
  };

  commit = e => {
    e.preventDefault();
    const {
      dispatch,
      form,
      type = 'NEW',
      notification: { notificationInfo, defaultTargetList },
    } = this.props;
    form.validateFields(err => {
      if (!err) {
        let dispatchType;
        if (type === 'NEW') {
          dispatchType = 'notification/fetchAddNotification';
          if(defaultTargetList && defaultTargetList.length > 0) {
            notificationInfo.targetList = defaultTargetList;
          }
          notificationInfo.id = null;
          notificationInfo.notificationId = null;
        } else {
          dispatchType = 'notification/fetchModifyNotification';
          notificationInfo.notificationId = notificationInfo.id;
        }
        const editor = this.reactQuillRef.getEditor();
        const unprivilegedEditor = this.reactQuillRef.makeUnprivilegedEditor(editor);

        const content = unprivilegedEditor.getHTML();
        notificationInfo.content = content;
        if (isNvl(content) || content === '<p><br></p>') {
          message.warn(formatMessage({ id: 'NOTICE_PUBLISH_CONTENT_NULL' }), 10);
          return;
        }
        if (isNvl(notificationInfo.scheduleDate) && String(notificationInfo.status) === '03') {
          message.warn(formatMessage({ id: 'NOTICE_SCHEDULE_DATE_NULL' }), 10);
          return;
        }
        if (
          String(notificationInfo.status) === '03' &&
          moment(notificationInfo.scheduleDate, 'YYYY-MM-DD HH:mm:ss') <= moment()
        ) {
          message.warn(formatMessage({ id: 'NOTICE_SCHEDULE_DATE_INVALID' }), 10);
          return;
        }
        dispatch({
          type: dispatchType,
          payload: notificationInfo,
        }).then(result => {
          if (result) {
            router.goBack();
          }
        });
      }
    });
  };

  onHandleTemplateModal = visibleFlag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/saveData',
      payload: {
        visibleFlag,
      },
    });
  };

  giveUp = e => {
    e.preventDefault();
    Modal.confirm({
      title: formatMessage({ id: 'LEAVE_NOTICE_TITLE' }),
      content: formatMessage({ id: 'LEAVE_NOTICE_CONTENT' }),
      okText: formatMessage({ id: 'COMMON_YES' }),
      cancelText: formatMessage({ id: 'COMMON_NO' }),
      icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
      onOk: () => {
        router.goBack();
      },
    });
  };

  fileBeforeChange = file =>
    new Promise(async (resolve, reject) => {
      const isFileType =
        file.type === 'text/csv' ||
        file.type === 'application/msword' ||
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'text/plain' ||
        file.type === 'application/zip';
      const pattern = /^.*?[.](csv|pdf|txt|doc|docx|xls|xlsx|zip|rar)$/;
      const isCheckFileType = pattern.test(String(file.name).toLowerCase());
      if (!(isCheckFileType || isFileType)) {
        message.error(formatMessage({ id: 'FILE_SUPPORT_EXTENSION' }));
      }
      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        message.error(formatMessage({ id: 'NOTICE_UPLOAD_FILE_TYPE' }));
      }
      if ((isCheckFileType || isFileType) && isLt10M) {
        resolve(file);
      } else {
        reject();
      }
    });

  onHandleDelNotificationFile = file => {
    const {
      dispatch,
      notification: { notificationInfo },
    } = this.props;
    dispatch({
      type: 'notification/fetchDeleteNotificationFile',
      payload: {
        fileName: file.fileName,
        path: file.filePath,
        filePath: file.filePath,
      },
    }).then(flag => {
      if (flag) {
        let newFiles = [];
        if (notificationInfo && notificationInfo.fileList && notificationInfo.fileList.length > 0) {
          newFiles = [...notificationInfo.fileList];
        }
        newFiles = newFiles.filter(item => item.fileName !== file.fileName);
        dispatch({
          type: 'notification/saveData',
          payload: {
            notificationInfo: {
              ...notificationInfo,
              fileList: newFiles,
            },
          },
        });
      }
    });
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const {
      dispatch,
      form,
      notification: { notificationInfo },
    } = this.props;
    let newNotificationInfo = {};
    if (!isNvl(notificationInfo)) {
      newNotificationInfo = { ...notificationInfo };
    }
    if (String(key) === 'saveTemplate') {
      form.setFieldsValue({ saveTemplate: keyValue });
      Object.assign(newNotificationInfo, { saveTemplate: keyValue });
    } else {
      const noVal = !isNvl(keyValue) ? String(keyValue).trim() : '';
      if (String(key) !== 'scheduleDate') {
        form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
      }
      const source = JSON.parse(`{"${key}":"${noVal}"}`);
      Object.assign(newNotificationInfo, source);
      if (String(key) === 'status' && String(keyValue) !== '02') {
        Object.assign(newNotificationInfo, { scheduleDate: '' });
      }
    }
    dispatch({
      type: 'notification/saveData',
      payload: {
        notificationInfo: {
          ...newNotificationInfo,
        },
      },
    });
  };

  normFile = fileList => {
    const newFileList = [];
    if (fileList && fileList.length > 0) {
      fileList.forEach((n, key) =>
        newFileList.push({
          uid: isNvl(n.uid) ? `-${key}` : n.uid,
          name: n.fileSourceName,
          status: 'done',
          url: n.filePath,
          response: {
            result: {
              filePath: n.filePath,
              fileName: n.fileName,
              fileSourceName: n.fileSourceName,
            },
          },
        })
      );
    }
    return newFileList || [];
  };

  onHandleFileChange = ({ file, fileList, event }) => {
    const {
      dispatch,
      notification: { notificationInfo },
    } = this.props;
    const {
      uid,
      status,
      response: { result: { filePath, fileName, fileSourceName } = '' } = '',
    } = file;
    let newFiles = [];
    if (notificationInfo && notificationInfo.fileList && notificationInfo.fileList.length > 0) {
      newFiles = [...notificationInfo.fileList];
    }
    if (typeof uid === 'string' && status === 'error') {
      message.error('Failed to upload.');
      newFiles = newFiles.filter(item => item.fileName !== file.fileName);
    }
    if (typeof uid === 'string' && status === 'uploading') {
      newFiles = newFiles.filter(item => item.fileName !== file.fileName);
    }
    if (typeof uid === 'string' && status === 'done') {
      newFiles = newFiles.filter(item => item.fileName !== file.fileName);
      const noticeFile = {
        fileName,
        filePath,
        fileSourceName,
        uploadStatus: '00',
        fileField: 'noticeFile',
      };
      newFiles.push(noticeFile);
      dispatch({
        type: 'notification/saveData',
        payload: {
          notificationInfo: {
            ...notificationInfo,
            fileList: newFiles,
          },
        },
      });
    }
    return {
      file,
      fileList,
      event,
    };
  };

  onHandleTreeChange = values => {
    const {
      dispatch,
      form,
      notification: { notificationInfo },
      notificationSearchForm: { targetTreeData },
    } = this.props;
    let newNotificationInfo = {};
    if (!isNvl(notificationInfo)) {
      newNotificationInfo = { ...notificationInfo };
    }
    let newTargetList = [];
    if (
      !isNvl(newNotificationInfo) &&
      newNotificationInfo.targetList &&
      newNotificationInfo.targetList.length > 0
    ) {
      newTargetList = [...newNotificationInfo.targetList];
    }
    if (values && values.length > 0) {
      const aaList = [];
      newTargetList = [];
      getAllTargetList(values, targetTreeData, aaList);
      getAllChildrenTargetList(aaList, newTargetList);
    } else {
      newTargetList = [];
    }
    form.setFieldsValue({ targetList: values });
    Object.assign(newNotificationInfo, { targetList: newTargetList });
    dispatch({
      type: 'notification/saveData',
      payload: {
        defaultTargetList: [],
        notificationInfo: {
          ...newNotificationInfo,
        },
      },
    });
  };

  initAllChildrenTargetList = (targetList, targetTreeData, newTargetList) => {
    if (!targetTreeData) return [];
    targetTreeData.forEach(item => {
      let targetObj = `${item.key}`.replace('customerGroup', '').replace('market', '');
      if(targetObj.startsWith("&{") && targetObj.indexOf("}&.") > -1){
        targetObj = item.title;
      }
      const hasTarget = targetList.findIndex(n => String(n.targetObj) === String(targetObj)) > -1;
      const existNewTargetList =
        newTargetList.findIndex(
          e => {
            const value = `${e.key}`.replace('customerGroup', '').replace('market', '');
            if(value.startsWith("&{") && value.indexOf("}&.") > -1){
              return `${e.title}` === targetObj;
            }
            return value === targetObj;
          }) > -1;
      if (hasTarget && !existNewTargetList) {
        newTargetList.push(item);
      } else if (item.children && item.children.length > 0) {
        this.initAllChildrenTargetList(targetList, item.children, newTargetList);
      }
    });
    return newTargetList;
  };

  resetTreeNodeCheckbox = (treeList) => {
    if (treeList && treeList.children && treeList.children.length > 0) {
      treeList.children.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(j => {
            j.disableCheckbox = '';
          });
        }
      });
    }
  };

  clearSelectNode = (allTreeData) => {
    if(!allTreeData || allTreeData.length < 1) return allTreeData;
    allTreeData.forEach(item => {
      this.resetTreeNodeCheckbox(item);
    });
    return allTreeData;
  };

  // set the node in disable whose value is the same as selected node
  disableSameNode = (selectedList, allTreeData) => {
    if (!selectedList || selectedList.length < 1) return this.clearSelectNode(allTreeData);
    const compareList = [];
    selectedList.forEach(item => {
      if (item.startsWith("&{") && item.indexOf("}&.") > -1) {
        compareList.push(item);
      }
      if (item.indexOf('customerGroup') > -1) {
        compareList.push(item.replace('customerGroup', 'market'));
      }
      if (item.indexOf('market') > -1) {
        compareList.push(item.replace('market', 'customerGroup'));
      }
    });
    const initTreeData = [];
    const marketTree = allTreeData.find(n => String(n.key) === 'market') || {};
    const customerGroupTree = allTreeData.find(n => String(n.key) === 'customerGroup') || {};
    const userTree = allTreeData.find(n => String(n.key) === 'RWS') || {};

    if (marketTree && marketTree.children && marketTree.children.length > 0) {
      marketTree.children.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(j => {
            j.disableCheckbox = '';
            const hasTarget = compareList.findIndex(n => String(n) === String(j.key)) > -1;
            if (hasTarget) {
              j.disableCheckbox = true;
            }
          });
        }
      });
      initTreeData.push(marketTree);
    }

    if (customerGroupTree && customerGroupTree.children && customerGroupTree.children.length > 0) {
      customerGroupTree.children.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(j => {
            j.disableCheckbox = '';
            const hasTarget = compareList.findIndex(n => String(n) === String(j.key)) > -1;
            if (hasTarget) {
              j.disableCheckbox = true;
            }
          });
        }
      });
      initTreeData.push(customerGroupTree);
    }
    if (userTree && userTree.children && userTree.children.length > 0) {
      userTree.children.forEach(item => {
        if (item.children && item.children.length > 0) {
          const parentRoleCode = item.title;
          item.children.forEach(j => {
            j.disableCheckbox = '';
            const hasTarget = compareList.findIndex(n => {
              const value = String(n);
              if (value.startsWith("&{") && value.indexOf("}&.") > -1) {
                const userCode = value.slice(value.indexOf("}&.") + 3);
                const roleCode = value.slice(value.indexOf("&{") + 2, value.indexOf("}&."));
                return parentRoleCode !== roleCode && userCode === String(j.title);
              }
              return false;
            }) > -1;
            if (hasTarget) {
              j.disableCheckbox = true;
            }
          });
        }
      });
      initTreeData.push(userTree);
    }
    return initTreeData;
  };

  initAllTargetList = (targetList, targetTreeData) => {
    if (!targetTreeData) return [];
    const marketTree = targetTreeData.find(n => String(n.key) === 'market') || {};
    const customerGroupTree = targetTreeData.find(n => String(n.key) === 'customerGroup') || {};
    const roleTree = targetTreeData.find(n => String(n.key) === 'RWS') || {};
    let treeList = [];
    if (marketTree && marketTree.children && marketTree.children.length > 0) {
      marketTree.children.forEach(item => {
        let onLen = 0;
        const tlist = [];
        if (item.children && item.children.length > 0) {
          item.children.forEach(j => {
            const hasTarget = targetList.findIndex(n => String(n.key) === String(j.key)) > -1;
            if (hasTarget) {
              tlist.push(j.key);
              onLen += 1;
            }
          });
          if (item.children.length === onLen && onLen !== 0) {
            tlist.length = 0;
            tlist.push(item.key);
          }
        }
        treeList = [...treeList, ...tlist];
      });
    }
    if (customerGroupTree && customerGroupTree.children && customerGroupTree.children.length > 0) {
      customerGroupTree.children.forEach(item => {
        let onLen = 0;
        const tlist = [];
        if (item.children && item.children.length > 0) {
          item.children.forEach(j => {
            const hasTarget = targetList.findIndex(n => String(n.key) === String(j.key)) > -1;
            if (hasTarget) {
              tlist.push(j.key);
              onLen += 1;
            }
          });
          if (item.children.length === onLen && onLen !== 0) {
            tlist.length = 0;
            tlist.push(item.key);
          }
        }
        treeList = [...treeList, ...tlist];
      });
    }
    if (roleTree && roleTree.children && roleTree.children.length > 0) {
      roleTree.children.forEach(item => {
        let onLen = 0;
        const tlist = [];
        if (item.children && item.children.length > 0) {
          item.children.forEach(j => {
            const hasTarget = targetList.findIndex(n => String(n.key) === String(j.key)) > -1;
            if (hasTarget) {
              tlist.push(j.key);
              onLen += 1;
            }
          });
          if (item.children.length === onLen && onLen !== 0) {
            tlist.length = 0;
            tlist.push(item.key);
          }
        }
        treeList = [...treeList, ...tlist];
      });
    }
    return treeList;
  };

  onLoadData = treeNode  => {
    return new Promise(resolve => {
      const { children, value } = treeNode.props;
      if(children && children.length > 0) {
        resolve();
        return;
      }
      const{ dispatch } = this.props;
      if(value.indexOf('role') === 0) {
        setTimeout(() => {
          dispatch({
            type: 'notificationSearchForm/queryAllUserByRole',
            payload: {
              roleCode: value.replace('role', ''),
            },
          });
          resolve();
        }, 300);
      }
    });
  };
  getTemplateModalHtml =()=>{
    return <NotificationTemplate onSelectTemplate={(targetList, content, fileList) => this.onSelectTemplate(targetList, content, fileList)} />;
  }

  render() {
    const {
      form,
      type,
      notification: { notificationInfo, defaultTargetList, visibleFlag },
      notificationSearchForm: { notificationTypeList, statusList, targetTreeData },
    } = this.props;
    const { noticeFileLoadingFlag } = this.state;
    const { getFieldDecorator } = form;
    const modalOpts = {
      title: formatMessage({ id: 'SELECT_TEMPLATE_TITLE' }),
      visible: visibleFlag,
      onCancel: () => this.onHandleTemplateModal(false),
      footer: null,
    };
    const comProps = {
      accept: '.csv, .pdf, .txt, .doc, .docx, .xls, .xlsx, .zip, .rar',
      name: 'file',
      action: actionUrl,
      headers: new Headers({
        Origin: '*',
        'App-Code': 'PAMS',
      }),
      FormData: 'file',
      multiple: false,
    };
    const fileProps = {
      ...comProps,
      data: { type: 'noticeFile' },
      onPreview: () => {},
      onChange: changeValue => this.onHandleFileChange(changeValue),
      onRemove: file => {
        const { status, response: { result: { filePath, fileName } = '' } = '' } = file;
        if (status === 'done') {
          this.onHandleDelNotificationFile({ uid: file.uid, fileName, filePath });
        }
      },
      beforeUpload: file => this.fileBeforeChange(file),
      // fileList: newTaFileList||[],
      onDownload: file => {
        const { response: { result: { filePath, fileName, fileSourceName } = '' } = '' } = file;
        const reqParamJson = {
          fileName,
          filePath,
        };
        handleDownFile(
          downUrl,
          reqParamJson,
          fileSourceName,
          () => this.setState({ noticeFileLoadingFlag: true }),
          () => this.setState({ noticeFileLoadingFlag: false })
        );
      },
    };
    let tList = form.getFieldValue('targetList');
    if(defaultTargetList && defaultTargetList.length > 0) {
      if(type === 'EDIT') {
        const newTargetList = [];
        this.initAllChildrenTargetList(defaultTargetList, targetTreeData, newTargetList);
        tList = this.initAllTargetList(newTargetList, targetTreeData);
        const roleList = defaultTargetList.filter(item => item.targetType === '02').map(item => `role${item.targetObj}`);
        tList = [...tList, ...roleList];
      } else if(type === 'NEW') {
        tList = [`role${SALES_SUPPORT_ROLE_KEY}`];
      }
    }
    const initTargetList = this.disableSameNode(tList, targetTreeData);
    const tProps = {
      allowClear: true,
      showSearch: true,
      multiple: true,
      treeData: initTargetList,
      value: tList || [],
      onChange: value => this.onHandleTreeChange(value),
      onSelect: (value, treeNode) => this.onLoadData(treeNode),
      treeCheckable: true,
      treeNodeFilterProp: 'title',
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      searchPlaceholder: formatMessage({ id: 'NOTICE_PLEASE_SELECT' }),
      loadData: treeNode => this.onLoadData(treeNode),
      getPopupContainer: () => document.getElementById(`noticeViewEdit`),
      style: {
        width: '100%',
      },
      dropdownStyle: {
        maxHeight: '300px',
      },
    };
    return (
      <React.Fragment>
        <Card className={styles.notificationEditCard} id="noticeViewEdit">
          <Form onSubmit={this.commit}>
            {String(type).toUpperCase() === 'NEW' && (
              <p className={styles.title}>{formatMessage({ id: 'PUBLISH_NEW_BULLETIN' })}</p>
            )}
            {String(type).toUpperCase() === 'EDIT' && (
              <p className={styles.title}>{formatMessage({ id: 'PUBLISH_EDIT_BULLETIN' })}</p>
            )}
            <Form.Item
              label={`${formatMessage({ id: 'TITLE' })} :`}
              className={styles.titleLabelItem}
              {...formItemHalfLayout}
            >
              <Input.Group compact={'compact' ? 1 : 0}>
                <div className={styles.titleItem}>
                  {getFieldDecorator(`title`, {
                    initialValue: notificationInfo.title || null,
                    rules: [{ required: true, message: formatMessage({ id: 'NOTICE_REQUIRED' }) }],
                  })(
                    <Input
                      allowClear
                      placeholder={formatMessage({ id: 'NOTICE_PLEASE_ENTER' })}
                      onChange={e => this.onHandleChange('title', e.target.value, 'title')}
                      onPressEnter={e => this.onHandleChange('title', e.target.value, 'title')}
                    />
                  )}
                </div>
                <a
                  className={styles.templateSelect}
                  onClick={() => this.onHandleTemplateModal(true)}
                >
                  {formatMessage({ id: 'SELECT_TEMPLATE' })}
                </a>
              </Input.Group>
            </Form.Item>
            <Form.Item {...formItemHalfLayout} label={formatMessage({ id: 'REASON_SCOPE_ROLE' })}>
              {getFieldDecorator(`targetList`, {
                initialValue: tList || [],
                rules: [{ required: true, message: formatMessage({ id: 'NOTICE_REQUIRED' }) }],
              })(<TreeSelect {...tProps} />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'COMMUNICATION_TYPE' })}>
              {getFieldDecorator(`type`, {
                initialValue: notificationInfo.type || null,
                rules: [{ required: true, message: formatMessage({ id: 'NOTICE_REQUIRED' }) }],
              })(
                <Radio.Group
                  style={{ marginTop: '6px' }}
                  onChange={e => this.onHandleChange('type', e.target.value, 'type')}
                >
                  {notificationTypeList &&
                    notificationTypeList.length > 0 &&
                    notificationTypeList.map(item => {
                      return (
                        <Radio key={item.id} value={item.dicValue}>
                          {item.dicName}
                        </Radio>
                      );
                    })}
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item
              {...formItemHalfLayout}
              label={`${formatMessage({ id: 'PUBLISH_CONTENT' })} :`}
              className={styles.notificationEditCardQuill}
            >
              <div>
                <ReactQuill
                  placeholder={formatMessage({ id: 'NOTICE_PLEASE_ENTER' })}
                  id="noticeViewEditQuill"
                  bounds="#noticeViewEditQuill"
                  className={styles.reactQuillStyle}
                  defaultValue={notificationInfo.content || null}
                  ref={el => {
                    this.reactQuillRef = el;
                  }}
                  theme="snow"
                  modules={this.modules}
                />
              </div>
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'FILE' })}
              extra={formatMessage({ id: 'FILE_SUPPORT_EXTENSION' })}
            >
              <Spin spinning={noticeFileLoadingFlag}>
                {getFieldDecorator('fileList', {
                  valuePropName: 'fileList',
                  initialValue: this.normFile(notificationInfo.fileList) || [],
                  getValueFromEvent: e => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e && e.fileList;
                  },
                  rules: [],
                })(
                  <Upload {...fileProps}>
                    <Button icon="upload" className={styles.fileUploadBtn}>
                      {formatMessage({ id: 'SUPPORT_CLICK_TO_UPLOAD' })}
                    </Button>
                  </Upload>
                )}
              </Spin>
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'STATE' })}>
              {getFieldDecorator(`status`, {
                initialValue: notificationInfo.status || null,
                rules: [{ required: true, message: formatMessage({ id: 'NOTICE_REQUIRED' }) }],
              })(
                <Radio.Group
                  onChange={e => this.onHandleChange('status', e.target.value, 'status')}
                >
                  {statusList &&
                    statusList.length > 0 &&
                    statusList.map(item => {
                      if (String(item.dicValue) === '03') {
                        return (
                          <Radio
                            key={item.id}
                            value={item.dicValue}
                            className={styles.scheduledCheckbox}
                          >
                            {item.dicName}
                            <DatePicker
                              disabled={String(notificationInfo.status) !== '03'}
                              value={
                                !isNvl(notificationInfo.scheduleDate)
                                  ? moment(notificationInfo.scheduleDate, 'YYYY-MM-DD HH:mm:ss')
                                  : null
                              }
                              placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                              onChange={date =>
                                this.onHandleChange(
                                  'scheduleDate',
                                  isNvl(date) ? date : date.format('YYYY-MM-DD'),
                                  'scheduleDate'
                                )
                              }
                            />
                          </Radio>
                        );
                      }
                      return (
                        <Radio key={item.id} value={item.dicValue}>
                          {item.dicName}
                        </Radio>
                      );
                    })}
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item className={styles.saveTemplateItem} extra={formatMessage({ id: 'NOTE' })}>
              {getFieldDecorator(`saveTemplate`, {
                valuePropName: 'checked',
                initialValue: notificationInfo.saveTemplate || false,
                rules: [{ required: false, message: formatMessage({ id: 'NOTICE_REQUIRED' }) }],
              })(
                <Checkbox
                  onChange={e =>
                    this.onHandleChange('saveTemplate', e.target.checked, 'saveTemplate')
                  }
                >
                  {formatMessage({ id: 'SAVE_AS_TEMPLATE' })}
                </Checkbox>
              )}
            </Form.Item>
          </Form>
          <Divider />
          <div style={{ float: 'right' }}>
            <Button htmlType="button" onClick={this.giveUp}>
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="primary"
              htmlType="button"
              onClick={this.commit}
            >
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          </div>
        </Card>
        {visibleFlag && (
          <React.Fragment>
            <MediaQuery
              maxWidth={SCREEN.screenMdMax}
              minWidth={SCREEN.screenSmMin}
              maxHeight={SCREEN.screenXsMax}
            >
              <MobileModal modalOpts={modalOpts}>{this.getTemplateModalHtml()}</MobileModal>
            </MediaQuery>
            <MediaQuery
              maxWidth={SCREEN.screenMdMax}
              minWidth={SCREEN.screenSmMin}
              minHeight={SCREEN.screenSmMin}
            >
              <Modal
                title={formatMessage({ id: 'SELECT_TEMPLATE_TITLE' })}
                visible={visibleFlag}
                onCancel={() => this.onHandleTemplateModal(false)}
                footer={null}
                // className={styles.contractHisModal}
                width="768px"
                bodyStyle={{
                  height: '450px',
                  overflowY: 'auto',
                  padding: '8px 16px',
                }}
                id="contractHisModalView"
              >
                {this.getTemplateModalHtml()}
              </Modal>
            </MediaQuery>
            <MediaQuery minWidth={SCREEN.screenLgMin}>
              <Modal
                title={formatMessage({ id: 'SELECT_TEMPLATE_TITLE' })}
                visible={visibleFlag}
                onCancel={() => this.onHandleTemplateModal(false)}
                footer={null}
                // className={styles.contractHisModal}
                width="768px"
                bodyStyle={{
                  height: '450px',
                  overflowY: 'auto',
                  padding: '8px 16px',
                }}
                id="contractHisModalView"
              >
                {this.getTemplateModalHtml()}
              </Modal>
            </MediaQuery>
            <MediaQuery maxWidth={SCREEN.screenXsMax}>
              <MobileModal modalOpts={modalOpts}>{this.getTemplateModalHtml()}</MobileModal>
            </MediaQuery>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default NotificationEdit;
