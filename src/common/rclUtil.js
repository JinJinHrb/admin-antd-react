import _L from 'lodash';

/** 验证日期格式正则表达式 */
const _validateDateStringExpArr = [
  /^\d{4}(0?[1-9]|1[012])(0?[1-9]|[12][0-9]|3[01])$/,
  /^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/, // format: yyyy-mm-dd //  /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/ // format: dd/mm/yyyy
  /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/, // format: yyyy-mm-dd hh:mi
  /^((\d{2}(([02468][048])|([13579][26]))[-/\s]?((((0?[13578])|(1[02]))[-/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[-/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[-/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[-/\s]?((((0?[13578])|(1[02]))[-/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[-/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[-/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3])):([0-5]?[0-9])((\s)|(:([0-5]?[0-9])))))?$/, // format: yyyy-mm-dd hh:mi:ss
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, // format: yyyy-mm-ddThh:mi:ss.fffZ
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
    // console.log(new Date(), '#20 times = ' + times);
    if (conditionHandler()) {
      return rsv(null);
    }
    if (options.maxRetryTimes && times > options.maxRetryTimes) {
      // console.log(new Date(), 'stepDownIfConditionSatisfiedPromise #24');
      if (options.overtimeHandler) {
        options.overtimeHandler.call(null, rsv, rej, times);
      } else {
        rej({ code: 110, msg: 'stepDown retry overtime: ' + options.maxRetryTimes });
      }
    } else {
      return setTimeout(function () {
        // console.log(new Date(), '#32 times = ' + times);
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
  const lastSecondObj = keyArr2.length > 0 ? getDeepVal(data, keyArr2) : data;
  for (let i = 0, ref = data; i < keyArr2.length; i++) {
    const subKey = keyArr2[i];
    const tmp = ref[subKey];
    if (['undefined', 'null'].indexOf(oType(tmp)) > -1) {
      ref = ref[subKey] = {};
    } else if (oType(tmp) === 'object') {
      ref = tmp;
    } else {
      if (!lastSecondObj || oType(lastSecondObj) !== 'object') {
        console.error('setDeepVal ERROR #382 lastSecondObj is not object:', data, keyArr, newValue);
        return;
      }
      return;
    }
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

export default {
  setDeepVal,
  getDeepVal,
  getDatetimeFlag,
  parseDatetimeStrByFlag,
  oType,
  stepDownIfConditionSatisfiedPromise,
};
