import {
  LockTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import React, { useState,useEffect } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { connect, useIntl, FormattedMessage,Link } from 'umi';
import logo from '@/assets/logo.png';
import logomask from '@/assets/logo_mask.png';
import styles from './index.less';

const Login = (props) => {
  const { userLogin , submitting } = props;
  const { lastlogininfo } = userLogin;
  const intl = useIntl();


  //提交
  const handleSubmit = (values) => {
    const { dispatch } = props;
    const postdata = {
      name:values.userName,
      password:values.password
    }

    dispatch({
      type: 'login/login',
      payload: { ...postdata },
    });
  };

  //自动登录
  useEffect(() => {
    console.log(lastlogininfo)
    if(lastlogininfo.autoLogin && lastlogininfo.userName && lastlogininfo.password){
        handleSubmit(lastlogininfo);
    } 
  }, []);
  


  return (
    <div className={styles.main}>
      <div className={styles.head}>
        <img src={logo} alt=""  style={{width:118,height:118}}/>
        <img src={logomask} alt=""  style={{width:118,height:118}}/>
      </div>
      <div className={styles.body}>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: submitting,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={async (values) => {
            handleSubmit(values);
          }}
        >
          <>
            <ProFormText
              name="userName"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockTwoTone className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
          </>


          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" style={{ color: "#fff" }} />
            </ProFormCheckbox>
            {/* <Link to="/user/fogot"
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </Link> */}
          </div>
        </ProForm>
      </div>
    </div>
  );
};

export default connect(({ login,global, loading }) => ({
  global,
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
