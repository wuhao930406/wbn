import { addrole, editrole, adduser, edituser,addstore,editstore } from '@/services/basic';

const UserModel = {
  namespace: 'basic',
  state: {
    currentUser: {},
  },
  effects: {
    *addrole({ payload }, { call, put }) {
      const response = yield call(addrole, payload);
      return response
    },
    *editrole({ payload }, { call, put }) {
      const response = yield call(editrole, payload);
      return response
    },

    *adduser({ payload }, { call, put }) {
      const response = yield call(adduser, payload);
      return response
    },
    *edituser({ payload }, { call, put }) {
      const response = yield call(edituser, payload);
      return response
    },
    *addstore({ payload }, { call, put }) {
      const response = yield call(addstore, payload);
      return response
    },
    *editstore({ payload }, { call, put }) {
      const response = yield call(editstore, payload);
      return response
    },


  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, ...action.payload };
    }
  },
};
export default UserModel;
