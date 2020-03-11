import { formatMessage } from 'umi/locale';

const Validator = {};
export default Validator;

// ////////////////////////////////////////////////validate method//////////////////////////////////////////////////
/**
 *  判断是不是email
 *
 * @param param (email: true|false)
 * @param value (校验的值)
 * @returns {boolean|*}
 */
Validator.email = function email(param, value) {
  const pass = {
    result: true,
    message: 'email格式不正确',
  };

  if (param === true) {
    pass.result = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      value
    );
  }

  return pass;
};

/**
 * 判断是不是url
 *
 * @param param(url:true|false)
 * @param value
 * @returns {boolean|*}
 */
Validator.url = function url(param, value) {
  const pass = {
    result: true,
    message: 'url格式不正确',
  };

  if (param === true) {
    pass.result = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!&',;=]|:|@)|\/|\?)*)?$/i.test(
      value
    );
  }

  return pass;
};

/**
 *  校验是不是日期
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.date = function date(param, value) {
  const pass = {
    result: true,
    message: 'date格式不正确',
  };
  if (param === true) {
    pass.result = !/Invalid|NaN/.test(new Date(value).toString());
  }

  return pass;
};

/**
 * 判断是不是ISO的日期格式
 *
 * @param param
 * @param value
 * @returns {boolean|*}
 */
Validator.dataISO = function dataISO(param, value) {
  const pass = {
    result: true,
    message: '不是ISO的日期格式',
  };

  if (param === true) {
    pass.result = /^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
  }

  return pass;
};

/**
 * 判断是不是数字带小数点
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.number = function number(param, value) {
  const pass = {
    result: true,
    message: '输入的数字不合法',
  };

  if (param === true) {
    pass.result = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
  }

  return pass;
};

/**
 * 校验整数
 *
 * @param param
 * @param value
 * @returns {boolean|*}
 */
Validator.digits = function digits(param, value) {
  const pass = {
    result: true,
    message: '不能包含除数字以外的其他字符',
  };

  if (param === true) {
    pass.result = /^\d+$/.test(value);
  }

  return pass;
};

/**
 * 校验必须项
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.required = function required(param, value) {
  const pass = {
    result: true,
    message: formatMessage({ id: 'COMMON_REQUIRED' }),
  };

  if (param === true) {
    pass.result = value && value.length > 0;
    if (Array.isArray(value) && value.length === 2) {
      value.forEach(v => {
        if (!v || v === undefined || v === '') {
          pass.result = false;
        }
      });
    }
  }

  return pass;
};

/**
 * 身份证号码
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.cardNo = function cardNo(param, value) {
  const pass = {
    result: true,
    message: '身份证号码不合法',
  };

  if (param === true) {
    const len = value.length;
    let re;
    if (len === 15) {
      re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);
    } else if (len === 18) {
      re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d|[Xx])$/);
    } else {
      pass.result = false;
    }
    const a = value.match(re);
    let B;
    if (a != null) {
      if (len === 15) {
        const D = new Date(`19${a[3]}/${a[4]}/${a[5]}`);
        B = D.getYear() === a[3] && D.getMonth() + 1 === a[4] && D.getDate() === a[5];
      } else {
        const D = new Date(`${a[3]}/${a[4]}/${a[5]}`);
        B = D.getFullYear() === a[3] && D.getMonth() + 1 === a[4] && D.getDate() === a[5];
      }
      if (!B) {
        pass.result = false;
      }
    }
    pass.result = true;
  }

  return pass;
};

/**
 *
 * @param param
 * @param value
 * @returns {boolean|*}
 */
Validator.qq = function qq(param, value) {
  const pass = {
    result: true,
    message: 'qq格式有误',
  };

  if (param === true) {
    const reg = /^[1-9][0-9]{4,14}$/;
    pass.result = reg.test(value);
  }

  return pass;
};

/**
 * 手机号码
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.mobile = function mobile(param, value) {
  const pass = {
    result: true,
    message: '手机号码格式不合法',
  };

  if (param === true && value) {
    const { length } = value;
    const reg = /^((1)+\d{10})$/;
    pass.result = length === 11 && reg.test(value);
  }

  return pass;
};

/**
 * 电话号码
 * @param param
 * @param value
 * @returns {boolean|*}
 */
