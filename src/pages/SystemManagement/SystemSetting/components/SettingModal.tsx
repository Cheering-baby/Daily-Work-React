import React, { FC, useRef, useLayoutEffect, ReactNode, useState } from 'react';
import { Modal, Form, Button, Input, message } from 'antd';
import { useModalForm } from '@/hooks/useModal';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Editor } from '@tinymce/tinymce-react';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
  const [_, setUpdate] = useState(false);
  const forceUpdate = () => {
    setUpdate(v => !v);
  };

  const editContent = useRef('');
  const { getFieldDecorator } = props.form;
  const saveDictionary = async (params: any) => {
    const { success } = await setDictionary(params);
    if (success) {
      return true;
    }
    return false;
  };

  useLayoutEffect(() => {
    if (visible) {
      (async () => {
        if (['termsConditions', 'frequentlyAskedQuestions', 'contactUs'].includes(showModalKey)) {
          const { file, success } = await downloadFile(showModalKey as any);
          if (success) {
            const reader = new FileReader();
            reader.addEventListener('loadend', function(e) {
              try {
                JSON.parse(e.target.result as string);
              } catch (error) {
                // const delta = [{ insert: ''}, { insert: '\n'}]
                editContent.current = e.target.result as string;
                forceUpdate();
              }
            });
            reader.readAsText(file);
          }
        }
      })();
    }
  }, [visible]);

  const { modalProps, loading } = useModalForm(props.form, {
    async onOk(values) {
      const params = { ...values };
      if (['termsConditions', 'frequentlyAskedQuestions', 'contactUs'].includes(showModalKey)) {
        const content = editContent.current;
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
      editContent.current = '';
    },
    setVisible: () => onVisible(),
  });

  let edTitle: ReactNode = `${title} SETTING`;
  if (['termsConditions', 'frequentlyAskedQuestions', 'contactUs'].includes(showModalKey)) {
    modalProps.width = 800;
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
          <Editor
            tinymceScriptSrc="/static/tinymce/tinymce.min.js"
            onEditorChange={(content, editor) => {
              // setContent(content)
              editContent.current = content;
            }}
            value={editContent.current}
            // apiKey="0lqk1naukvtphya9f0y4pumhomv7fxewx79g9yakj3n4npm3"
            init={{
              height: 500,
              menubar: 'file edit view insert format tools table tc help',
              plugins: [
                'print preview  importcss  searchreplace autolink autosave save directionality  visualblocks visualchars fullscreen image link media  codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists  wordcount imagetools textpattern noneditable help charmap quickbars emoticons ',
              ],
              toolbar: `undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview  print | insertfile image media link anchor codesample | ltr rtl `,
            }}
          />
        )}
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(SettingModal);
