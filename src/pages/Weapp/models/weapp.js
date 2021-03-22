import {
  stations,
  addstore, editstore,
  addfactory, editfactory,
  addkeyword, editkeyword,
  addmax_classify, editmax_classify,
  addjob, editjob,
  addmin_classify, editmin_classify,
  addbanner, editbanner,
  addtrain, edittrain,
  addcustomer, editcustomer,
  enrollverify, enrollquit, enrollset_working
} from '@/services/weapp';

const UserModel = {
  namespace: 'weapp',
  state: {
    currentUser: {},
    stations: [],
  },
  effects: {
    *addstore({ payload }, { call, put }) {
      const response = yield call(addstore, payload);
      return response
    },
    *editstore({ payload }, { call, put }) {
      const response = yield call(editstore, payload);
      return response
    },
    *addfactory({ payload }, { call, put }) {
      const response = yield call(addfactory, payload);
      return response
    },
    *editfactory({ payload }, { call, put }) {
      const response = yield call(editfactory, payload);
      return response
    },
    *addkeyword({ payload }, { call, put }) {
      const response = yield call(addkeyword, payload);
      return response
    },
    *editkeyword({ payload }, { call, put }) {
      const response = yield call(editkeyword, payload);
      return response
    },
    *addmax_classify({ payload }, { call, put }) {
      const response = yield call(addmax_classify, payload);
      return response
    },
    *editmax_classify({ payload }, { call, put }) {
      const response = yield call(editmax_classify, payload);
      return response
    },
    *addmin_classify({ payload }, { call, put }) {
      const response = yield call(addmin_classify, payload);
      return response
    },
    *editmin_classify({ payload }, { call, put }) {
      const response = yield call(editmin_classify, payload);
      return response
    },
    *addtrain({ payload }, { call, put }) {
      const response = yield call(addtrain, payload);
      return response
    },
    *edittrain({ payload }, { call, put }) {
      const response = yield call(edittrain, payload);
      return response
    },
    *addcustomer({ payload }, { call, put }) {
      const response = yield call(addcustomer, payload);
      return response
    },
    *editcustomer({ payload }, { call, put }) {
      const response = yield call(editcustomer, payload);
      return response
    },
    *addbanner({ payload }, { call, put }) {
      const response = yield call(addbanner, payload);
      return response
    },
    *editbanner({ payload }, { call, put }) {
      const response = yield call(editbanner, payload);
      return response
    },
    *addjob({ payload }, { call, put }) {
      const response = yield call(addjob, payload);
      return response
    },
    *editjob({ payload }, { call, put }) {
      const response = yield call(editjob, payload);
      return response
    },
    *enrollverify({ payload }, { call, put }) {
      const response = yield call(enrollverify, payload);
      return response
    },
    *enrollquit({ payload }, { call, put }) {
      const response = yield call(enrollquit, payload);
      return response
    },
    *enrollset_working({ payload }, { call, put }) {
      const response = yield call(enrollset_working, payload);
      return response
    },
    *stations({ payload }, { call, put }) {
      const response = yield call(stations, payload);
      let list = [...new Set([...response.data?.end_stations, ...response.data?.start_stations])]
      yield put({
        type: 'save',
        payload: {
          stations: list.map(it=>({
            label:it,
            value:it
          })),
        },
      });
      return response
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
};
export default UserModel;
