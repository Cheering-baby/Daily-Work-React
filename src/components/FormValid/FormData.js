/* eslint-disable dot-notation */
import ValidRules from './validrules';

export default function() {
  let formData = {}; // 所有元素的值

  const keyNameMap = {};

  const validData = {}; // 需要验证的属性及对应的规则{name:['required','mobile']} 或者 {name:[{required:true},{equalTo:'pwd'}]}

  const validFieldFunc = {}; // 保存所有的属性的验证方法,用于回调验证

  const errMsg = {};

  function addValidField(name, func) {
    validFieldFunc[name] = func;
  }

  function formChange(name, value) {
    formData[name] = value;
    const result = this.formValid(name, value);
    errMsg[name] = result;
    return result;
  }

  function clearFormField(name) {
    delete validData[name];
    delete formData[name];
    delete validFieldFunc[name];
    delete errMsg[name];
  }

  function clearFormValid(name) {
    delete validFieldFunc[name];
  }

  function loopFormField(v, value) {
    Object.keys(v).forEach(key => {
      const val = v[key];
      if (typeof val !== 'object' || (Array && Array.isArray(val))) {
        const result = ValidRules[key](val, value);
        if (!result.result) {
          return result.message;
        }
      } else {
        const otherName = v[key].name;
        const otherValue = formData[otherName];
        const result = ValidRules[key](otherValue, value);
        if (!result.result) {
          return result.message;
        }
      }
      return null;
    });
  }

  function formValid(name, value) {
    if (validData && validData[name]) {
      for (let i = 0; i < validData[name].length; i += 1) {
        const v = validData[name][i];
        if (typeof v === 'string') {
          const result = ValidRules[v](true, value);
          if (!result.result) {
            return result.message;
          }
        } else {
          loopFormField(v, value);
        }
      }
    }
    return null;
  }

  return {
    getFormData() {
      return formData;
    },
    resetFormData() {
      Object.keys(formData).forEach(key => {
        if (Object.hasOwnProperty.call(formData, key)) {
          delete formData[key];
        }
      });
    },
    getKeyNameMap() {
      return keyNameMap;
    },
    getErrMsg() {
      return errMsg;
    },
    setFormData(key, value) {
      if (value) formData[key] = value;
    },
    /**
     * 用于生成字段属性的方法 内置三个基础方法formChange, formValid,addValidField
     * 新增 clearFormField 用于销毁元素时 清除各种数组
     * 新增 clearFormValid 用于创建元素时 首先清空上一次的formvalid
     *
     *@param options {name:"mobile",placeholder:"请输入手机号码",label:"手机",rules:['required','mobile']}
     * */
    createField(options) {
      if (options['rules'] && options['name']) {
        validData[options['name']] = options['rules'];
      }
      keyNameMap[options['name']] = options['label'];
      return { formChange, formValid, addValidField, clearFormField, clearFormValid, ...options };
    },
    addValidRules(name, rules) {
      validData[name].push(rules);
    },
    addForm(object) {
      formData = Object.assign({}, formData, object);
    },

    isValid() {
      Object.keys(validFieldFunc).forEach(key => {
        if (validFieldFunc[key]) {
          validFieldFunc[key](); // 执行验证
        }
      });
      let flag = true;
      Object.keys(errMsg).forEach(key => {
        if (errMsg[key] !== undefined && errMsg[key] !== null) {
          flag = false;
        }
        return null;
      });
      return flag;
    },
  };
}
