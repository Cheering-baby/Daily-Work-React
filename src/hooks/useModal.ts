import { Modal, Form, Spin, Button, Input } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { useState } from 'react';
interface useModalFromOption {
    onOk: (values: any) => Promise<boolean>;
    onCancel?: Function;
    visible?: boolean;
    afterClose?: ()=> void;
    setVisible?: (v: boolean) => void;
}
export function useModalForm(form: WrappedFormUtils, option: useModalFromOption) {
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const visible = option.visible || isVisible;
    const setVisible = option.setVisible || setIsVisible;
    const onCancel = () => {
        setVisible(false);
    };
    const afterClose = () => {
        form.resetFields();
        option.afterClose();
    }
    const onOk = () => {
        form
            .validateFields({}, async (error, values) => {
                if (error) {
                    return;
                }
                setLoading(true);
                const falg = await option.onOk(values);
                setLoading(false);
                if (falg) {
                    setVisible(false);
                }
            })
    }
    const modalProps: ModalProps = {
        visible,
        onOk,
        onCancel,
        afterClose,
        confirmLoading: loading,
    };
    return { modalProps, setVisible, loading };
}
