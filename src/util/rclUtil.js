import _L from 'lodash';

/** 验证日期格式正则表达式 */
const _validateDateStringExpArr = [
  /^\d{4}(0?[1-9]|1[012])(0?[1-9]|[12][0-9]|3[01])$/,

  // format: yyyy-mm-dd // /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/ // format: dd/mm/yyyy
  /^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/,

  // format: yyyy-mm-dd hh:mi
  /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/,

  // format: yyyy-mm-dd hh:mi:ss
  /^((\d{2}(([02468][048])|([13579][26]))[-/\s]?((((0?[13578])|(1[02]))[-/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[-/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[-/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[-/\s]?((((0?[13578])|(1[02]))[-/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[-/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[-/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3])):([0-5]?[0-9])((\s)|(:([0-5]?[0-9])))))?$/,

  // format: yyyy-mm-ddThh:mi:ss.fffZ
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
];

const oType = (o) => {
  return o === null ? 'null' : typeof o;
};

const stepDownIfConditionSatisfiedPromise = (conditionHandler, options) => {
  if (!options) {
    options = {};
  }
  const recurInterval = options.recurInterval || 500;
  if (!conditionHandler || !(conditionHandler instanceof Function)) {
    return Promise.resolve(null);
  }
  const recurHandler = function (rsv, rej, times) {
    if (!times) {
      times = 0;
    }
    times++;
    if (conditionHandler()) {
      return rsv(null);
    }
    if (options.maxRetryTimes && times > options.maxRetryTimes) {
      if (options.overtimeHandler) {
        options.overtimeHandler.call(null, rsv, rej, times);
      } else {
        rej({ code: 110, msg: 'stepDown retry overtime: ' + options.maxRetryTimes });
      }
    } else {
      return setTimeout(function () {
        recurHandler(rsv, rej, times);
      }, recurInterval);
    }
  };
  return new Promise(function (rsv, rej) {
    recurHandler(rsv, rej);
  });
};

const getValByIterativeKey = (data, keyArr, result) => {
  if (!data) {
    data = {};
  }
  if (!keyArr) {
    keyArr = [];
  }
  if (oType(keyArr) === 'string') {
    keyArr = keyArr.split('.');
  }
  var key = keyArr.shift();
  data = data[key];
  if (!data) {
    return;
  }
  if (keyArr.length > 0) {
    return getValByIterativeKey(data, keyArr, result);
  } else {
    return result.push(data);
  }
};
const getDeepVal = (data, keyArr) => {
  let result = [];
  getValByIterativeKey(data, keyArr, result);
  return result[0];
};

const setDeepVal = (data, keyArr, newValue) => {
  if (!keyArr) {
    keyArr = [];
  }
  if (oType(keyArr) === 'string') {
    keyArr = keyArr.split('.');
  }
  if (!(keyArr instanceof Array) || keyArr.length < 1) {
    console.error('setDeepVal ERROR - keyArr is empty:', data, keyArr, newValue);
  }
  const keyArr2 = keyArr.length > 1 ? keyArr.slice(0, keyArr.length - 1) : [];
  const lastKey = keyArr.length > 1 ? keyArr.slice(-1)[0] : keyArr[0];
  if (oType(lastKey) === 'undefined') {
    console.error('setDeepVal ERROR - lastKey is undefined:', data, keyArr, newValue);
  }
  for (let i = 0, ref = data; i < keyArr2.length; i++) {
    const subKey = keyArr2[i];
    const tmp = ref[subKey];
    if (['undefined', 'null'].indexOf(oType(tmp)) > -1) {
      ref = ref[subKey] = {};
    } else if (oType(tmp) === 'object') {
      ref = tmp;
    }
  }
  const lastSecondObj = keyArr2.length > 0 ? getDeepVal(data, keyArr2) : data;
  if (!lastSecondObj || oType(lastSecondObj) !== 'object') {
    console.error('setDeepVal ERROR #382 lastSecondObj is not object:', data, keyArr, newValue);
    return;
  }
  lastSecondObj[lastKey] = newValue;
};

const getDatetimeFlag = function (str) {
  let i,
    len,
    regExp,
    match,
    rtnFlag = '';
  for (i = 0, len = _validateDateStringExpArr.length; i < len; i++) {
    regExp = _validateDateStringExpArr[i];
    match = regExp.test(str);
    if (match) {
      break;
    }
  }
  switch (i) {
    case 0:
      rtnFlag = 'yyyyMMdd';
      break;
    case 1:
      rtnFlag = 'yyyy-mm-dd';
      break;
    case 2:
      rtnFlag = 'yyyy-mm-dd hh:mi';
      break;
    case 3:
      rtnFlag = 'yyyy-mm-dd hh:mi:ss';
      break;
    case 4:
      rtnFlag = 'yyyy-mm-ddThh:mi:ss.fffZ';
      break;
    default:
      rtnFlag = '';
  }
  return rtnFlag;
};

const parseDatetimeStrByFlag = (str, options = {}) => {
  if (oType(options) === 'string') {
    // 兼容老的格式 @ 2020-05-25 16:20:23
    options = { flag: options };
  }
  let flag = _L.trim(options.flag);
  if (!str) {
    return null;
  } else if (str instanceof Date) {
    return str;
  }
  if (oType(str) !== 'string') {
    return null;
  }
  // 处理 + 号 START
  const startPlus = str.indexOf('+');
  const endPlus = str.lastIndexOf('+');
  if (startPlus > -1 && startPlus === endPlus) {
    str = str.replace('+', ' ');
  }
  // 处理 + 号 END
  var regExp,
    match,
    date,
    skipValidation = false;
  if (!flag) {
    skipValidation = true;
    flag = getDatetimeFlag(str);
  }
  const addOneDayIfNoTime = _L.trim(options.addOneDayIfNoTime);
  // eslint-disable-next-line default-case
  switch (flag) {
    // equivalent to function: parse_yyyymmdd(str)
    case 'yyyy-mm-dd':
      regExp = _validateDateStringExpArr[0];
      break;
    case 'yyyy-mm-dd hh:mi':
      regExp = _validateDateStringExpArr[1];
      break;
    case 'yyyy-mm-dd hh:mi:ss':
      regExp = _validateDateStringExpArr[2];
      break;
    case 'yyyy-mm-ddThh:mi:ss.fffZ':
      regExp = _validateDateStringExpArr[3];
      break;
    case 'yyyy-mm-dd hh:mi:ss.fff':
      regExp = _validateDateStringExpArr[4];
      break;
  }
  if (regExp) {
    if (skipValidation) {
      date = new Date(str);
    } else {
      match = regExp.test(str);
      if (match) {
        date = new Date(str);
      } else if (flag) {
        str = str.substring(0, flag.length);
        match = regExp.test(str);
        if (match) {
          date = new Date(str);
        }
      }
    }
    if (!(date instanceof Date)) {
      return null;
    }
    // eslint-disable-next-line default-case
    switch (flag) {
      // equivalent to function: parse_yyyymmdd(str)
      case 'yyyy-mm-dd':
        date.setHours(0);
        date.setMinutes(0, 0, 0);
        break;
      case 'yyyy-mm-dd hh:mi':
        date.setSeconds(0, 0);
        break;
      case 'yyyy-mm-dd hh:mi:ss':
        date.setMilliseconds(0);
        break;
    }
    if (flag === 'yyyy-mm-dd' && addOneDayIfNoTime === 'Y') {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }
  return null;
};

/**
 * @param cvtFn 转换函数
 * */
const copyTreeStructure = function copyTree(jsonData, cvtFn) {
  const rtn = cvtFn(jsonData);
  const children = getDeepVal(jsonData, 'children') || [];
  if (!_L.isEmpty(children)) {
    rtn.children = children.map((el) => copyTree(el, cvtFn));
  }
  return rtn;
};

/**
 * 深度克隆；如果提供了转换方法，可以同时转换日期格式，并存入克隆对象
 * */
const deepClone = function fnDeepClone(obj, options = {}) {
  if (['object', 'function'].indexOf(oType(obj)) < 0) {
    return obj;
  }
  // var oidHandler = options.oidHandler;
  let result = typeof obj.splice === 'function' ? [] : {},
    key;
  if (obj && typeof obj === 'object') {
    for (key in obj) {
      /* if(obj[key] && obj[key] instanceof ObjectID){
                result[key] = new ObjectID(obj[key]);
            }else  */
      if (obj[key] && obj[key] instanceof Date) {
        if (options.dateHandler && options.dateHandler instanceof Function) {
          result[key] = options.dateHandler(obj[key]);
        } else {
          result[key] = new Date(obj[key]);
        }
        /* }else if(obj[key] && obj[key] instanceof Buffer){
                    if(options.bufferHandler && options.bufferHandler instanceof Function){
                        result[key] = options.bufferHandler(obj[key])
                    }else{
                        result[key] = obj[key]
                    } */
      } else if (obj[key] && typeof obj[key] === 'object') {
        result[key] = fnDeepClone(obj[key], options); //如果对象的属性值为object的时候，递归调用deepClone，即再把某个值对象复制一份到新的对象的对应值中
      } else {
        /* if(key === '_id'){
                    if(oidHandler && oType(oidHandler) === 'function'){
                        result[key] = oidHandler(obj[key]);
                        continue;
                    }
                } */
        result[key] = obj[key]; //如果对象的属性值不为object的时候，直接复制参数对象的每一个键/值到新对象对应的键/值中
      }
    }
    return result;
  }
  return obj;
};

/**
 * 深度比较链各个对象是否相同
 */
const deepCompare = function (x, y) {
  var i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    var p;
    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if (
      (typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)
    ) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof x[p]) {
        case 'object':
        case 'function':
          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
};

const parseJsonWithNumber2String = (str) => {
  if (!str) {
    return null;
  }
  var rtn = str;
  var regexArr = [new RegExp(':\\d{17,}(,|\\})', 'g'), new RegExp(':\\d+\\.\\d+(,|\\})', 'g')];
  for (var j = 0; j < regexArr.length; j++) {
    var regex = regexArr[j];
    var matches = str.match(regex);
    var matchArr = matches ? Array.prototype.slice.call(matches) : [];
    for (var i = 0; i < matchArr.length; i++) {
      var sourceStr = _L.trim(matchArr[i]);
      var targetStr = sourceStr.replace(':', ':"');
      if (j === 0) {
        targetStr = targetStr.replace(',', '",');
      } else {
        targetStr = targetStr.replace('}', '"}');
      }
      rtn = rtn.replace(sourceStr, targetStr);
    }
  }
  var obj = null;
  try {
    obj = JSON.parse(rtn);
  } catch (e) {
    try {
      obj = JSON.parse(str);
    } catch (e1) {}
  }
  return obj;
};

export default {
  deepClone,
  copyTreeStructure,
  deepCompare,
  setDeepVal,
  getDeepVal,
  getDatetimeFlag,
  oType,
  parseDatetimeStrByFlag,
  parseJsonWithNumber2String,
  stepDownIfConditionSatisfiedPromise,
};
