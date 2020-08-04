import React, { FC, useRef, useLayoutEffect, ReactNode } from 'react';
import { Modal, Form, Button, Input, message } from 'antd';
import { useModalForm } from '@/hooks/useModal';
import { WrappedFormUtils } from 'antd/lib/form/Form';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './SettingModal.less';
import { setDictionary, downloadFile, upload } from '@/services/copyright';
import { SettingResult } from '@/types/settingResult';

interface Props {
  visible: boolean;
  showModalKey: keyof SettingResult | '';
  setShowModalKey: (v: keyof SettingResult | '') => void;
  data: SettingResult;
  onChange: () => void;
  onVisible: () => void;
  title: string;
  form: WrappedFormUtils;
}
const SettingModal: FC<Props> = props => {
  const { visible, title, onVisible, onChange, data, showModalKey, setShowModalKey } = props;
  const { getFieldDecorator } = props.form;
  const saveDictionary = async (params: any) => {
    const { success } = await setDictionary(params);
    if (success) {
      return true;
    }
    return false;
  };
  const reactQuillRef = useRef<ReactQuill>();
  useLayoutEffect(() => {
    if (visible) {
      (async () => {
        if (['termsConditions', 'frequentlyAskedQuestions', 'contactUs'].includes(showModalKey)) {
          const { file, success } = await downloadFile(showModalKey as any);
          if (success) {
            const reader = new FileReader();
            reader.addEventListener('loadend', function(e) {
              if (reactQuillRef.current) {
                try {
                  JSON.parse(e.target.result as string);
                } catch (error) {
                  const delta = [{ insert: ''}, { insert: '\n'}]
                  reactQuillRef.current.getEditor().setContents(delta as any);
                  reactQuillRef.current.getEditor().pasteHTML(e.target.result as string);
                }
              }
            });
            reader.readAsText(file);

          }
        }
      })();
    }
  }, [visible]);
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
        { align: [] as any[] },
      ],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] as any[] }, { background: [] as any[] }], // dropdown with defaults from theme
      ['link', 'image'],
    ],
  };
  const { modalProps, loading } = useModalForm(props.form, {
    async onOk(values) {
      const params = { ...values };
      if (['termsConditions', 'frequentlyAskedQuestions', 'contactUs'].includes(showModalKey)) {
        const editor = reactQuillRef.current.getEditor();
        const unprivilegedEditor = (reactQuillRef.current as any).makeUnprivilegedEditor(editor);
        const content = unprivilegedEditor.getHTML();
        let errMsg = '';
        console.log(content);
        if (
          !content ||
          content === '<p><br></p>' ||
          content === '<h1><br></h1>' ||
          content === '<h2><br></h2>'
        ) {
          switch (showModalKey) {
            case 'termsConditions':
              errMsg = 'Terms and Conditions';
              break;
            case 'frequentlyAskedQuestions':
              errMsg = 'Frequently Asked Question';
              break;
            case 'contactUs':
              errMsg = 'Contact Us';
              break;
            default:
              break;
          }
          message.warn(`The content of ${errMsg} is required.`);
          return false;
        }
        const file = new Blob([content], { type: 'text/plain' });
        const formData = new FormData();

        formData.append('type', 'common');
        formData.append('file', file);

        const {
          data: {
            result: { fileName, filePath },
          },
        } = await upload(formData);
        params[showModalKey] = `${filePath}${fileName}`;
        // const f = new File([file], 'name.txt',{});
        // console.log(f);
        // uploadFile(showModalKey, file);
      }
      const falg = await saveDictionary(params);
      if (falg) {
        onChange();
        message.success('Saved successfully!');
        return true;
      }
      return false;
    },
    visible,
    afterClose() {
      setShowModalKey('');
      setTimeout(() => {
        if (reactQuillRef.current) {
          const delta = [{ insert: ''}, { insert: '\n'}]
          reactQuillRef.current.getEditor().setContents(delta as any);
          reactQuillRef.current.getEditor().pasteHTML('<p><br></p>');
        }
      }, 100);
    },
    setVisible: () => onVisible(),
  });

  const preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close();
    }
    const editor = reactQuillRef.current.getEditor();
    const unprivilegedEditor = (reactQuillRef.current as any).makeUnprivilegedEditor(editor);
    const content = unprivilegedEditor.getHTML();
    window.previewWindow = window.open();
    window.previewWindow.document.write(buildPreviewHtml(content));
    window.previewWindow.document.close();
  };

  const buildPreviewHtml = (html: string) => {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css">
          <style>
          h1,
          h3,
          h4 {
            font-size: 14px;
          }
          h2 {
            font-size: 15px;
          }
          h2,
          h3,
          h4 {
            font-weight: normal;
          }
          h1,
          h2,
          h3 {
            color: #000;
          }
          h4 {
            color: #858585;
          }
          </style>
        </head>
        <body>
        <div class="ql-snow">
        <pre class="ql-editor">${html}</pre>
        </div>
        </body>
      </html>
    `;
  };

  let edTitle: ReactNode = `${title} SETTING`;
  if (['termsConditions', 'frequentlyAskedQuestions', 'contactUs'].includes(showModalKey)) {
    modalProps.width = 800;
    edTitle = (
      <span>
        {edTitle}{' '}
        <Button type="link" onClick={preview}>
          preview
        </Button>{' '}
      </span>
    );
  }
  return (
    <Modal
      key="1"
      title={edTitle}
      {...modalProps}
      footer={[
        <Button key="1" type="primary" loading={loading} onClick={modalProps.onOk}>
          Save
        </Button>,
        <Button key="2" onClick={modalProps.onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form>
        {showModalKey === 'companyName' && (
          <Form.Item label="Company Name">
            {getFieldDecorator('companyName', {
              initialValue: data.companyName,
              rules: [{ required: true, message: 'Required' }],
            })(<Input maxLength={255} />)}
          </Form.Item>
        )}
        {showModalKey === 'legalInformation' && (
          <Form.Item label="Link to">
            {getFieldDecorator('legalInformation', {
              initialValue: data.legalInformation,
              rules: [{ required: true, message: 'Required' }],
            })(<Input maxLength={255} addonBefore="https://" />)}
          </Form.Item>
        )}
        {showModalKey === 'dataProtection' && (
          <Form.Item label="Link to">
            {getFieldDecorator('dataProtection', {
              initialValue: data.dataProtection,
              rules: [{ required: true, message: 'Required' }],
            })(<Input maxLength={255} addonBefore="https://" />)}
          </Form.Item>
        )}
        {['termsConditions', 'frequentlyAskedQuestions', 'contactUs'].includes(showModalKey) && (
          <ReactQuill
            //   placeholder={formatMessage({ id: 'NOTICE_PLEASE_ENTER' })}
            id="noticeViewEditQuill"
            bounds="#noticeViewEditQuill"
            className={styles.reactQuillStyle}
            //   defaultValue={notificationInfo.content || null}
            ref={el => {
              reactQuillRef.current = el;
            }}
            theme="snow"
            modules={modules}
          />
        )}
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(SettingModal);