Validator.phone = function phone(param, value) {
  const pass = {
    result: true,
    message: '电话号码格式不正确',
  };
  if (param === true) {
    const reg = /^((\d{10,11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
    pass.result = reg.test(value);
  }

  return pass;
};

/**
 * 密码强度验证: 密码必须是字符与数字的混合
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.pwdMix = function pwdMix(param, value) {
  const pass = {
    result: true,
    message: '密码必须是字符与数字的混合',
  };

  if (param === true) {
    const reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
    pass.result = reg.test(value);
  }

  return pass;
};

/**
 * 最小值
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.min = function min(param, value) {
  const pass = {
    result: true,
    message: `值不能低于${param}`,
  };

  if (param) {
    pass.result = value >= param;
  }

  return pass;
};

/**
 * 最大值
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.max = function max(param, value) {
  // return value <= param;
  const pass = {
    result: true,
    message: `值不能超过${param}`,
  };

  if (param) {
    pass.result = value <= param;
  }

  return pass;
};

/**
 * 最小长度
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.minlength = function minLength(param, value) {
  const pass = {
    result: true,
    message: `长度不能小于${param}个`,
  };

  if (param) {
    pass.result = value.length >= param;
  }

  return pass;
};

/**
 * 最大长度
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.maxlength = function maxLength(param, value) {
  // return value.length <= param;
  const pass = {
    result: true,
    message: `字符串长度不能超过${param}个`,
  };

  if (param) {
    pass.result = value.length <= param;
  }

  return pass;
};

/**
 * 在范围内
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.range = function range(param, value) {
  // return value >= param[0] && value <= param[1];
  const pass = {
    result: true,
    message: `值的大小应该在${param[0]}到${param[1]}之间`,
  };

  if (param) {
    pass.result = value >= param[0] && value <= param[1];
  }

  return pass;
};

/**
 *  * 长度在范围之内
 *   *
 *    * @param param
 *     * @param val
 *      * @returns {boolean}
 *       */
Validator.rangeLength = function rangeLength(param, val) {
  // return val.length >= param[0] && val.length <= param[1];
  const pass = {
    result: true,
    message: `值的长度应该在${param[0]}到${param[1]}之间`,
  };

  if (param) {
    pass.result = val.length >= param[0] && val.length <= param[1];
  }

  return pass;
};

/**
 * 邮编
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.zipCode = function zipCode(param, value) {
  const pass = {
    result: true,
    message: '邮编格式不正确',
  };

  if (param === true) {
    pass.result = /^[0-9]{6}$/.test(value);
  }
  return pass;
};

/**
 * 判断是不是数字最多两位小数
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.number2point = function number(param, value) {
  const pass = {
    result: true,
    message: '邮编格式不正确',
  };
  if (param === true) {
    pass.result = /^[0-9]+(.[0-9]{1,2})?$/.test(value);
  }
  return pass;
};

/**
 * 判断是不是数字最多两位小数
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.equalsTo = function equalsTo(param, value) {
  return {
    result: param === value,
    message: '值不一致',
  };
};

/**
 * 判断登录名
 *
 * @param param
 * @param value
 * @returns {boolean}
 */
Validator.loginName = function equalsTo(param, value) {
  const pass = {
    result: true,
    message: '登录名不能为纯数字或者存在@',
  };
  if (param === true) {
    pass.result = !/^\d+$/.test(value) && !/@/.test(value);
  }
  return pass;
};

/**
 * 联系人
 */
Validator.contactName = function equalsTo(param, value) {
  const pass = {
    result: true,
    message: '只能输入汉字、空格、（）且长度不小于2（不要以空格开头或结尾）',
  };
  if (param === true && value) {
    pass.result =
      /^[\u4e00-\u9fa5\u0020（）]+$/.test(value) &&
      value.length >= 2 &&
      value.indexOf(' ') !== 0 &&
      value.indexOf(' ') !== value.length - 1;
  }
  return pass;
};

/**
 * 判断金钱类型
 */
Validator.money = function money(param, value) {
  const pass = {
    result: true,
    message: '请输入正确的金钱',
  };

  if (param && value) {
    pass.result = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
  }
  return pass;
};

Validator.code = function code(param, value) {
  const pass = {
    result: true,
    message: '请输入正确的唯一编码',
  };
  if (param && value) {
    pass.result = /^[a-zA-Z0-9_]+$/.test(value); // 所有包含一个以上的字母、数字或下划线的字符串
  }
  return pass;
};
