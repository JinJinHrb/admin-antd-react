import request from '../request/request';
import { history } from 'umi';
import { message } from 'antd';
import { isSuccess, platformToken } from '../common/globalConstant';

async function logout(params) {
  return request.post(request.api.platformLogout, params);
}


export default {
  namespace: 'logoutToNamespace',
  state: {},
  subscriptions: {},
  effects: {
    * platformLogout({ payload }, { call }) {
      const response = yield call(logout, payload);
      if (response && response[isSuccess] === true) {
        sessionStorage.removeItem(platformToken);
        history.push('/login');
      } else {
        message.error(response.error_info.msg);
      }
    },
  },
  reducers: {},
};
