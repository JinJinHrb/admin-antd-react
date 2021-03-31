import { login } from '../services/index';
import { message } from 'antd';
import { history } from 'umi';
import { isSuccess, platformToken } from '../../../common/globalConstant';

export default {
  namespace: 'loginToNamespace',
  state: {},
  subscriptions: {},
  effects: {
    * platformLogin({ payload }, { call }) {
      const response = yield call(login, payload);
      if (response && response[isSuccess] === true) {
        const token = response.result.token;
        sessionStorage.setItem(platformToken, token);
        history.push('/');
      } else if (response && response[isSuccess] === false) {
        message.error(response.error_info.msg);
      }
    },
  },
  reducers: {},
};
