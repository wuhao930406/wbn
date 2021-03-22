import request from '@/utils/request';
import bodyParse from '@/utils/bodyParse'

//启用or禁用用户
export async function setenable(params) {
  return request('/api/user/set_enable', {
    method: 'PUT',
    data: params,
  });
}

//角色列表
export async function role(params) {
  return request('/api/role'+ bodyParse(params));
}

//创建角色
export async function addrole(params) {
  return request('/api/role', {
    method: 'POST',
    data: params,
  });
}

//更新角色
export async function editrole(params) {
  return request('/api/role/'+params.id, {
    method: 'PUT',
    data: params,
  });
}

//删除角色
export async function deleterole(params) {
  return request('/api/role/'+params, {
    method: 'DELETE',
  });
}

//创建用户
export async function adduser(params) {
  return request('/api/user', {
    method: 'POST',
    data: params,
  });
}

//更新用户
export async function edituser(params) {
  return request('/api/user/'+params.id, {
    method: 'PUT',
    data: params,
  });
}

//删除用户
export async function deleteuser(params) {
  return request('/api/user/'+params, {
    method: 'DELETE',
  });
}

//重置密码
export async function resetuser(params) {
  return request('/api/user/reset_password', {
    method: 'PUT',
    data: params,
  });
}


//用户详情
export async function getuser(params) {
  return request('/api/user/'+params);
}


//门店列表
export async function store(params) {
  return request('/api/store'+ bodyParse(params));
}

//创建门店
export async function addstore(params) {
  return request('/api/store', {
    method: 'POST',
    data: params,
  });
}

//更新门店
export async function editstore(params) {
  return request('/api/store/'+params.id, {
    method: 'PUT',
    data: params,
  });
}

//删除门店
export async function deletestore(params) {
  return request('/api/store/'+params, {
    method: 'DELETE',
  });
}



//当前用户信息
export async function queryCurrent() {
  return request('/api/user/info');
}

export async function queryNotices() {
  return request('/api/notices');
}
