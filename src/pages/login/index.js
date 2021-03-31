import React, { Component } from 'react';
import { Icon, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import avatar from './images/avatar.png';
import styles from './css/styles.less';


const modelPlatformLogin = 'loginToNamespace/platformLogin';


@connect(({ loginToNamespace, loading }) => ({
  loginToNamespace,
  submitLoading: loading.effects[modelPlatformLogin],
}))
class Index extends Component {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {

  }

  componentDidMount() {

  }


  eventSubmit = () => {
    const username = _.trim(this.refs.username.value);
    const password = _.trim(this.refs.password.value);
    const { dispatch } = this.props;
    if (username === '') {
      message.error('用户名不能为空!');
    } else if (password === '') {
      message.error('密码不能为空!');
    } else {
      dispatch({
        type: modelPlatformLogin,
        payload: { username, password },
      });
    }
  };

  render() {
    const { submitLoading } = this.props;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin/>;
    return (
      <div className={styles['login']}>
        <div className={styles['login-form']}>
          <div className={styles['close']}/>
          <div className={styles['head-info']}>
            <label className={styles['lbl-1']}/>
            <label className={styles['lbl-2']}/>
            <label className={styles['lbl-3']}/>
          </div>
          <div className={styles['clear']}/>
          <div className={styles['avtar']}>
            <img src={avatar}/>
          </div>
          <form>
            <input ref='username' type="text" className={styles['text']} placeholder={'username'} defaultValue='admin'/>
            <input ref='password' type="password" placeholder={'password'} defaultValue='123456'/>
          </form>
          <div className={styles['signin']}>
            <Spin indicator={antIcon} spinning={submitLoading === true}>
              <input onClick={this.eventSubmit} type="submit" value={submitLoading === true ? '正在登陆...' : '登陆'}/>
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}


export default Index;


