import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    lastlogininfo:localStorage.getItem("lastlogininfo") ? JSON.parse(localStorage.getItem("lastlogininfo")) : {},
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = {
        status: 'ok',
        currentAuthority: 'admin',
      },
      token = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (token.jwt) {
        yield put({
          type: 'updateState',
          payload: {lastlogininfo:payload},
        });
        localStorage.setItem("lastlogininfo", JSON.stringify(payload))

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        localStorage.setItem("TOKEN", token.jwt)
        message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },
    *logout({ payload }, { call, put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        yield put({
          type: 'updateState',
          payload: {lastlogininfo:{}},
        });
        localStorage.removeItem("lastlogininfo");
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
